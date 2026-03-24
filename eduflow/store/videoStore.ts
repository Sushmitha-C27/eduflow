import { create } from "zustand";

interface VideoStoreState {
  currentVideoId: string | null;
  subjectId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isCompleted: boolean;
  nextVideoId: string | null;
  prevVideoId: string | null;
  setVideo: (args: {
    videoId: string;
    subjectId: string;
    duration?: number;
    nextVideoId?: string | null;
    prevVideoId?: string | null;
  }) => void;
  setProgress: (args: { currentTime: number; duration?: number }) => void;
  markCompleted: () => void;
  reset: () => void;
}

export const useVideoStore = create<VideoStoreState>((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,

  setVideo({ videoId, subjectId, duration, nextVideoId, prevVideoId }) {
    set({
      currentVideoId: videoId,
      subjectId,
      duration: duration ?? 0,
      currentTime: 0,
      isPlaying: true,
      isCompleted: false,
      nextVideoId: nextVideoId ?? null,
      prevVideoId: prevVideoId ?? null,
    });
  },

  setProgress({ currentTime, duration }) {
    set((state) => ({
      currentTime,
      duration: duration ?? state.duration,
    }));
  },

  markCompleted() {
    set({ isCompleted: true });
  },

  reset() {
    set({
      currentVideoId: null,
      subjectId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
    });
  },
}));

