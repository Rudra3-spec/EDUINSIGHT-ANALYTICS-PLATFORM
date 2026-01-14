const { spawn } = require("child_process");
const path = require("path");
const Student = require("../models/Student");

exports.handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);

    // 1. Call Python Script
    const pythonProcess = spawn("python", [
      path.join(__dirname, "..", "ml_predict.py"),
      filePath,
    ]);

    let pythonData = "";

    // 2. Listen for data from Python
    pythonProcess.stdout.on("data", (data) => {
      pythonData += data.toString();
    });

    // 3. When Python finishes
    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ message: "Python script failed" });
      }

      try {
        // This 'parsed' object now looks like: { students: [], chapters: [], insight: "" }
        const parsed = JSON.parse(pythonData);

        // 4. Save ONLY the student list to MongoDB
        // We don't save the 'chapters' or 'insight' to the Student collection
        await Student.insertMany(parsed.students);

        // 5. Send EVERYTHING back to React
        // React needs all three parts to show the charts and the text
        res.status(200).json({
          message: "ML Analysis Complete!",
          data: parsed,
        });
      } catch (parseError) {
        console.error("Parse Error:", parseError);
        res.status(500).json({ message: "Error parsing ML results" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
