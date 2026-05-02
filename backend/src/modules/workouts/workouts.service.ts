import { prisma } from "../../config/prisma";
import { updatePerformanceCache, getSuggestionsForWorkout } from "../progression/progression.service";
import { updateStreak } from "../habits/habits.service";
import { enqueueLlmJob } from "../llm/llm.service";
import { parsePagination, paginationToSkipTake } from "../../utils/pagination";

export async function getTodayWorkout(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeProgram = await prisma.userProgram.findFirst({
    where: { userId, isActive: true },
    include: {
      programTemplate: {
        include: { workoutTemplates: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
      },
      weeks: { orderBy: { weekNumber: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!activeProgram) {
    return { type: "no_program" as const };
  }

  // Find the current week
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  const currentWeek = activeProgram.weeks.find(
    (w) => new Date(w.startDate) <= todayEnd && new Date(w.endDate) >= today
  );

  if (!currentWeek) {
    return { type: "rest_day" as const, message: "Program complete — great work!" };
  }

  // Get habit settings to see if today is a training day
  const habits = await prisma.habitSettings.findUnique({ where: { userId } });
  const todayDayOfWeek = (today.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
  const isTrainingDay = habits ? habits.trainingDays.includes(todayDayOfWeek) : true;

  if (!isTrainingDay) {
    return { type: "rest_day" as const, message: "Rest day — recovery is part of progress!" };
  }

  // Check for an in-progress session today
  const inProgressSession = await prisma.workoutSession.findFirst({
    where: {
      userId,
      status: "in_progress",
      startedAt: { gte: today },
    },
  });
  if (inProgressSession) {
    return { type: "in_progress" as const, sessionId: inProgressSession.id };
  }

  // Determine next workout label (A/B/C/D/E) based on completed sessions this week
  const completedThisWeek = await prisma.workoutSession.findMany({
    where: { userId, userProgramWeekId: currentWeek.id, status: "completed" },
    orderBy: { completedAt: "asc" },
  });

  const templates = activeProgram.programTemplate.workoutTemplates;
  const completedLabels = completedThisWeek.map((s) => s.label);
  const nextTemplate = templates.find((t) => !completedLabels.includes(t.label)) ?? templates[0];

  // Load progression suggestions
  const suggestions = await getSuggestionsForWorkout(userId, nextTemplate.id);
  const suggestionMap = new Map(suggestions.map((s) => [s.exerciseId, s]));

  const exercisesWithSuggestions = nextTemplate.exercises.map((slot) => ({
    ...slot,
    suggestion: suggestionMap.get(slot.exerciseId) ?? null,
  }));

  return {
    type: "workout" as const,
    week: currentWeek,
    workoutTemplate: { ...nextTemplate, exercises: exercisesWithSuggestions },
    completedThisWeek: completedLabels.length,
    totalThisWeek: templates.length,
  };
}

export async function startSession(userId: string, workoutTemplateId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeProgram = await prisma.userProgram.findFirst({
    where: { userId, isActive: true },
    include: { weeks: true },
    orderBy: { createdAt: "desc" },
  });

  const currentWeek = activeProgram?.weeks.find(
    (w) => new Date(w.startDate) <= new Date() && new Date(w.endDate) >= new Date()
  );

  const template = await prisma.workoutTemplate.findUnique({ where: { id: workoutTemplateId } });

  return prisma.workoutSession.create({
    data: {
      userId,
      workoutTemplateId,
      userProgramWeekId: currentWeek?.id,
      label: template?.label,
      startedAt: new Date(),
      status: "in_progress",
    },
    include: {
      workoutTemplate: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } } },
      setLogs: true,
    },
  });
}

export async function getSession(userId: string, sessionId: string) {
  const session = await prisma.workoutSession.findUnique({
    where: { id: sessionId },
    include: {
      workoutTemplate: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } } },
      setLogs: { include: { exercise: true }, orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }] },
    },
  });
  if (!session) throw new Error("NOT_FOUND");
  if (session.userId !== userId) throw new Error("FORBIDDEN");
  return session;
}

export async function finishSession(
  userId: string,
  sessionId: string,
  data: { feelRating?: string; hasPain?: boolean; painNotes?: string; overallRpe?: number; notes?: string }
) {
  const session = await prisma.workoutSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error("NOT_FOUND");
  if (session.userId !== userId) throw new Error("FORBIDDEN");

  const completedAt = new Date();
  const durationSeconds = Math.round((completedAt.getTime() - session.startedAt.getTime()) / 1000);

  const setCount = await prisma.setLog.count({ where: { workoutSessionId: sessionId } });

  const updated = await prisma.workoutSession.update({
    where: { id: sessionId },
    data: {
      status: "completed",
      completedAt,
      durationSeconds,
      ...data,
    },
    include: {
      setLogs: { include: { exercise: true } },
      workoutTemplate: true,
    },
  });

  // Update progression cache and streak async
  await updatePerformanceCache(userId, sessionId);
  await updateStreak(userId);

  // Enqueue AI coaching feedback
  const setLogs = updated.setLogs;
  const exerciseSummary = buildExerciseSummary(setLogs as Parameters<typeof buildExerciseSummary>[0]);
  const llmJobId = await enqueueLlmJob({
    userId,
    jobType: "post_workout_coach",
    inputData: {
      workoutLabel: updated.workoutTemplate?.name ?? "Workout",
      completedSets: setCount,
      totalVolume: setLogs.reduce((s, l) => s + (l.weight ?? 0) * (l.reps ?? 0), 0),
      overallRpe: data.overallRpe ?? null,
      exerciseSummary,
    },
    workoutSessionId: sessionId,
  });

  return { session: updated, llmJobId };
}

export async function updateSession(userId: string, sessionId: string, data: Record<string, unknown>) {
  const session = await prisma.workoutSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error("NOT_FOUND");
  if (session.userId !== userId) throw new Error("FORBIDDEN");
  return prisma.workoutSession.update({ where: { id: sessionId }, data: data as Parameters<typeof prisma.workoutSession.update>[0]["data"] });
}

export async function getHistory(userId: string, query: Record<string, unknown>) {
  const pagination = parsePagination(query);
  const { skip, take } = paginationToSkipTake(pagination);

  const [sessions, total] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId, status: "completed" },
      include: { workoutTemplate: true },
      orderBy: { completedAt: "desc" },
      skip,
      take,
    }),
    prisma.workoutSession.count({ where: { userId, status: "completed" } }),
  ]);

  return { sessions, total, page: pagination.page, limit: pagination.limit };
}

type SetLogItem = { exerciseId: string; weight: number | null; reps: number | null; exercise: { name: string } };

function buildExerciseSummary(setLogs: SetLogItem[]) {
  const byEx = new Map<string, { name: string; sets: number; maxWeight: number }>();
  for (const log of setLogs) {
    if (!byEx.has(log.exerciseId)) {
      byEx.set(log.exerciseId, { name: log.exercise.name, sets: 0, maxWeight: 0 });
    }
    const entry = byEx.get(log.exerciseId)!;
    entry.sets++;
    entry.maxWeight = Math.max(entry.maxWeight, log.weight ?? 0);
  }
  return Array.from(byEx.values());
}
