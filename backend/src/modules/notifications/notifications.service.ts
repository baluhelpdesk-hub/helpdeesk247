import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { prisma } from "../../config/prisma";
import { logger } from "../../utils/logger";

const expo = new Expo();

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    logger.warn(`Invalid Expo push token: ${expoPushToken}`);
    return;
  }

  const message: ExpoPushMessage = { to: expoPushToken, title, body, data };
  const chunks = expo.chunkPushNotifications([message]);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (err) {
      logger.error("Push notification send error:", err);
    }
  }
}

export async function sendWorkoutReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0

  const habitsToRemind = await prisma.habitSettings.findMany({
    where: {
      remindersOn: true,
      reminderHour: hour,
      reminderMinute: minute,
      trainingDays: { has: dayOfWeek },
    },
    include: { user: { include: { profile: true } } },
  });

  for (const habit of habitsToRemind) {
    const token = habit.user.profile?.expoPushToken;
    if (!token) continue;

    await sendPushNotification(
      token,
      "Time to train! 💪",
      "Your workout is scheduled for today. Let's go!",
      { type: "workout_reminder" }
    );
  }
}

export async function checkAndSendMissedWorkoutNotifications() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDOW = (yesterday.getDay() + 6) % 7;

  // Users who had yesterday as a training day
  const habitsWithYesterdayTraining = await prisma.habitSettings.findMany({
    where: {
      remindersOn: true,
      trainingDays: { has: yesterdayDOW },
    },
    include: { user: { include: { profile: true } } },
  });

  const startOfYesterday = new Date(yesterday);
  startOfYesterday.setHours(0, 0, 0, 0);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  for (const habit of habitsWithYesterdayTraining) {
    const token = habit.user.profile?.expoPushToken;
    if (!token) continue;

    const sessionCount = await prisma.workoutSession.count({
      where: {
        userId: habit.userId,
        startedAt: { gte: startOfYesterday, lte: endOfYesterday },
      },
    });

    if (sessionCount === 0) {
      await sendPushNotification(
        token,
        "Missed workout yesterday",
        "No worries! Get back on track today. You've got this.",
        { type: "missed_workout" }
      );
    }
  }
}
