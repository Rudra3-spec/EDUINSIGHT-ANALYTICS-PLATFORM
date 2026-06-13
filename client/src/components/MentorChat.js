// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { API_URL } from "../config";

// const MentorChat = ({ studentData }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       role: "bot",
//       text: '👋 Hi! I\'m your LegalEagle AI Mentor. Upload your student data and ask me anything — like "Which students are at risk?" or "Show me chapter difficulty".',
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef(null);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   // Unified function to handle hitting endpoints with explicit headers
//   const sendMessage = async (textToSend = input) => {
//     const text = textToSend.trim();
//     if (!text || loading) return;

//     // Append user message immediately to the dialogue logs
//     setMessages((prev) => [...prev, { role: "user", text }]);
//     setInput("");
//     setLoading(true);

//     try {
//       // FIX: Explicitly grab token to support backend authentication lookup layers
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         `${API_URL}/api/chat/gemini`,
//         {
//           message: text,
//           studentData: studentData, // This fallback array will be populated securely from state context
//         },
//         {
//           headers: {
//             "x-auth-token": token, // FIX: Pass the authentication string to the backend middleware securely
//           },
//         }
//       );
//       setMessages((prev) => [...prev, { role: "bot", text: res.data.text }]);
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.error ||
//         "Sorry, something went wrong. Please try again.";
//       setMessages((prev) => [...prev, { role: "bot", text: `⚠️ ${errMsg}` }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // FIX: Instantly fire query off when quick-suggestion chips are selected
//   const handleQuickPromptClick = (promptText) => {
//     if (loading) return;
//     sendMessage(promptText);
//   };

//   return (
//     <div style={containerStyle}>
//       {/* Chat Window */}
//       {isOpen && (
//         <div className="glass-card" style={chatWindowStyle}>
//           {/* Header */}
//           <div style={headerStyle}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ fontSize: "1.1rem" }}>🤖</span>
//               <span style={{ fontWeight: "700", color: "#818cf8" }}>Mentor Assistant</span>
//               <span
//                 style={{
//                   fontSize: "0.7rem",
//                   background: "rgba(52,211,153,0.15)",
//                   color: "#34d399",
//                   border: "1px solid #34d399",
//                   borderRadius: "20px",
//                   padding: "1px 8px",
//                   fontWeight: "600",
//                 }}
//               >
//                 Online
//               </span>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#64748b",
//                 cursor: "pointer",
//                 fontSize: "1.1rem",
//                 lineHeight: 1,
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           {/* Messages */}
//           <div style={msgListStyle}>
//             {messages.map((m, i) => (
//               <div key={i} style={m.role === "user" ? userMsgStyle : botMsgStyle}>
//                 {m.text.split("\n").map((line, j) => (
//                   <span key={j}>
//                     {line}
//                     {j < m.text.split("\n").length - 1 && <br />}
//                   </span>
//                 ))}
//               </div>
//             ))}

//             {/* Typing indicator */}
//             {loading && (
//               <div style={botMsgStyle}>
//                 <span style={typingDotStyle} />
//                 <span style={{ ...typingDotStyle, animationDelay: "0.2s" }} />
//                 <span style={{ ...typingDotStyle, animationDelay: "0.4s" }} />
//                 <style>{`
//                   @keyframes bounce {
//                     0%, 80%, 100% { transform: translateY(0); }
//                     40% { transform: translateY(-6px); }
//                   }
//                 `}</style>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Input */}
//           <div style={inputAreaStyle}>
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               style={inputStyle}
//               placeholder="Ask about your students..."
//               disabled={loading}
//             />
//             <button
//               onClick={() => sendMessage()}
//               disabled={loading || !input.trim()}
//               style={{
//                 ...sendBtnStyle,
//                 opacity: loading || !input.trim() ? 0.5 : 1,
//                 cursor: loading || !input.trim() ? "not-allowed" : "pointer",
//               }}
//             >
//               {loading ? "..." : "Send"}
//             </button>
//           </div>

