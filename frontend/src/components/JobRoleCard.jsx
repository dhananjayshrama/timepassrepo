import { Check } from "lucide-react";

export default function JobRoleCard({
  label,
  icon: Icon,
  description,
  tags = [],
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={
        "group flex h-full flex-col border p-6 text-left transition-all duration-300 " +
        (selected
          ? "border-emerald-700 bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-xl shadow-emerald-700/30"
          : "border-slate-200 bg-white text-slate-800 shadow-md shadow-slate-900/5 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-600/15")
      }
    >
      <div className="mb-5 flex items-start justify-between">
        <span
          className={
            "flex h-12 w-12 items-center justify-center " +
            (selected
              ? "bg-white/20 text-white"
              : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100")
          }
        >
          <Icon size={24} />
        </span>
        <span
          className={
            "flex h-6 w-6 items-center justify-center border " +
            (selected
              ? "border-white bg-white text-emerald-700"
              : "border-slate-300 text-transparent")
          }
        >
          <Check size={14} strokeWidth={3} />
        </span>
      </div>

      <h3 className="text-lg font-bold">{label}</h3>
      <p
        className={
          "mt-2 flex-1 text-sm leading-relaxed " +
          (selected ? "text-emerald-50" : "text-slate-500")
        }
      >
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={
              "px-2.5 py-1 text-xs font-medium " +
              (selected
                ? "bg-white/20 text-white"
                : "bg-emerald-50 text-emerald-700")
            }
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}