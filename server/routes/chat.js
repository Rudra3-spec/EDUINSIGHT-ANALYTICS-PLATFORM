const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (only used if API key is valid and not exhausted)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Built-in Smart Fallback Analyser ────────────────────────────────────────
// Works entirely offline — analyses studentData JSON and answers common questions
function builtInAnalyser(message, studentData) {
  const q = message.toLowerCase().trim();
  const students = studentData?.students || [];
  const chapters = studentData?.chapters || [];
  const insight = studentData?.insight || "";

  if (students.length === 0) {
    return "No student data has been uploaded yet. Please upload a CSV file first, then ask me questions about your class.";
  }

  const total = students.length;
  const highRisk = students.filter((s) => s.riskLevel === "High");
  const medRisk = students.filter((s) => s.riskLevel === "Medium");
  const lowRisk = students.filter((s) => s.riskLevel === "Low");
  const avgScore = (students.reduce((a, s) => a + (s.score || 0), 0) / total).toFixed(1);
  const avgProb = (students.reduce((a, s) => a + (s.completionProbability || 0), 0) / total * 100).toFixed(1);

  const hardestChapter = chapters.length
    ? chapters.reduce((a, b) => (a.difficulty > b.difficulty ? a : b))
    : null;
  const easiestChapter = chapters.length
    ? chapters.reduce((a, b) => (a.difficulty < b.difficulty ? a : b))
    : null;

  // High risk students
  if (q.includes("high risk") || q.includes("at risk") || q.includes("struggling") || q.includes("danger")) {
    if (highRisk.length === 0) return "🎉 Great news! No students are currently at high risk of dropping out.";
    const ids = highRisk.slice(0, 10).map((s) => `Student ${s.studentId}`).join(", ");
    return `⚠️ **${highRisk.length} students are at High Risk** (${((highRisk.length / total) * 100).toFixed(0)}% of class):\n${ids}${highRisk.length > 10 ? ` ... and ${highRisk.length - 10} more.` : "."}\n\nThese students have a low completion probability. Consider scheduling 1-on-1 check-ins.`;
  }

  // Completion / overview
  if (q.includes("completion") || q.includes("overview") || q.includes("summary") || q.includes("overall") || q.includes("how is") || q.includes("how are")) {
    return `📊 **Class Overview (${total} students)**\n\n• 🔴 High Risk: ${highRisk.length} (${((highRisk.length / total) * 100).toFixed(0)}%)\n• 🟡 Medium Risk: ${medRisk.length} (${((medRisk.length / total) * 100).toFixed(0)}%)\n• 🟢 Low Risk: ${lowRisk.length} (${((lowRisk.length / total) * 100).toFixed(0)}%)\n\n• Average Score: ${avgScore}%\n• Average Completion Probability: ${avgProb}%\n\n${insight}`;
  }

  // Chapter difficulty
  if (q.includes("chapter") || q.includes("difficult") || q.includes("hard") || q.includes("easy") || q.includes("topic")) {
    if (!hardestChapter) return "No chapter data available yet.";
    let reply = `📚 **Chapter Analysis (${chapters.length} chapters)**\n\n`;
    chapters.forEach((ch) => {
      const label = ch.difficulty > 60 ? "🔴 Hard" : ch.difficulty > 40 ? "🟡 Medium" : "🟢 Easy";
      reply += `• Chapter ${ch.chapter}: ${label} — Difficulty ${ch.difficulty}%, Avg Score ${ch.avgScore}%, Avg Time ${ch.avgTime}min\n`;
    });
    reply += `\n🏆 Hardest: Chapter ${hardestChapter.chapter} (${hardestChapter.difficulty}% difficulty)\n✅ Easiest: Chapter ${easiestChapter.chapter} (${easiestChapter.difficulty}% difficulty)`;
    return reply;
  }

  // Score
  if (q.includes("score") || q.includes("grade") || q.includes("marks") || q.includes("performance")) {
    const topStudents = [...students].sort((a, b) => b.score - a.score).slice(0, 5);
    const bottomStudents = [...students].sort((a, b) => a.score - b.score).slice(0, 5);
    return `📈 **Score Analysis**\n\nClass Average Score: **${avgScore}%**\n\n🏆 Top 5 Students:\n${topStudents.map((s) => `• Student ${s.studentId}: ${s.score}%`).join("\n")}\n\n⚠️ Bottom 5 Students:\n${bottomStudents.map((s) => `• Student ${s.studentId}: ${s.score}%`).join("\n")}`;
  }

  // Count / how many
  if (q.includes("how many") || q.includes("count") || q.includes("number of")) {
    return `📊 **Student Counts**\n\n• Total Students: ${total}\n• High Risk: ${highRisk.length}\n• Medium Risk: ${medRisk.length}\n• Low Risk: ${lowRisk.length}\n• Avg Completion Probability: ${avgProb}%`;
  }

  // Insight
  if (q.includes("insight") || q.includes("recommend") || q.includes("suggest") || q.includes("advice") || q.includes("what should")) {
    return `💡 **AI Insight**\n\n${insight}\n\n**Recommendations:**\n• Focus extra support on the ${highRisk.length} high-risk students\n• ${hardestChapter ? `Add resources for Chapter ${hardestChapter.chapter} (hardest chapter)` : ""}\n• Students with scores below 50% need immediate attention`;
  }

  // Hello / greeting
  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("help") || q.length < 5) {
    return `👋 Hello! I'm your EduInsight Mentor AI.\n\nI can help you analyse your class data. Try asking:\n• "Which students are at high risk?"\n• "Show me chapter difficulty"\n• "Give me an overview of the class"\n• "Who has the lowest scores?"\n• "What do you recommend?"`;
  }

  // Default — still give useful info
  return `🤖 Here's what I know about your class:\n\n${total} students loaded | Average score: ${avgScore}% | High risk: ${highRisk.length} students\n\n${insight}\n\nYou can ask me about: high risk students, chapter difficulty, scores, completion rates, or recommendations.`;
}

// ─── ENDPOINT: GEMINI with smart fallback ────────────────────────────────────
router.post("/gemini", async (req, res) => {
  const { message, studentData } = req.body;

  // Try Gemini first
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `You are an AI Mentor for the "EduInsight Analytics" educational platform.
You help teachers understand their students' performance data.

Student Data (JSON):
${JSON.stringify(studentData, null, 2)}

Teacher's Question: ${message}

Instructions:
- Answer based on the provided data only
- Be concise and specific (2-4 sentences)
- Highlight numbers and student IDs where relevant
- If data is empty, ask the teacher to upload a CSV first`;

      const result = await model.generateContent(prompt);
      return res.json({ text: result.response.text(), source: "gemini" });
    } catch (error) {
      console.warn("Gemini failed, using built-in analyser:", error.message?.slice(0, 80));
      // Fall through to built-in
    }
  }

  // Built-in fallback
  const reply = builtInAnalyser(message, studentData);
  res.json({ text: reply, source: "builtin" });
});

// ─── ENDPOINT: HuggingFace with smart fallback ───────────────────────────────
router.post("/huggingface", async (req, res) => {
  const { message, studentData } = req.body;
  // HuggingFace free tier is unreliable — always use built-in for now
  const reply = builtInAnalyser(message, studentData);
  res.json({ text: reply, source: "builtin" });
});

module.exports = router;
