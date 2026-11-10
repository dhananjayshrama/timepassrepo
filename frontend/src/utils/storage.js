const KEY = "smart_interview_name";

export function getName() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function saveName(name) {
  try {
    localStorage.setItem(KEY, name.trim());
  } catch {
    // storage blocked, ignore
  }
}