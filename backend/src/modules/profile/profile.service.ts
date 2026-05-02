import { prisma } from "../../config/prisma";
import { OnboardingInput, UpdateProfileInput } from "./profile.schema";
import { selectAndGenerateProgram } from "../programs/programs.service";

export async function completeOnboarding(userId: string, data: OnboardingInput) {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: { ...data, onboardingDone: true },
    create: { ...data, userId, onboardingDone: true },
  });

  // Deactivate any existing active programs before generating new one
  await prisma.userProgram.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  const userProgram = await selectAndGenerateProgram(userId, profile);

  return { profile, userProgram };
}

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  return prisma.profile.update({ where: { userId }, data });
}

export async function savePushToken(userId: string, expoPushToken: string) {
  return prisma.profile.update({ where: { userId }, data: { expoPushToken } });
}
