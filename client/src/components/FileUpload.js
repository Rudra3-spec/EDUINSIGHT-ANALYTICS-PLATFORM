import React, { useState } from "react";

const FileUpload = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (file) onUpload(file);
    else alert("Please select a file first!");
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "50px",
        textAlign: "center",
        marginBottom: "40px",
        border: "2px solid rgba(129, 138, 248, 0.1)",
      }}
    >
      <div
        style={{
          border: "3px dashed rgba(129, 138, 248, 0.3)",
          borderRadius: "24px",
          padding: "60px 20px",
          background: "rgba(79, 70, 229, 0.03)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📁</div>
        <h2 style={{ color: "#fff", marginBottom: "10px", fontWeight: "800" }}>
          Upload Learner Data
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Drag and drop your CSV file or click to browse
        </p>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
          accept=".csv"
        />
        <label
          htmlFor="fileInput"
          style={{
            padding: "12px 30px",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-block",
            boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.39)",
          }}
        >
          {file ? `✅ ${file.name}` : "Choose CSV File"}
        </label>
      </div>

      {/* REQUIRED COLUMNS SECTION */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "15px",
        }}
      >
        <p
          style={{
            color: "#818cf8",
            fontWeight: "bold",
            marginBottom: "12px",
            fontSize: "0.9rem",
          }}
        >
          REQUIRED DATA COLUMNS
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {[
            "student_id",
            "course_id",
            "chapter_order",
            "time_spent",
            "score",
          ].map((col) => (
            <code
              key={col}
              style={{
                background: "#1e293b",
                color: "#34d399",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #334155",
              }}
            >
              {col}
            </code>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        style={{
          width: "100%",
          marginTop: "30px",
          padding: "18px",
          background:
            loading || !file
              ? "#334155"
              : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          fontWeight: "800",
          fontSize: "1.1rem",
          cursor: loading || !file ? "not-allowed" : "pointer",
          boxShadow:
            loading || !file
              ? "none"
              : "0 10px 20px -5px rgba(99, 102, 241, 0.5)",
        }}
      >
        {loading ? "⚡ ANALYZING DATA..." : "RUN AI PREDICTIONS"}
      </button>
    </div>
  );
};

export default FileUpload;
