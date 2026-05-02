import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exercisesApi, Exercise } from "../api/client";

const EMPTY: Partial<Exercise> = {
  name: "", primaryMuscles: [], secondaryMuscles: [], equipment: [],
  difficulty: "beginner", videoUrl: "", instructions: [], commonMistakes: [],
};

export default function ExerciseForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Exercise>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) exercisesApi.get(id).then(setForm);
  }, [id]);

  function field(key: keyof Exercise) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function arrayField(key: keyof Exercise) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (id) {
        await exercisesApi.update(id, form);
      } else {
        await exercisesApi.create(form);
      }
      navigate("/exercises");
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{id ? "Edit" : "New"} Exercise</h2>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 28, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
        <Field label="Name" required>
          <input style={INPUT} value={form.name ?? ""} onChange={field("name")} required />
        </Field>
        <Field label="Difficulty">
          <select style={INPUT} value={form.difficulty ?? "beginner"} onChange={field("difficulty")}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Primary Muscles (comma-separated)">
          <input style={INPUT} value={(form.primaryMuscles ?? []).join(", ")} onChange={arrayField("primaryMuscles")} />
        </Field>
        <Field label="Secondary Muscles (comma-separated)">
          <input style={INPUT} value={(form.secondaryMuscles ?? []).join(", ")} onChange={arrayField("secondaryMuscles")} />
        </Field>
        <Field label="Equipment (comma-separated)">
          <input style={INPUT} value={(form.equipment ?? []).join(", ")} onChange={arrayField("equipment")} />
        </Field>
        <Field label="Video URL">
          <input style={INPUT} value={form.videoUrl ?? ""} onChange={field("videoUrl")} type="url" />
        </Field>
        <Field label="Instructions (one per line)">
          <textarea
            style={{ ...INPUT, minHeight: 100 }}
            value={(form.instructions ?? []).join("\n")}
            onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value.split("\n").filter(Boolean) }))}
          />
        </Field>
        <Field label="Common Mistakes (one per line)">
          <textarea
            style={{ ...INPUT, minHeight: 80 }}
            value={(form.commonMistakes ?? []).join("\n")}
            onChange={(e) => setForm((prev) => ({ ...prev, commonMistakes: e.target.value.split("\n").filter(Boolean) }))}
          />
        </Field>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={loading} style={BTN}>{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate("/exercises")} style={{ ...BTN, background: "#888" }}>Cancel</button>
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
