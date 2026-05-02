import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getSuggestionsForWorkout } from "./progression.service";

export const progressionRouter = Router();

progressionRouter.get("/suggestions/:workoutTemplateId", authenticate, async (req, res, next) => {
  try {
    const suggestions = await getSuggestionsForWorkout(req.userId, req.params.workoutTemplateId);
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
});
