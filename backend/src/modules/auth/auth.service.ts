import crypto from "crypto";
import { prisma } from "../../config/db";
import { HttpError } from "../../utils/httpError";
import bcrypt from "bcryptjs";
import { signAccessToken } from "../../utils/jwt";

const PASSWORD_ROUNDS = 12;
const REFRESH_TOKEN_BYTES = 64;
const REFRESH_DAYS = 30;

function hashRefreshToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiresAt() {
  const ms = REFRESH_DAYS * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

function sanitizeUser(user: { id: number; email: string; name: string; createdAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HttpError(409, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_ROUNDS);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const accessToken = signAccessToken(
      { userId: user.id, email: user.email },
      "15m"
    );

    const refreshToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: refreshExpiresAt(),
      },
    });

    return { accessToken, refreshToken, user: sanitizeUser(user) };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true, passwordHash: true },
    });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Invalid credentials");
    }

    const accessToken = signAccessToken(
      { userId: user.id, email: user.email },
      "15m"
    );

    const refreshToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: refreshExpiresAt(),
      },
    });

    const { passwordHash: _ph, ...safeUser } = user;
    return { accessToken, refreshToken, user: sanitizeUser(safeUser) };
  },

  async refresh(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    const record = await prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!record) {
      throw new HttpError(401, "Invalid refresh token");
    }
    if (record.revokedAt) {
      throw new HttpError(401, "Refresh token revoked");
    }
    if (record.expiresAt.getTime() < Date.now()) {
      throw new HttpError(401, "Refresh token expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: record.userId },
      select: { id: true, email: true },
    });
    if (!user) {
      throw new HttpError(401, "Invalid refresh token");
    }

    const accessToken = signAccessToken(
      { userId: user.id, email: user.email },
      "15m"
    );

    return { accessToken };
  },

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  },
};

