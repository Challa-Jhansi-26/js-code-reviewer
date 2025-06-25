// Frontend/src/App.jsx
import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  /* ───────────────────────────────────────────── */
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState(""); // Markdown string

  /* ───────────────────────────────────────────── */
  useEffect(() => {
    prism.highlightAll();
  }, []);

  /* ─────────────────────────────────────────────
     Helper: convert JSON response → Markdown
  ───────────────────────────────────────────── */
  const formatMarkdown = (data) => {
    const issuesList =
      data.issues?.map((issue) => `- ${issue}`).join("\n") || "None";

    const improvementsList =
      data.improvements?.map((imp) => `- ${imp}`).join("\n") || "None";

    return `
### 📝 Summary
${data.summary}

### ⚠️ Issues
${issuesList}

### ✅ Improvements
${improvementsList}

### 🛠️ Fixed Code
\`\`\`js
${data.fixedCode}
\`\`\`
    `.trim();
  };

  /* ─────────────────────────────────────────────
     Called when the user clicks “Review”
  ───────────────────────────────────────────── */
  async function reviewCode() {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const { data } = await axios.post(`${BASE_URL}/review`, { code });
      setReview(formatMarkdown(data));
    } catch (err) {
      console.error("❌ API Error:", err);
      setReview("**Error communicating with the review service.**");
    }
  }

  /* ───────────────────────────────────────────── */
  return (
    <main>
      {/* LEFT SIDE — Code Editor */}
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(c) =>
              prism.highlight(c, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: 5,
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        <button onClick={reviewCode} className="review">
          Review
        </button>
      </div>

      {/* RIGHT SIDE — AI Review */}
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
