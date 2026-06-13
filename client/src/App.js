// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Components
// import FileHistory from "./components/FileHistory";
// import AuthPage from "./components/AuthPage";
// import ResetPassword from "./components/ResetPassword"; // Create this component next
// import FileUpload from "./components/FileUpload";
// import MentorChat from "./components/MentorChat";

// // Aesthetic Components
// import OverviewSection from "./components/OverviewSection";
// import RiskTable from "./components/RiskTable";
// import ChapterTable from "./components/ChapterTable";
// import FullReport from "./components/FullReport";
// import DifficultyChart from "./components/DifficultyChart";

// // 1. GLOBAL AXIOS INTERCEPTOR
// // This automatically attaches the token to every request
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["x-auth-token"] = token;
//   }
//   return config;
// });

// function Dashboard({ data, setData, loading, setLoading, handleLogout }) {
//   const [activeTab, setActiveTab] = useState("overview");

//   // RE-ANALYZE PREVIOUS FILE
//   const handlePreviousFileAnalysis = async (file) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/analyze-previous",
//         {
//           fileId: file._id,
//         },
//       );
//       if (response.data && response.data.analysis) {
//         setData(response.data.analysis);
//         alert(`Switched to analysis for: ${file.fileName}`);
//       }
//     } catch (error) {
//       console.error("Analysis failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/upload",
//         formData,
//       );
//       setData(response.data.analysis);
//       alert("ML Analysis Complete!");
//     } catch (error) {
//       alert(error.response?.data?.msg || "Failed to process file.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadReport = () => {
//     if (data.students.length === 0) return alert("No data to download!");
//     const reportContent = `🎓 LEARNING INTELLIGENCE ANALYSIS\nDate: ${new Date().toLocaleString()}\n\nAI INSIGHT:\n${data.insight}`;
//     const element = document.createElement("a");
//     const file = new Blob([reportContent], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `Report_${Date.now()}.txt`;
//     document.body.appendChild(element);
//     element.click();
//   };

//   const handleClearData = async () => {
//     if (window.confirm("Are you sure?")) {
//       try {
//         await axios.delete("http://localhost:5000/api/clear");
//         setData({ students: [], chapters: [], insight: "" });
//         window.location.reload();
//       } catch (err) {
//         alert("Delete failed");
//       }
//     }
//   };

//   return (
//     <div style={{ padding: "40px 5%", minHeight: "100vh" }}>
//       <header
//         style={{
//           marginBottom: "40px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "2.5rem",
//               fontWeight: "800",
//               background: "linear-gradient(to right, #fff, #94a3b8)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Learning Intelligence <span style={{ color: "#818cf8" }}>Tool</span>
//           </h1>
//         </div>
//         <div style={{ display: "flex", gap: "15px" }}>
//           <button onClick={downloadReport} style={actionBtnStyle("#10b981")}>
//             📥 Report
//           </button>
//           <button onClick={handleClearData} style={actionBtnStyle("#ef4444")}>
//             🗑️ Reset
//           </button>
//           <button onClick={handleLogout} style={actionBtnStyle("#94a3b8")}>
//             Logout
//           </button>
//         </div>
//       </header>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 350px",
//           gap: "30px",
//         }}
//       >
//         <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
//           <OverviewSection data={data} />
//           {data.insight && (
//             <div className="glass-card" style={enhancedInsightStyle}>
//               <h3 style={{ color: "#818cf8" }}>💡 AI Predictive Insights</h3>
//               <p style={{ color: "#f8fafc", fontSize: "1.1rem" }}>
//                 {data.insight}
//               </p>
//             </div>
//           )}
//           <div className="glass-card">
//             <div style={tabContainerStyle}>
//               {["overview", "risk", "chapters", "report"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   style={tabButtonStyle(activeTab === tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             <div style={{ padding: "30px" }}>
//               {activeTab === "overview" && (
//                 <DifficultyChart data={data.chapters} />
//               )}
//               {activeTab === "risk" && <RiskTable students={data.students} />}
//               {activeTab === "chapters" && (
//                 <ChapterTable chapters={data.chapters} />
//               )}
//               {activeTab === "report" && <FullReport data={data} />}
//             </div>
//           </div>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
//           <FileUpload onUpload={handleUpload} loading={loading} />
//           <FileHistory onSelectFile={handlePreviousFileAnalysis} />
//           {data.students.length > 0 && (
//             <MentorChat studentData={data.students} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   const [data, setData] = useState({ students: [], chapters: [], insight: "" });
//   const [loading, setLoading] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     if (!token) return;
//     const fetchExistingData = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/students");
//         if (res.data && res.data.length > 0) {
//           setData((prev) => ({ ...prev, students: res.data }));
//         }
//       } catch (err) {
//         console.log("Session expired or no data.");
//       }
//     };
//     fetchExistingData();
//   }, [token]);

