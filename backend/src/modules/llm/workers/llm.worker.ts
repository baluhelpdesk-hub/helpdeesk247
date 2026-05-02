import { Worker, Job } from "bullmq";
import { redis } from "../../../config/redis";
import { prisma } from "../../../config/prisma";
import { logger } from "../../../utils/logger";
import { LLM_QUEUE_NAME } from "../llm.service";
import { postWorkoutCoachHandler } from "./handlers/postWorkoutCoach.handler";
import { weeklySummaryInsightsHandler } from "./handlers/weeklySummaryInsights.handler";
import { exerciseCuesHandler } from "./handlers/exerciseCues.handler";
import { userQaHandler } from "./handlers/userQa.handler";

type LlmJobType = "post_workout_coach" | "weekly_summary_insights" | "exercise_cues" | "user_qa";

const handlers: Record<LlmJobType, (data: Record<string, unknown>) => Promise<string>> = {
  post_workout_coach: postWorkoutCoachHandler,
  weekly_summary_insights: weeklySummaryInsightsHandler,
  exercise_cues: exerciseCuesHandler,
  user_qa: userQaHandler,
};

export const llmWorker = new Worker(
  LLM_QUEUE_NAME,
  async (job: Job) => {
    const { llmJobDbId, jobType, inputData } = job.data as {
      llmJobDbId: string;
      jobType: LlmJobType;
      inputData: Record<string, unknown>;
    };

    await prisma.llmJob.update({
      where: { id: llmJobDbId },
      data: { status: "processing" },
    });

    const handler = handlers[jobType];
    if (!handler) throw new Error(`Unknown job type: ${jobType}`);

    const outputText = await handler(inputData);

    await prisma.llmJob.update({
      where: { id: llmJobDbId },
      data: { status: "done", outputText },
    });

    logger.info(`LLM job ${llmJobDbId} (${jobType}) completed`);
    return outputText;
  },
  {
    connection: redis,
    concurrency: 2,
  }
);

llmWorker.on("failed", async (job, error) => {
  logger.error(`LLM job failed: ${error.message}`);
  if (job?.data?.llmJobDbId) {
    try {
      await prisma.llmJob.update({
        where: { id: job.data.llmJobDbId },
        data: { status: "failed", errorMessage: error.message },
      });
    } catch (dbErr) {
      logger.error("Failed to update LLM job status:", dbErr);
    }
  }
});
