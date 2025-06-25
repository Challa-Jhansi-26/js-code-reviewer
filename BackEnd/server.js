// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ──────────────────────────────────
// Middleware
// ──────────────────────────────────
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// ──────────────────────────────────
// Health Check (GET /)
// ──────────────────────────────────
app.get("/", (req, res) => {
  res.send("🟢 JS Code Reviewer backend is running!");
});

// ──────────────────────────────────
// Main Route: POST /review
// ──────────────────────────────────
app.post("/review", async (req, res) => {
  const { code } = req.body;

  // Basic validation
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Field 'code' is required as string." });
  }

  try {
    // TODO: Replace this stub with your Gemini logic
    // Example placeholder response:
    const response = {
      summary: "This code adds two numbers.",
      issues: ["Missing JSDoc", "No type validation"],
      fixedCode: `
/**
 * Adds two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Inputs must be numbers');
  }
  return a + b;
}`.trim(),
      improvements: [
        "Added JSDoc for better documentation.",
        "Implemented type checking for reliability."
      ]
    };

    res.json(response);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────
// Start Server
// ──────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
