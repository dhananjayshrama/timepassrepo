export default function FieldSelector({ fields, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {fields.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={
            "flex items-center gap-2 border px-5 py-3 text-sm font-semibold transition-all duration-300 " +
            (value === id
              ? "border-emerald-700 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "border-slate-200 bg-white text-slate-700 shadow-md shadow-slate-900/5 hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-600/15")
          }
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
}