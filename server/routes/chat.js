const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HfInference } = require("@huggingface/inference");

// 1. Initialize AI Clients
// Ensure these keys are in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// ---------------------------------------------------------
// ENDPOINT 1: GEMINI (High Performance)
// ---------------------------------------------------------
router.post("/gemini", async (req, res) => {
  const { message, studentData } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated to a faster, newer model

    const prompt = `
      System: You are an AI Mentor for the "LegalEagle" project. 
      Context Data: ${JSON.stringify(studentData)}
      User Question: ${message}
      Instruction: Provide a data-driven, concise answer based ONLY on the provided JSON. 
      If the data is missing, inform the user politely.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed to respond." });
  }
});

// ---------------------------------------------------------
// huggingface

router.post("/huggingface", async (req, res) => {
  const { message, studentData } = req.body;

  try {
    const response = await hf.textGeneration({
      model: "google/flan-t5-large", // ✅ runs on free API reliably
      inputs: `
You are an AI Mentor for LegalEagle.

Student Data:
${JSON.stringify(studentData)}

Question:
${message}

Give a short, data-driven answer only from the data.
      `,
      parameters: {
        max_new_tokens: 200,
      },
    });

    res.json({ text: response.generated_text });
  } catch (error) {
    console.error("DETAILED HF ERROR:", error.message);

    res.status(500).json({
      error: "HF overloaded",
      details: "Using Gemini is recommended right now.",
    });
  }
});

module.exports = router;
