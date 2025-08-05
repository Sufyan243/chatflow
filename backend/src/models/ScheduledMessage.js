const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ScheduledMessage = sequelize.define('ScheduledMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  chatbotId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'chatbot_id',
    references: {
      model: 'chatbots',
      key: 'id',
    },
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'contact_id',
    references: {
      model: 'contacts',
      key: 'id',
    },
  },
  automationRuleId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'automation_rule_id',
    references: {
      model: 'automation_rules',
      key: 'id',
    },
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'document'),
    allowNull: false,
    defaultValue: 'text',
    field: 'message_type',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'media_url',
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'scheduled_at',
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message',
  },
}, {
  tableName: 'scheduled_messages',
  timestamps: true,
  paranoid: true,
});

// Instance methods
ScheduledMessage.prototype.isOverdue = function() {
  return this.scheduledAt < new Date() && this.status === 'pending';
};

ScheduledMessage.prototype.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
};

ScheduledMessage.prototype.markAsFailed = function(error) {
  this.status = 'failed';
  this.errorMessage = error;
};

ScheduledMessage.prototype.cancel = function() {
  this.status = 'cancelled';
};

// Class methods
ScheduledMessage.findPending = function() {
  return this.findAll({
    where: {
      status: 'pending',
      scheduledAt: {
        [sequelize.Op.lte]: new Date(),
      },
    },
    order: [['scheduledAt', 'ASC']],
  });
};

ScheduledMessage.findByUser = function(userId, options = {}) {
  const { status, limit = 50, offset = 0 } = options;
  
  const where = { userId };
  if (status) {
    where.status = status;
  }
  
  return this.findAll({
    where,
    order: [['scheduledAt', 'DESC']],
    limit,
    offset,
  });
};

ScheduledMessage.findByContact = function(contactId, options = {}) {
  const { status, limit = 50, offset = 0 } = options;
  
  const where = { contactId };
  if (status) {
    where.status = status;
  }
  
  return this.findAll({
    where,
    order: [['scheduledAt', 'DESC']],
    limit,
    offset,
  });
};

ScheduledMessage.getStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.findAll({
    where: {
      userId,
      scheduledAt: {
        [sequelize.Op.gte]: startDate,
      },
    },
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['status'],
  });
};

module.exports = ScheduledMessage; 