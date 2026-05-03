import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid credentials") {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.requestPasswordReset(req.body.email);
    // Always respond 200 to avoid email enumeration
    res.json({ message: "If that email exists, a reset link will be sent." });
  } catch (err) {
    next(err);
  }
}
