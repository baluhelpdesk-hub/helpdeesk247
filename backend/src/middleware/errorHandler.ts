import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation error", details: err.flatten().fieldErrors });
    return;
  }

  if (err instanceof Error) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (err.message === "FORBIDDEN") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (err.message === "CONFLICT") {
      res.status(409).json({ error: "Conflict" });
      return;
    }
    logger.error(err.message, err.stack);
  }

  res.status(500).json({ error: "Internal server error" });
}
