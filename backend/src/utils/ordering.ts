import { prisma } from "../config/db";

export function sortByOrderIndex<T extends { orderIndex: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
}

export interface GlobalVideoSequenceItem {
  id: number;
  title: string;
  youtubeUrl: string;
  durationSeconds: number | null;
  sectionId: number;
  sectionTitle: string;
  sectionOrderIndex: number;
  orderIndex: number;
}

export async function getGlobalVideoSequence(subjectId: number) {
  const videos = await prisma.video.findMany({
    where: { section: { subjectId } },
    orderBy: [{ section: { orderIndex: "asc" } }, { orderIndex: "asc" }],
    select: {
      id: true,
      title: true,
      youtubeUrl: true,
      durationSeconds: true,
      sectionId: true,
      orderIndex: true,
      section: { select: { title: true, orderIndex: true } },
    },
  });

  return videos.map((v) => ({
    id: v.id,
    title: v.title,
    youtubeUrl: v.youtubeUrl,
    durationSeconds: v.durationSeconds ?? null,
    sectionId: v.sectionId,
    sectionTitle: v.section.title,
    sectionOrderIndex: v.section.orderIndex,
    orderIndex: v.orderIndex,
  })) satisfies GlobalVideoSequenceItem[];
}

export async function getPrevNextVideos(videoId: number, subjectId: number) {
  const sequence = await getGlobalVideoSequence(subjectId);
  const idx = sequence.findIndex((v) => v.id === videoId);

  if (idx < 0) {
    return { previousVideoId: null as number | null, nextVideoId: null as number | null };
  }

  return {
    previousVideoId: idx > 0 ? sequence[idx - 1]!.id : null,
    nextVideoId: idx < sequence.length - 1 ? sequence[idx + 1]!.id : null,
  };
}

export async function isVideoLocked(videoId: number, userId: number, subjectId: number) {
  const sequence = await getGlobalVideoSequence(subjectId);
  const idx = sequence.findIndex((v) => v.id === videoId);
  if (idx <= 0) return false;

  const prevId = sequence[idx - 1]!.id;
  const progress = await prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId: prevId } },
    select: { isCompleted: true },
  });

  return !progress?.isCompleted;
}

