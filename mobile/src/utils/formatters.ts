export function formatWeight(kg: number | null | undefined, units: "kg" | "lb" = "kg"): string {
  if (kg === null || kg === undefined) return "--";
  if (units === "lb") return `${Math.round(kg * 2.2046 * 4) / 4} lb`;
  return `${kg} kg`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
