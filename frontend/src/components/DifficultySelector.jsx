const LEVELS = ["Easy", "Medium", "Hard"];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={
            "border px-4 py-4 text-sm font-semibold uppercase tracking-wide transition-all duration-300 " +
            (value === level
              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "border-slate-200 bg-white text-slate-800 shadow-md shadow-slate-900/5 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-600/15")
          }
        >
          {level}
        </button>
      ))}
    </div>
  );
}