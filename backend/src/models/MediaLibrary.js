const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MediaLibrary = sequelize.define('MediaLibrary', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_url',
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size',
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mime_type',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'media_library',
  timestamps: true,
  paranoid: true,
});

// Instance methods
MediaLibrary.prototype.getFileExtension = function() {
  const url = this.fileUrl;
  return url.split('.').pop().toLowerCase();
};

MediaLibrary.prototype.isImage = function() {
  return this.type === 'image';
};

MediaLibrary.prototype.isVideo = function() {
  return this.type === 'video';
};

MediaLibrary.prototype.isAudio = function() {
  return this.type === 'audio';
};

MediaLibrary.prototype.isDocument = function() {
  return this.type === 'document';
};

MediaLibrary.prototype.getFileSizeInMB = function() {
  if (!this.fileSize) return 0;
  return (this.fileSize / (1024 * 1024)).toFixed(2);
};

// Class methods
MediaLibrary.findByUser = function(userId, options = {}) {
  const { type, limit = 50, offset = 0 } = options;
  
  const where = { userId };
  if (type) {
    where.type = type;
  }
  
  return this.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
};

MediaLibrary.findByType = function(userId, type) {
  return this.findAll({
    where: { userId, type },
    order: [['createdAt', 'DESC']],
  });
};

MediaLibrary.getStorageStats = function(userId) {
  return this.findAll({
    where: { userId },
    attributes: [
      'type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('file_size')), 'total_size'],
    ],
    group: ['type'],
  });
};

module.exports = MediaLibrary; 