const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HfInference } = require("@huggingface/inference");

// 1. Initialize AI Clients
// Ensure these keys are in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// ---------------------------------------------------------
// ENDPOINT 1: GEMINI (Paid Tier / High Performance)
// ---------------------------------------------------------
router.post("/gemini", async (req, res) => {
  const { message, studentData } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // Formatting context for the AI
    const prompt = `
      System: You are an AI Mentor for the "LegalEagle" project. 
      Data: Here is the current student analytics data: ${JSON.stringify(studentData)}.
      User Question: ${message}
      Instruction: Provide a data-driven, concise answer based ONLY on the provided JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed to respond." });
  }
});

// ---------------------------------------------------------
// ENDPOINT 2: HUGGING FACE (Free Models / Open Source)
// ---------------------------------------------------------
router.post("/huggingface", async (req, res) => {
  const { message, studentData } = req.body;

  try {
    const context = `Context: ${JSON.stringify(studentData)}. Question: ${message}`;

    const out = await hf.textGeneration({
      model: "mistralai/Mistral-7B-v0.3", // High-quality free model
      inputs: `<s>[INST] You are a teaching assistant for Rudraksh. Using this data: ${context} [/INST]`,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
      },
    });

    res.json({ text: out.generated_text });
  } catch (error) {
    console.error("HF Error:", error);
    res.status(500).json({ error: "Hugging Face Inference failed." });
  }
});

module.exports = router;
