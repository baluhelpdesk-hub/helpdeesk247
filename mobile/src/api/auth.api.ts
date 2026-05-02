import apiClient from "./client";

export const authApi = {
  register: (email: string, password: string) =>
    apiClient.post("/auth/register", { email, password }).then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }).then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post("/auth/logout", { refreshToken }),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }).then((r) => r.data),
};
