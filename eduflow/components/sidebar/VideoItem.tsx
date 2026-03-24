"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import type { SubjectVideo } from "@/types";

interface Props {
  video: SubjectVideo;
  subjectId: string;
  isActive?: boolean;
}

export const VideoItem: React.FC<Props> = ({ video, subjectId, isActive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatDuration = (secs?: number) => {
    if (!secs) return "";
    if (secs >= 3600) {
      return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
    }
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const content = (
    <div
      role={video.locked ? "button" : undefined}
      tabIndex={video.locked ? 0 : undefined}
      aria-label={video.locked ? `${video.title} locked` : undefined}
      style={{
        position: "relative",
        display: "flex", alignItems: "center", gap: 10,
        padding: "7px 10px",
        borderRadius: 8,
        borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
        background: isActive
          ? "rgba(232,184,75,0.08)"
          : video.locked
          ? "transparent"
          : "transparent",
        cursor: video.locked ? "not-allowed" : "pointer",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        if (!video.locked && !isActive)
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        if (video.locked) setShowTooltip(true);
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.background = "transparent";
        setShowTooltip(false);
      }}
      onKeyDown={(e) => {
        if (!video.locked) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowTooltip((state) => !state);
        }
      }}
    >
      {/* Status icon */}
      <div style={{
        width: 18, height: 18, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {video.locked ? (
          <Lock size={11} color="var(--rose)" />
        ) : video.isCompleted ? (
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: "var(--jade)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check size={9} color="#000" strokeWidth={3} />
          </div>
        ) : (
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: isActive ? "var(--gold)" : "var(--ink-4)",
            border: isActive ? "none" : "1px solid var(--text-3)",
          }} />
        )}
      </div>

      {/* Title */}
      <span style={{
        flex: 1, fontSize: 13, lineHeight: 1.4,
        color: video.locked
          ? "rgba(255,107,107,0.6)"
          : video.isCompleted
          ? "var(--text-3)"
          : isActive
          ? "var(--gold)"
          : "var(--text-2)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textDecoration: video.isCompleted ? "line-through" : "none",
        fontFamily: "var(--font-ui)",
      }}>
        {video.title}
      </span>

      {/* Duration */}
      <span style={{
        fontSize: 11, color: "var(--text-3)",
        fontFamily: "var(--font-mono)", whiteSpace: "nowrap", flexShrink: 0,
      }}>
        {formatDuration(video.durationSeconds)}
      </span>

      {/* Tooltip for locked */}
      {showTooltip && video.locked && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "var(--ink-3)", border: "1px solid var(--ink-4)",
          borderRadius: 8, padding: "6px 10px",
          fontSize: 11, color: "var(--text-2)", whiteSpace: "nowrap",
          zIndex: 100, pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          Complete previous lesson first
        </div>
      )}
    </div>
  );

  if (video.locked) return content;

  return (
    <Link
      href={`/subjects/${subjectId}/video/${video.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      {content}
    </Link>
  );
};