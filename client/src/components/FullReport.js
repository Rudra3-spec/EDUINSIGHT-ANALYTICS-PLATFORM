const FullReport = ({ data }) => {
  const highRisk = data.students.filter((s) => s.riskLevel === "High").length;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* NEON DECORATION */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "2px",
            background: "#818cf8",
            boxShadow: "0 0 15px #818cf8",
          }}
        ></div>

        <h2
          style={{
            color: "#818cf8",
            textAlign: "center",
            letterSpacing: "2px",
            marginBottom: "30px",
          }}
        >
          INTELLIGENCE REPORT
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ color: "#94a3b8" }}>
            <p>
              • STATUS: <span style={{ color: "#34d399" }}>ACTIVE</span>
            </p>
            <p>• DATA_SET: COURSE_V1</p>
            <p>• TIMESTAMP: {new Date().toLocaleTimeString()}</p>
          </div>
          <div style={{ color: "#94a3b8", textAlign: "right" }}>
            <p>STUDENTS: {data.students.length}</p>
            <p>ANOMALIES: {highRisk}</p>
            <p>SYSTEM: NEURAL_GEN_3</p>
          </div>
        </div>

        <hr style={{ borderColor: "#334155", margin: "30px 0" }} />

        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid rgba(129, 138, 248, 0.2)",
          }}
        >
          <h4 style={{ color: "#818cf8", margin: "0 0 15px 0" }}>
            💡 PREDICTIVE INSIGHT
          </h4>
          <p
            style={{ color: "#cbd5e0", lineHeight: "1.6", fontSize: "1.1rem" }}
          >
            {data.insight || "Awaiting data synchronization..."}
          </p>
        </div>

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#475569",
            fontSize: "0.8rem",
          }}
        >
          CONFIDENTIAL - FOR EDUCATOR USE ONLY
        </div>
      </div>
    </div>
  );
};

export default FullReport;
