const OverviewSection = ({ data }) => {
  const total = data.students.length;
  const highRisk = data.students.filter((s) => s.riskLevel === "High").length;
  // Calculating Medium Risk to complete the risk profile
  const mediumRisk = data.students.filter(
    (s) => s.riskLevel === "Medium"
  ).length;
  const rate = total > 0 ? Math.round(((total - highRisk) / total) * 100) : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {/* TOTAL STUDENTS CARD */}
      <div
        className="glass-card"
        style={{ padding: "20px", borderTop: "4px solid #818cf8" }}
      >
        <h4
          style={{
            color: "#94a3b8",
            margin: "0 0 10px 0",
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          Total Students
        </h4>
        <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#fff" }}>
          {total}
        </h1>
      </div>

      {/* HIGH RISK CARD */}
      <div
        className="glass-card"
        style={{ padding: "20px", borderTop: "4px solid #f87171" }}
      >
        <h4
          style={{
            color: "#94a3b8",
            margin: "0 0 10px 0",
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          High Risk
        </h4>
        <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#f87171" }}>
          {highRisk}
        </h1>
      </div>

      {/* MEDIUM RISK CARD - REPLACED ENGAGEMENT */}
      <div
        className="glass-card"
        style={{ padding: "20px", borderTop: "4px solid #fbbf24" }}
      >
        <h4
          style={{
            color: "#94a3b8",
            margin: "0 0 10px 0",
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          Medium Risk
        </h4>
        <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#fbbf24" }}>
          {mediumRisk}
        </h1>
      </div>

      {/* COMPLETION RATE CARD */}
      <div
        className="glass-card"
        style={{ padding: "20px", borderTop: "4px solid #34d399" }}
      >
        <h4
          style={{
            color: "#94a3b8",
            margin: "0 0 10px 0",
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          Completion Rate
        </h4>
        <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#34d399" }}>
          {rate}%
        </h1>
      </div>
    </div>
  );
};

export default OverviewSection;
