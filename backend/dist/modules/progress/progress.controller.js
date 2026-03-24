"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db_1 = require("../../config/db");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const httpError_1 = require("../../utils/httpError");
exports.progressRouter = (0, express_1.Router)();
function requireValid(req) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        throw new httpError_1.HttpError(400, result.array()[0]?.msg ?? "Invalid request");
    }
}
// GET /api/progress/subjects/:subjectId (auth)
exports.progressRouter.get("/subjects/:subjectId", authMiddleware_1.requireAuth, async (req, res, next) => {
    try {
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const subjectId = Number(req.params.subjectId);
        if (!Number.isFinite(subjectId))
            throw new httpError_1.HttpError(400, "Invalid subjectId");
        const totalVideos = await db_1.prisma.video.count({
            where: { section: { subjectId } },
        });
        const completedVideos = await db_1.prisma.videoProgress.count({
            where: {
                userId: req.user.id,
                isCompleted: true,
                video: { section: { subjectId } },
            },
        });
        const last = await db_1.prisma.videoProgress.findFirst({
            where: { userId: req.user.id, video: { section: { subjectId } } },
            orderBy: { updatedAt: "desc" },
            select: { videoId: true, lastPositionSeconds: true },
        });
        const percentComplete = totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);
        return res.json({
            totalVideos,
            completedVideos,
            percentComplete,
            lastVideoId: last?.videoId ?? undefined,
            lastPositionSeconds: last?.lastPositionSeconds ?? undefined,
        });
    }
    catch (err) {
        return next(err);
    }
});
// GET /api/progress/videos/:videoId (auth)
exports.progressRouter.get("/videos/:videoId", authMiddleware_1.requireAuth, async (req, res, next) => {
    try {
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const videoId = Number(req.params.videoId);
        if (!Number.isFinite(videoId))
            throw new httpError_1.HttpError(400, "Invalid videoId");
        const progress = await db_1.prisma.videoProgress.findUnique({
            where: { userId_videoId: { userId: req.user.id, videoId } },
            select: { lastPositionSeconds: true, isCompleted: true },
        });
        return res.json(progress ?? { lastPositionSeconds: 0, isCompleted: false });
    }
    catch (err) {
        return next(err);
    }
});
// POST /api/progress/videos/:videoId (auth)
exports.progressRouter.post("/videos/:videoId", authMiddleware_1.requireAuth, (0, express_validator_1.body)("lastPositionSeconds").isFloat({ min: 0 }), (0, express_validator_1.body)("isCompleted").optional().isBoolean(), async (req, res, next) => {
    try {
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const videoId = Number(req.params.videoId);
        if (!Number.isFinite(videoId))
            throw new httpError_1.HttpError(400, "Invalid videoId");
        requireValid(req);
        const lastPositionSeconds = Math.floor(Number(req.body.lastPositionSeconds));
        const isCompleted = req.body.isCompleted === true;
        const video = await db_1.prisma.video.findUnique({
            where: { id: videoId },
            select: { durationSeconds: true },
        });
        if (!video)
            throw new httpError_1.HttpError(404, "Video not found");
        const capped = typeof video.durationSeconds === "number" && video.durationSeconds >= 0
            ? Math.min(lastPositionSeconds, video.durationSeconds)
            : lastPositionSeconds;
        const progress = await db_1.prisma.videoProgress.upsert({
            where: { userId_videoId: { userId: req.user.id, videoId } },
            create: {
                userId: req.user.id,
                videoId,
                lastPositionSeconds: capped,
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
            update: {
                lastPositionSeconds: capped,
                isCompleted: isCompleted ? true : undefined,
                completedAt: isCompleted ? new Date() : undefined,
            },
            select: { lastPositionSeconds: true, isCompleted: true, completedAt: true },
        });
        return res.json(progress);
    }
    catch (err) {
        return next(err);
    }
});
