// backend/src/routes/upload.js
const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');

const router = express.Router();

router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.body.chatId}/${req.file.filename}`;
    
    res.json({
      fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;