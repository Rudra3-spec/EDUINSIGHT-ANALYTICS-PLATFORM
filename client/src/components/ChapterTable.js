import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const ChapterTable = ({ chapters }) => {
  // Custom color scale for the chart: Green for easy, Red for hard
  const getBarColor = (difficulty) => {
    if (difficulty > 60) return "#f87171"; // Red
    if (difficulty > 40) return "#fbbf24"; // Yellow
    return "#34d399"; // Green
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* 1. VISUAL CHART SECTION */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h4
          style={{
            color: "#818cf8",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          📊 Difficulty Distribution per Chapter
        </h4>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chapters}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="chapter"
                stroke="#94a3b8"
                label={{
                  value: "Chapter Number",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#94a3b8"
                label={{
                  value: "Difficulty %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="difficulty" radius={[4, 4, 0, 0]}>
                {chapters.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.difficulty)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. ENHANCED TABLE SECTION */}
      <div
        className="glass-card"
        style={{ padding: "24px", overflowX: "auto" }}
      >
        <h4 style={{ color: "#818cf8", marginBottom: "20px" }}>
          📚 Detailed Chapter Analytics
        </h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#f8fafc",
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "2px solid #334155",
                color: "#94a3b8",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              <th style={{ padding: "15px" }}>Chapter</th>
              <th>Difficulty Score</th>
              <th>Level</th>
              <th>Avg Score</th>
              <th>Avg Time (Min)</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((ch, index) => (
              <tr
                key={index}
                className="table-row-hover"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  transition: "background 0.3s",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  Chapter {ch.chapter}
                </td>
                <td style={{ fontSize: "1.1rem" }}>
                  <span style={{ color: getBarColor(ch.difficulty) }}>
                    {ch.difficulty}%
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      background:
                        ch.difficulty > 60
                          ? "rgba(248, 113, 113, 0.2)"
                          : "rgba(251, 191, 36, 0.2)",
                      color: ch.difficulty > 60 ? "#f87171" : "#fbbf24",
                      border: `1px solid ${
                        ch.difficulty > 60 ? "#f87171" : "#fbbf24"
                      }`,
                    }}
                  >
                    {ch.difficulty > 60 ? "Hard" : "Medium"}
                  </span>
                </td>
                <td style={{ color: "#cbd5e0" }}>{100 - ch.difficulty}</td>
                <td style={{ color: "#cbd5e0" }}>{ch.avgTime}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChapterTable;
