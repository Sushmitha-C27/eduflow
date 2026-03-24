"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import type { Subject, SubjectSection, SubjectVideo } from "@/types";
import { ProgressBar } from "./ProgressBar";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "../ui/Skeleton";
import { useToast } from "../ui/ToastProvider";

interface Props {
  subject: Subject;
  section?: SubjectSection;
  video: SubjectVideo;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instructor mock data per subject
const INSTRUCTORS: Record<string, { name: string; initials: string; title: string }> = {
  "javascript-mastery": { name: "Kyle Simpson", initials: "KS", title: "JavaScript Expert" },
  "python-for-ai": { name: "Mosh Hamedani", initials: "MH", title: "Python & AI Engineer" },
  "uiux-design-systems": { name: "Ava Martinez", initials: "AM", title: "Senior UX Designer" },
  "react-nextjs": { name: "Lee Robinson", initials: "LR", title: "Next.js Core Team" },
  "cloud-devops": { name: "Nana Janashia", initials: "NJ", title: "DevOps Engineer" },
};

// Tags per subject
const TAGS: Record<string, string[]> = {
  "javascript-mastery": ["ES6+", "DOM", "Async", "Promises", "Modules"],
  "python-for-ai": ["Python", "NumPy", "Pandas", "ML", "AI"],
  "uiux-design-systems": ["Figma", "UX", "Design Tokens", "Components"],
  "react-nextjs": ["React 18", "Next.js 14", "TypeScript", "RSC"],
  "cloud-devops": ["Docker", "AWS", "CI/CD", "GitHub Actions"],
};

export const VideoMeta: React.FC<Props> = ({ subject, section, video }) => {
  const { accessToken } = useAuthStore();
  const [completed, setCompleted] = useState(video.isCompleted);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(video.isCompleted ? 100 : 0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const instructor = INSTRUCTORS[subject.id] ?? { name: "EduFlow Instructor", initials: "EF", title: "Expert Educator" };
  const tags = TAGS[subject.id] ?? [];

  // Load progress from backend on mount
  useEffect(() => {
    const skeletonTimer = window.setTimeout(() => setLoading(false), 650);

    if (!API_BASE || !accessToken) return;
    fetch(`${API_BASE}/api/progress/videos/${video.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isCompleted) {
          setCompleted(true);
          setProgress(100);
        }
      })
      .catch(() => {}); // silently fail if offline
    return () => window.clearTimeout(skeletonTimer);
  }, [video.id, accessToken]);

  const saveProgress = async (isCompleted: boolean) => {
    if (!API_BASE || !accessToken) return;
    try {
      await fetch(`${API_BASE}/api/progress/videos/${video.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lastPositionSeconds: 0,
          isCompleted,
        }),
      });
    } catch {
      // silently fail if backend offline
    }
  };

  const handleMarkComplete = async () => {
    setCompleted(true);
    setProgress(100);
    await saveProgress(true);
    showToast({ message: "Lesson completed! ✓", type: "success" });
  };

  const handleMarkIncomplete = async () => {
    setCompleted(false);
    setProgress(0);
    await saveProgress(false);
  };

  const handleSavePlaylist = () => {
    setSaved(true);
    showToast({ message: "Progress saved", type: "info", durationMs: 2000 });
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return "";
    if (secs >= 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const description = `This lesson is part of ${subject.title}, a curated series on ${subject.description?.toLowerCase() ?? "building modern skills"}. You'll gain hands-on experience with real-world examples and practical exercises designed to accelerate your learning. Each lesson builds on the previous, ensuring a solid foundation before moving forward.`;

  const shortDesc = description.slice(0, 120) + "...";

  return (
    <aside
      className="glass-panel"
      style={{
        borderRadius: 24, padding: 22,
        display: "flex", flexDirection: "column",
        gap: 18, position: "relative",
      }}
    >
      {loading ? (
        <>
          <Skeleton style={{ width: "42%", height: 22 }} />
          <Skeleton style={{ width: "88%", height: 28 }} />
          <Skeleton style={{ width: "100%", height: 14 }} />
          <Skeleton style={{ width: "100%", height: 14 }} />
          <Skeleton style={{ width: "60%", height: 14 }} />
          <Skeleton style={{ width: "100%", height: 8, borderRadius: 999 }} />
        </>
      ) : (
        <>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="pill pill-muted">
          {section?.label ?? "Lesson"}
          {video.durationSeconds ? ` · ${formatDuration(video.durationSeconds)}` : ""}
        </span>
        <h3 style={{
          margin: 0, fontFamily: "var(--font-display)",
          fontSize: 22, fontWeight: 700, color: "var(--text-1)",
          lineHeight: 1.3,
        }}>
          {video.title}
        </h3>
      </div>

      {/* Instructor */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "var(--gold-dim)", border: "1px solid rgba(232,184,75,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600, color: "var(--gold)",
          fontFamily: "var(--font-ui)", flexShrink: 0,
        }}>
          {instructor.initials}
        </div>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>
            {instructor.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>
            {instructor.title}
          </div>
        </div>
      </div>

      {/* Description with Show more */}
      <div>
        <p style={{
          fontSize: 13, color: "var(--text-2)",
          lineHeight: 1.7, margin: "0 0 6px",
        }}>
          {expanded ? description : shortDesc}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none",
            color: "var(--gold)", fontSize: 12,
            cursor: "pointer", padding: 0,
            fontFamily: "var(--font-ui)",
          }}
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              padding: "3px 10px", borderRadius: 999,
              background: "var(--gold-dim)",
              border: "1px solid rgba(232,184,75,0.2)",
              fontSize: 11, color: "var(--gold)",
              fontFamily: "var(--font-mono)",
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 12, color: "var(--text-3)",
        }}>
          <span>Lesson progress</span>
          <span style={{ color: completed ? "var(--jade)" : "var(--text-3)" }}>
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} color={completed ? "jade" : "gold"} />
      </div>

      {/* Completion badge */}
      {completed && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(78,205,196,0.08)",
          border: "1px solid rgba(78,205,196,0.2)",
          borderRadius: 10, padding: "8px 12px",
          fontSize: 13, color: "var(--jade)",
        }}>
          <span>✓</span>
          <span>Lesson completed</span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: 4, display: "flex", gap: 10 }}>
        {!completed ? (
          <Button size="sm" onClick={handleMarkComplete}>
            Mark as complete
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={handleMarkIncomplete}>
            Mark incomplete
          </Button>
        )}
        <Button
          size="sm" variant="ghost"
          onClick={handleSavePlaylist}
          style={{ color: saved ? "var(--gold)" : undefined }}
        >
          {saved ? "♥ Saved" : "Save to playlist"}
        </Button>
      </div>

        </>
      )}
    </aside>
  );
};