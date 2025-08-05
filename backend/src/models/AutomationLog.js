const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AutomationLog = sequelize.define('AutomationLog', {
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
  automationRuleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'automation_rule_id',
    references: {
      model: 'automation_rules',
      key: 'id',
    },
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'message_id',
    references: {
      model: 'messages',
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
  triggerType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'trigger_type',
  },
  triggerData: {
    type: DataTypes.JSONB,
    defaultValue: {},
    field: 'trigger_data',
  },
  actionResults: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'action_results',
  },
  status: {
    type: DataTypes.ENUM('executed', 'failed', 'skipped'),
    defaultValue: 'executed',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message',
  },
  executedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'executed_at',
  },
}, {
  tableName: 'automation_logs',
  timestamps: true,
  paranoid: false, // No soft deletes for logs
});

// Instance methods
AutomationLog.prototype.addActionResult = function(action, result) {
  const results = this.actionResults || [];
  results.push({
    action,
    result,
    timestamp: new Date().toISOString(),
  });
  this.actionResults = results;
};

AutomationLog.prototype.markAsFailed = function(error) {
  this.status = 'failed';
  this.errorMessage = error;
};

// Class methods
AutomationLog.findByUser = function(userId, options = {}) {
  const { limit = 50, offset = 0, status } = options;
  
  const where = { userId };
  if (status) {
    where.status = status;
  }
  
  return this.findAll({
    where,
    order: [['executedAt', 'DESC']],
    limit,
    offset,
  });
};

AutomationLog.findByRule = function(automationRuleId, options = {}) {
  const { limit = 50, offset = 0 } = options;
  
  return this.findAll({
    where: { automationRuleId },
    order: [['executedAt', 'DESC']],
    limit,
    offset,
  });
};

AutomationLog.getStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.findAll({
    where: {
      userId,
      executedAt: {
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

module.exports = AutomationLog; 