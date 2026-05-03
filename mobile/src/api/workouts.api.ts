import apiClient from "./client";

export const workoutsApi = {
  getToday: () => apiClient.get("/workouts/today").then((r) => r.data),

  start: (workoutTemplateId: string) =>
    apiClient.post("/workouts/start", { workoutTemplateId }).then((r) => r.data),

  getSession: (sessionId: string) =>
    apiClient.get(`/workouts/${sessionId}`).then((r) => r.data),

  finish: (sessionId: string, data: Record<string, unknown>) =>
    apiClient.post(`/workouts/${sessionId}/finish`, data).then((r) => r.data),

  update: (sessionId: string, data: Record<string, unknown>) =>
    apiClient.patch(`/workouts/${sessionId}`, data).then((r) => r.data),

  getHistory: (page = 1, limit = 20) =>
    apiClient.get(`/workouts/history?page=${page}&limit=${limit}`).then((r) => r.data),

  getHistorySession: (sessionId: string) =>
    apiClient.get(`/workouts/history/${sessionId}`).then((r) => r.data),

  logSet: (sessionId: string, data: Record<string, unknown>) =>
    apiClient.post(`/workouts/${sessionId}/sets`, data).then((r) => r.data),

  editSet: (sessionId: string, setId: string, data: Record<string, unknown>) =>
    apiClient.patch(`/workouts/${sessionId}/sets/${setId}`, data).then((r) => r.data),

  deleteSet: (sessionId: string, setId: string) =>
    apiClient.delete(`/workouts/${sessionId}/sets/${setId}`),
};
