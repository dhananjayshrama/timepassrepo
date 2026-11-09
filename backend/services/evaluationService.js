import { scoreAnswer, writeReport } from "./langchainService.js";

const clamp = (n) => Math.min(10, Math.max(0, Number(n) || 0));
const round1 = (n) => Math.round(n * 10) / 10;

// Scores ONE answer
export async function evaluateAnswer({ role, difficulty, question, answer }) {
  // Empty answer: no need to call the AI
  if (!answer || answer.trim().length < 3) {
    return {
      technical: 0,
      communication: 0,
      feedback: "No answer was given for this question.",
      betterAnswer: "",
    };
  }

  const result = await scoreAnswer({ role, difficulty, question, answer });

  return {
    technical: clamp(result.technical),
    communication: clamp(result.communication),
    feedback: result.feedback || "",
    betterAnswer: result.betterAnswer || "",
  };
}

// Final scores come from maths, not from the AI
export function calculateScores(history) {
  if (!history.length) {
    return { technical: 0, communication: 0, overall: 0 };
  }

  const avg = (key) => history.reduce((sum, h) => sum + h[key], 0) / history.length;

  const technical = avg("technical");
  const communication = avg("communication");
  const overall = technical * 0.6 + communication * 0.4;

  return {
    technical: round1(technical),
    communication: round1(communication),
    overall: round1(overall),
  };
}

// Final report: scores from maths + written feedback from the AI
export async function createFinalReport({ name, role, difficulty, history }) {
  const scores = calculateScores(history);

  const written = await writeReport({ name, role, difficulty, history });

  return {
    name,
    role,
    difficulty,
    scores,
    summary: written.summary || "",
    strengths: written.strengths || [],
    improvements: written.improvements || [],
    studyPlan: written.studyPlan || [],
    history,
  };
}