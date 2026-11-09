import { z } from "zod";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModels } from "../config/models.js";
import {
  buildInterviewerPrompt,
  buildEvaluationPrompt,
  buildFinalReportPrompt,
} from "../prompts/interviewPrompts.js";

// Shapes the AI must return (structured output)
const evaluationSchema = z.object({
  technical: z.number().describe("Technical correctness and depth, from 0 to 10"),
  communication: z.number().describe("Clarity and structure, from 0 to 10"),
  feedback: z.string().describe("2-3 sentences of specific feedback"),
  betterAnswer: z.string().describe("A short example of a stronger answer"),
});

const reportSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  studyPlan: z.array(z.string()),
});

// Tries each provider in order. If one fails (quota, error), the next one is used.
async function runWithFallback(task, messages, schema) {
  let lastError;

  for (const { name, model } of getModels(task)) {
    try {
      const runnable = schema ? model.withStructuredOutput(schema) : model;
      const result = await runnable.invoke(messages);
      console.log(`[AI] ${task} answered by ${name}`);
      return result;
    } catch (err) {
      console.error(`[AI] ${name} failed:`, err.message);
      lastError = err;
    }
  }
  throw lastError;
}

function textOf(response) {
  const c = response.content;
  return (typeof c === "string" ? c : c.map((p) => p.text || "").join("")).trim();
}

// history = [{ question, answer }, ...] of the answered questions so far.
// This is the interview "memory": the model sees every earlier question and answer.
export async function generateQuestion({ name, role, difficulty, history = [], questionNumber, totalQuestions }) {
  const messages = [
    new SystemMessage(buildInterviewerPrompt({ name, role, difficulty, totalQuestions })),
    new HumanMessage(`Start the interview. Ask question 1 of ${totalQuestions}.`),
  ];

  history.forEach((h, i) => {
    messages.push(new AIMessage(h.question));
    const isLast = i === history.length - 1;
    const extra = isLast
      ? `\n\n(Now ask question ${questionNumber} of ${totalQuestions}. Choose a new topic.)`
      : "";
    messages.push(new HumanMessage(`${h.answer}${extra}`));
  });

  const response = await runWithFallback("question", messages);
  return textOf(response);
}

export function scoreAnswer({ role, difficulty, question, answer }) {
  return runWithFallback(
    "evaluation",
    [
      new SystemMessage("You are a strict but fair technical interviewer."),
      new HumanMessage(buildEvaluationPrompt({ role, difficulty, question, answer })),
    ],
    evaluationSchema
  );
}

export function writeReport({ name, role, difficulty, history }) {
  return runWithFallback(
    "evaluation",
    [
      new SystemMessage("You are an interview coach."),
      new HumanMessage(buildFinalReportPrompt({ name, role, difficulty, history })),
    ],
    reportSchema
  );
}