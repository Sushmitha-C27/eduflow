"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByOrderIndex = sortByOrderIndex;
exports.getGlobalVideoSequence = getGlobalVideoSequence;
exports.getPrevNextVideos = getPrevNextVideos;
exports.isVideoLocked = isVideoLocked;
const db_1 = require("../config/db");
function sortByOrderIndex(items) {
    return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
}
async function getGlobalVideoSequence(subjectId) {
    const videos = await db_1.prisma.video.findMany({
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
    }));
}
async function getPrevNextVideos(videoId, subjectId) {
    const sequence = await getGlobalVideoSequence(subjectId);
    const idx = sequence.findIndex((v) => v.id === videoId);
    if (idx < 0) {
        return { previousVideoId: null, nextVideoId: null };
    }
    return {
        previousVideoId: idx > 0 ? sequence[idx - 1].id : null,
        nextVideoId: idx < sequence.length - 1 ? sequence[idx + 1].id : null,
    };
}
async function isVideoLocked(videoId, userId, subjectId) {
    const sequence = await getGlobalVideoSequence(subjectId);
    const idx = sequence.findIndex((v) => v.id === videoId);
    if (idx <= 0)
        return false;
    const prevId = sequence[idx - 1].id;
    const progress = await db_1.prisma.videoProgress.findUnique({
        where: { userId_videoId: { userId, videoId: prevId } },
        select: { isCompleted: true },
    });
    return !progress?.isCompleted;
}
