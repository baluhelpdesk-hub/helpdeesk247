import { Request, Response, NextFunction } from "express";
import * as workoutsService from "./workouts.service";

export async function getTodayWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await workoutsService.getTodayWorkout(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function startWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { workoutTemplateId } = req.body;
    if (!workoutTemplateId) {
      res.status(400).json({ error: "workoutTemplateId is required" });
      return;
    }
    const session = await workoutsService.startSession(req.userId, workoutTemplateId);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await workoutsService.getSession(req.userId, req.params.sessionId);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function finishWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await workoutsService.finishSession(req.userId, req.params.sessionId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await workoutsService.updateSession(req.userId, req.params.sessionId, req.body);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await workoutsService.getHistory(req.userId, req.query as Record<string, unknown>);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getHistorySession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await workoutsService.getSession(req.userId, req.params.sessionId);
    res.json(session);
  } catch (err) {
    next(err);
  }
}
