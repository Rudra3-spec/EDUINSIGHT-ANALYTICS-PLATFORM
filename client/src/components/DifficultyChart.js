import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const DifficultyChart = ({ data }) => {
  return (
    <div className="glass-card" style={{ padding: "24px", flex: 2 }}>
      <h3 style={{ marginBottom: "20px", color: "#818cf8" }}>
        📈 Chapter Difficulty Analysis
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="chapter"
            stroke="#94a3b8"
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar
            dataKey="difficulty"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DifficultyChart;
