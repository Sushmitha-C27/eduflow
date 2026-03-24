"use client";

import React from "react";
import { VideoItem } from "./VideoItem";
import type { SubjectSection } from "@/types";
import { ChevronDown } from "lucide-react";

interface Props {
  section: SubjectSection;
  subjectId: string;
  activeVideoId?: string;
}

export const SectionItem: React.FC<Props> = ({ section, subjectId, activeVideoId }) => {
  const completedCount = section.videos.filter((v) => v.isCompleted).length;

  return (
    <details open style={{ borderRadius: 10 }}>
      <summary style={{
        listStyle: "none", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        gap: 8, cursor: "pointer", padding: "6px 8px",
        borderRadius: 8,
        userSelect: "none",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{
            fontSize: 10, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "var(--text-3)",
            fontFamily: "var(--font-mono)",
          }}>
            {section.label}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
            {section.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 11, color: "var(--text-3)",
            fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
          }}>
            {completedCount}/{section.videos.length} done
          </span>
          <ChevronDown size={12} color="var(--text-3)" />
        </div>
      </summary>

      <div style={{
        marginTop: 6, display: "flex",
        flexDirection: "column", gap: 2, paddingLeft: 4,
      }}>
        {section.videos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            subjectId={subjectId}
            isActive={video.id === activeVideoId}
          />
        ))}
      </div>
    </details>
  );
};