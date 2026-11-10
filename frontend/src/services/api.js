const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const BASE = `${API_URL}/api/interview`;

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // response had no JSON body
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

export function startInterview({ name, role, difficulty }) {
  return request("/start", {
    method: "POST",
    body: JSON.stringify({ name, role, difficulty }),
  });
}

export function submitAnswer({ sessionId, answer }) {
  return request("/answer", {
    method: "POST",
    body: JSON.stringify({ sessionId, answer }),
  });
}

export function getResult(sessionId) {
  return request(`/result/${sessionId}`);
}