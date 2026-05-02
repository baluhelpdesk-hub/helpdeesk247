import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { adminAuth } from "../../middleware/adminAuth";
import * as exercisesController from "./exercises.controller";

export const exercisesRouter = Router();

// Public
exercisesRouter.get("/", exercisesController.listExercises);
exercisesRouter.get("/:id", exercisesController.getExercise);

// Auth required
exercisesRouter.get("/:id/cues", authenticate, exercisesController.getExerciseCues);

// Admin
exercisesRouter.post("/admin", adminAuth, exercisesController.adminCreate);
exercisesRouter.put("/admin/:id", adminAuth, exercisesController.adminUpdate);
exercisesRouter.delete("/admin/:id", adminAuth, exercisesController.adminDelete);
