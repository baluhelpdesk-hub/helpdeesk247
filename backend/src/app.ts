import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.router";
import { profileRouter } from "./modules/profile/profile.router";
import { exercisesRouter } from "./modules/exercises/exercises.router";
import { programsRouter } from "./modules/programs/programs.router";
import { workoutsRouter } from "./modules/workouts/workouts.router";
import { setsRouter } from "./modules/sets/sets.router";
import { progressionRouter } from "./modules/progression/progression.router";
import { weeklySummaryRouter } from "./modules/weekly-summary/weekly-summary.router";
import { habitsRouter } from "./modules/habits/habits.router";
import { progressRouter } from "./modules/progress/progress.router";
import { llmRouter } from "./modules/llm/llm.router";
import { adminRouter } from "./modules/admin/admin.router";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(morgan("combined"));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/exercises", exercisesRouter);
  app.use("/api/programs", programsRouter);
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/workouts", setsRouter);
  app.use("/api/progression", progressionRouter);
  app.use("/api/weekly-summary", weeklySummaryRouter);
  app.use("/api/habits", habitsRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/llm-jobs", llmRouter);
  app.use("/admin", adminRouter);

  app.use(errorHandler);

  return app;
}
