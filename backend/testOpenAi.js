const { OpenAI } = require('openai');  // Correctly import OpenAI class
require('dotenv').config();  // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Use your API key from .env file
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Choose the model
      messages: [{ role: 'user', content: 'Hello, OpenAI!' }],
    });

    console.log(response);  // Log the response from OpenAI API
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
  }
}

testOpenAI();
