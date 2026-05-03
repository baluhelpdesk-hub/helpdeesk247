import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as workoutsController from "./workouts.controller";

export const workoutsRouter = Router();

workoutsRouter.get("/today", authenticate, workoutsController.getTodayWorkout);
workoutsRouter.post("/start", authenticate, workoutsController.startWorkout);
workoutsRouter.get("/history", authenticate, workoutsController.getHistory);
workoutsRouter.get("/history/:sessionId", authenticate, workoutsController.getHistorySession);
workoutsRouter.get("/:sessionId", authenticate, workoutsController.getSession);
workoutsRouter.post("/:sessionId/finish", authenticate, workoutsController.finishWorkout);
workoutsRouter.patch("/:sessionId", authenticate, workoutsController.updateSession);
