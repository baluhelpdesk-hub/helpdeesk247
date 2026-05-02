import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { templatesApi, ProgramTemplate } from "../api/client";

const EMPTY: Partial<ProgramTemplate> = {
  name: "", description: "", goal: "general_fitness", experience: ["beginner"],
  location: "gym", daysPerWeek: 3, progressionModel: "linear",
};

const GOALS = ["muscle_gain", "fat_loss", "strength", "general_fitness", "endurance"];
const LOCATIONS = ["gym", "home", "both"];
const PROGRESSIONS = ["linear", "undulating", "block"];
const EXPERIENCES = ["beginner", "some_experience", "regular"];

export default function TemplateForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<ProgramTemplate>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) templatesApi.get(id).then(setForm);
  }, [id]);

  function field(key: keyof ProgramTemplate) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function toggleExperience(exp: string) {
    setForm((prev) => {
      const current = prev.experience ?? [];
      const next = current.includes(exp) ? current.filter((e) => e !== exp) : [...current, exp];
      return { ...prev, experience: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, daysPerWeek: Number(form.daysPerWeek) };
      if (id) {
        await templatesApi.update(id, payload);
      } else {
        await templatesApi.create(payload);
      }
      navigate("/templates");
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{id ? "Edit" : "New"} Template</h2>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 28, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
        <Field label="Name" required>
          <input style={INPUT} value={form.name ?? ""} onChange={field("name")} required />
        </Field>
        <Field label="Description">
          <textarea style={{ ...INPUT, minHeight: 72 }} value={form.description ?? ""} onChange={field("description")} />
        </Field>
        <Field label="Goal">
          <select style={INPUT} value={form.goal ?? "general_fitness"} onChange={field("goal")}>
            {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <select style={INPUT} value={form.location ?? "gym"} onChange={field("location")}>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Days per Week">
          <input style={INPUT} type="number" min={2} max={7} value={form.daysPerWeek ?? 3} onChange={field("daysPerWeek")} />
        </Field>
        <Field label="Progression Model">
          <select style={INPUT} value={form.progressionModel ?? "linear"} onChange={field("progressionModel")}>
            {PROGRESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Experience Levels">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {EXPERIENCES.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => toggleExperience(exp)}
                style={{
                  padding: "6px 14px", borderRadius: 6, border: "1.5px solid #4F46E5", cursor: "pointer", fontSize: 13,
                  background: (form.experience ?? []).includes(exp) ? "#4F46E5" : "#fff",
                  color: (form.experience ?? []).includes(exp) ? "#fff" : "#4F46E5",
                  fontWeight: 500,
                }}
              >
                {exp}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="submit" disabled={loading} style={BTN}>{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate("/templates")} style={{ ...BTN, background: "#888" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 500, fontSize: 13, color: "#444", marginBottom: 6 }}>
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}

const BTN: React.CSSProperties = { background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14 };
const INPUT: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 };
