interface TopExercise {
  name: string;
  maxWeight: number;
}

interface WeeklySummaryInput {
  weekNumber: number;
  phase: string;
  plannedSessions: number;
  completedSessions: number;
  totalVolume: number;
  totalSets: number;
  topExercises: TopExercise[];
}

export function buildWeeklySummaryInsightsPrompt(data: WeeklySummaryInput): string {
  const adherencePercent = Math.round((data.completedSessions / Math.max(1, data.plannedSessions)) * 100);
  const topEx = data.topExercises
    .map((e) => `${e.name} (${e.maxWeight}kg)`)
    .join(", ");

  const phaseLabel = data.phase === "low_volume" ? "foundation" : data.phase === "deload" ? "recovery" : "growth";

  return `You are a personal fitness coach writing a brief weekly training review for your client.

Week ${data.weekNumber} — ${phaseLabel} phase
Completed: ${data.completedSessions} of ${data.plannedSessions} planned workouts (${adherencePercent}% adherence)
Total sets this week: ${data.totalSets}
Total volume: ${Math.round(data.totalVolume)}kg
Highlight exercises: ${topEx || "none recorded"}

Write a 2-4 sentence personalised weekly summary.
If adherence was 100%, celebrate it. If lower, be encouraging without being preachy.
Include one specific observation about their training and one forward-looking suggestion.
Do not use markdown, lists, or headers. Keep under 100 words.`;
}
