import { Queue } from "bullmq";
import { redis } from "../../config/redis";
import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const LLM_QUEUE_NAME = "llm-jobs";

export const llmQueue = new Queue(LLM_QUEUE_NAME, { connection: redis });

type LlmJobType = "post_workout_coach" | "weekly_summary_insights" | "exercise_cues" | "user_qa";

interface EnqueueParams {
  userId: string;
  jobType: LlmJobType;
  inputData: Record<string, unknown>;
  workoutSessionId?: string;
}

export async function enqueueLlmJob(params: EnqueueParams): Promise<string> {
  const dbJob = await prisma.llmJob.create({
    data: {
      userId: params.userId,
      jobType: params.jobType,
      inputData: params.inputData as Prisma.InputJsonValue,
      workoutSessionId: params.workoutSessionId,
      status: "queued",
    },
  });

  const bullJob = await llmQueue.add(
    params.jobType,
    { llmJobDbId: dbJob.id, jobType: params.jobType, inputData: params.inputData },
    { removeOnComplete: 100, removeOnFail: 50 }
  );

  await prisma.llmJob.update({
    where: { id: dbJob.id },
    data: { bullJobId: String(bullJob.id) },
  });

  return dbJob.id;
}

export async function getLlmJob(userId: string, jobId: string) {
  const job = await prisma.llmJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("NOT_FOUND");
  if (job.userId !== userId) throw new Error("FORBIDDEN");
  return job;
}
