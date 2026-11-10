import { useEffect, useRef, useState } from "react";
import { startInterview, submitAnswer, getResult } from "../services/api";
import { speak, stopSpeaking } from "../services/speechSynthesis";
import { startListening, stopListening, isSpeechSupported } from "../services/speechRecognition";
import CameraMonitor from "../components/CameraMonitor";
import "../styles/interview.css";

// After this many warnings the message gets stronger, but the interview stays open
const STRONG_WARNING_AT = 5;

export default function Interview({ name, role, difficulty, onFinished, onExit }) {
  const [cameraOk, setCameraOk] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [qNum, setQNum] = useState(1);
  const [total, setTotal] = useState(5);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const [warnings, setWarnings] = useState(0);
  const [warningMsg, setWarningMsg] = useState("");

  const startedRef = useRef(false);
  const warningsRef = useRef(0);
  const lastWarnRef = useRef(0);
  const baseTextRef = useRef("");

  // ---------- warnings (never ends the interview) ----------
  function addWarning(message) {
    const now = Date.now();
    if (now - lastWarnRef.current < 1500) return; // blur + hidden fire together
    lastWarnRef.current = now;

    warningsRef.current += 1;
    setWarnings(warningsRef.current);
    setWarningMsg(message);
  }

  // hide the banner after 5 seconds
  useEffect(() => {
    if (!warningMsg) return;
    const t = setTimeout(() => setWarningMsg(""), 5000);
    return () => clearTimeout(t);
  }, [warningMsg]);

  // ---------- close button ----------
  function closeInterview() {
    const ok = window.confirm("Close the interview? Your progress will be lost.");
    if (!ok) return;
    stopSpeaking();
    stopListening();
    setListening(false);
    onExit(); // leaving this page also turns the camera off
  }

  // ---------- tab switching ----------
  useEffect(() => {
    if (!sessionId) return;

    const onVisibility = () => {
      if (document.hidden) addWarning("Tab switching is not allowed during the interview.");
    };
    const onBlur = () => addWarning("You left the interview window. This is not allowed.");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [sessionId]);

  // ---------- start the interview after the camera is on ----------
  useEffect(() => {
    if (!cameraOk || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        setLoading(true);
        const data = await startInterview({ name, role, difficulty });
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setQNum(data.questionNumber);
        setTotal(data.totalQuestions);
        speak(data.question);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [cameraOk]);

  // stop voice when leaving the page
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // ---------- voice answer ----------
  function toggleMic() {
    if (listening) {
      stopListening();
      setListening(false);
      return;
    }
    stopSpeaking(); // so the mic does not hear the bot
    baseTextRef.current = answer ? answer.trim() + " " : "";
    setError("");
    setListening(true);
    startListening({
      onText: (text) => setAnswer(baseTextRef.current + text),
      onEnd: () => setListening(false),
      onError: (code) => {
        setListening(false);
        setError(
          code === "not-allowed"
            ? "Microphone access is blocked. Allow it in the browser."
            : "Voice problem: " + code
        );
      },
    });
  }

  // ---------- send answer ----------
  async function sendAnswer() {
    if (loading) return;
    stopListening();
    setListening(false);
    stopSpeaking();
    setLoading(true);
    setError("");

    try {
      const data = await submitAnswer({ sessionId, answer });
      setFeedback(data.evaluation);
      setAnswer("");

      if (data.finished) {
        const finalResult = await getResult(sessionId);
        onFinished(finalResult);
        return;
      }
      setQuestion(data.nextQuestion);
      setQNum(data.questionNumber);
      speak(data.nextQuestion);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const tooMany = warnings >= STRONG_WARNING_AT;

  return (
    <div className="iv-page">
      {warningMsg && (
        <div className="warning-banner">
          ⚠ Warning {warnings}: {warningMsg}
          {tooMany && " You have too many warnings. Please stay focused on the interview."}
        </div>
      )}

      <CameraMonitor
        onReady={() => setCameraOk(true)}
        onError={(msg) => setCameraError(msg)}
        onWarning={(msg) => addWarning(msg)}
      />

      <div className="iv-top">
        <span>
          {role} · {difficulty} · Question {qNum} of {total}
        </span>
        <span className="iv-top-right">
          <span className={"iv-warn-count" + (tooMany ? " high" : "")}>
            Warnings: {warnings}
          </span>
          <button className="iv-close" onClick={closeInterview}>
            ✕ Close Interview
          </button>
        </span>
      </div>

      {cameraError && <div className="iv-card iv-error">{cameraError}</div>}
      {!cameraError && !cameraOk && (
        <div className="iv-card">Please allow camera access to begin the interview.</div>
      )}

      {cameraOk && (
        <>
          <div className="iv-card">
            <div className="iv-label">Interviewer</div>
            <p className="iv-question">{loading && !question ? "Preparing your question..." : question}</p>
            {question && (
              <button className="iv-link" onClick={() => speak(question)}>🔊 Repeat question</button>
            )}
          </div>

          {feedback && (
            <div className="iv-card">
              <div className="iv-label">Feedback on your last answer</div>
              <p>Technical: {feedback.technical}/10 · Communication: {feedback.communication}/10</p>
              <p>{feedback.feedback}</p>
              {feedback.betterAnswer && <p><b>Better answer:</b> {feedback.betterAnswer}</p>}
            </div>
          )}

          <div className="iv-card">
            <textarea
              className="iv-input"
              rows={5}
              placeholder="Type your answer or press the mic and speak..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading || !question}
            />
            {error && <p className="iv-error-text">{error}</p>}
            <div className="iv-actions">
              {isSpeechSupported ? (
                <button
                  className={"iv-btn iv-mic" + (listening ? " on" : "")}
                  onClick={toggleMic}
                  disabled={loading || !question}
                >
                  {listening ? "⏹ Stop mic" : "🎤 Speak"}
                </button>
              ) : (
                <span className="iv-note">Voice needs Chrome or Edge</span>
              )}
              <button className="iv-btn" onClick={sendAnswer} disabled={loading || !question}>
                {loading ? "Checking..." : qNum >= total ? "Finish" : "Send answer"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}