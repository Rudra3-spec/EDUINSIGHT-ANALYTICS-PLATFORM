// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const { spawn } = require("child_process");
// const File = require("../models/File");
// const jwt = require("jsonwebtoken"); // New: for token verification
// const fs = require("fs");
// const router = express.Router();

// // --- AUTH MIDDLEWARE ---
// // This checks the "x-auth-token" header to see who is logged in
// const auth = (req, res, next) => {
//   const token = req.header("x-auth-token");
//   if (!token)
//     return res.status(401).json({ msg: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
//     req.user = decoded; // Adds user id to req.user.id
//     next();
//   } catch (e) {
//     res.status(400).json({ msg: "Token is not valid" });
//   }
// };

// // 1. Setup Storage
// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: uploadsDir,
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Only accept CSV and Excel files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "text/csv",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   ];
//   const allowedExts = [".csv", ".xls", ".xlsx"];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only CSV and Excel (.xls, .xlsx) files are allowed"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // Helper function to run ML Analysis
// const runMLAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const scriptPath = path.join(__dirname, "../ml_predict.py");
//     const absoluteFilePath = path.resolve(filePath);
//     // Set thread env vars to prevent numpy/BLAS from hanging on startup
//     const pythonEnv = {
//       ...process.env,
//       OMP_NUM_THREADS: "1",
//       OPENBLAS_NUM_THREADS: "1",
//       MKL_NUM_THREADS: "1",
//     };
//     const pythonProcess = spawn("python", [scriptPath, absoluteFilePath], {
//       env: pythonEnv,
//     });
//     let resultData = "";
//     let errorData = "";

//     pythonProcess.stdout.on("data", (data) => {
//       resultData += data.toString();
//     });
//     pythonProcess.stderr.on("data", (data) => {
//       errorData += data.toString();
//     });
//     pythonProcess.on("close", (code) => {
//       try {
//         const parsed = JSON.parse(resultData);
//         // ml_predict.py always outputs JSON — check if it contains an error key
//         if (parsed.error) {
//           console.error("ML script returned error:", parsed.error);
//           reject(new Error(parsed.error));
//         } else {
//           resolve(parsed);
//         }
//       } catch (parseErr) {
//         // Python crashed before printing JSON
//         const errMsg = errorData || resultData || "Unknown Python error";
//         console.error("Python script crashed:", errMsg);
//         reject(new Error(`ML analysis failed: ${errMsg.slice(0, 300)}`));
//       }
//     });
//   });
// };

// // 2. Upload and Analyze New File (PROTECTED)
// // Note: In Express v5, middleware must be chained separately, not passed as an array
// router.post("/upload", auth, upload.single("file"), async (req, res) => {
//   try {
//     // multer fileFilter error comes through as req.fileValidationError
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded. Please upload a CSV or Excel file." });
//     }

//     const newFile = new File({
//       fileName: req.file.originalname,
//       filePath: req.file.path,
//       teacherId: req.user.id,
//     });
//     await newFile.save();

//     let analysis;
//     try {
//       analysis = await runMLAnalysis(req.file.path);
//     } catch (mlErr) {
//       // Delete the saved file record since analysis failed
//       await newFile.deleteOne();
//       return res.status(422).json({
//         error: mlErr.message || "ML analysis failed. Check your file format and required columns.",
//       });
//     }

//     res.json({
//       message: "Analysis Complete!",
//       file: newFile,
//       analysis: analysis,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Upload failed", details: err.message });
//   }
// });

// // 3. Analyze a Previous File (PROTECTED)
// router.post("/analyze-previous", auth, async (req, res) => {
//   try {
//     // Only allow analysis if the file belongs to the logged-in user
//     const file = await File.findOne({
//       _id: req.body.fileId,
//       teacherId: req.user.id,
//     });
//     if (!file)
//       return res.status(404).json({ error: "File not found or access denied" });

