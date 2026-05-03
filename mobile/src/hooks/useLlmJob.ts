import { useQuery } from "@tanstack/react-query";
import { llmApi } from "../api/llm.api";

export interface LlmJobResult {
  id: string;
  status: "queued" | "processing" | "done" | "failed";
  jobType: string;
  outputText: string | null;
  errorMessage: string | null;
}

export function useLlmJob(jobId: string | null) {
  return useQuery<LlmJobResult>({
    queryKey: ["llm-job", jobId],
    queryFn: () => llmApi.getJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000;
      if (data.status === "done" || data.status === "failed") return false;
      return 3000;
    },
  });
}
