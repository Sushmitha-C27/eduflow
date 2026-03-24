import * as React from "react";
import Link from "next/link";
import type { Subject } from "@/types";
import { CompletionBadge } from "../common/CompletionBadge";

interface SubjectCardProps {
  subject: Subject & { subtitle?: string };
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  // Fix NaN — use percentComplete, fallback to 0
  const completion =
    typeof subject.percentComplete === "number" && !isNaN(subject.percentComplete)
      ? Math.round(subject.percentComplete)
      : 0;

  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="fade-border"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 18,
        borderRadius: 20,
        background:
          "radial-gradient(circle at top, rgba(232,184,75,0.13), transparent 60%), var(--ink-2)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="pill pill-muted">{subject.category}</span>
          <h3 style={{ margin: 0, fontSize: 18 }}>{subject.title}</h3>
        </div>
        <CompletionBadge completion={completion} />
      </div>
      <p style={{ fontSize: 14 }} className="text-muted">
        {subject.subtitle ?? subject.description}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 6,
          fontSize: 12,
          color: "var(--text-3)",
        }}
      >
        <span>
          {subject.level ?? "All levels"}
          {subject.durationLabel ? ` · ${subject.durationLabel}` : ""}
        </span>
        <span>{subject.lessonCount ?? subject.totalVideos ?? 0} lessons</span>
      </div>
    </Link>
  );
};