//     const analysis = await runMLAnalysis(file.filePath);
//     res.json({ analysis });
//   } catch (err) {
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// // 4. Get User-Specific File History (PROTECTED)
// router.get("/previous-files", auth, async (req, res) => {
//   try {
//     // We only fetch files belonging to the logged-in teacher
//     const files = await File.find({ teacherId: req.user.id }).sort({
//       uploadDate: -1,
//     });
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ error: "Could not fetch files" });
//   }
// });

// // 5. Clear ONLY the User's Records (PROTECTED)
// router.delete("/clear", auth, async (req, res) => {
//   try {
//     // Delete only the records for this specific user
//     await File.deleteMany({ teacherId: req.user.id });
//     res.json({ message: "Your history has been cleared successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to clear your records" });
//   }
// });

// // 6. Get Students from latest file (PROTECTED)
// router.get("/students", auth, async (req, res) => {
//   try {
//     const lastFile = await File.findOne({ teacherId: req.user.id }).sort({
//       uploadDate: -1,
//     });
//     if (!lastFile) return res.json([]);

//     const analysis = await runMLAnalysis(lastFile.filePath);
//     res.json(analysis.students);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch student data" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const File = require("../models/File");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const router = express.Router();

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

// Setup Storage
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const allowedExts = [".csv", ".xls", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel (.xls, .xlsx) files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Helper function to run ML Analysis
const runMLAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../ml_predict.py");
    const absoluteFilePath = path.resolve(filePath);
    const pythonEnv = {
      ...process.env,
      OMP_NUM_THREADS: "1",
      OPENBLAS_NUM_THREADS: "1",
      MKL_NUM_THREADS: "1",
    };
    const pythonProcess = spawn("python", [scriptPath, absoluteFilePath], {
      env: pythonEnv,
    });
    let resultData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });
    pythonProcess.on("close", (code) => {
      try {
        const parsed = JSON.parse(resultData);
        if (parsed.error) {
          console.error("ML script returned error:", parsed.error);
          reject(new Error(parsed.error));
        } else {
          resolve(parsed);
        }
      } catch (parseErr) {
        const errMsg = errorData || resultData || "Unknown Python error";
        console.error("Python script crashed:", errMsg);
        reject(new Error(`ML analysis failed: ${errMsg.slice(0, 300)}`));
      }
    });
  });
};

// 2. Upload and Analyze New File (PROTECTED)
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Please upload a CSV or Excel file.",
      });
    }

    let analysis;
    try {
      // 1. Run ML Analysis first
      analysis = await runMLAnalysis(req.file.path);
    } catch (mlErr) {
      // Clean up local temp file if processing drops an error
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(422).json({
        error:
          mlErr.message ||
          "ML analysis failed. Check your file format and required columns.",
      });
    }

    // 2. Save file info AND parsed analysis data arrays to MongoDB
    const newFile = new File({
      fileName: req.file.originalname,
      filePath: req.file.path,
      teacherId: req.user.id,
      analysisData: analysis,
    });
    await newFile.save();

    res.json({
      message: "Analysis Complete!",
      file: newFile,
      analysis: analysis,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// 3. Analyze a Previous File (PROTECTED)
router.post("/analyze-previous", auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.body.fileId,
      teacherId: req.user.id,
    });
    if (!file)
      return res.status(404).json({ error: "File not found or access denied" });

    // Optimization: If database already contains data, send it directly without spawning Python again
    if (file.analysisData) {
      return res.json({ analysis: file.analysisData });
    }

    const analysis = await runMLAnalysis(file.filePath);
    file.analysisData = analysis;
    await file.save();

    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

// 4. Get User-Specific File History (PROTECTED)
router.get("/previous-files", auth, async (req, res) => {
  try {
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

    if (lastFile.analysisData && lastFile.analysisData.students) {
      return res.json(lastFile.analysisData.students);
    }

    const analysis = await runMLAnalysis(lastFile.filePath);
    res.json(analysis.students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

module.exports = router;
