import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as setsService from "./sets.service";

export const setsRouter = Router({ mergeParams: true });

setsRouter.post("/:sessionId/sets", authenticate, async (req, res, next) => {
  try {
    const set = await setsService.logSet(req.userId, req.params.sessionId, req.body);
    res.status(201).json(set);
  } catch (err) {
    next(err);
  }
});

setsRouter.patch("/:sessionId/sets/:setId", authenticate, async (req, res, next) => {
  try {
    const set = await setsService.editSet(req.userId, req.params.setId, req.body);
    res.json(set);
  } catch (err) {
    next(err);
  }
});

setsRouter.delete("/:sessionId/sets/:setId", authenticate, async (req, res, next) => {
  try {
    await setsService.removeSet(req.userId, req.params.setId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
