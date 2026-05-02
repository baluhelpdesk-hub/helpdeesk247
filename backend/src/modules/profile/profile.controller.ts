import { Request, Response, NextFunction } from "express";
import * as profileService from "./profile.service";

export async function onboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await profileService.completeOnboarding(req.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await profileService.getProfile(req.userId);
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await profileService.updateProfile(req.userId, req.body);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function savePushToken(req: Request, res: Response, next: NextFunction) {
  try {
    await profileService.savePushToken(req.userId, req.body.expoPushToken);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
