import { prisma } from "../../config/prisma";

export async function getWorkoutsPerWeek(userId: string, weeks: number) {
  const from = new Date();
  from.setDate(from.getDate() - weeks * 7);
  from.setHours(0, 0, 0, 0);

  const sessions = await prisma.workoutSession.findMany({
    where: { userId, status: "completed", completedAt: { gte: from } },
    select: { completedAt: true },
    orderBy: { completedAt: "asc" },
  });

  // Bucket by ISO week (Monday date string)
  const buckets = new Map<string, number>();
  for (const s of sessions) {
    if (!s.completedAt) continue;
    const d = new Date(s.completedAt);
    const day = d.getDay();
    const daysFromMon = day === 0 ? 6 : day - 1;
    const mon = new Date(d);
    mon.setDate(d.getDate() - daysFromMon);
    mon.setHours(0, 0, 0, 0);
    const key = mon.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  // Fill empty weeks
  const result: { weekStart: string; count: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date();
    const day = d.getDay();
    const daysFromMon = day === 0 ? 6 : day - 1;
    const mon = new Date(d);
    mon.setDate(d.getDate() - daysFromMon - i * 7);
    mon.setHours(0, 0, 0, 0);
    const key = mon.toISOString().slice(0, 10);
    result.push({ weekStart: key, count: buckets.get(key) ?? 0 });
  }

  return result;
}

export async function getLoadProgression(userId: string, exerciseId: string) {
  const records = await prisma.exercisePerformanceCache.findMany({
    where: { userId, exerciseId },
    orderBy: { sessionDate: "asc" },
    take: 30,
  });

  return records.map((r) => ({
    date: r.sessionDate.toISOString().slice(0, 10),
    avgWeight: r.avgWeight,
    totalVolume: r.totalVolume,
  }));
}

export async function getPersonalBests(userId: string) {
  const records = await prisma.exercisePerformanceCache.findMany({
    where: { userId },
    include: { exercise: { select: { name: true, slug: true } } },
    orderBy: { avgWeight: "desc" },
  });

  const bests = new Map<string, { exerciseName: string; maxWeight: number; date: Date }>();
  for (const r of records) {
    if (!bests.has(r.exerciseId) && r.avgWeight) {
      bests.set(r.exerciseId, {
        exerciseName: r.exercise.name,
        maxWeight: r.avgWeight,
        date: r.sessionDate,
      });
    }
  }

  return Array.from(bests.values());
}
