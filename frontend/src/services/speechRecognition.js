const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export const isSpeechSupported = Boolean(SR);

let recognition = null;

export function startListening({ onText, onEnd, onError }) {
  if (!SR) {
    if (onError) onError("not-supported");
    return;
  }
  stopListening();

  recognition = new SR();
  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalText = "";

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += piece + " ";
      else interim += piece;
    }
    onText(finalText + interim);
  };
  recognition.onerror = (e) => onError && onError(e.error);
  recognition.onend = () => onEnd && onEnd();

  recognition.start();
}

export function stopListening() {
  if (recognition) {
    recognition.onend = null;
    recognition.stop();
    recognition = null;
  }
}