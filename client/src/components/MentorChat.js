import React, { useState } from "react";
import axios from "axios";

const MentorChat = ({ studentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I am your Mentor AI. How can I help with your class data today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [modelType, setModelType] = useState("gemini"); // Toggle state

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      // 1. Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      const endpoint =
        modelType === "gemini" ? "/api/chat/gemini" : "/api/chat/huggingface";

      // 2. Add the headers object as the third argument in axios.post
      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        {
          message: input,
          studentData: studentData,
        },
        {
          headers: {
            "x-auth-token": token, // Must match the key used in your backend middleware
          },
        },
      );

      setMessages((prev) => [...prev, { role: "bot", text: res.data.text }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I encountered an authentication or server error.",
        },
      ]);
    }
  };

  return (
    <div style={containerStyle}>
      {isOpen && (
        <div className="glass-card" style={chatWindowStyle}>
          <div style={headerStyle}>
            <span>🤖 Mentor Assistant</span>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              style={selectStyle}
            >
              <option value="gemini">Gemini</option>
              <option value="huggingface">HuggingFace</option>
            </select>
          </div>
          <div style={msgListStyle}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={m.role === "user" ? userMsgStyle : botMsgStyle}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={inputAreaStyle}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={inputStyle}
              placeholder="Ask about your students..."
            />
            <button onClick={sendMessage} style={sendBtnStyle}>
              Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={bubbleStyle}>
        💬
      </button>
    </div>
  );
};

// Styles
const containerStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  zIndex: 1000,
};
const chatWindowStyle = {
  width: "350px",
  height: "450px",
  display: "flex",
  flexDirection: "column",
  padding: "15px",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #334155",
  paddingBottom: "10px",
  color: "#818cf8",
  fontWeight: "bold",
};
const selectStyle = {
  background: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "0.8rem",
};
const msgListStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "10px 0",
  fontSize: "0.9rem",
};
const userMsgStyle = {
  background: "#4f46e5",
  color: "#fff",
  padding: "8px",
  borderRadius: "8px",
  marginBottom: "10px",
  alignSelf: "flex-end",
  marginLeft: "20%",
};
const botMsgStyle = {
  background: "rgba(255,255,255,0.05)",
  color: "#cbd5e0",
  padding: "8px",
  borderRadius: "8px",
  marginBottom: "10px",
  marginRight: "20%",
};
const inputAreaStyle = { display: "flex", gap: "5px" };
const inputStyle = {
  flex: 1,
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#fff",
  padding: "8px",
  borderRadius: "4px",
};
const sendBtnStyle = {
  background: "#818cf8",
  border: "none",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: "4px",
  cursor: "pointer",
};
const bubbleStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "none",
  color: "#fff",
  fontSize: "1.5rem",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

export default MentorChat;
