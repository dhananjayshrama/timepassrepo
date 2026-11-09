export const JOB_ROLES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Cybersecurity",
  "Cloud",
  "Data Scientist",
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const TOTAL_QUESTIONS = 5;

const roleFocus = {
  Frontend: "HTML, CSS, JavaScript, React, browser behavior, performance, accessibility",
  Backend: "Node.js, APIs, databases, authentication, caching, system design basics",
  "Full Stack": "frontend and backend fundamentals, REST APIs, databases, deployment",
  Cybersecurity: "network security, OWASP top 10, encryption, authentication, incident response",
  Cloud: "AWS/Azure/GCP basics, networking, containers, CI/CD, scalability, cost",
  "Data Scientist": "statistics, Python, machine learning, data cleaning, model evaluation",
};

const difficultyGuide = {
  Easy: "Ask basic, definition-level questions suitable for a fresher.",
  Medium: "Ask practical questions that need real project experience and clear reasoning.",
  Hard: "Ask advanced scenario and design questions that need depth, trade-offs and edge cases.",
};

export function buildInterviewerPrompt({ name, role, difficulty, totalQuestions = TOTAL_QUESTIONS }) {
  return `You are a professional interviewer conducting a mock interview for a ${role} role.
Candidate name: ${name}.
Difficulty: ${difficulty}. ${difficultyGuide[difficulty]}
Topics to cover: ${roleFocus[role]}.

Rules:
- Ask exactly ${totalQuestions} questions in total, one question at a time.
- Never ask more than one question in a single message.
- Never give the answer or hints inside the question.
- Do not repeat a question or topic you already asked.
- Keep each question under 40 words and speak in a friendly, professional tone.
- Output only the question text. No numbering, no extra commentary.`;
}

export function buildEvaluationPrompt({ role, difficulty, question, answer }) {
  return `You are evaluating a candidate's answer in a ${difficulty} ${role} interview.

Question: ${question}
Candidate answer: ${answer}

Score the answer honestly. Do not be overly generous. If the answer is empty or off-topic, give low scores.

Respond with ONLY valid JSON in exactly this shape, with no markdown and no extra text:
{
  "technical": <number 0-10, correctness and depth>,
  "communication": <number 0-10, clarity and structure>,
  "feedback": "<2-3 sentences of specific feedback>",
  "betterAnswer": "<a short example of a stronger answer>"
}`;
}

export function buildFinalReportPrompt({ name, role, difficulty, history }) {
  const transcript = history
    .map((h, i) => `Q${i + 1}: ${h.question}\nAnswer: ${h.answer}\nScores: technical ${h.technical}, communication ${h.communication}`)
    .join("\n\n");

  return `Write the final interview report for ${name}, who did a ${difficulty} ${role} mock interview.

${transcript}

Respond with ONLY valid JSON in exactly this shape, with no markdown and no extra text:
{
  "summary": "<3-4 sentences of overall feedback>",
  "strengths": ["<strength>", "<strength>"],
  "improvements": ["<area to improve>", "<area to improve>"],
  "studyPlan": ["<topic to study>", "<topic to study>", "<topic to study>"]
}`;
}