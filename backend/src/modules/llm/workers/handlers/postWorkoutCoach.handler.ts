import { ollamaClient } from "../../ollama.client";
import { buildPostWorkoutCoachPrompt } from "../prompts/postWorkoutCoach.prompt";

export async function postWorkoutCoachHandler(inputData: Record<string, unknown>): Promise<string> {
  const prompt = buildPostWorkoutCoachPrompt(inputData as unknown as Parameters<typeof buildPostWorkoutCoachPrompt>[0]);
  return ollamaClient.generate(prompt, { temperature: 0.75, num_predict: 150 });
}
