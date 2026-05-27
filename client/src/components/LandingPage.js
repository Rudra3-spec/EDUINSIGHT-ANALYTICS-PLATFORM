import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={landingContainerStyle}>
      {/* Background Overlay */}
      <div style={overlayStyle}></div>

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          Empowering Education with{" "}
          <span style={{ color: "#818cf8" }}>AI Intelligence</span>
        </h1>
        <p style={subtitleStyle}>
          Predict student success, identify risks, and gain deep learning
          insights using our advanced Machine Learning predictive engine.
        </p>

        <div style={buttonGroupStyle}>
          <button onClick={() => navigate("/auth")} style={primaryBtnStyle}>
            Get Started
          </button>
          <button
            onClick={() => window.scrollTo(0, 800)}
            style={secondaryBtnStyle}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* About Section (Scroll Down) */}
      <div style={aboutSectionStyle}>
        <h2 style={{ color: "#818cf8", fontSize: "2rem" }}>About LegalEagle</h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            lineHeight: "1.8",
            color: "#94a3b8",
          }}
        >
          Our tool analyzes complex educational data to provide teachers with
          actionable insights. By leveraging Random Forest Classifiers, we
          predict completion probabilities and highlight students who need
          immediate intervention.
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const landingContainerStyle = {
  minHeight: "100vh",
  position: "relative",
  color: "#fff",
  backgroundColor: "#0f172a",
  backgroundImage:
    'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072")', // Tech/Space Background
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflowX: "hidden",
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.7), #0f172a)",
  zIndex: 1,
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  textAlign: "center",
  padding: "0 20px",
};

const titleStyle = {
  fontSize: "4rem",
  fontWeight: "800",
  marginBottom: "20px",
};
const subtitleStyle = {
  fontSize: "1.25rem",
  color: "#94a3b8",
  maxWidth: "700px",
  marginBottom: "40px",
};

const buttonGroupStyle = { display: "flex", gap: "20px" };
const primaryBtnStyle = {
  padding: "15px 40px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.1rem",
  cursor: "pointer",
  fontWeight: "bold",
};
const secondaryBtnStyle = {
  padding: "15px 40px",
  background: "transparent",
  color: "#fff",
  border: "2px solid #334155",
  borderRadius: "12px",
  fontSize: "1.1rem",
  cursor: "pointer",
};

const aboutSectionStyle = {
  position: "relative",
  zIndex: 2,
  padding: "100px 20px",
  textAlign: "center",
  background: "#0f172a",
};

export default LandingPage;
