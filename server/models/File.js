// const mongoose = require("mongoose");

// const FileSchema = new mongoose.Schema({
//   fileName: { type: String, required: true },
//   filePath: { type: String, required: true },
//   // Link this to the 'User' model we are about to create
//   teacherId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   uploadDate: { type: Date, default: Date.now },
// });

// // Using 'files' as the third argument ensures it hits your existing collection
// module.exports = mongoose.model("File", FileSchema, "files");

const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
  // Storing the full JSON payload from the ML prediction script
  analysisData: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model("File", FileSchema, "files");
