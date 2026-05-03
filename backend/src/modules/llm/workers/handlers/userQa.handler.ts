import { ollamaClient } from "../../ollama.client";
import { buildUserQaPrompt } from "../prompts/userQa.prompt";
import { prisma } from "../../../../config/prisma";

export async function userQaHandler(inputData: Record<string, unknown>): Promise<string> {
  // Enrich with user profile if userId provided
  let userGoal = String(inputData.userGoal ?? "general_fitness");
  let trainingExp = String(inputData.trainingExp ?? "new");

  if (inputData.userId) {
    const profile = await prisma.profile.findUnique({ where: { userId: String(inputData.userId) } });
    if (profile) {
      userGoal = profile.goal;
      trainingExp = profile.trainingExp;
    }
  }

  const prompt = buildUserQaPrompt({
    question: String(inputData.question ?? ""),
    userGoal,
    trainingExp,
  });

  return ollamaClient.generate(prompt, { temperature: 0.7, num_predict: 150 });
}
