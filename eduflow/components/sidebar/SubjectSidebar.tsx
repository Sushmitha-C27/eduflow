"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SectionItem } from "./SectionItem";
import type { Subject, SubjectSection } from "@/types";
import { ProgressRing } from "../ui/ProgressRing";
import { Skeleton } from "../ui/Skeleton";

interface Props {
  subject: Subject & { subtitle?: string; sections: SubjectSection[] };
}

export const SubjectSidebar: React.FC<Props> = ({ subject }) => {
  const params = useParams();
  const activeVideoId = params?.videoId as string | undefined;

  // Compute progress
  const allVideos = subject.sections.flatMap((s) => s.videos);
  const totalVideos = allVideos.length;
  const completedVideos = allVideos.filter((v) => v.isCompleted).length;
  const percentComplete = totalVideos > 0
    ? Math.round((completedVideos / totalVideos) * 100) : 0;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div style={{
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      height: "100%",
    }}>

      {/* Back link */}
      <Link
        href="/subjects"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "var(--text-3)", textDecoration: "none",
          fontFamily: "var(--font-ui)", letterSpacing: "0.04em",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
      >
        <ArrowLeft size={13} />
        All Subjects
      </Link>

      {/* Subject header + progress ring */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, textTransform: "uppercase",
            letterSpacing: "0.16em", color: "var(--text-3)",
            fontFamily: "var(--font-mono)", marginBottom: 6,
          }}>
            Current Series
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 16,
            fontWeight: 600, color: "var(--text-1)",
            margin: "0 0 4px", lineHeight: 1.3,
          }}>
            {subject.title}
          </h3>
          <p style={{
            fontSize: 12, color: "var(--text-3)",
            margin: 0, lineHeight: 1.5,
          }}>
            {completedVideos} of {totalVideos} lessons complete
          </p>
        </div>

        {/* Progress ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing value={mounted ? percentComplete : 0} size="md" />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontFamily: "var(--font-mono)",
            color: percentComplete > 0 ? "var(--jade)" : "var(--text-3)",
          }}>
            {percentComplete}%
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--ink-4)" }} />

      {/* Section list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`sidebar-skeleton-${idx}`} style={{ display: "grid", gap: 8 }}>
                <Skeleton style={{ width: "38%", height: 10, borderRadius: 999 }} />
                <Skeleton style={{ width: "100%", height: 12 }} />
                <Skeleton style={{ width: "72%", height: 10 }} />
              </div>
            ))}
          </div>
        ) : (
          <nav aria-label="Chapters">
            <ol style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {subject.sections.map((section, i) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SectionItem
                    section={section}
                    subjectId={subject.id}
                    activeVideoId={activeVideoId}
                  />
                </motion.li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
};