import { Home, Clock, Settings, Info } from "lucide-react";

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "history", label: "History", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "about", label: "About", icon: Info },
];

export default function Sidebar({ view, onChange }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/40 shadow-lg shadow-emerald-900/5 backdrop-blur-xl backdrop-saturate-150">
      <nav className="flex h-16 w-full items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 bg-emerald-600 shadow-md shadow-emerald-600/50" />
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-900">
            Max Interview
          </span>
        </div>
        <div className="flex items-center gap-2">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={
                "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 " +
                "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-emerald-600 after:transition-all after:duration-300 " +
                (view === id
                  ? "bg-emerald-600/10 text-emerald-700 after:w-full"
                  : "text-slate-700 after:w-0 hover:bg-white/60 hover:text-emerald-700 hover:after:w-full")
              }
            >
              <Icon size={18} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}