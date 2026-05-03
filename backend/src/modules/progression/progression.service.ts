import { prisma } from "../../config/prisma";

type ProgressionCategory = "upper_compound" | "lower_compound" | "isolation";

function getCategory(primaryMuscles: string[]): ProgressionCategory {
  const lowerMuscles = new Set(["quadriceps", "hamstrings", "glutes", "calves"]);
  const isolationMuscles = new Set(["biceps", "triceps", "medial deltoid", "anterior deltoid", "brachialis", "forearms"]);
  if (primaryMuscles.some((m) => lowerMuscles.has(m))) return "lower_compound";
  if (primaryMuscles.some((m) => isolationMuscles.has(m))) return "isolation";
  return "upper_compound";
}

function getIncrementKg(category: ProgressionCategory): number {
  if (category === "lower_compound") return 5;
  if (category === "upper_compound") return 2.5;
  return 1.25;
}

export async function updatePerformanceCache(userId: string, sessionId: string) {
  const session = await prisma.workoutSession.findUnique({
    where: { id: sessionId },
    include: {
      setLogs: { include: { exercise: true } },
      workoutTemplate: { include: { exercises: true } },
    },
  });
  if (!session) return;

  // Group set logs by exercise
  const byExercise = new Map<string, typeof session.setLogs>();
  for (const log of session.setLogs) {
    if (!byExercise.has(log.exerciseId)) byExercise.set(log.exerciseId, []);
    byExercise.get(log.exerciseId)!.push(log);
  }

  for (const [exerciseId, logs] of byExercise.entries()) {
    const workingSets = logs.filter((l) => !l.isWarmup && l.weight !== null && l.reps !== null);
    if (workingSets.length === 0) continue;

    const avgWeight = workingSets.reduce((s, l) => s + (l.weight ?? 0), 0) / workingSets.length;
    const totalVolume = workingSets.reduce((s, l) => s + (l.weight ?? 0) * (l.reps ?? 0), 0);

    // Find the template target for this exercise
    const template = session.workoutTemplate?.exercises.find((e) => e.exerciseId === exerciseId);
    let hitTargets = false;
    if (template) {
      const targetSets = template.sets;
      const completedAtTarget = workingSets.filter(
        (l) => (l.reps ?? 0) >= template.repsMin
      ).length;
      hitTargets = completedAtTarget >= targetSets;
    }

    const avgRpe = workingSets.reduce((s, l) => s + (l.rpe ?? 5), 0) / workingSets.length;
    const markedEasy = avgRpe <= 6;

    await prisma.exercisePerformanceCache.upsert({
      where: {
        userId_exerciseId_sessionDate: {
          userId,
          exerciseId,
          sessionDate: session.startedAt,
        },
      },
      update: { avgWeight, totalVolume, hitTargets, markedEasy },
      create: {
        userId,
        exerciseId,
        sessionDate: session.startedAt,
        avgWeight,
        totalVolume,
        hitTargets,
        markedEasy,
      },
    });
  }
}

export async function getSuggestionsForWorkout(userId: string, workoutTemplateId: string) {
  const template = await prisma.workoutTemplate.findUnique({
    where: { id: workoutTemplateId },
    include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } },
  });
  if (!template) return [];

  const suggestions = [];
  for (const slot of template.exercises) {
    const recent = await prisma.exercisePerformanceCache.findMany({
      where: { userId, exerciseId: slot.exerciseId },
      orderBy: { sessionDate: "desc" },
      take: 5,
    });

    if (recent.length === 0) {
      suggestions.push({
        exerciseId: slot.exerciseId,
        suggestedWeightKg: null,
        lastWeightKg: null,
        basis: "no_data" as const,
      });
      continue;
    }

    const lastWeight = recent[0].avgWeight;
    const last2 = recent.slice(0, 2);
    const shouldIncrease = last2.length === 2 && last2.every((r) => r.hitTargets && r.markedEasy);
    const shouldReduce = last2.every((r) => !r.markedEasy && !r.hitTargets);

    let suggestedWeightKg = lastWeight;
    let basis: "increase" | "maintain" | "reduce" | "no_data" = "maintain";

    if (shouldIncrease && lastWeight) {
      const category = getCategory(slot.exercise.primaryMuscles);
      suggestedWeightKg = (lastWeight ?? 0) + getIncrementKg(category);
      basis = "increase";
    } else if (shouldReduce && lastWeight) {
      suggestedWeightKg = Math.max(0, (lastWeight ?? 0) * 0.95);
      basis = "reduce";
    }

    suggestions.push({ exerciseId: slot.exerciseId, suggestedWeightKg, lastWeightKg: lastWeight, basis });
  }

  return suggestions;
}
