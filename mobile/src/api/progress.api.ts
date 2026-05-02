import apiClient from "./client";

export const progressApi = {
  getWorkoutsPerWeek: (weeks = 12) =>
    apiClient.get(`/progress/workouts-per-week?weeks=${weeks}`).then((r) => r.data),

  getLoadProgression: (exerciseId: string) =>
    apiClient.get(`/progress/load/${exerciseId}`).then((r) => r.data),

  getPersonalBests: () => apiClient.get("/progress/personal-bests").then((r) => r.data),

  getWeeklySummary: () => apiClient.get("/weekly-summary/current").then((r) => r.data),

  getPrograms: () => apiClient.get("/programs/active").then((r) => r.data),

  getTemplates: () => apiClient.get("/programs/templates").then((r) => r.data),

  switchProgram: (templateId: string) =>
    apiClient.post("/programs/switch", { templateId }).then((r) => r.data),
};
