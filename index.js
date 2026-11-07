import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = 5001;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1beta" },
});

app.post("/ai", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "input is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: input }] }],
      config: {
        systemInstruction: "You are an assistant and your name is Jarvis.",
      },
    });

    return res.status(200).json({ ai: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  return res.send({ message: "Hello from level3" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});