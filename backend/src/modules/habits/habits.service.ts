import { prisma } from "../../config/prisma";

interface HabitSettingsInput {
  trainingDays: number[];
  reminderHour: number;
  reminderMinute: number;
  timezone?: string;
  remindersOn?: boolean;
}

export async function upsertHabitSettings(userId: string, data: HabitSettingsInput) {
  return prisma.habitSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

export async function getHabitSettings(userId: string) {
  return prisma.habitSettings.findUnique({ where: { userId } });
}

export async function getStreakStats(userId: string) {
  return prisma.streakStats.findUnique({ where: { userId } });
}

export async function updateStreak(userId: string) {
  const habits = await prisma.habitSettings.findUnique({ where: { userId } });
  if (!habits) return;

  const plannedPerWeek = habits.trainingDays.length;

  // Get the start of the current ISO week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const daysFromMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysFromMon);
  weekStart.setHours(0, 0, 0, 0);

  const completedThisWeek = await prisma.workoutSession.count({
    where: {
      userId,
      status: "completed",
      completedAt: { gte: weekStart },
    },
  });

  if (completedThisWeek < plannedPerWeek) return;

  // Week is complete — update streak
  const existing = await prisma.streakStats.findUnique({ where: { userId } });

  let currentStreak = 1;
  if (existing?.lastCompletedWeekStart) {
    const prevWeekStart = new Date(existing.lastCompletedWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() + 7);
    const sameWeek =
      prevWeekStart.getFullYear() === weekStart.getFullYear() &&
      prevWeekStart.getMonth() === weekStart.getMonth() &&
      prevWeekStart.getDate() === weekStart.getDate();
    if (sameWeek) return; // already updated this week
    const consecutiveWeek =
      Math.abs(prevWeekStart.getTime() - weekStart.getTime()) < 7 * 24 * 60 * 60 * 1000;
    currentStreak = consecutiveWeek ? (existing.currentStreak ?? 0) + 1 : 1;
  }

  await prisma.streakStats.upsert({
    where: { userId },
    update: {
      currentStreak,
      longestStreak: Math.max(existing?.longestStreak ?? 0, currentStreak),
      lastCompletedWeekStart: weekStart,
    },
    create: {
      userId,
      currentStreak,
      longestStreak: currentStreak,
      lastCompletedWeekStart: weekStart,
    },
  });
}
