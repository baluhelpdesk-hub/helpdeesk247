import { prisma } from "../../config/prisma";
import { enqueueLlmJob } from "../llm/llm.service";

export async function listExercises(filters: { muscles?: string; equipment?: string; difficulty?: string }) {
  return prisma.exercise.findMany({
    where: {
      ...(filters.muscles && { primaryMuscles: { has: filters.muscles } }),
      ...(filters.equipment && { equipment: { has: filters.equipment } }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
    },
    orderBy: { name: "asc" },
  });
}

export async function getExerciseWithAlternatives(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      alternatives: { include: { alternative: true } },
      alternativeFor: { include: { primary: true } },
      cuesCache: true,
    },
  });
  if (!exercise) throw new Error("NOT_FOUND");
  return exercise;
}

export async function getOrQueueCues(userId: string, exerciseId: string) {
  // Return from cache if available
  const cached = await prisma.exerciseCuesCache.findUnique({ where: { exerciseId } });
  if (cached) {
    const cues = JSON.parse(cached.cues) as string[];
    return { cues, jobId: null };
  }

  // Queue async LLM job
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) throw new Error("NOT_FOUND");

  const jobId = await enqueueLlmJob({
    userId,
    jobType: "exercise_cues",
    inputData: {
      exerciseId,
      exerciseName: exercise.name,
      primaryMuscles: exercise.primaryMuscles,
      commonMistakes: exercise.commonMistakes,
    },
  });

  return { cues: null, jobId };
}

// ── Admin helpers ──────────────────────────────────────────────────────────

export async function createExercise(data: Record<string, unknown>) {
  return prisma.exercise.create({ data: data as Parameters<typeof prisma.exercise.create>[0]["data"] });
}

export async function updateExercise(id: string, data: Record<string, unknown>) {
  return prisma.exercise.update({ where: { id }, data: data as Parameters<typeof prisma.exercise.update>[0]["data"] });
}

export async function deleteExercise(id: string) {
  return prisma.exercise.delete({ where: { id } });
}
