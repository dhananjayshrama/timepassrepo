import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { saveName } from "../utils/storage.js";
import { FIELDS, ROLES } from "../data/roles.js";
import JobRoleCard from "../components/JobRoleCard.jsx";
import FieldSelector from "../components/FieldSelector.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";

const saveButton =
  "bg-emerald-700 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white " +
  "shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:bg-emerald-800";

const heading = "mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-700";

export default function Home({ name, onNameSaved, onStart }) {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [field, setField] = useState("technical");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  function handleSave(e) {
    e.preventDefault();
    if (!input.trim()) return;
    saveName(input);
    onNameSaved(input.trim());
    setInput("");
    setEditing(false);
  }

  function handleFieldChange(id) {
    setField(id);
    setRole("");
  }

  if (!name || editing) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="w-full max-w-xl border border-emerald-200 bg-white p-10 shadow-xl shadow-emerald-900/10">
          <h1 className="mb-2 text-3xl font-bold text-emerald-900">Max Interview</h1>
          <p className="mb-6 text-slate-600">What should we call you?</p>
          <form onSubmit={handleSave} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="flex-1 border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600/30"
            />
            <button type="submit" className={saveButton}>Save</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10 md:p-12 lg:p-16">
      <h1 className="text-4xl font-bold text-emerald-900 md:text-5xl">Hi {name}!</h1>
      <p className="mt-3 text-xl font-semibold text-slate-800 md:text-2xl">
        Your dream job starts with this one practice.
      </p>
      <p className="mb-10 mt-2 max-w-3xl text-slate-500">
        Every great career begins with a great interview. Pick your field, choose
        your role and challenge, and walk into the real thing with confidence. You've got this.
      </p>

      <h2 className={heading}>Choose Your Field</h2>
      <div className="mb-10">
        <FieldSelector fields={FIELDS} value={field} onChange={handleFieldChange} />
      </div>

      <h2 className={heading}>Choose Your Job Role</h2>
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {ROLES[field].map((r) => (
          <JobRoleCard
            key={r.label}
            label={r.label}
            icon={r.icon}
            description={r.description}
            tags={r.tags}
            selected={role === r.label}
            onClick={() => setRole(r.label)}
          />
        ))}
      </div>

      <h2 className={heading}>Choose Your Challenge</h2>
      <div className="mb-12 max-w-3xl">
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-8">
        <div className="flex flex-wrap items-center gap-6">
          <button
            disabled={!role}
            onClick={() => onStart({ field, role, difficulty })}
            className="group flex items-stretch bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-700/40 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <span className="px-8 py-4 text-sm font-semibold uppercase tracking-widest">
              Start Interview
            </span>
            <span className="flex items-center bg-black/20 px-5">
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </button>
          <span className="text-sm text-slate-500">
            {role ? `${role} · ${difficulty}` : "Select a role to begin"}
          </span>
        </div>
        <a
          href="#"
          className="text-sm text-emerald-700 underline hover:text-emerald-900"
          onClick={(e) => { e.preventDefault(); setEditing(true); }}
        >
          change name
        </a>
      </div>
    </div>
  );
}