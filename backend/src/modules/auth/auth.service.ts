import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { RegisterInput, LoginInput } from "./auth.schema";

const REFRESH_TOKEN_TTL_DAYS = 30;

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("CONFLICT");

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { email: data.email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
  return user;
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email },
  };
}

export async function refreshTokens(token: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  const { userId } = verifyRefreshToken(token);

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { token } });
  const newRefreshToken = signRefreshToken(userId);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { token: newRefreshToken, userId, expiresAt } });

  return {
    accessToken: signAccessToken(userId),
    refreshToken: newRefreshToken,
  };
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function requestPasswordReset(email: string) {
  // V1: just log — email delivery not wired up yet
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    console.log(`[PASSWORD_RESET] Token requested for user ${user.id} (email not sent in V1)`);
  }
}
