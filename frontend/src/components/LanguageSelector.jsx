import { Languages } from "lucide-react";

const OPTIONS = [
  { value: "English", title: "English Speaking", sub: "Questions and answers in English" },
  { value: "Marathi", title: "Marathi Speaking", sub: "मराठीत प्रश्न आणि उत्तरे" },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={
            "flex items-center gap-4 border px-6 py-5 text-left transition-all duration-300 " +
            (value === o.value
              ? "border-emerald-700 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "border-slate-200 bg-white text-slate-800 shadow-md shadow-slate-900/5 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-600/15")
          }
        >
          <Languages size={24} />
          <span>
            <span className="block text-base font-bold">{o.title}</span>
            <span className={"block text-sm " + (value === o.value ? "text-emerald-50" : "text-slate-500")}>
              {o.sub}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}