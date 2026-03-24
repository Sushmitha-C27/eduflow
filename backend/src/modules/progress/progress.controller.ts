import { Router } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../config/db";
import { requireAuth, type AuthedRequest } from "../../middleware/authMiddleware";
import { HttpError } from "../../utils/httpError";

export const progressRouter = Router();

function requireValid(req: any) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new HttpError(400, result.array()[0]?.msg ?? "Invalid request");
  }
}

// GET /api/progress/subjects/:subjectId (auth)
progressRouter.get(
  "/subjects/:subjectId",
  requireAuth,
  async (req: AuthedRequest, res, next) => {
    try {
      if (!req.user) throw new HttpError(401, "Unauthorized");
      const subjectId = Number(req.params.subjectId);
      if (!Number.isFinite(subjectId)) throw new HttpError(400, "Invalid subjectId");

      const totalVideos = await prisma.video.count({
        where: { section: { subjectId } },
      });

      const completedVideos = await prisma.videoProgress.count({
        where: {
          userId: req.user.id,
          isCompleted: true,
          video: { section: { subjectId } },
        },
      });

      const last = await prisma.videoProgress.findFirst({
        where: { userId: req.user.id, video: { section: { subjectId } } },
        orderBy: { updatedAt: "desc" },
        select: { videoId: true, lastPositionSeconds: true },
      });

      const percentComplete =
        totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);

      return res.json({
        totalVideos,
        completedVideos,
        percentComplete,
        lastVideoId: last?.videoId ?? undefined,
        lastPositionSeconds: last?.lastPositionSeconds ?? undefined,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// GET /api/progress/videos/:videoId (auth)
progressRouter.get(
  "/videos/:videoId",
  requireAuth,
  async (req: AuthedRequest, res, next) => {
    try {
      if (!req.user) throw new HttpError(401, "Unauthorized");
      const videoId = Number(req.params.videoId);
      if (!Number.isFinite(videoId)) throw new HttpError(400, "Invalid videoId");

      const progress = await prisma.videoProgress.findUnique({
        where: { userId_videoId: { userId: req.user.id, videoId } },
        select: { lastPositionSeconds: true, isCompleted: true },
      });

      return res.json(
        progress ?? { lastPositionSeconds: 0, isCompleted: false }
      );
    } catch (err) {
      return next(err);
    }
  }
);

// POST /api/progress/videos/:videoId (auth)
progressRouter.post(
  "/videos/:videoId",
  requireAuth,
  body("lastPositionSeconds").isFloat({ min: 0 }),
  body("isCompleted").optional().isBoolean(),
  async (req: AuthedRequest, res, next) => {
    try {
      if (!req.user) throw new HttpError(401, "Unauthorized");
      const videoId = Number(req.params.videoId);
      if (!Number.isFinite(videoId)) throw new HttpError(400, "Invalid videoId");

      requireValid(req);

      const lastPositionSeconds = Math.floor(Number(req.body.lastPositionSeconds));
      const isCompleted = req.body.isCompleted === true;

      const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: { durationSeconds: true },
      });
      if (!video) throw new HttpError(404, "Video not found");

      const capped =
        typeof video.durationSeconds === "number" && video.durationSeconds >= 0
          ? Math.min(lastPositionSeconds, video.durationSeconds)
          : lastPositionSeconds;

      const progress = await prisma.videoProgress.upsert({
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
    } catch (err) {
      return next(err);
    }
  }
);

