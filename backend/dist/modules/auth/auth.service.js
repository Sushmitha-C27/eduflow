"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../../config/db");
const httpError_1 = require("../../utils/httpError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const PASSWORD_ROUNDS = 12;
const REFRESH_TOKEN_BYTES = 64;
const REFRESH_DAYS = 30;
function hashRefreshToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
function refreshExpiresAt() {
    const ms = REFRESH_DAYS * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms);
}
function sanitizeUser(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
    };
}
exports.authService = {
    async register(email, password, name) {
        const existing = await db_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new httpError_1.HttpError(409, "Email already in use");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, PASSWORD_ROUNDS);
        const user = await db_1.prisma.user.create({
            data: { email, name, passwordHash },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, email: user.email }, "15m");
        const refreshToken = crypto_1.default.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
        const tokenHash = hashRefreshToken(refreshToken);
        await db_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: refreshExpiresAt(),
            },
        });
        return { accessToken, refreshToken, user: sanitizeUser(user) };
    },
    async login(email, password) {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, createdAt: true, passwordHash: true },
        });
        if (!user) {
            throw new httpError_1.HttpError(401, "Invalid credentials");
        }
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok) {
            throw new httpError_1.HttpError(401, "Invalid credentials");
        }
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, email: user.email }, "15m");
        const refreshToken = crypto_1.default.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
        const tokenHash = hashRefreshToken(refreshToken);
        await db_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: refreshExpiresAt(),
            },
        });
        const { passwordHash: _ph, ...safeUser } = user;
        return { accessToken, refreshToken, user: sanitizeUser(safeUser) };
    },
    async refresh(refreshToken) {
        const tokenHash = hashRefreshToken(refreshToken);
        const record = await db_1.prisma.refreshToken.findFirst({
            where: { tokenHash },
        });
        if (!record) {
            throw new httpError_1.HttpError(401, "Invalid refresh token");
        }
        if (record.revokedAt) {
            throw new httpError_1.HttpError(401, "Refresh token revoked");
        }
        if (record.expiresAt.getTime() < Date.now()) {
            throw new httpError_1.HttpError(401, "Refresh token expired");
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: record.userId },
            select: { id: true, email: true },
        });
        if (!user) {
            throw new httpError_1.HttpError(401, "Invalid refresh token");
        }
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, email: user.email }, "15m");
        return { accessToken };
    },
    async logout(refreshToken) {
        const tokenHash = hashRefreshToken(refreshToken);
        await db_1.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        return { success: true };
    },
};
