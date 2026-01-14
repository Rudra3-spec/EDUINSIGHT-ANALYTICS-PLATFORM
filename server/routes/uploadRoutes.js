const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadController = require("../controllers/uploadController");

// Define the POST route
router.post(
  "/upload",
  upload.single("file"),
  uploadController.handleFileUpload
);

const Student = require("../models/Student");

// New route to get all analyzed students
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add this above module.exports
router.delete("/clear", async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({ message: "Database cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
