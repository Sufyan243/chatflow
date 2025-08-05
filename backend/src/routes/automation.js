const express = require('express');
const { body, param, query } = require('express-validator');
const automationController = require('../controllers/automationController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation rules
const ruleValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 1, max: 100 }),
  body('triggerType').isIn(['keyword', 'welcome', 'schedule', 'event']).withMessage('Invalid trigger type'),
  body('triggerConditions').isObject().withMessage('Trigger conditions must be an object'),
  body('actions').isArray().withMessage('Actions must be an array'),
  body('priority').optional().isInt({ min: 0 }).withMessage('Priority must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const mediaValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['image', 'video', 'audio', 'document']).withMessage('Invalid media type'),
  body('fileUrl').notEmpty().withMessage('File URL is required').isURL().withMessage('Invalid file URL'),
  body('fileSize').optional().isInt({ min: 0 }).withMessage('File size must be a non-negative integer'),
  body('mimeType').optional().isString().withMessage('MIME type must be a string'),
];

// Automation Rules Routes
router.get('/rules', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('triggerType').optional().isIn(['keyword', 'welcome', 'schedule', 'event']).withMessage('Invalid trigger type'),
  query('isActive').optional().isIn(['true', 'false']).withMessage('isActive must be true or false'),
], automationController.getRules);

router.get('/rules/:id', [
  param('id').isUUID().withMessage('Invalid rule ID'),
], automationController.getRule);

router.post('/rules', ruleValidation, automationController.createRule);

router.put('/rules/:id', [
  param('id').isUUID().withMessage('Invalid rule ID'),
  ...ruleValidation,
], automationController.updateRule);

router.delete('/rules/:id', [
  param('id').isUUID().withMessage('Invalid rule ID'),
], automationController.deleteRule);

router.patch('/rules/:id/toggle', [
  param('id').isUUID().withMessage('Invalid rule ID'),
], automationController.toggleRule);

// Automation Logs Routes
router.get('/logs', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['executed', 'failed', 'skipped']).withMessage('Invalid status'),
  query('ruleId').optional().isUUID().withMessage('Invalid rule ID'),
], automationController.getLogs);

// Automation Statistics Routes
router.get('/stats', [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
], automationController.getStats);

// Media Library Routes
router.get('/media', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['image', 'video', 'audio', 'document']).withMessage('Invalid media type'),
], automationController.getMedia);

router.post('/media', mediaValidation, automationController.uploadMedia);

router.delete('/media/:id', [
  param('id').isUUID().withMessage('Invalid media ID'),
], automationController.deleteMedia);

// Scheduled Messages Routes
router.get('/scheduled', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'sent', 'failed', 'cancelled']).withMessage('Invalid status'),
], automationController.getScheduledMessages);

router.delete('/scheduled/:id', [
  param('id').isUUID().withMessage('Invalid scheduled message ID'),
], automationController.cancelScheduledMessage);

module.exports = router; 