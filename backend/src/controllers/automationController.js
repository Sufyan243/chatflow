const AutomationRule = require('../models/AutomationRule');
const AutomationLog = require('../models/AutomationLog');
const MediaLibrary = require('../models/MediaLibrary');
const ScheduledMessage = require('../models/ScheduledMessage');
const automationService = require('../services/automationService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class AutomationController {
  /**
   * Get all automation rules for a user
   */
  async getRules(req, res) {
    try {
      const { page = 1, limit = 20, triggerType, isActive } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (triggerType) where.triggerType = triggerType;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const rules = await AutomationRule.findAndCountAll({
        where,
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: rules.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: rules.count,
          pages: Math.ceil(rules.count / limit),
        },
      });
    } catch (error) {
      logger.error('Error getting automation rules:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get automation rules',
        error: error.message,
      });
    }
  }

  /**
   * Get a single automation rule
   */
  async getRule(req, res) {
    try {
      const { id } = req.params;
      const rule = await AutomationRule.findOne({
        where: { id, userId: req.user.id },
      });

      if (!rule) {
        return res.status(404).json({
          success: false,
          message: 'Automation rule not found',
        });
      }

      res.json({
        success: true,
        data: rule,
      });
    } catch (error) {
      logger.error('Error getting automation rule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get automation rule',
        error: error.message,
      });
    }
  }

  /**
   * Create a new automation rule
   */
  async createRule(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const {
        name,
        description,
        triggerType,
        triggerConditions,
        actions,
        chatbotId,
        priority = 0,
        isActive = true,
      } = req.body;

      const rule = await AutomationRule.create({
        userId: req.user.id,
        chatbotId,
        name,
        description,
        triggerType,
        triggerConditions,
        actions,
        priority,
        isActive,
      });

      res.status(201).json({
        success: true,
        message: 'Automation rule created successfully',
        data: rule,
      });
    } catch (error) {
      logger.error('Error creating automation rule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create automation rule',
        error: error.message,
      });
    }
  }

  /**
   * Update an automation rule
   */
  async updateRule(req, res) {
    try {
      const { id } = req.params;
      const rule = await AutomationRule.findOne({
        where: { id, userId: req.user.id },
      });

      if (!rule) {
        return res.status(404).json({
          success: false,
          message: 'Automation rule not found',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const updateData = req.body;
      await rule.update(updateData);

      res.json({
        success: true,
        message: 'Automation rule updated successfully',
        data: rule,
      });
    } catch (error) {
      logger.error('Error updating automation rule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update automation rule',
        error: error.message,
      });
    }
  }

  /**
   * Delete an automation rule
   */
  async deleteRule(req, res) {
    try {
      const { id } = req.params;
      const rule = await AutomationRule.findOne({
        where: { id, userId: req.user.id },
      });

      if (!rule) {
        return res.status(404).json({
          success: false,
          message: 'Automation rule not found',
        });
      }

      await rule.destroy();

      res.json({
        success: true,
        message: 'Automation rule deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting automation rule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete automation rule',
        error: error.message,
      });
    }
  }

  /**
   * Toggle automation rule status
   */
  async toggleRule(req, res) {
    try {
      const { id } = req.params;
      const rule = await AutomationRule.findOne({
        where: { id, userId: req.user.id },
      });

      if (!rule) {
        return res.status(404).json({
          success: false,
          message: 'Automation rule not found',
        });
      }

      rule.isActive = !rule.isActive;
      await rule.save();

      res.json({
        success: true,
        message: `Automation rule ${rule.isActive ? 'activated' : 'deactivated'} successfully`,
        data: rule,
      });
    } catch (error) {
      logger.error('Error toggling automation rule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle automation rule',
        error: error.message,
      });
    }
  }

  /**
   * Get automation logs
   */
  async getLogs(req, res) {
    try {
      const { page = 1, limit = 20, status, ruleId } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (status) where.status = status;
      if (ruleId) where.automationRuleId = ruleId;

      const logs = await AutomationLog.findAndCountAll({
        where,
        order: [['executedAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: AutomationRule,
            as: 'automationRule',
            attributes: ['id', 'name', 'triggerType'],
          },
        ],
      });

      res.json({
        success: true,
        data: logs.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: logs.count,
          pages: Math.ceil(logs.count / limit),
        },
      });
    } catch (error) {
      logger.error('Error getting automation logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get automation logs',
        error: error.message,
      });
    }
  }

  /**
   * Get automation statistics
   */
  async getStats(req, res) {
    try {
      const { days = 30 } = req.query;
      const stats = await automationService.getAutomationStats(req.user.id, parseInt(days));

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error getting automation stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get automation statistics',
        error: error.message,
      });
    }
  }

  /**
   * Get media library
   */
  async getMedia(req, res) {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (type) where.type = type;

      const media = await MediaLibrary.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: media.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: media.count,
          pages: Math.ceil(media.count / limit),
        },
      });
    } catch (error) {
      logger.error('Error getting media library:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get media library',
        error: error.message,
      });
    }
  }

  /**
   * Upload media to library
   */
  async uploadMedia(req, res) {
    try {
      const { name, type, fileUrl, fileSize, mimeType, metadata = {} } = req.body;

      const media = await MediaLibrary.create({
        userId: req.user.id,
        name,
        type,
        fileUrl,
        fileSize,
        mimeType,
        metadata,
      });

      res.status(201).json({
        success: true,
        message: 'Media uploaded successfully',
        data: media,
      });
    } catch (error) {
      logger.error('Error uploading media:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload media',
        error: error.message,
      });
    }
  }

  /**
   * Delete media from library
   */
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      const media = await MediaLibrary.findOne({
        where: { id, userId: req.user.id },
      });

      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found',
        });
      }

      await media.destroy();

      res.json({
        success: true,
        message: 'Media deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting media:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete media',
        error: error.message,
      });
    }
  }

  /**
   * Get scheduled messages
   */
  async getScheduledMessages(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (status) where.status = status;

      const messages = await ScheduledMessage.findAndCountAll({
        where,
        order: [['scheduledAt', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: messages.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.count,
          pages: Math.ceil(messages.count / limit),
        },
      });
    } catch (error) {
      logger.error('Error getting scheduled messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get scheduled messages',
        error: error.message,
      });
    }
  }

  /**
   * Cancel scheduled message
   */
  async cancelScheduledMessage(req, res) {
    try {
      const { id } = req.params;
      const message = await ScheduledMessage.findOne({
        where: { id, userId: req.user.id },
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Scheduled message not found',
        });
      }

      if (message.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only cancel pending messages',
        });
      }

      message.cancel();
      await message.save();

      res.json({
        success: true,
        message: 'Scheduled message cancelled successfully',
      });
    } catch (error) {
      logger.error('Error cancelling scheduled message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel scheduled message',
        error: error.message,
      });
    }
  }
}

module.exports = new AutomationController(); 