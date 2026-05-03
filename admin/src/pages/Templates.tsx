import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { templatesApi, ProgramTemplate } from "../api/client";

export default function Templates() {
  const [templates, setTemplates] = useState<ProgramTemplate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    templatesApi.list().then(setTemplates);
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await templatesApi.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Program Templates ({templates.length})</h2>
        <button onClick={() => navigate("/templates/new")} style={BTN}>+ New Template</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        <thead>
          <tr style={{ background: "#f0f0ff" }}>
            <TH>Name</TH>
            <TH>Goal</TH>
            <TH>Location</TH>
            <TH>Days/Week</TH>
            <TH>Experience</TH>
            <TH>Progression</TH>
            <TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
              <TD>{t.name}</TD>
              <TD>{t.goal}</TD>
              <TD>{t.location}</TD>
              <TD>{t.daysPerWeek}</TD>
              <TD>{t.experience.join(", ")}</TD>
              <TD>{t.progressionModel}</TD>
              <TD>
                <button onClick={() => navigate(`/templates/${t.id}`)} style={BTN_SM}>Edit</button>
                {" "}
                <button onClick={() => handleDelete(t.id, t.name)} style={{ ...BTN_SM, background: "#EF4444" }}>Del</button>
              </TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BTN: React.CSSProperties = { background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14 };
const BTN_SM: React.CSSProperties = { ...BTN, padding: "4px 10px", fontSize: 12 };

function TH({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#555" }}>{children}</th>;
}

function TD({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 16px", fontSize: 14 }}>{children}</td>;
}
