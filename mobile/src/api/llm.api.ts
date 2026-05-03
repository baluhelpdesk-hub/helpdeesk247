import apiClient from "./client";

export const llmApi = {
  getJob: (jobId: string) => apiClient.get(`/llm-jobs/${jobId}`).then((r) => r.data),

  askQuestion: (question: string) =>
    apiClient.post("/llm-jobs/user-qa", { question }).then((r) => r.data),
};
