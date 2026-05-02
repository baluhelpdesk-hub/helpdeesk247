import { ollamaClient } from "../../ollama.client";
import { buildExerciseCuesPrompt } from "../prompts/exerciseCues.prompt";
import { prisma } from "../../../../config/prisma";

export async function exerciseCuesHandler(inputData: Record<string, unknown>): Promise<string> {
  const prompt = buildExerciseCuesPrompt(inputData as unknown as Parameters<typeof buildExerciseCuesPrompt>[0]);
  const raw = await ollamaClient.generate(prompt, { temperature: 0.3, num_predict: 200 });

  // Parse JSON array from response
  let cues: string[];
  try {
    // Extract JSON array even if there's surrounding text
    const match = raw.match(/\[[\s\S]*?\]/);
    cues = match ? JSON.parse(match[0]) : [raw.trim()];
  } catch {
    // If parsing fails, split by newlines
    cues = raw.split("\n").filter((l) => l.trim().length > 0).slice(0, 5);
  }

  // Cache the cues permanently
  if (inputData.exerciseId) {
    await prisma.exerciseCuesCache.upsert({
      where: { exerciseId: String(inputData.exerciseId) },
      update: { cues: JSON.stringify(cues), generatedAt: new Date() },
      create: { exerciseId: String(inputData.exerciseId), cues: JSON.stringify(cues) },
    });
  }

  return JSON.stringify(cues);
}
