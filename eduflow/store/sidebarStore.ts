import { create } from "zustand";
import type { SubjectTree } from "@/types";
import { get } from "@/lib/apiClient";

interface SidebarState {
  tree: SubjectTree | null;
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: string) => Promise<void>;
  markVideoCompleted: (videoId: string) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,

 async fetchTree(subjectId: string) {
  set({ loading: true, error: null });
  try {
    const tree = (await get(`/subjects/${subjectId}/tree`)) as SubjectTree;
    set({ tree, loading: false });
  } catch (error) {
    set({
      loading: false,
      error: "Unable to load subject structure",
    });
  }
}

  markVideoCompleted(videoId: string) {
    const { tree } = get();
    if (!tree) return;

    const updatedTree: SubjectTree = {
      ...tree,
      sections: tree.sections.map((section) => ({
        ...section,
        videos: section.videos.map((video) =>
          video.id === videoId
            ? { ...video, isCompleted: true }
            : video
        ),
      })),
    };

    set({ tree: updatedTree });
  },
}));

