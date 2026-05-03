import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as progressService from "./progress.service";

export const progressRouter = Router();

progressRouter.get("/workouts-per-week", authenticate, async (req, res, next) => {
  try {
    const weeks = Math.min(52, Math.max(1, parseInt(String(req.query.weeks ?? "12"), 10)));
    const data = await progressService.getWorkoutsPerWeek(req.userId, weeks);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

progressRouter.get("/load/:exerciseId", authenticate, async (req, res, next) => {
  try {
    const data = await progressService.getLoadProgression(req.userId, req.params.exerciseId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

progressRouter.get("/personal-bests", authenticate, async (req, res, next) => {
  try {
    const data = await progressService.getPersonalBests(req.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});