//           {/* Quick prompts */}
//           <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
//             {["High risk students", "Chapter difficulty", "Class overview"].map((q) => (
//               <button
//                 key={q}
//                 onClick={() => handleQuickPromptClick(q)} // Fixed reference implementation link
//                 style={quickBtnStyle}
//                 disabled={loading}
//               >
//                 {q}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Floating Bubble */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={bubbleStyle}
//         title="Open Mentor Chat"
//       >
//         {isOpen ? "✕" : "💬"}
//       </button>
//     </div>
//   );
// };

// // ── Styles ────────────────────────────────────────────────────────────────────
// const containerStyle = {
//   position: "fixed",
//   bottom: "30px",
//   right: "30px",
//   zIndex: 1000,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-end",
//   gap: "12px",
// };

// const chatWindowStyle = {
//   width: "370px",
//   height: "500px",
//   display: "flex",
//   flexDirection: "column",
//   padding: "16px",
//   boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   borderBottom: "1px solid #1e293b",
//   paddingBottom: "12px",
//   marginBottom: "4px",
// };

// const msgListStyle = {
//   flex: 1,
//   overflowY: "auto",
//   padding: "8px 0",
//   fontSize: "0.875rem",
//   display: "flex",
//   flexDirection: "column",
//   gap: "8px",
// };

// const userMsgStyle = {
//   background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
//   color: "#fff",
//   padding: "10px 14px",
//   borderRadius: "16px 16px 4px 16px",
//   alignSelf: "flex-end",
//   maxWidth: "85%",
//   lineHeight: "1.5",
//   wordBreak: "break-word",
// };

// const botMsgStyle = {
//   background: "rgba(30,41,59,0.8)",
//   color: "#cbd5e0",
//   padding: "10px 14px",
//   borderRadius: "16px 16px 16px 4px",
//   alignSelf: "flex-start",
//   maxWidth: "90%",
//   lineHeight: "1.6",
//   wordBreak: "break-word",
//   border: "1px solid rgba(255,255,255,0.05)",
// };

// const typingDotStyle = {
//   display: "inline-block",
//   width: "7px",
//   height: "7px",
//   background: "#818cf8",
//   borderRadius: "50%",
//   margin: "0 2px",
//   animation: "bounce 1s infinite",
// };

// const inputAreaStyle = {
//   display: "flex",
//   gap: "6px",
//   marginTop: "10px",
// };

// const inputStyle = {
//   flex: 1,
//   background: "#0f172a",
//   border: "1px solid #334155",
//   color: "#fff",
//   padding: "10px 12px",
//   borderRadius: "10px",
//   fontSize: "0.875rem",
//   outline: "none",
// };

// const sendBtnStyle = {
//   background: "linear-gradient(135deg, #6366f1, #a855f7)",
//   border: "none",
//   color: "#fff",
//   padding: "10px 16px",
//   borderRadius: "10px",
//   fontWeight: "700",
//   fontSize: "0.875rem",
//   transition: "opacity 0.2s",
// };

// const quickBtnStyle = {
//   background: "rgba(79,70,229,0.15)",
//   border: "1px solid rgba(129,138,248,0.3)",
//   color: "#818cf8",
//   padding: "3px 10px",
//   borderRadius: "20px",
//   fontSize: "0.72rem",
//   cursor: "pointer",
//   fontWeight: "600",
// };

// const bubbleStyle = {
//   width: "58px",
//   height: "58px",
//   borderRadius: "50%",
//   background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
//   border: "none",
//   color: "#fff",
//   fontSize: "1.5rem",
//   cursor: "pointer",
//   boxShadow: "0 8px 25px rgba(99,102,241,0.5)",
//   transition: "transform 0.2s ease, box-shadow 0.2s ease",
// };

