import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): { userId: string } {
  const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
  return { userId: payload.userId };
}

export function verifyRefreshToken(token: string): { userId: string } {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  return { userId: payload.userId };
}
