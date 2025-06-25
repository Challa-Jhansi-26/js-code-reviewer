// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────
// Middleware
// ─────────────────────────────
app.use(cors());
app.use(express.json());

// ─────────────────────────────
// Health Check (GET /)
// ─────────────────────────────
app.get("/", (_, res) => {
  res.send("🟢 JS Code Reviewer backend is running!");
});

// ─────────────────────────────
// Main Route: POST /review
// ─────────────────────────────
app.post("/review", async (req, res) => {
  const { code } = req.body;

  // Basic validation
  if (!code || typeof code !== "string") {
    return res
      .status(400)
      .json({ error: "Field 'code' is required as string." });
  }

  try {
    // Ask Gemini to review the code
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You're a senior JavaScript code reviewer.  
Given the code snippet below, respond **ONLY** in valid JSON with this structure:

{
  "summary": "...",
  "issues": ["...", "..."],
  "improvements": ["...", "..."],
  "fixedCode": "..."
}

Here is the code to review:
\`\`\`js
${code}
\`\`\`
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    // Extract JSON block if Gemini wraps it in ```json ```
    const match = raw.match(/```json\\s*([\\s\\S]*?)```/i);
    const jsonText = match ? match[1].trim() : raw;

    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────
// Start Server
// ─────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