//   const handleLoginSuccess = () => setToken(localStorage.getItem("token"));
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setData({ students: [], chapters: [], insight: "" });
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* LOGIN / SIGNUP PAGE */}
//         <Route
//           path="/"
//           element={
//             !token ? (
//               <AuthPage onLoginSuccess={handleLoginSuccess} />
//             ) : (
//               <Navigate to="/dashboard" />
//             )
//           }
//         />

//         {/* MAIN DASHBOARD */}
//         <Route
//           path="/dashboard"
//           element={
//             token ? (
//               <Dashboard
//                 data={data}
//                 setData={setData}
//                 loading={loading}
//                 setLoading={setLoading}
//                 handleLogout={handleLogout}
//               />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* FORGOT PASSWORD RESET PAGE */}
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//       </Routes>
//     </Router>
//   );
// }

// // STYLES
// const actionBtnStyle = (color) => ({
//   padding: "10px 20px",
//   backgroundColor: "transparent",
//   color,
//   border: `1px solid ${color}`,
//   borderRadius: "10px",
//   cursor: "pointer",
// });
// const enhancedInsightStyle = {
//   padding: "30px",
//   borderLeft: "6px solid #818cf8",
//   background: "rgba(129, 138, 248, 0.08)",
// };
// const tabContainerStyle = {
//   display: "flex",
//   gap: "10px",
//   padding: "20px",
//   borderBottom: "1px solid rgba(255,255,255,0.05)",
// };
// const tabButtonStyle = (isActive) => ({
//   background: isActive ? "#4f46e5" : "transparent",
//   color: isActive ? "#fff" : "#94a3b8",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "8px",
//   cursor: "pointer",
// });

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import FileHistory from "./components/FileHistory";
import AuthPage from "./components/AuthPage";
import ResetPassword from "./components/ResetPassword";
import FileUpload from "./components/FileUpload";
import MentorChat from "./components/MentorChat";
import LandingPage from "./components/LandingPage"; // New Landing Page

// Aesthetic Components
import OverviewSection from "./components/OverviewSection";
import RiskTable from "./components/RiskTable";
import ChapterTable from "./components/ChapterTable";
import FullReport from "./components/FullReport";
import DifficultyChart from "./components/DifficultyChart";
import { API_URL } from "./config";

// 1. GLOBAL AXIOS INTERCEPTOR
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// console.log("LandingPage", LandingPage);
// console.log("AuthPage", AuthPage);
// console.log("ResetPassword", ResetPassword);
// console.log("Dashboard", Dashboard);
// console.log("OverviewSection", OverviewSection);
// console.log("RiskTable", RiskTable);
// console.log("ChapterTable", ChapterTable);
// console.log("FullReport", FullReport);
// console.log("DifficultyChart", DifficultyChart);
// console.log("FileHistory", FileHistory);
// console.log("FileUpload", FileUpload);
// console.log("MentorChat", MentorChat);

