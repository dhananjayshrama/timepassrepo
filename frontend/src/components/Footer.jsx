import { Mail } from "lucide-react";

const AUTHOR = "Dhananjay Rajesh Sharma";
const EMAIL = "dhananjayrajeshsharma@mail"; // complete this address, e.g. @gmail.com

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white/70 backdrop-blur-md">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-slate-600 md:px-10">
        <p>
          Made by <span className="font-semibold text-emerald-800">{AUTHOR}</span>
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 hover:underline"
        >
          <Mail size={16} />
          {EMAIL}
        </a>
        <p className="text-slate-400">© {new Date().getFullYear()} Max Interview</p>
      </div>
    </footer>
  );
}