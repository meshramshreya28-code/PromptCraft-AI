import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PromptCraft AI Backend is running successfully!",
  });
});

// Generate prompt route
app.post("/generate", async (req, res) => {
  try {
    const { taskType, topic, tone, outputFormat } = req.body;

    if (!taskType || !topic || !tone || !outputFormat) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const instruction = `
You are an expert Prompt Engineer.

Based on the following details:
- Task Type: ${taskType}
- Topic or Goal: ${topic}
- Tone: ${tone}
- Output Format: ${outputFormat}

Generate a response in EXACTLY this format:

OPTIMIZED PROMPT:
[Write a highly effective AI prompt]

WHY THIS PROMPT WORKS:
[Explain why the prompt is effective and well-structured]

EXPERT PROMPT:
[Write an advanced expert-level version of the prompt]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: instruction,
    });

    const text = response.text;

    res.json({
      success: true,
      result: text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate prompt.",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});