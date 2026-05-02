import apiClient from "./client";

export const exercisesApi = {
  list: (filters?: { muscles?: string; equipment?: string; difficulty?: string }) =>
    apiClient.get("/exercises", { params: filters }).then((r) => r.data),

  get: (id: string) => apiClient.get(`/exercises/${id}`).then((r) => r.data),

  getCues: (id: string) => apiClient.get(`/exercises/${id}/cues`).then((r) => r.data),
};
