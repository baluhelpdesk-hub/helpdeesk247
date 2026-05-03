import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exercisesApi, Exercise } from "../api/client";

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    exercisesApi.list().then(setExercises);
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await exercisesApi.delete(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Exercises ({exercises.length})</h2>
        <button onClick={() => navigate("/exercises/new")} style={BTN}>+ New Exercise</button>
      </div>
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={INPUT}
      />
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        <thead>
          <tr style={{ background: "#f0f0ff" }}>
            <TH>Name</TH>
            <TH>Muscles</TH>
            <TH>Difficulty</TH>
            <TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id} style={{ borderTop: "1px solid #eee" }}>
              <TD>{e.name}</TD>
              <TD>{e.primaryMuscles.join(", ")}</TD>
              <TD>{e.difficulty}</TD>
              <TD>
                <button onClick={() => navigate(`/exercises/${e.id}`)} style={BTN_SM}>Edit</button>
                {" "}
                <button onClick={() => handleDelete(e.id, e.name)} style={{ ...BTN_SM, background: "#EF4444" }}>Del</button>
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
const INPUT: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 16 };

function TH({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#555" }}>{children}</th>;
}

function TD({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 16px", fontSize: 14 }}>{children}</td>;
}
