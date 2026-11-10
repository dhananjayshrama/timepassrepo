import { useState } from "react";
import { Send } from "lucide-react";

export default function TextInput({ onSubmit, disabled }) {
  const [text, setText] = useState("");

  function send() {
    if (disabled) return;
    onSubmit(text.trim());
    setText("");
  }

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer here..."
        rows={5}
        maxLength={3000}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-300 bg-white p-3 pr-14 disabled:opacity-50"
      />
      <button
        onClick={send}
        disabled={disabled}
        className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-40"
      >
        <Send size={18} />
      </button>
    </div>
  );
}