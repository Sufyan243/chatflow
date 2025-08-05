const cron = require('node-cron');
const automationService = require('../services/automationService');

const { logger } = require('../utils/logger');

class ScheduledMessageProcessor {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the scheduled message processor
   */
  start() {
    if (this.isRunning) {
      logger.warn('Scheduled message processor is already running');
      return;
    }

    // Run every minute to check for scheduled messages
    cron.schedule('* * * * *', async () => {
      await this.processScheduledMessages();
    });

    this.isRunning = true;
    logger.info('Scheduled message processor started');
  }

  /**
   * Stop the scheduled message processor
   */
  stop() {
    this.isRunning = false;
    logger.info('Scheduled message processor stopped');
  }

  /**
   * Process scheduled messages that are due
   */
  async processScheduledMessages() {
    try {
      await automationService.processScheduledMessages();
    } catch (error) {
      logger.error('Error processing scheduled messages:', error);
    }
  }

  /**
   * Process messages immediately (for testing or manual triggers)
   */
  async processMessagesNow() {
    try {
      logger.info('Manually processing scheduled messages');
      await automationService.processScheduledMessages();
      logger.info('Manual processing completed');
    } catch (error) {
      logger.error('Error in manual processing:', error);
      throw error;
    }
  }
}

module.exports = new ScheduledMessageProcessor(); 