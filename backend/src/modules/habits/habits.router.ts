import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as habitsService from "./habits.service";

export const habitsRouter = Router();

habitsRouter.get("/", authenticate, async (req, res, next) => {
  try {
    const settings = await habitsService.getHabitSettings(req.userId);
    res.json(settings ?? {});
  } catch (err) {
    next(err);
  }
});

habitsRouter.put("/", authenticate, async (req, res, next) => {
  try {
    const settings = await habitsService.upsertHabitSettings(req.userId, req.body);
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

habitsRouter.get("/streak", authenticate, async (req, res, next) => {
  try {
    const streak = await habitsService.getStreakStats(req.userId);
    res.json(streak ?? { currentStreak: 0, longestStreak: 0 });
  } catch (err) {
    next(err);
  }
});
