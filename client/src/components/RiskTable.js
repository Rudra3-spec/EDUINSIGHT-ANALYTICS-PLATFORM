import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RiskTable = ({ students }) => {
  const riskData = [
    {
      name: "High Risk",
      value: students.filter((s) => s.riskLevel === "High").length,
      color: "#f87171",
    },
    {
      name: "Medium Risk",
      value: students.filter((s) => s.riskLevel === "Medium").length || 0,
      color: "#fbbf24",
    },
    {
      name: "Low Risk",
      value: students.filter((s) => s.riskLevel === "Low").length,
      color: "#34d399",
    },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* 1. VISUAL RISK DISTRIBUTION */}
      <div
        className="glass-card"
        style={{ padding: "24px", display: "flex", alignItems: "center" }}
      >
        <div style={{ flex: 1, height: "300px" }}>
          <h4 style={{ color: "#818cf8", marginBottom: "10px" }}>
            Risk distribution Analysis
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {riskData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, paddingLeft: "20px" }}>
          <h2 style={{ color: "#fff", margin: "0" }}>{students.length}</h2>
          <p style={{ color: "#94a3b8" }}>Students processed via AI model</p>
        </div>
      </div>

      {/* 2. FULL STUDENT LIST (SCROLLABLE) */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h4 style={{ color: "#818cf8", marginBottom: "20px" }}>
          📋 All Students — Risk Analysis
        </h4>
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#cbd5e0",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#1e293b",
                zIndex: 1,
              }}
            >
              <tr
                style={{ textAlign: "left", borderBottom: "2px solid #334155" }}
              >
                <th style={{ padding: "15px" }}>Student ID</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <td
                    style={{
                      padding: "15px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {s.studentId}
                  </td>
                  <td>{Math.round(s.completionProbability * 100)}%</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        background:
                          s.riskLevel === "High"
                            ? "rgba(248, 113, 113, 0.15)"
                            : s.riskLevel === "Medium"
                            ? "rgba(251, 191, 36, 0.15)"
                            : "rgba(52, 211, 153, 0.15)",
                        color:
                          s.riskLevel === "High"
                            ? "#f87171"
                            : s.riskLevel === "Medium"
                            ? "#fbbf24"
                            : "#34d399",
                        border: `1px solid ${
                          s.riskLevel === "High"
                            ? "#f87171"
                            : s.riskLevel === "Medium"
                            ? "#fbbf24"
                            : "#34d399"
                        }`,
                      }}
                    >
                      {s.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskTable;
