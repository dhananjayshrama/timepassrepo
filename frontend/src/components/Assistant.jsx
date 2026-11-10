import { Bot } from "lucide-react";

export default function Assistant({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
        <Bot size={22} />
      </div>
      <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-slate-800">
        {text}
      </div>
    </div>
  );
}