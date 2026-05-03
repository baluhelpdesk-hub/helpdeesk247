import apiClient from "./client";

export const profileApi = {
  complete: (data: Record<string, unknown>) =>
    apiClient.post("/profile/onboarding", data).then((r) => r.data),

  get: () => apiClient.get("/profile").then((r) => r.data),

  update: (data: Record<string, unknown>) =>
    apiClient.patch("/profile", data).then((r) => r.data),

  savePushToken: (expoPushToken: string) =>
    apiClient.patch("/profile/push-token", { expoPushToken }),
};
