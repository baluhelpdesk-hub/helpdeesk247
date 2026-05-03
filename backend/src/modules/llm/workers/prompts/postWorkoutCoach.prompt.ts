interface ExerciseSummary {
  name: string;
  sets: number;
  maxWeight: number;
}

interface PostWorkoutCoachInput {
  workoutLabel: string;
  completedSets: number;
  totalVolume: number;
  overallRpe: number | null;
  exerciseSummary: ExerciseSummary[];
}

export function buildPostWorkoutCoachPrompt(data: PostWorkoutCoachInput): string {
  const exerciseList = data.exerciseSummary
    .map((e) => `  - ${e.name}: ${e.sets} sets, top weight ${e.maxWeight}kg`)
    .join("\n");

  return `You are a supportive personal fitness coach. A user just completed their workout.

Workout: ${data.workoutLabel}
Total working sets completed: ${data.completedSets}
Total volume: ${Math.round(data.totalVolume)}kg
Overall effort (RPE 1-10): ${data.overallRpe ?? "not rated"}
Exercises:
${exerciseList}

Write 2-3 sentences of encouraging, specific coaching feedback based on their actual performance.
Mention at least one specific exercise or number from their session.
End with one practical tip for next time.
Be conversational, warm, and motivating. Do not use markdown, bullet points, or headers.
Keep it under 80 words.`;
}
