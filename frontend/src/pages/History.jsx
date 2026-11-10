import { useState } from "react";
import { getHistory, clearHistory } from "../utils/history.js";

function fmt(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toFixed(1) : "0.0";
}

export default function History() {
  const [list, setList] = useState(getHistory());

  function handleClear() {
    if (!window.confirm("Delete all your interview history?")) return;
    clearHistory();
    setList([]);
  }

  const last = list.length ? list[list.length - 1] : null;
  const recent = [...list].reverse();

  return (
    <div className="w-full border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10 md:p-12">
      <h1 className="mb-8 text-3xl font-bold text-emerald-900">Your History</h1>

      {!last ? (
        <p className="text-slate-500">
          No completed interviews yet. Finish an interview and it will appear here.
        </p>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="border border-emerald-200 bg-emerald-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Interviews completed
              </div>
              <div className="mt-2 text-5xl font-bold text-emerald-900">{list.length}</div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Last interview score
              </div>
              <div className="mt-2 text-5xl font-bold text-emerald-900">
                {fmt(last.overall)}<span className="text-2xl text-slate-500"> / 10</span>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {last.role} · {last.difficulty}
              </div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Last interview details
              </div>
              <div className="mt-3 text-slate-700">Technical: {fmt(last.technical)} / 10</div>
              <div className="text-slate-700">Communication: {fmt(last.communication)} / 10</div>
            </div>
          </div>

          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            All interviews
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-200 text-slate-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Level</th>
                  <th className="py-2 pr-4">Technical</th>
                  <th className="py-2 pr-4">Communication</th>
                  <th className="py-2">Overall</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((h, i) => (
                  <tr key={h.date + i} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{new Date(h.date).toLocaleString()}</td>
                    <td className="py-2 pr-4">{h.role}</td>
                    <td className="py-2 pr-4">{h.difficulty}</td>
                    <td className="py-2 pr-4">{fmt(h.technical)}</td>
                    <td className="py-2 pr-4">{fmt(h.communication)}</td>
                    <td className="py-2 font-semibold">{fmt(h.overall)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleClear}
            className="mt-8 text-sm text-red-700 underline hover:text-red-900"
          >
            Clear history
          </button>
        </>
      )}
    </div>
  );
}