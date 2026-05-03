import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";
import { checkOllamaHealth } from "./modules/llm/ollama.client";
import { llmWorker } from "./modules/llm/workers/llm.worker";
import { sendWorkoutReminders, checkAndSendMissedWorkoutNotifications } from "./modules/notifications/notifications.service";
import { logger } from "./utils/logger";
import cron from "node-cron";

async function start() {
  // Check Ollama availability
  await checkOllamaHealth();

  // Ensure BullMQ worker is running (imported above — side-effectful)
  logger.info("LLM worker started");

  // Cron: check reminders every minute
  cron.schedule("* * * * *", () => {
    sendWorkoutReminders().catch((err) => logger.error("Reminder cron error:", err));
  });

  // Cron: check missed workouts at 23:00 daily
  cron.schedule("0 23 * * *", () => {
    checkAndSendMissedWorkoutNotifications().catch((err) =>
      logger.error("Missed workout cron error:", err)
    );
  });

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

start().catch((err) => {
  logger.error("Fatal startup error:", err);
  process.exit(1);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down...");
  await llmWorker.close();
  process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
