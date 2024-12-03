const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI with your API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
