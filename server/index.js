const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(express.json());


// Import your routes
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

// Mount the auth routes
app.use("/api/auth", authRoutes);

// Use your routes
app.use("/api", uploadRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Connection
// You will get this URL from MongoDB Atlas (free)
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/learning_tool";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running and waiting for ML tasks!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
