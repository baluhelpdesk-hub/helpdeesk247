import { prisma } from "../../config/prisma";

interface LogSetInput {
  exerciseId: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  rpe?: number;
  isWarmup?: boolean;
  notes?: string;
}

export async function logSet(userId: string, sessionId: string, data: LogSetInput) {
  const session = await prisma.workoutSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error("NOT_FOUND");
  if (session.userId !== userId) throw new Error("FORBIDDEN");

  return prisma.setLog.create({
    data: { workoutSessionId: sessionId, ...data },
    include: { exercise: true },
  });
}

export async function editSet(userId: string, setId: string, data: Partial<LogSetInput>) {
  const setLog = await prisma.setLog.findUnique({
    where: { id: setId },
    include: { workoutSession: true },
  });
  if (!setLog) throw new Error("NOT_FOUND");
  if (setLog.workoutSession.userId !== userId) throw new Error("FORBIDDEN");

  return prisma.setLog.update({ where: { id: setId }, data });
}

export async function removeSet(userId: string, setId: string) {
  const setLog = await prisma.setLog.findUnique({
    where: { id: setId },
    include: { workoutSession: true },
  });
  if (!setLog) throw new Error("NOT_FOUND");
  if (setLog.workoutSession.userId !== userId) throw new Error("FORBIDDEN");

  await prisma.setLog.delete({ where: { id: setId } });
}
