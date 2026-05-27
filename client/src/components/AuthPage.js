// import React, { useState } from "react";
// import axios from "axios";

// const AuthPage = ({ onLoginSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showForgot, setShowForgot] = useState(false); // Toggle for Forgot Password view
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [resetEmail, setResetEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // --- FORGOT PASSWORD FLOW ---
//     if (showForgot) {
//       try {
//         const res = await axios.post(
//           "http://localhost:5000/api/auth/forgot-password",
//           { email: resetEmail },
//         );
//         alert(res.data.msg);
//         setShowForgot(false);
//       } catch (err) {
//         alert(err.response?.data?.msg || "Error sending email");
//       }
//       return;
//     }

//     // --- LOGIN / SIGNUP FLOW ---
//     const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
//     try {
//       const res = await axios.post(
//         `http://localhost:5000${endpoint}`,
//         formData,
//       );
//       if (isLogin) {
//         localStorage.setItem("token", res.data.token);
//         onLoginSuccess(res.data.user);
//       } else {
//         alert("Signup successful! Please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       alert(err.response?.data?.msg || "Authentication failed");
//     }
//   };

//   return (
//     <div style={authContainerStyle}>
//       <div className="glass-card" style={{ padding: "40px", width: "400px" }}>
//         <h2 style={{ color: "#818cf8", textAlign: "center" }}>
//           {showForgot
//             ? "Reset Password"
//             : isLogin
//               ? "Welcome Back"
//               : "Create Account"}
//         </h2>

//         <form onSubmit={handleSubmit} style={formStyle}>
//           {showForgot ? (
//             // --- SHOW THIS IF showForgot IS TRUE ---
//             <input
//               type="email"
//               placeholder="Enter your registered email"
//               style={inputStyle}
//               onChange={(e) => setResetEmail(e.target.value)}
//               required
//             />
//           ) : (
//             // --- SHOW LOGIN/SIGNUP FIELDS ---
//             <>
//               {!isLogin && (
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   style={inputStyle}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               )}
//               <input
//                 type="email"
//                 placeholder="Email"
//                 style={inputStyle}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 style={inputStyle}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}

//           <button type="submit" style={submitBtnStyle}>
//             {showForgot ? "Send Reset Link" : isLogin ? "Login" : "Sign Up"}
//           </button>
//         </form>

//         <div style={{ textAlign: "center", marginTop: "15px" }}>
//           {/* TOGGLE FORGOT PASSWORD VIEW */}
//           <p onClick={() => setShowForgot(!showForgot)} style={linkStyle}>
//             {showForgot ? "Back to Login" : "Forgot Password?"}
//           </p>

//           {/* TOGGLE LOGIN/SIGNUP VIEW */}
//           {!showForgot && (
//             <p onClick={() => setIsLogin(!isLogin)} style={linkStyle}>
//               {isLogin
//                 ? "Don't have an account? Sign Up"
//                 : "Already have an account? Login"}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles
// const authContainerStyle = {
//   height: "100vh",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   background: "#0f172a",
// };
// const formStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "15px",
//   marginTop: "20px",
// };
// const inputStyle = {
//   padding: "12px",
//   background: "#1e293b",
//   border: "1px solid #334155",
//   borderRadius: "8px",
//   color: "#fff",
// };
// const submitBtnStyle = {
//   padding: "12px",
//   background: "#4f46e5",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontWeight: "bold",
// };
// const linkStyle = {
//   color: "#94a3b8",
//   cursor: "pointer",
//   fontSize: "0.85rem",
//   marginTop: "10px",
// };

// export default AuthPage;
import React, { useState } from "react";
import axios from "axios";

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showForgot) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          { email: resetEmail },
        );
        alert(res.data.msg);
        setShowForgot(false);
      } catch (err) {
        alert(err.response?.data?.msg || "Error sending email");
      }
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData,
      );
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        onLoginSuccess(res.data.user);
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Authentication failed");
    }
  };

  return (
    <div style={fullPageBg}>
      {/* Moving Glow Effects in background */}
      <div style={glowCircle1}></div>
      <div style={glowCircle2}></div>

      <div className="glass-card" style={proGlassCard}>
        <div style={cardHeader}>
          <div style={logoCircle}>LE</div>
          <h2 style={proTitle}>
            {showForgot
              ? "Secure Reset"
              : isLogin
                ? "Welcome Back"
                : "Join LegalEagle"}
          </h2>
          <p style={proSubtitle}>
            {showForgot
              ? "Enter email to recover access"
              : "Intelligence-driven learning analytics"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {!showForgot && !isLogin && (
            <div style={inputWrapper}>
              <input
                type="text"
                placeholder="Full Name"
                style={proInput}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div style={inputWrapper}>
            <input
              type="email"
              placeholder="Email Address"
              style={proInput}
              onChange={(e) =>
                showForgot
                  ? setResetEmail(e.target.value)
                  : setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {!showForgot && (
            <div style={inputWrapper}>
              <input
                type="password"
                placeholder="Password"
                style={proInput}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          )}

          <button type="submit" style={proSubmitBtn}>
            {showForgot
              ? "Recover Account"
              : isLogin
                ? "Sign In"
                : "Get Started"}
          </button>
        </form>

        <div style={footerLinks}>
          <span onClick={() => setShowForgot(!showForgot)} style={smallLink}>
            {showForgot ? "Wait, I remember it!" : "Forgot password?"}
          </span>
          {!showForgot && (
            <div style={toggleText}>
              {isLogin ? "New to the platform?" : "Already a member?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)} style={activeLink}>
                {isLogin ? "Create Account" : "Log In"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PRO STYLING ---
// --- COMPLETE STYLES (REPLACE YOUR OLD ONES WITH THIS) ---

const fullPageBg = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#020617",
  backgroundImage:
    'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2072")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  position: "relative",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const glowCircle1 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  background: "rgba(79, 70, 229, 0.15)",
  filter: "blur(100px)",
  top: "10%",
  left: "15%",
  borderRadius: "50%",
};

const glowCircle2 = {
  position: "absolute",
  width: "300px",
  height: "300px",
  background: "rgba(129, 140, 248, 0.1)",
  filter: "blur(80px)",
  bottom: "10%",
  right: "15%",
  borderRadius: "50%",
};

const proGlassCard = {
  width: "100%",
  maxWidth: "440px",
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "24px",
  padding: "50px 40px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  zIndex: 10,
};

const cardHeader = { textAlign: "center", marginBottom: "35px" };

const logoCircle = {
  width: "60px",
  height: "60px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  borderRadius: "16px",
  margin: "0 auto 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
  fontSize: "1.2rem",
  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
};

const proTitle = {
  color: "#fff",
  fontSize: "1.8rem",
  fontWeight: "700",
  marginBottom: "8px",
};
const proSubtitle = { color: "#94a3b8", fontSize: "0.95rem" };

const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };

const inputWrapper = {
  width: "100%",
  position: "relative",
};

const proInput = {
  width: "100%",
  padding: "14px 20px",
  background: "rgba(30, 41, 59, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  transition: "0.3s",
  boxSizing: "border-box",
};

const proSubmitBtn = {
  padding: "14px",
  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
};

const footerLinks = {
  marginTop: "25px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const smallLink = {
  color: "#94a3b8",
  fontSize: "0.85rem",
  cursor: "pointer",
  textDecoration: "underline",
};
const toggleText = { color: "#64748b", fontSize: "0.9rem" };
const activeLink = { color: "#818cf8", fontWeight: "bold", cursor: "pointer" };

// Temporary helper style just in case
const authContainerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
};
export default AuthPage;
