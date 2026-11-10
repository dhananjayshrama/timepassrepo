import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Interview from "./pages/Interview.jsx";
import History from "./pages/History.jsx";
import { getName } from "./utils/storage.js";
import { saveInterview } from "./utils/history.js";

export default function App() {
  const [name, setName] = useState(getName());
  const [view, setView] = useState("home");
  const [selection, setSelection] = useState(null);
  const [result, setResult] = useState(null);
  const [interviewId, setInterviewId] = useState(0);

  function handleStart(sel) {
    setSelection(sel);
    setInterviewId((n) => n + 1);
    setView("interview");
  }

  function handleFinished(r) {
    saveInterview(r); // saved in this browser for the History page
    setResult(r);
    setView("result");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-emerald-50 via-white to-green-100 text-slate-900">
      {name && <Sidebar view={view} onChange={setView} />}
      <main className="w-full flex-1 px-3 py-3 md:px-5 md:py-5">
        {view === "home" && (
          <Home name={name} onNameSaved={setName} onStart={handleStart} />
        )}
        {view === "interview" && selection && (
          <Interview
            key={interviewId}
            name={name}
            role={selection.role}
            difficulty={selection.difficulty}
            onFinished={handleFinished}
            onExit={() => setView("home")}
          />
        )}
        {view === "result" && result && (
          <pre className="whitespace-pre-wrap border border-emerald-200 bg-white p-6 text-sm shadow-lg">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
        {view === "history" && <History />}
        {view === "settings" && <p>Settings page comes later.</p>}
        {view === "about" && <p>About page comes later.</p>}
      </main>
      <Footer />
    </div>
  );
}