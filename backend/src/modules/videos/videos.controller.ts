import { Router } from "express";
import { prisma } from "../../config/db";
import { requireAuth, type AuthedRequest } from "../../middleware/authMiddleware";
import { HttpError } from "../../utils/httpError";
import { getGlobalVideoSequence, getPrevNextVideos } from "../../utils/ordering";

export const videosRouter = Router();

// GET /api/videos/:videoId (auth)
videosRouter.get("/:videoId", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");
    const videoId = Number(req.params.videoId);
    if (!Number.isFinite(videoId)) throw new HttpError(400, "Invalid videoId");

    const video = await prisma.video.findUnique({
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
      throw new HttpError(404, "Video not found");
    }

    const subjectId = video.section.subject.id;

    const { previousVideoId, nextVideoId } = await getPrevNextVideos(videoId, subjectId);

    // Compute locked (needs prev completion)
    const sequence = await getGlobalVideoSequence(subjectId);
    const idx = sequence.findIndex((v) => v.id === videoId);
    let locked = false;
    let unlockReason: string | undefined;

    if (idx > 0) {
      const prev = sequence[idx - 1]!;
      const prevProgress = await prisma.videoProgress.findUnique({
        where: { userId_videoId: { userId: req.user.id, videoId: prev.id } },
        select: { isCompleted: true },
      });
      locked = !prevProgress?.isCompleted;
      if (locked) {
        unlockReason = `Complete '${prev.title}' first`;
      }
    }

    const progress = await prisma.videoProgress.findUnique({
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
  } catch (err) {
    return next(err);
  }
});

