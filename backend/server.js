const express = require('express');
const openai = require('./config/openaiConfig');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5002;

app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Dummy in-memory user storage (replace with a database in production)
let users = [];

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: "Server is running" });
});

// Register endpoint (existing, do not touch)
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = { id: Date.now(), username, password };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Login endpoint (existing, do not touch)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  return res.status(200).json({ message: 'Login successful', user });
});

// Chat endpoint using OpenAI API
app.post('/api/chat', async (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages should be an array." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Chat Error:", error.message);
    next(error);
  }
});

// Text completion endpoint using OpenAI API
app.post('/api/completions', async (req, res, next) => {
  const { prompt, max_tokens } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt must be a string." });
  }

  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: max_tokens || 150, // Default max_tokens if not provided
    });
    res.json({ reply: response.choices[0].text });
  } catch (error) {
    console.error("OpenAI Completion Error:", error.message);
    next(error);
  }
});

// Error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
