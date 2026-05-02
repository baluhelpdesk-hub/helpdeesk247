import { Request, Response, NextFunction } from "express";
import * as exercisesService from "./exercises.service";

export async function listExercises(req: Request, res: Response, next: NextFunction) {
  try {
    const exercises = await exercisesService.listExercises({
      muscles: req.query.muscles as string | undefined,
      equipment: req.query.equipment as string | undefined,
      difficulty: req.query.difficulty as string | undefined,
    });
    res.json(exercises);
  } catch (err) {
    next(err);
  }
}

export async function getExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await exercisesService.getExerciseWithAlternatives(req.params.id);
    res.json(exercise);
  } catch (err) {
    next(err);
  }
}

export async function getExerciseCues(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await exercisesService.getOrQueueCues(req.userId, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Admin
export async function adminCreate(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await exercisesService.createExercise(req.body);
    res.status(201).json(exercise);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await exercisesService.updateExercise(req.params.id, req.body);
    res.json(exercise);
  } catch (err) {
    next(err);
  }
}

export async function adminDelete(req: Request, res: Response, next: NextFunction) {
  try {
    await exercisesService.deleteExercise(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
