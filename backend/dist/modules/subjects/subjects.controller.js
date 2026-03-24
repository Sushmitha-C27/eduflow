"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../config/db");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const httpError_1 = require("../../utils/httpError");
const ordering_1 = require("../../utils/ordering");
exports.subjectsRouter = (0, express_1.Router)();
// GET /api/subjects (public)
exports.subjectsRouter.get("/", async (_req, res, next) => {
    try {
        const subjects = await db_1.prisma.subject.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnail: true,
                sections: {
                    select: {
                        _count: { select: { videos: true } },
                    },
                },
            },
        });
        const result = subjects.map((s) => ({
            id: s.id,
            title: s.title,
            slug: s.slug,
            description: s.description,
            thumbnail: s.thumbnail,
            totalVideos: s.sections.reduce((sum, sec) => sum + sec._count.videos, 0),
        }));
        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
});
// GET /api/subjects/:subjectId (public)
exports.subjectsRouter.get("/:subjectId", async (req, res, next) => {
    try {
        const subjectId = Number(req.params.subjectId);
        if (!Number.isFinite(subjectId))
            throw new httpError_1.HttpError(400, "Invalid subjectId");
        const subject = await db_1.prisma.subject.findFirst({
            where: { id: subjectId, isPublished: true },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnail: true,
                isPublished: true,
            },
        });
        if (!subject)
            throw new httpError_1.HttpError(404, "Subject not found");
        return res.json(subject);
    }
    catch (err) {
        return next(err);
    }
});
// GET /api/subjects/:subjectId/tree (auth)
exports.subjectsRouter.get("/:subjectId/tree", authMiddleware_1.requireAuth, async (req, res, next) => {
    try {
        const subjectId = Number(req.params.subjectId);
        if (!Number.isFinite(subjectId))
            throw new httpError_1.HttpError(400, "Invalid subjectId");
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const subject = await db_1.prisma.subject.findFirst({
            where: { id: subjectId, isPublished: true },
            select: {
                id: true,
                title: true,
                sections: {
                    orderBy: { orderIndex: "asc" },
                    select: {
                        id: true,
                        subjectId: true,
                        title: true,
                        orderIndex: true,
                        videos: {
                            orderBy: { orderIndex: "asc" },
                            select: {
                                id: true,
                                sectionId: true,
                                title: true,
                                orderIndex: true,
                                durationSeconds: true,
                                youtubeUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!subject)
            throw new httpError_1.HttpError(404, "Subject not found");
        const allVideoIds = subject.sections.flatMap((s) => s.videos.map((v) => v.id));
        const progressRows = await db_1.prisma.videoProgress.findMany({
            where: { userId: req.user.id, videoId: { in: allVideoIds } },
            select: { videoId: true, isCompleted: true },
        });
        const completed = new Set(progressRows.filter((p) => p.isCompleted).map((p) => p.videoId));
        // Compute locked based on global ordering + completion set.
        const sequence = await (0, ordering_1.getGlobalVideoSequence)(subjectId);
        const lockedMap = new Map();
        for (let i = 0; i < sequence.length; i++) {
            const vid = sequence[i];
            if (i === 0) {
                lockedMap.set(vid.id, { locked: false });
                continue;
            }
            const prev = sequence[i - 1];
            const locked = !completed.has(prev.id);
            lockedMap.set(vid.id, { locked, prevTitle: prev.title });
        }
        const tree = {
            id: subject.id,
            title: subject.title,
            sections: subject.sections.map((sec) => ({
                id: sec.id,
                subjectId: sec.subjectId,
                title: sec.title,
                orderIndex: sec.orderIndex,
                videos: sec.videos.map((v) => ({
                    id: v.id,
                    sectionId: v.sectionId,
                    title: v.title,
                    orderIndex: v.orderIndex,
                    durationSeconds: v.durationSeconds ?? undefined,
                    youtubeUrl: v.youtubeUrl,
                    isCompleted: completed.has(v.id),
                    locked: lockedMap.get(v.id)?.locked ?? false,
                })),
            })),
        };
        return res.json(tree);
    }
    catch (err) {
        return next(err);
    }
});
// GET /api/subjects/:subjectId/first-video (auth)
exports.subjectsRouter.get("/:subjectId/first-video", authMiddleware_1.requireAuth, async (req, res, next) => {
    try {
        const subjectId = Number(req.params.subjectId);
        if (!Number.isFinite(subjectId))
            throw new httpError_1.HttpError(400, "Invalid subjectId");
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        const subject = await db_1.prisma.subject.findFirst({
            where: { id: subjectId, isPublished: true },
            select: {
                id: true,
                sections: {
                    select: { videos: { select: { id: true } } },
                },
            },
        });
        if (!subject)
            throw new httpError_1.HttpError(404, "Subject not found");
        const sequence = await (0, ordering_1.getGlobalVideoSequence)(subjectId);
        if (sequence.length === 0)
            throw new httpError_1.HttpError(404, "No videos in subject");
        const progressRows = await db_1.prisma.videoProgress.findMany({
            where: {
                userId: req.user.id,
                videoId: { in: sequence.map((v) => v.id) },
                isCompleted: true,
            },
            select: { videoId: true },
        });
        const completed = new Set(progressRows.map((p) => p.videoId));
        // First unlocked = first video where prev is completed (or first in list).
        let firstUnlocked = sequence[0].id;
        for (let i = 1; i < sequence.length; i++) {
            const prevId = sequence[i - 1].id;
            if (completed.has(prevId)) {
                firstUnlocked = sequence[i].id;
            }
            else {
                break;
            }
        }
        return res.json({ videoId: firstUnlocked });
    }
    catch (err) {
        return next(err);
    }
});
