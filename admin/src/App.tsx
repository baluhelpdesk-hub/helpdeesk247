// @ts-nocheck
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAdminSecret, setAdminSecret } from "./api/client";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import ExerciseForm from "./pages/ExerciseForm";
import Templates from "./pages/Templates";
import TemplateForm from "./pages/TemplateForm";

const NAV_LINK_STYLE = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  padding: "10px 16px",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: 500,
  color: isActive ? "#fff" : "#ccc",
  background: isActive ? "#4F46E5" : "transparent",
  marginBottom: 4,
});

export default function App() {
  const [secret, setSecret] = useState(getAdminSecret());
  const [draft, setDraft] = useState(secret);

  useEffect(() => {
    if (secret) setAdminSecret(secret);
  }, [secret]);

  if (!secret) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,.1)", width: 360 }}>
          <h2 style={{ marginBottom: 16 }}>Admin Login</h2>
          <input
            type="password"
            placeholder="Admin secret"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSecret(draft)}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 15, marginBottom: 12 }}
          />
          <button
            onClick={() => setSecret(draft)}
            style={{ width: "100%", padding: "10px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer", fontWeight: 600 }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#1E1B4B", padding: 24, flexShrink: 0 }}>
        <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 32, letterSpacing: 0.5 }}>
          Fitness Admin
        </h1>
        <nav>
          <NavLink to="/" end style={NAV_LINK_STYLE}>Dashboard</NavLink>
          <NavLink to="/exercises" style={NAV_LINK_STYLE}>Exercises</NavLink>
          <NavLink to="/templates" style={NAV_LINK_STYLE}>Templates</NavLink>
        </nav>
        <button
          onClick={() => { localStorage.removeItem("adminSecret"); setSecret(""); }}
          style={{ position: "absolute", bottom: 24, left: 24, background: "transparent", border: "1px solid #555", color: "#aaa", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}
        >
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/new" element={<ExerciseForm />} />
          <Route path="/exercises/:id" element={<ExerciseForm />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/new" element={<TemplateForm />} />
          <Route path="/templates/:id" element={<TemplateForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
