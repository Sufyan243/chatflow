const AutomationRule = require('../models/AutomationRule');
const AutomationLog = require('../models/AutomationLog');
const ScheduledMessage = require('../models/ScheduledMessage');
const MediaLibrary = require('../models/MediaLibrary');
// const Message = require('../models/ScheduledMessage');
// const Contact = require('../models/Contact');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class AutomationService {
  /**
   * Process incoming message and check for automation triggers
   */
  async processIncomingMessage(message, contact, userId) {
    try {
      logger.info(`Processing automation for message: ${message.id}, contact: ${contact.id}`);

      // Get active automation rules for this user
      const rules = await AutomationRule.findActiveRules(userId, message.chatbotId);
      
      if (rules.length === 0) {
        logger.info('No active automation rules found');
        return;
      }

      // Check each rule for triggers
      for (const rule of rules) {
        try {
          if (await this.checkRuleTrigger(rule, message, contact)) {
            await this.executeRule(rule, message, contact, userId);
            // Only execute the first matching rule (priority-based)
            break;
          }
        } catch (error) {
          logger.error(`Error processing rule ${rule.id}:`, error);
          await this.logAutomationError(rule, message, contact, userId, error);
        }
      }
    } catch (error) {
      logger.error('Error in processIncomingMessage:', error);
    }
  }

  /**
   * Check if a rule should be triggered
   */
  async checkRuleTrigger(rule, message, contact) {
    return rule.isTriggered(message, contact);
  }

  /**
   * Execute automation rule actions
   */
  async executeRule(rule, message, contact, userId) {
    logger.info(`Executing rule: ${rule.name} (${rule.id})`);

    // Create automation log
    const log = await AutomationLog.create({
      userId,
      automationRuleId: rule.id,
      messageId: message.id,
      contactId: contact.id,
      triggerType: rule.triggerType,
      triggerData: {
        messageContent: message.content,
        contactPhone: contact.phone,
      },
      status: 'executed',
    });

    try {
      // Execute each action in the rule
      for (const action of rule.actions) {
        const result = await this.executeAction(action, contact, userId, rule);
        log.addActionResult(action, result);
      }

      await log.save();
      logger.info(`Rule ${rule.name} executed successfully`);
    } catch (error) {
      log.markAsFailed(error.message);
      await log.save();
      throw error;
    }
  }

  /**
   * Execute a single automation action
   */
  async executeAction(action, contact, userId, rule) {
    const { type, data } = action;

    switch (type) {
      case 'send_message':
        return await this.sendMessage(contact, data, userId);
      
      case 'send_media':
        return await this.sendMedia(contact, data, userId);
      
      case 'schedule_message':
        return await this.scheduleMessage(contact, data, userId, rule.id);
      
      case 'update_contact':
        return await this.updateContact(contact, data);
      
      case 'add_tag':
        return await this.addTag(contact, data);
      
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Send immediate message
   */
  async sendMessage(contact, data, userId) {
    const { content, messageType = 'text' } = data;
    
    // Create message record
    const message = await Message.create({
      userId,
      contactId: contact.id,
      type: messageType,
      direction: 'outgoing',
      content,
      status: 'sent',
      sentAt: new Date(),
    });

    // TODO: Integrate with WhatsApp service to actually send the message
    // This would call your WhatsApp API service
    
    return {
      success: true,
      messageId: message.id,
      content,
    };
  }

  /**
   * Send media message
   */
  async sendMedia(contact, data, userId) {
    const { mediaId, caption } = data;
    
    // Get media from library
    const media = await MediaLibrary.findByPk(mediaId);
    if (!media || media.userId !== userId) {
      throw new Error('Media not found or access denied');
    }

    // Create message record
    const message = await Message.create({
      userId,
      contactId: contact.id,
      type: media.type,
      direction: 'outgoing',
      content: caption || '',
      mediaUrl: media.fileUrl,
      status: 'sent',
      sentAt: new Date(),
    });

    // TODO: Integrate with WhatsApp service to send media
    
    return {
      success: true,
      messageId: message.id,
      mediaType: media.type,
      mediaUrl: media.fileUrl,
    };
  }

  /**
   * Schedule a message for later delivery
   */
  async scheduleMessage(contact, data, userId, ruleId) {
    const { content, scheduledAt, messageType = 'text', mediaId } = data;
    
    const scheduledMessage = await ScheduledMessage.create({
      userId,
      contactId: contact.id,
      automationRuleId: ruleId,
      messageType,
      content,
      mediaUrl: mediaId ? (await MediaLibrary.findByPk(mediaId))?.fileUrl : null,
      scheduledAt: new Date(scheduledAt),
      status: 'pending',
    });

    return {
      success: true,
      scheduledMessageId: scheduledMessage.id,
      scheduledAt: scheduledMessage.scheduledAt,
    };
  }

  /**
   * Update contact information
   */
  async updateContact(contact, data) {
    const updatedContact = await contact.update(data);
    return {
      success: true,
      contactId: updatedContact.id,
      updatedFields: Object.keys(data),
    };
  }

  /**
   * Add tag to contact
   */
  async addTag(contact, data) {
    const { tag } = data;
    const tags = contact.tags || [];
    
    if (!tags.includes(tag)) {
      tags.push(tag);
      await contact.update({ tags });
    }

    return {
      success: true,
      tag,
      tags,
    };
  }

  /**
   * Log automation error
   */
  async logAutomationError(rule, message, contact, userId, error) {
    await AutomationLog.create({
      userId,
      automationRuleId: rule.id,
      messageId: message.id,
      contactId: contact.id,
      triggerType: rule.triggerType,
      triggerData: {
        messageContent: message.content,
        contactPhone: contact.phone,
      },
      status: 'failed',
      errorMessage: error.message,
    });
  }

  /**
   * Process scheduled messages
   */
  async processScheduledMessages() {
    try {
      const pendingMessages = await ScheduledMessage.findPending();
      
      for (const scheduledMessage of pendingMessages) {
        try {
          await this.sendScheduledMessage(scheduledMessage);
        } catch (error) {
          logger.error(`Error sending scheduled message ${scheduledMessage.id}:`, error);
          scheduledMessage.markAsFailed(error.message);
          await scheduledMessage.save();
        }
      }
    } catch (error) {
      logger.error('Error processing scheduled messages:', error);
    }
  }

  /**
   * Send a scheduled message
   */
  async sendScheduledMessage(scheduledMessage) {
    // Create message record
    const message = await Message.create({
      userId: scheduledMessage.userId,
      contactId: scheduledMessage.contactId,
      chatbotId: scheduledMessage.chatbotId,
      type: scheduledMessage.messageType,
      direction: 'outgoing',
      content: scheduledMessage.content,
      mediaUrl: scheduledMessage.mediaUrl,
      status: 'sent',
      sentAt: new Date(),
    });

    // TODO: Integrate with WhatsApp service to actually send the message
    
    scheduledMessage.markAsSent();
    await scheduledMessage.save();

    return {
      success: true,
      messageId: message.id,
      scheduledMessageId: scheduledMessage.id,
    };
  }

  /**
   * Get automation statistics
   */
  async getAutomationStats(userId, days = 30) {
    const [ruleStats, logStats, scheduledStats] = await Promise.all([
      AutomationRule.findAll({
        where: { userId },
        attributes: [
          'triggerType',
          'isActive',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['triggerType', 'isActive'],
      }),
      AutomationLog.getStats(userId, days),
      ScheduledMessage.getStats(userId, days),
    ]);

    return {
      rules: ruleStats,
      logs: logStats,
      scheduled: scheduledStats,
    };
  }
}

module.exports = new AutomationService(); 