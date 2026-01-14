const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentId: String,
  score: Number,
  timeSpent: Number,
  chapterOrder: Number,
  // These fields will be filled by your ML script later
  completionPrediction: Number, // 0 or 1
  completionProbability: Number, // e.g., 0.85
  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);
