import { ollamaClient } from "../../ollama.client";
import { buildWeeklySummaryInsightsPrompt } from "../prompts/weeklySummaryInsights.prompt";

export async function weeklySummaryInsightsHandler(inputData: Record<string, unknown>): Promise<string> {
  const prompt = buildWeeklySummaryInsightsPrompt(inputData as unknown as Parameters<typeof buildWeeklySummaryInsightsPrompt>[0]);
  return ollamaClient.generate(prompt, { temperature: 0.6, num_predict: 200 });
}