// export default MentorChat;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const MentorChat = ({ studentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: '👋 Hi! I\'m your LegalEagle AI Mentor. Upload your student data and ask me anything — like "Which students are at risk?" or "Show me chapter difficulty".',
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Unified function to handle hitting endpoints with explicit headers
  const sendMessage = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    // Append user message immediately to the dialogue logs
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // FIX: Explicitly grab token to support backend authentication lookup layers
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/chat/gemini`,
        {
          message: text,
          studentData: studentData, // This fallback array will be populated securely from state context
        },
        {
          headers: {
            "x-auth-token": token, // FIX: Pass the authentication string to the backend middleware securely
          },
        },
      );
      setMessages((prev) => [...prev, { role: "bot", text: res.data.text }]);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", text: `⚠️ ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // FIX: Instantly fire query off when quick-suggestion chips are selected
  const handleQuickPromptClick = (promptText) => {
    if (loading) return;
    sendMessage(promptText);
  };

  return (
    <div style={containerStyle}>
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card" style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>🤖</span>
              <span style={{ fontWeight: "700", color: "#818cf8" }}>
                Mentor Assistant
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  background: "rgba(52,211,153,0.15)",
                  color: "#34d399",
                  border: "1px solid #34d399",
                  borderRadius: "20px",
                  padding: "1px 8px",
                  fontWeight: "600",
                }}
              >
                Online
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={msgListStyle}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={m.role === "user" ? userMsgStyle : botMsgStyle}
              >
                {m.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < m.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={botMsgStyle}>
                <span style={typingDotStyle} />
                <span style={{ ...typingDotStyle, animationDelay: "0.2s" }} />
                <span style={{ ...typingDotStyle, animationDelay: "0.4s" }} />
                <style>{`
                  @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                  }
                `}</style>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={inputAreaStyle}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              placeholder="Ask about your students..."
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                ...sendBtnStyle,
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

          {/* Quick prompts */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {["High risk students", "Chapter difficulty", "Class overview"].map(
              (q) => (
                <button
                  key={q}
                  onClick={() => handleQuickPromptClick(q)} // Fixed reference implementation link
                  style={quickBtnStyle}
                  disabled={loading}
                >
                  {q}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={bubbleStyle}
        title="Open Mentor Chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const containerStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "12px",
};

const chatWindowStyle = {
  width: "370px",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #1e293b",
  paddingBottom: "12px",
  marginBottom: "4px",
};

const msgListStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "8px 0",
  fontSize: "0.875rem",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const userMsgStyle = {
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "16px 16px 4px 16px",
  alignSelf: "flex-end",
  maxWidth: "85%",
  lineHeight: "1.5",
  wordBreak: "break-word",
};

const botMsgStyle = {
  background: "rgba(30,41,59,0.8)",
  color: "#cbd5e0",
  padding: "10px 14px",
  borderRadius: "16px 16px 16px 4px",
  alignSelf: "flex-start",
  maxWidth: "90%",
  lineHeight: "1.6",
  wordBreak: "break-word",
  border: "1px solid rgba(255,255,255,0.05)",
};

const typingDotStyle = {
  display: "inline-block",
  width: "7px",
  height: "7px",
  background: "#818cf8",
  borderRadius: "50%",
  margin: "0 2px",
  animation: "bounce 1s infinite",
};

const inputAreaStyle = {
  display: "flex",
  gap: "6px",
  marginTop: "10px",
};

const inputStyle = {
  flex: 1,
  background: "#0f172a",
  border: "1px solid #334155",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "0.875rem",
  outline: "none",
};

const sendBtnStyle = {
  background: "linear-gradient(135deg, #6366f1, #a855f7)",
  border: "none",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "0.875rem",
  transition: "opacity 0.2s",
};

const quickBtnStyle = {
  background: "rgba(79,70,229,0.15)",
  border: "1px solid rgba(129,138,248,0.3)",
  color: "#818cf8",
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "0.72rem",
  cursor: "pointer",
  fontWeight: "600",
};

const bubbleStyle = {
  width: "58px",
  height: "58px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "none",
  color: "#fff",
  fontSize: "1.5rem",
  cursor: "pointer",
  boxShadow: "0 8px 25px rgba(99,102,241,0.5)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

export default MentorChat;
