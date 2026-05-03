import { prisma } from "../../config/prisma";
import { enqueueLlmJob } from "../llm/llm.service";

export async function getCurrentWeekSummary(userId: string) {
  const activeProgram = await prisma.userProgram.findFirst({
    where: { userId, isActive: true },
    include: { weeks: true, programTemplate: { include: { workoutTemplates: true } } },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  if (!activeProgram) {
    return { error: "No active program" };
  }

  const currentWeek = activeProgram.weeks.find(
    (w) => new Date(w.startDate) <= now && new Date(w.endDate) >= now
  );

  if (!currentWeek) {
    return { error: "No current week found" };
  }

  const plannedSessions = activeProgram.programTemplate.workoutTemplates.length;

  const completedSessions = await prisma.workoutSession.count({
    where: { userId, userProgramWeekId: currentWeek.id, status: "completed" },
  });

  const setLogs = await prisma.setLog.findMany({
    where: { workoutSession: { userId, userProgramWeekId: currentWeek.id, status: "completed" } },
    include: { exercise: true },
  });

  const totalVolume = setLogs.reduce((s, l) => s + (l.weight ?? 0) * (l.reps ?? 0), 0);
  const totalSets = setLogs.length;

  // Find personal bests (max weight per exercise this week)
  const exerciseBests = new Map<string, { name: string; maxWeight: number }>();
  for (const log of setLogs) {
    if (!exerciseBests.has(log.exerciseId)) {
      exerciseBests.set(log.exerciseId, { name: log.exercise.name, maxWeight: 0 });
    }
    const entry = exerciseBests.get(log.exerciseId)!;
    entry.maxWeight = Math.max(entry.maxWeight, log.weight ?? 0);
  }

  // Check if AI insights already exist for this week
  const existingJob = await prisma.llmJob.findFirst({
    where: {
      userId,
      jobType: "weekly_summary_insights",
      status: "done",
      createdAt: { gte: currentWeek.startDate, lte: currentWeek.endDate },
    },
    orderBy: { createdAt: "desc" },
  });

  let aiInsights: string | null = null;
  let aiInsightsJobId: string | null = null;

  if (existingJob) {
    aiInsights = existingJob.outputText ?? null;
  } else {
    aiInsightsJobId = await enqueueLlmJob({
      userId,
      jobType: "weekly_summary_insights",
      inputData: {
        weekNumber: currentWeek.weekNumber,
        phase: currentWeek.phase,
        plannedSessions,
        completedSessions,
        totalVolume,
        totalSets,
        topExercises: Array.from(exerciseBests.values()).slice(0, 3),
      },
    });
  }

  return {
    weekNumber: currentWeek.weekNumber,
    phase: currentWeek.phase,
    plannedSessions,
    completedSessions,
    totalVolume,
    totalSets,
    topExercises: Array.from(exerciseBests.values()),
    aiInsights,
    aiInsightsJobId,
  };
}
