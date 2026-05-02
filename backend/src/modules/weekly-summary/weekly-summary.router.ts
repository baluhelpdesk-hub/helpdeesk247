import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getCurrentWeekSummary } from "./weekly-summary.service";

export const weeklySummaryRouter = Router();

weeklySummaryRouter.get("/current", authenticate, async (req, res, next) => {
  try {
    const summary = await getCurrentWeekSummary(req.userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});
