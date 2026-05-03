import apiClient from "./client";

export const habitsApi = {
  get: () => apiClient.get("/habits").then((r) => r.data),

  update: (data: { trainingDays: number[]; reminderHour: number; reminderMinute: number; remindersOn?: boolean }) =>
    apiClient.put("/habits", data).then((r) => r.data),

  getStreak: () => apiClient.get("/habits/streak").then((r) => r.data),
};
