import { prisma } from "../../config/prisma";
import { Profile } from "@prisma/client";

type Phase = "low_volume" | "high_volume" | "deload";

function getWeekPhase(weekNumber: number): Phase {
  if (weekNumber <= 2) return "low_volume";
  if (weekNumber === 6) return "deload";
  return "high_volume";
}

function nextMonday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay(); // 0=Sun
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function selectTemplate(profile: Profile) {
  // Priority order: exact goal match first, then "any"
  const goalCandidates = [profile.goal, "any"];
  const locationCandidates = profile.location === "both" ? ["gym", "home", "both"] : [profile.location, "both"];

  for (const goal of goalCandidates) {
    const matches = await prisma.programTemplate.findMany({
      where: {
        goal,
        experience: { hasSome: [profile.trainingExp] },
        location: { in: locationCandidates },
        daysPerWeek: profile.daysPerWeek,
      },
    });
    if (matches.length > 0) return matches[0];
  }

  // Fallback: any template with the right number of days
  const fallback = await prisma.programTemplate.findFirst({
    where: { daysPerWeek: profile.daysPerWeek },
  });
  if (fallback) return fallback;

  // Last resort: first template
  const any = await prisma.programTemplate.findFirst();
  if (!any) throw new Error("No program templates found — run seed first");
  return any;
}

export async function selectAndGenerateProgram(userId: string, profile: Profile) {
  const template = await selectTemplate(profile);
  return generateUserProgram(userId, template.id);
}

export async function generateUserProgram(userId: string, templateId: string) {
  const startDate = nextMonday(new Date());

  const userProgram = await prisma.userProgram.create({
    data: {
      userId,
      programTemplateId: templateId,
      startDate,
      isActive: true,
      currentWeek: 1,
    },
  });

  const TOTAL_WEEKS = 8;
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (week - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    await prisma.userProgramWeek.create({
      data: {
        userProgramId: userProgram.id,
        weekNumber: week,
        phase: getWeekPhase(week),
        startDate: weekStart,
        endDate: weekEnd,
      },
    });
  }

  return prisma.userProgram.findUnique({
    where: { id: userProgram.id },
    include: { programTemplate: true, weeks: { orderBy: { weekNumber: "asc" } } },
  });
}

export async function getActiveProgram(userId: string) {
  return prisma.userProgram.findFirst({
    where: { userId, isActive: true },
    include: {
      programTemplate: {
        include: { workoutTemplates: { include: { exercises: { include: { exercise: true } } } } },
      },
      weeks: { orderBy: { weekNumber: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function switchProgram(userId: string, templateId: string) {
  await prisma.userProgram.updateMany({ where: { userId, isActive: true }, data: { isActive: false } });
  return generateUserProgram(userId, templateId);
}

export async function listTemplates() {
  return prisma.programTemplate.findMany({
    include: {
      workoutTemplates: { orderBy: { order: "asc" } },
    },
  });
}
