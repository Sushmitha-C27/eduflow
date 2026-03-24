"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { subjects } from "@/types";
import { SubjectCard } from "./SubjectCard";
import { Skeleton } from "../ui/Skeleton";

export const SubjectGrid: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  if (subjects.length === 0) {
    return (
      <div className="glass-panel" style={{ marginTop: 12, padding: 24, textAlign: "center" }}>
        <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
          <rect x="8" y="20" width="28" height="20" rx="4" fill="rgba(232,184,75,0.15)" />
          <circle cx="62" cy="30" r="14" fill="rgba(78,205,196,0.12)" />
          <path d="M88 41 L112 15" stroke="rgba(232,184,75,0.35)" strokeWidth="2" />
        </svg>
        <h3 style={{ margin: "12px 0 8px" }}>No subjects enrolled yet</h3>
        <p className="text-muted">Start your first track and build your learning momentum.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 18,
        marginTop: 8,
      }}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`subject-skeleton-${index}`}
              style={{
                border: "1px solid var(--ink-4)",
                borderRadius: 20,
                background: "var(--ink-2)",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 190,
              }}
            >
              <Skeleton style={{ width: "35%", height: 10, borderRadius: 999 }} />
              <Skeleton style={{ width: "70%", height: 20 }} />
              <Skeleton style={{ width: "100%", height: 12 }} />
              <Skeleton style={{ width: "85%", height: 12 }} />
              <Skeleton style={{ marginTop: "auto", width: "45%", height: 12, borderRadius: 999 }} />
            </div>
          ))
        : subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
    </div>
  );
};

