import { useEffect, useState } from "react";
import { dashboardApi } from "../api/client";

interface Stats {
  userCount: number;
  exerciseCount: number;
  templateCount: number;
  sessionCount: number;
}

const CARD_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 1px 4px rgba(0,0,0,.08)",
  textAlign: "center",
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardApi.get().then(setStats).catch(() => setError("Failed to load stats — check admin secret"));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Loading...</p>;

  const items = [
    { label: "Users", value: stats.userCount, color: "#4F46E5" },
    { label: "Exercises", value: stats.exerciseCount, color: "#059669" },
    { label: "Templates", value: stats.templateCount, color: "#D97706" },
    { label: "Sessions", value: stats.sessionCount, color: "#DB2777" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {items.map((item) => (
          <div key={item.label} style={CARD_STYLE}>
            <div style={{ fontSize: 40, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ color: "#666", marginTop: 6, fontWeight: 500 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
