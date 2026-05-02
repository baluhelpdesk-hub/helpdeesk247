interface ExerciseCuesInput {
  exerciseName: string;
  primaryMuscles: string[];
  commonMistakes: string[];
}

export function buildExerciseCuesPrompt(data: ExerciseCuesInput): string {
  return `You are an expert personal trainer. Provide exactly 4 brief, actionable coaching cues for the ${data.exerciseName}.

Primary muscles worked: ${data.primaryMuscles.join(", ")}
Common mistakes to avoid: ${data.commonMistakes.join(", ")}

Respond with exactly 4 coaching cues as a JSON array of strings. Each cue should be:
- Under 15 words
- Actionable and specific
- Focused on technique, not motivation

Example format:
["Cue one here", "Cue two here", "Cue three here", "Cue four here"]

Respond with ONLY the JSON array, no explanation, no markdown.`;
}
