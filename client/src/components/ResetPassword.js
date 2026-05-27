// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const { token } = useParams(); // Grabs the token from the URL
//   const navigate = useNavigate();

//   const handleReset = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/auth/reset-password/${token}`,
//         { password },
//       );
//       alert(res.data.msg);
//       navigate("/"); // Go back to login page
//     } catch (err) {
//       alert(err.response?.data?.msg || "Link expired or invalid");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="glass-card">
//         <h2>Set New Password</h2>
//         <form onSubmit={handleReset}>
//           <input
//             type="password"
//             placeholder="Enter new password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Update Password</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password },
      );
      alert("Password updated!");
      navigate("/auth");
    } catch (err) {
      alert("Invalid or expired link");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0f172a",
      }}
    >
      <div className="glass-card" style={{ padding: "40px" }}>
        <h2 style={{ color: "#fff" }}>New Password</h2>
        <form
          onSubmit={handleReset}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="password"
            placeholder="New Password"
            style={{ padding: "10px", borderRadius: "5px" }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
            }}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
