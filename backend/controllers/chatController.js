const openai = require('../config/openaiConfig');

exports.chatWithAI = async (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages should be an array." });
  }

  try {
    // Use the updated OpenAI chat API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use 'gpt-4' or 'gpt-3.5-turbo' depending on your preference
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    next(error);
  }
};

exports.completion = async (req, res, next) => {
  const { prompt, max_tokens } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt must be a string." });
  }

  try {
    // Use OpenAI completion API
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: max_tokens || 150, // Default max_tokens if not provided
    });

    const reply = response.choices[0].text;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI Completion Error:', error.message);
    next(error);
  }
};
