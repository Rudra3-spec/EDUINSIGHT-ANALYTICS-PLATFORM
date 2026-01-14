const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import your routes
const uploadRoutes = require("./routes/uploadRoutes");

// Use your routes
app.use("/api", uploadRoutes);

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
