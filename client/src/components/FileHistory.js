import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const FileHistory = ({ onSelectFile }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${API_URL}/api/previous-files`,
          {
            headers: { "x-auth-token": token },
          },
        );
        setFiles(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="glass-card" style={{ padding: "20px", marginTop: "20px" }}>
      <h4 style={{ color: "#818cf8", marginBottom: "15px" }}>
        📜 Previous Uploads
      </h4>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {/* --- PLACE THE CODE BLOCK BELOW --- */}
        {files.map((file) => (
          <div
            key={file._id}
            onClick={() => onSelectFile(file)}
            style={{
              ...fileItemStyle,
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <span style={{ fontSize: "0.8rem", color: "#f8fafc" }}>
              {file.fileName}
            </span>
            <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>
              {new Date(file.uploadDate).toLocaleDateString()}
            </span>
          </div>
        ))}
        {/* --- END OF CODE BLOCK --- */}
      </div>
    </div>
  );
};

const fileItemStyle = {
  padding: "12px",
  borderBottom: "1px solid #334155",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background 0.2s ease",
};

export default FileHistory;
