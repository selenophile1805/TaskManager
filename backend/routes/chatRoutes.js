const express = require('express');
const { chatWithAI, completion } = require('../controllers/chatController');

const router = express.Router();

// Chat route using OpenAI API
router.post('/chat', chatWithAI);

// Text completion route using OpenAI API
router.post('/completions', completion);

module.exports = router;
