const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AutomationRule = sequelize.define('AutomationRule', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  triggerType: {
    type: DataTypes.ENUM('keyword', 'welcome', 'schedule', 'event'),
    allowNull: false,
    field: 'trigger_type',
  },
  triggerConditions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    field: 'trigger_conditions',
  },
  actions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'automation_rules',
  timestamps: true,
  paranoid: true,
});

// Instance methods
AutomationRule.prototype.isTriggered = function(message, contact) {
  switch (this.triggerType) {
    case 'keyword':
      return this.checkKeywordTrigger(message);
    case 'welcome':
      return this.checkWelcomeTrigger(contact);
    case 'schedule':
      return this.checkScheduleTrigger();
    case 'event':
      return this.checkEventTrigger(message, contact);
    default:
      return false;
  }
};

AutomationRule.prototype.checkKeywordTrigger = function(message) {
  const keywords = this.triggerConditions.keywords || [];
  const messageText = message.content.toLowerCase();
  
  return keywords.some(keyword => 
    messageText.includes(keyword.toLowerCase())
  );
};

AutomationRule.prototype.checkWelcomeTrigger = function(contact) {
  // Check if this is the first message from this contact
  return contact.isNewContact;
};

AutomationRule.prototype.checkScheduleTrigger = function() {
  const schedule = this.triggerConditions.schedule;
  if (!schedule) return false;
  
  const now = new Date();
  const { days, time } = schedule;
  
  // Check if current day is in schedule
  const currentDay = now.getDay();
  if (!days.includes(currentDay)) return false;
  
  // Check if current time matches schedule
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = time.start.split(':').map(Number);
  const [endHour, endMin] = time.end.split(':').map(Number);
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  return currentTime >= startTime && currentTime <= endTime;
};

AutomationRule.prototype.checkEventTrigger = function(message, contact) {
  const events = this.triggerConditions.events || [];
  // This would be expanded based on specific events you want to track
  return events.some(event => {
    switch (event) {
      case 'first_message':
        return contact.messageCount === 1;
      case 'no_response_24h':
        return contact.lastMessageAt && 
               (Date.now() - new Date(contact.lastMessageAt).getTime()) > 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  });
};

// Class methods
AutomationRule.findActiveRules = function(userId, chatbotId = null) {
  const where = {
    userId,
    isActive: true,
  };
  
  if (chatbotId) {
    where.chatbotId = chatbotId;
  }
  
  return this.findAll({
    where,
    order: [['priority', 'DESC'], ['createdAt', 'ASC']],
  });
};

AutomationRule.findByTriggerType = function(userId, triggerType) {
  return this.findAll({
    where: {
      userId,
      triggerType,
      isActive: true,
    },
    order: [['priority', 'DESC']],
  });
};

module.exports = AutomationRule; 