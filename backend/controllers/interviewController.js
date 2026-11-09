import { randomUUID } from "crypto";
import { JOB_ROLES, DIFFICULTIES, TOTAL_QUESTIONS } from "../prompts/interviewPrompts.js";
import { generateQuestion } from "../services/langchainService.js";
import { evaluateAnswer, createFinalReport } from "../services/evaluationService.js";

// Interview sessions live in server memory (no database, no login)
const sessions = new Map();
const SESSION_LIFETIME = 2 * 60 * 60 * 1000; // 2 hours

function removeOldSessions() {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.updatedAt > SESSION_LIFETIME) sessions.delete(id);
  }
}

// POST /api/interview/start   body: { name, role, difficulty }
export async function startInterview(req, res) {
  try {
    const { name, role, difficulty } = req.body ?? {};
    const cleanName = String(name || "").trim().slice(0, 50);

    if (!cleanName) {
      return res.status(400).json({ error: "name is required" });
    }
    if (!JOB_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid role", allowed: JOB_ROLES });
    }
    if (!DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty", allowed: DIFFICULTIES });
    }

    removeOldSessions();

    const question = await generateQuestion({
      name: cleanName,
      role,
      difficulty,
      history: [],
      questionNumber: 1,
      totalQuestions: TOTAL_QUESTIONS,
    });

    const sessionId = randomUUID();
    sessions.set(sessionId, {
      name: cleanName,
      role,
      difficulty,
      currentQuestion: question,
      history: [], // answered questions with their scores
      finished: false,
      busy: false,
      report: null,
      updatedAt: Date.now(),
    });

    return res.status(201).json({
      sessionId,
      question,
      questionNumber: 1,
      totalQuestions: TOTAL_QUESTIONS,
    });
  } catch (err) {
    console.error("startInterview error:", err.message);
    return res.status(500).json({ error: "Could not start the interview. Please try again." });
  }
}

// POST /api/interview/answer   body: { sessionId, answer }
export async function submitAnswer(req, res) {
  const { sessionId, answer } = req.body ?? {};
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Interview not found. Please start a new one." });
  }
  if (session.finished) {
    return res.status(400).json({ error: "This interview is already finished." });
  }
  if (typeof answer !== "string") {
    return res.status(400).json({ error: "answer must be text" });
  }
  if (session.busy) {
    return res.status(429).json({ error: "Your last answer is still being checked." });
  }

  session.busy = true;
  try {
    const cleanAnswer = answer.trim().slice(0, 3000);
    const questionNumber = session.history.length + 1; // question being answered now
    const isLast = questionNumber >= TOTAL_QUESTIONS;

    const answeredSoFar = [
      ...session.history.map((h) => ({ question: h.question, answer: h.answer })),
      { question: session.currentQuestion, answer: cleanAnswer },
    ];

    // Score this answer and write the next question at the same time (faster)
    const [evaluation, nextQuestion] = await Promise.all([
      evaluateAnswer({
        role: session.role,
        difficulty: session.difficulty,
        question: session.currentQuestion,
        answer: cleanAnswer,
      }),
      isLast
        ? Promise.resolve(null)
        : generateQuestion({
            name: session.name,
            role: session.role,
            difficulty: session.difficulty,
            history: answeredSoFar,
            questionNumber: questionNumber + 1,
            totalQuestions: TOTAL_QUESTIONS,
          }),
    ]);

    session.history.push({
      question: session.currentQuestion,
      answer: cleanAnswer,
      ...evaluation,
    });
    session.currentQuestion = nextQuestion;
    session.finished = isLast;
    session.updatedAt = Date.now();

    return res.json({
      evaluation,
      finished: isLast,
      nextQuestion,
      questionNumber: isLast ? questionNumber : questionNumber + 1,
      totalQuestions: TOTAL_QUESTIONS,
    });
  } catch (err) {
    console.error("submitAnswer error:", err.message);
    return res.status(500).json({ error: "Could not check your answer. Please try again." });
  } finally {
    session.busy = false;
  }
}

// GET /api/interview/result/:sessionId
export async function getResult(req, res) {
  const session = sessions.get(req.params.sessionId);

  if (!session) {
    return res.status(404).json({ error: "Interview not found." });
  }
  if (!session.finished) {
    return res.status(400).json({ error: "The interview is not finished yet." });
  }

  try {
    // The report is created once and then reused
    if (!session.report) {
      session.report = await createFinalReport({
        name: session.name,
        role: session.role,
        difficulty: session.difficulty,
        history: session.history,
      });
    }
    return res.json(session.report);
  } catch (err) {
    console.error("getResult error:", err.message);
    return res.status(500).json({ error: "Could not create the report. Please try again." });
  }
}