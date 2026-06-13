// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS Configuration
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "https://eduinsight-analytics-platform.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (Postman, mobile apps, etc.)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
//     credentials: true,
//   }),
// );

// app.use(express.json());

// // Routes
// const uploadRoutes = require("./routes/uploadRoutes");
// const chatRoutes = require("./routes/chat");
// const authRoutes = require("./routes/auth");

// app.use("/api/auth", authRoutes);
// app.use("/api", uploadRoutes);
// app.use("/api/chat", chatRoutes);

// // MongoDB Connection
// const mongoURI =
//   process.env.MONGO_URI || "mongodb://localhost:27017/learning_tool";

// mongoose
//   .connect(mongoURI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// // Health Check Route
// app.get("/", (req, res) => {
//   res.send("Server is running and waiting for ML tasks!");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// TEMPORARY CORS (allow all origins)
app.use(cors());

// Middleware
app.use(express.json());

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Connection
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/learning_tool";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Health Check Route
app.get("/", (req, res) => {
  res.send("Server is running and waiting for ML tasks!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
