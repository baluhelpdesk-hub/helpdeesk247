import { Request, Response, NextFunction } from "express";
import * as programsService from "./programs.service";

export async function getActive(req: Request, res: Response, next: NextFunction) {
  try {
    const program = await programsService.getActiveProgram(req.userId);
    if (!program) {
      res.status(404).json({ error: "No active program found" });
      return;
    }
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function listTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    const templates = await programsService.listTemplates();
    res.json(templates);
  } catch (err) {
    next(err);
  }
}

export async function switchProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const { templateId } = req.body;
    if (!templateId) {
      res.status(400).json({ error: "templateId is required" });
      return;
    }
    const program = await programsService.switchProgram(req.userId, templateId);
    res.json(program);
  } catch (err) {
    next(err);
  }
}
