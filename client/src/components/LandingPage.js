import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: "🎯",
      title: "Risk Prediction",
      desc: "Identify at-risk students before they fall behind using our Random Forest ML model trained on historical data.",
    },
    {
      icon: "📊",
      title: "Chapter Difficulty Analysis",
      desc: "Automatically detect which chapters are causing the most difficulty based on score and time-spent patterns.",
    },
    {
      icon: "🤖",
      title: "AI Mentor Chat",
      desc: "Ask natural language questions about your class data and get instant, data-driven answers powered by Gemini AI.",
    },
    {
      icon: "📈",
      title: "Completion Forecasting",
      desc: "Get a per-student completion probability score so you know exactly where to focus your teaching effort.",
    },
    {
      icon: "📁",
      title: "CSV Upload & History",
      desc: "Upload student data as CSV in seconds. All previous uploads are saved so you can revisit any analysis.",
    },
    {
      icon: "📥",
      title: "Instant Reports",
      desc: "Export a structured analysis report for your records or to share with department heads in one click.",
    },
  ];

  return (
    <div style={landingContainerStyle}>
      {/* ── NAVBAR ── */}
      <nav style={navStyle}>
        <div style={navLogoStyle}>
          <span style={{ color: "#818cf8" }}>Edu</span>Insight
        </div>
        <button
          style={navBtnStyle}
          onMouseEnter={(e) => (e.target.style.background = "#6366f1")}
          onMouseLeave={(e) => (e.target.style.background = "#4f46e5")}
          onClick={() => navigate("/auth")}
        >
          Login / Sign Up
        </button>
      </nav>

      {/* ── HERO ── */}
      <div style={overlayStyle} />
      <div style={contentStyle}>
        <div style={badgeStyle}>✨ Powered by Machine Learning + Gemini AI</div>
        <h1 style={titleStyle}>
          Empowering Education with{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Intelligence
          </span>
        </h1>
        <p style={subtitleStyle}>
          Predict student success, identify risks, and gain deep learning
          insights using our advanced Machine Learning predictive engine.
        </p>

        <div style={buttonGroupStyle}>
          <button
            onClick={() => navigate("/auth")}
            style={primaryBtnStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 15px 30px rgba(79,70,229,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 8px 20px rgba(79,70,229,0.3)";
            }}
          >
            Get Started Free →
          </button>
          <button
            onClick={scrollToFeatures}
            style={secondaryBtnStyle}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#818cf8";
              e.target.style.color = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#334155";
              e.target.style.color = "#fff";
            }}
          >
            See Features ↓
          </button>
        </div>

        {/* Stats row */}
        <div style={statsRowStyle}>
          {[
            { value: "95%", label: "Prediction Accuracy" },
            { value: "< 5s", label: "Analysis Time" },
            { value: "100%", label: "Free to Use" },
          ].map((s) => (
            <div key={s.label} style={statItemStyle}>
              <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#818cf8" }}>
                {s.value}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <div ref={featuresRef} style={featuresSectionStyle}>
        <h2 style={sectionTitleStyle}>
          Everything you need to{" "}
          <span style={{ color: "#818cf8" }}>teach smarter</span>
        </h2>
        <p style={sectionSubStyle}>
          One platform, all the analytics your classroom needs.
        </p>
        <div style={featuresGridStyle}>
          {features.map((f) => (
            <div
              key={f.title}
              style={featureCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(129,138,248,0.4)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={featureIconStyle}>{f.icon}</div>
              <h3 style={{ color: "#f1f5f9", margin: "0 0 10px", fontSize: "1.1rem" }}>
                {f.title}
              </h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <div style={aboutSectionStyle}>
        <h2 style={sectionTitleStyle}>About EduInsight Analytics</h2>
        <p style={aboutTextStyle}>
          EduInsight Analytics is an AI-powered educational intelligence platform that
          helps teachers understand their students' performance at a deeper level.
          By leveraging a <strong style={{ color: "#818cf8" }}>Random Forest Classifier</strong>,
          we predict course completion probabilities and surface students who need immediate
          intervention — before it's too late.
        </p>
        <button
          onClick={() => navigate("/auth")}
          style={{ ...primaryBtnStyle, marginTop: "30px" }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Start Analyzing Now →
        </button>
      </div>
    </div>
  );
};

// ── STYLES ──
const landingContainerStyle = {
  minHeight: "100vh",
  position: "relative",
  color: "#fff",
  backgroundColor: "#0f172a",
  backgroundImage:
    'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  overflowX: "hidden",
};

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 5%",
  background: "rgba(15,23,42,0.85)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
};

const navLogoStyle = {
  fontSize: "1.4rem",
  fontWeight: "800",
  letterSpacing: "-0.5px",
};

const navBtnStyle = {
  padding: "10px 24px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.9rem",
  transition: "background 0.2s ease",
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.75) 0%, #0f172a 100%)",
  zIndex: 1,
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  textAlign: "center",
  padding: "120px 20px 60px",
};

const badgeStyle = {
  background: "rgba(129,138,248,0.15)",
  border: "1px solid rgba(129,138,248,0.3)",
  borderRadius: "999px",
  padding: "8px 20px",
  fontSize: "0.85rem",
  color: "#818cf8",
  marginBottom: "24px",
  fontWeight: "600",
};

const titleStyle = {
  fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
  fontWeight: "800",
  marginBottom: "20px",
  lineHeight: 1.15,
  maxWidth: "850px",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#94a3b8",
  maxWidth: "680px",
  marginBottom: "40px",
  lineHeight: 1.7,
};

const buttonGroupStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const primaryBtnStyle = {
  padding: "15px 40px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.05rem",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 8px 20px rgba(79,70,229,0.3)",
  transition: "all 0.2s ease",
};

const secondaryBtnStyle = {
  padding: "15px 40px",
  background: "transparent",
  color: "#fff",
  border: "2px solid #334155",
  borderRadius: "12px",
  fontSize: "1.05rem",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease",
};

const statsRowStyle = {
  display: "flex",
  gap: "60px",
  marginTop: "60px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const statItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
};

const featuresSectionStyle = {
  position: "relative",
  zIndex: 2,
  padding: "100px 8%",
  textAlign: "center",
  background: "rgba(15,23,42,0.95)",
};

const sectionTitleStyle = {
  fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
  fontWeight: "800",
  marginBottom: "12px",
  color: "#f1f5f9",
};

const sectionSubStyle = {
  color: "#64748b",
  fontSize: "1.1rem",
  marginBottom: "60px",
};

const featuresGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
  maxWidth: "1100px",
  margin: "0 auto",
  textAlign: "left",
};

const featureCardStyle = {
  background: "rgba(30,41,59,0.6)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  padding: "32px",
  transition: "all 0.3s ease",
  cursor: "default",
};

const featureIconStyle = {
  fontSize: "2.2rem",
  marginBottom: "16px",
};

const aboutSectionStyle = {
  position: "relative",
  zIndex: 2,
  padding: "100px 20px",
  textAlign: "center",
  background: "linear-gradient(to bottom, rgba(15,23,42,0.95), #0f172a)",
};

const aboutTextStyle = {
  maxWidth: "750px",
  margin: "20px auto 0",
  lineHeight: "1.9",
  color: "#94a3b8",
  fontSize: "1.05rem",
};

export default LandingPage;
