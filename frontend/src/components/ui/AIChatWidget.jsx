import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_GEMINI_API_KEY
);

console.log(process.env.REACT_APP_GEMINI_API_KEY);

export default function AIChatWidget() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const askAI = async () => {
    if (!name || !mobile || !question) {
  alert("దయచేసి పేరు, మొబైల్ నంబర్ మరియు ప్రశ్న నమోదు చేయండి.");
  return;
   }
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

     
     const prompt = `
నువ్వు Fortune U Group యొక్క AI Financial Assistant.

Website: https://fortuneugroup.in

Services:
- Mutual Funds
- Health Insurance
- Term Insurance
- SIP Planning
- Retirement Planning
- Financial Planning

User Question:
${question}

సమాధానం తెలుగులో లేదా English లో user అడిగిన భాషలో ఇవ్వు.
చివర్లో "మరింత సమాచారం కోసం Fortune U Group ని సంప్రదించండి." అని చెప్పు.
`;

      console.log("Question:", question);
    
      const result = await model.generateContent(prompt);
     const aiResponse = result.response.text();

    
  await fetch("https://n8n.fortuneugroup.in/webhook/ai-chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    mobile,
    question,
    aiResponse,
  }),
});

setResponse(aiResponse);

    } catch (error) {
      console.error("Gemini Error:", error);
    }
    
    setLoading(false);
  };

  return (
  <>
    {/* Floating Chat Button */}
    {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "140px",
          right: "20px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background: "#0F2B5B",
          color: "#fff",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,.25)",
          zIndex: 9999,
        }}
      >
        🤖
      </button>
    )}

    {/* Chat Window */}
    {isOpen && (
      <div
        style={{
          position: "fixed",
          bottom: "140px",
          right: "20px",
          width: "360px",
          height: "520px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>🤖 Fortune U Group AI</strong>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div style={{ padding: "12px" }}>
        <input
  type="text"
  placeholder="మీ పేరు"
  value={name}
  onChange={(e) => setName(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "8px",
  }}
/>

<input
  type="tel"
  placeholder="Mobile Number"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "8px",
  }}
/>
          <input
            type="text"
            placeholder="మీ ప్రశ్న అడగండి..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <button
            onClick={askAI}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              background: "#0F2B5B",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            background: "#f5f5f5",
            whiteSpace: "pre-wrap",
          }}
        >
          {response || "👋 Welcome to Fortune U Group AI.\n\nమీ ప్రశ్న అడగండి."}
        </div>
      </div>
    )}
  </>
);
}