// SUB-COMPONENT: DASHBOARD

function Dashboard({ data, setData, loading, setLoading, handleLogout }) {
  const [activeTab, setActiveTab] = useState("overview");

  const handlePreviousFileAnalysis = async (file) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/analyze-previous`,
        { fileId: file._id },
      );
      if (response.data && response.data.analysis) {
        setData(response.data.analysis);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/upload`,
        formData,
      );
      setData(response.data.analysis);
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.msg || "Failed to process file. Check your file format.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (data.students.length === 0) return alert("No data to download!");
    const reportContent = `🎓 LEARNING INTELLIGENCE ANALYSIS\nDate: ${new Date().toLocaleString()}\n\nAI INSIGHT:\n${data.insight}`;
    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Report_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleClearData = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/clear`);
        setData({ students: [], chapters: [], insight: "" });
        window.location.reload();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div style={{ padding: "40px 5%", minHeight: "100vh" }}>
      <header
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(to right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learning Intelligence <span style={{ color: "#818cf8" }}>Tool</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={downloadReport} style={actionBtnStyle("#10b981")}>
            📥 Report
          </button>
          <button onClick={handleClearData} style={actionBtnStyle("#ef4444")}>
            🗑️ Reset
          </button>
          <button onClick={handleLogout} style={actionBtnStyle("#94a3b8")}>
            Logout
          </button>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "30px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <OverviewSection data={data} />
          {data.insight && (
            <div className="glass-card" style={enhancedInsightStyle}>
              <h3 style={{ color: "#818cf8" }}>💡 AI Predictive Insights</h3>
              <p style={{ color: "#f8fafc", fontSize: "1.1rem" }}>
                {data.insight}
              </p>
            </div>
          )}
          <div className="glass-card">
            <div style={tabContainerStyle}>
              {["overview", "risk", "chapters", "report"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={tabButtonStyle(activeTab === tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: "30px" }}>
              {activeTab === "overview" && (
                <DifficultyChart data={data.chapters} />
              )}
              {activeTab === "risk" && <RiskTable students={data.students} />}
              {activeTab === "chapters" && (
                <ChapterTable chapters={data.chapters} />
              )}
              {activeTab === "report" && <FullReport data={data} />}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <FileUpload onUpload={handleUpload} loading={loading} />
          <FileHistory onSelectFile={handlePreviousFileAnalysis} />
          {data.students.length > 0 && (
            <MentorChat studentData={data.students} />
          )}
        </div>
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  const [data, setData] = useState({ students: [], chapters: [], insight: "" });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;
    const fetchExistingData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/students`);
        if (res.data && res.data.length > 0) {
          setData((prev) => ({ ...prev, students: res.data }));
        }
      } catch (err) {
        console.log("Session expired or no data.");
      }
    };
    fetchExistingData();
  }, [token]);

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("token"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setData({ students: [], chapters: [], insight: "" });
  };

  return (
    <Router>
      <Routes>
        {/* LANDING PAGE (Public) */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH PAGE (Login/Signup) */}
        <Route
          path="/auth"
          element={
            !token ? (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                data={data}
                setData={setData}
                loading={loading}
                setLoading={setLoading}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {/* FORGOT PASSWORD RESET */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

// GLOBAL STYLES
const actionBtnStyle = (color) => ({
  padding: "10px 20px",
  backgroundColor: "transparent",
  color,
  border: `1px solid ${color}`,
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
});

const enhancedInsightStyle = {
  padding: "30px",
  borderLeft: "6px solid #818cf8",
  background: "rgba(129, 138, 248, 0.08)",
};

const tabContainerStyle = {
  display: "flex",
  gap: "10px",
  padding: "20px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const tabButtonStyle = (isActive) => ({
  background: isActive ? "#4f46e5" : "transparent",
  color: isActive ? "#fff" : "#94a3b8",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
});

export default App;
