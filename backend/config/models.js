import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// Each provider is created only if its key exists in .env
const builders = {
  groq: (temperature) =>
    process.env.GROQ_API_KEY &&
    new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature,
    }),

  gemini: (temperature) =>
    process.env.GEMINI_API_KEY &&
    new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      temperature,
    }),

  openai: (temperature) =>
    process.env.OPENAI_API_KEY &&
    new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature,
    }),
};

const DEFAULT_ORDER = {
  question: "groq,gemini,openai",
  evaluation: "openai,gemini,groq",
};

// Returns [{ name, model }] in the order set in .env
export function getModels(task) {
  const envKey = task === "question" ? "QUESTION_PROVIDERS" : "EVALUATION_PROVIDERS";
  const order = (process.env[envKey] || DEFAULT_ORDER[task])
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Questions need some variety; scoring should be consistent
  const temperature = task === "question" ? 0.7 : 0;

  const models = [];
  for (const name of order) {
    const model = builders[name]?.(temperature);
    if (model) models.push({ name, model });
  }

  if (!models.length) {
    throw new Error("No AI provider is configured. Check the keys in backend/.env");
  }
  return models;
}