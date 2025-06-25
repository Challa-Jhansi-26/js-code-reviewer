const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You're a JavaScript code reviewer. Given this code, return:

1. A explainable summary
2. A bullet list of issues (if any)
3. A bullet list of improvements
4. The fixed version of the code (with proper formatting, JSDoc, and error handling if needed)

Respond in this JSON format:

{
  "summary": "...",
  "issues": ["..."],
  "improvements": ["..."],
  "fixedCode": "..."
}

Here is the code:
\`\`\`js
${code}
\`\`\`
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to extract just the JSON from response
    const match = text.match(/```json([\s\S]*?)```/);
    const rawJson = match ? match[1].trim() : text;

    const parsed = JSON.parse(rawJson);
    res.json(parsed);
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

module.exports = router;
