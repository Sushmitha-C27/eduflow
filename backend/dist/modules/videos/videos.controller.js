"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../config/db");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const httpError_1 = require("../../utils/httpError");
const ordering_1 = require("../../utils/ordering");
exports.videosRouter = (0, express_1.Router)();
// GET /api/videos/:videoId (auth)
exports.videosRouter.get("/:videoId", authMiddleware_1.requireAuth, async (req, res, next) => {
    try {
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const videoId = Number(req.params.videoId);
        if (!Number.isFinite(videoId))
            throw new httpError_1.HttpError(400, "Invalid videoId");
        const video = await db_1.prisma.video.findUnique({
            where: { id: videoId },
            select: {
                id: true,
                sectionId: true,
                title: true,
                description: true,
                youtubeUrl: true,
                orderIndex: true,
                durationSeconds: true,
                section: {
                    select: {
                        id: true,
                        title: true,
                        orderIndex: true,
                        subject: { select: { id: true, title: true, isPublished: true } },
                    },
                },
            },
        });
        if (!video || !video.section.subject.isPublished) {
            throw new httpError_1.HttpError(404, "Video not found");
        }
        const subjectId = video.section.subject.id;
        const { previousVideoId, nextVideoId } = await (0, ordering_1.getPrevNextVideos)(videoId, subjectId);
        // Compute locked (needs prev completion)
        const sequence = await (0, ordering_1.getGlobalVideoSequence)(subjectId);
        const idx = sequence.findIndex((v) => v.id === videoId);
        let locked = false;
        let unlockReason;
        if (idx > 0) {
            const prev = sequence[idx - 1];
            const prevProgress = await db_1.prisma.videoProgress.findUnique({
                where: { userId_videoId: { userId: req.user.id, videoId: prev.id } },
                select: { isCompleted: true },
            });
            locked = !prevProgress?.isCompleted;
            if (locked) {
                unlockReason = `Complete '${prev.title}' first`;
            }
        }
        const progress = await db_1.prisma.videoProgress.findUnique({
            where: { userId_videoId: { userId: req.user.id, videoId } },
            select: { lastPositionSeconds: true, isCompleted: true },
        });
        const detail = {
            id: video.id,
            sectionId: video.sectionId,
            title: video.title,
            orderIndex: video.orderIndex,
            isCompleted: progress?.isCompleted ?? false,
            locked,
            durationSeconds: video.durationSeconds ?? undefined,
            youtubeUrl: video.youtubeUrl,
            description: video.description ?? "",
            sectionTitle: video.section.title,
            subjectId,
            subjectTitle: video.section.subject.title,
            previousVideoId: previousVideoId ? String(previousVideoId) : null,
            nextVideoId: nextVideoId ? String(nextVideoId) : null,
            unlockReason,
            lastPositionSeconds: progress?.lastPositionSeconds ?? 0,
        };
        return res.json(detail);
    }
    catch (err) {
        return next(err);
    }
});
