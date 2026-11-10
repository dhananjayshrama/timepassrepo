const KEY = "interviewHistory";

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveInterview(result) {
  try {
    const list = getHistory();
    list.push({
      date: new Date().toISOString(),
      role: result.role,
      difficulty: result.difficulty,
      overall: result.scores?.overall ?? 0,
      technical: result.scores?.technical ?? 0,
      communication: result.scores?.communication ?? 0,
    });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: ignore
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}