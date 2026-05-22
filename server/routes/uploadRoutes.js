// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const File = require('../models/File');
// const router = express.Router();

// // 1. Setup Storage Engine
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage });

// // 2. Upload and Save Metadata
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const newFile = new File({
//       fileName: req.file.originalname,
//       filePath: req.file.path
//     });
//     await newFile.save();

//     // Here you would also trigger your Python ML script
//     res.json({ message: "File uploaded and saved!", file: newFile });
//   } catch (err) {
//     res.status(500).json({ error: "File upload failed" });
//   }
// });

// // 3. Get Previous Files
// router.get('/previous-files', async (req, res) => {
//   try {
//     const files = await File.find().sort({ uploadDate: -1 });
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ error: "Could not fetch files" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const File = require("../models/File");
const jwt = require("jsonwebtoken"); // New: for token verification
const fs = require("fs");
const router = express.Router();

// --- AUTH MIDDLEWARE ---
// This checks the "x-auth-token" header to see who is logged in
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.user = decoded; // Adds user id to req.user.id
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

// 1. Setup Storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Helper function to run ML Analysis
const runMLAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["ml_predict.py", filePath]);
    let resultData = "";
    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) reject("Python script failed");
      else resolve(JSON.parse(resultData));
    });
  });
};

// 2. Upload and Analyze New File (PROTECTED)
router.post("/upload", [auth, upload.single("file")], async (req, res) => {
  try {
    const newFile = new File({
      fileName: req.file.originalname,
      filePath: req.file.path,
      teacherId: req.user.id, // Now links file to the logged-in teacher
    });
    await newFile.save();

    const analysis = await runMLAnalysis(req.file.path);

    res.json({
      message: "Analysis Complete!",
      file: newFile,
      analysis: analysis,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload or Analysis failed" });
  }
});

// 3. Analyze a Previous File (PROTECTED)
router.post("/analyze-previous", auth, async (req, res) => {
  try {
    // Only allow analysis if the file belongs to the logged-in user
    const file = await File.findOne({
      _id: req.body.fileId,
      teacherId: req.user.id,
    });
    if (!file)
      return res.status(404).json({ error: "File not found or access denied" });

    const analysis = await runMLAnalysis(file.filePath);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

// 4. Get User-Specific File History (PROTECTED)
router.get("/previous-files", auth, async (req, res) => {
  try {
    // We only fetch files belonging to the logged-in teacher
    const files = await File.find({ teacherId: req.user.id }).sort({
      uploadDate: -1,
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch files" });
  }
});

// 5. Clear ONLY the User's Records (PROTECTED)
router.delete("/clear", auth, async (req, res) => {
  try {
    // Delete only the records for this specific user
    await File.deleteMany({ teacherId: req.user.id });
    res.json({ message: "Your history has been cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear your records" });
  }
});

// 6. Get Students from latest file (PROTECTED)
router.get("/students", auth, async (req, res) => {
  try {
    const lastFile = await File.findOne({ teacherId: req.user.id }).sort({
      uploadDate: -1,
    });
    if (!lastFile) return res.json([]);

    const analysis = await runMLAnalysis(lastFile.filePath);
    res.json(analysis.students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

module.exports = router;
