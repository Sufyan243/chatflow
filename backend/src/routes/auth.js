const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.send({ message: 'Register endpoint hit' });
});

router.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

module.exports = router;
