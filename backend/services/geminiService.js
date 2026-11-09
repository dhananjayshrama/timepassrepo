import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1beta" },
});

const MODEL = "gemini-2.5-flash";

// Normal text reply (used for interview questions).
// history = earlier messages: [{ role: "user" | "model", parts: [{ text }] }]
export async function askGemini({ systemInstruction, prompt, history = [] }) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [...history, { role: "user", parts: [{ text: prompt }] }],
    config: { systemInstruction },
  });

  return (response.text || "").trim();
}

// JSON reply (used for scoring and the final report)
export async function askGeminiJSON({ systemInstruction, prompt }) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { systemInstruction, responseMimeType: "application/json" },
  });

  const clean = (response.text || "").replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("Gemini returned invalid JSON:", clean);
    throw new Error("AI returned an invalid response. Please try again.");
  }
}