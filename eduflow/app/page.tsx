"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { subjects } from "@/types";
import { useAuthStore } from "@/store/authStore";

const CATEGORY_COLORS: Record<string, string> = {
  Development: "#7C3AED",
  "Data Science": "#06B6D4",
  Design: "#F59E0B",
  Infrastructure: "#10B981",
  Business: "#F43F5E",
};

const FILTERS = ["All", "Development", "Data Science", "Design", "Infrastructure"];

function SubjectCard({ subject, index }: { subject: typeof subjects[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const accentColor = CATEGORY_COLORS[subject.category ?? "Development"] ?? "#7C3AED";
  const completion = typeof subject.percentComplete === "number" && !isNaN(subject.percentComplete)
    ? Math.round(subject.percentComplete) : 0;
  const hasProgress = completion > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/subjects/${subject.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div className="subject-card-elite">
          {/* Accent strip */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: "12px 12px 0 0",
            marginBottom: 20,
          }} />

          {/* Category + difficulty */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{
              fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em",
              color: accentColor, fontFamily: "var(--font-mono)",
            }}>
              {subject.category}
            </span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 999,
              background: "var(--ink-3)", color: "var(--text-3)",
              border: "1px solid var(--ink-4)",
            }}>
              {subject.level}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
            color: "var(--text-1)", margin: "0 0 10px", lineHeight: 1.3,
          }}>
            {subject.title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
            margin: "0 0 16px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {subject.subtitle ?? subject.description}
          </p>

          {/* Meta row */}
          <div style={{
            display: "flex", gap: 12, fontSize: 12,
            color: "var(--text-3)", marginBottom: 16,
            fontFamily: "var(--font-mono)",
          }}>
            <span>{subject.lessonCount ?? subject.totalVideos ?? 0} lessons</span>
            <span>·</span>
            <span>{subject.durationLabel ?? "—"}</span>
          </div>

          {/* Progress bar */}
          {hasProgress && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "var(--text-3)", marginBottom: 6,
              }}>
                <span>Progress</span>
                <span style={{ color: "var(--jade)" }}>{completion}%</span>
              </div>
              <div style={{ height: 3, background: "var(--ink-4)", borderRadius: 999 }}>
                <div style={{
                  height: "100%", width: `${completion}%`,
                  background: "var(--jade)", borderRadius: 999,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          )}

          {/* CTA button */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: "auto", paddingTop: 4,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: hasProgress ? "var(--jade)" : "var(--gold)",
              fontFamily: "var(--font-ui)",
            }}>
              {hasProgress ? "Continue →" : "Start Learning →"}
            </span>
            <span style={{
              fontSize: 11, color: "var(--text-3)",
              fontFamily: "var(--font-mono)",
            }}>
              {subject.completedVideos ?? 0}/{subject.totalVideos ?? 0} done
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { isAuthenticated } = useAuthStore();

  const filtered = activeFilter === "All"
    ? subjects
    : subjects.filter((s) => s.category === activeFilter);

  return (
    <main style={{ minHeight: "100vh", background: "var(--ink)" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        padding: "80px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="shell" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}>
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--gold-dim)", border: "1px solid rgba(232,184,75,0.25)",
                borderRadius: 999, padding: "4px 14px", marginBottom: 28,
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--gold)", display: "inline-block",
              }} />
              <span style={{
                fontSize: 11, letterSpacing: "0.18em",
                color: "var(--gold)", fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
              }}>
                Learning Reimagined
              </span>
            </motion.div>

            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-display)", margin: 0,
                  lineHeight: 1.1,
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "var(--text-1)" }}>
                  Learn without
                </span>
                <span style={{
                  display: "block", fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700, fontStyle: "italic",
                  background: "linear-gradient(135deg, var(--gold), #f5d78e)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  the noise.
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontSize: 16, color: "var(--text-2)", lineHeight: 1.7,
                maxWidth: 440, margin: "20px 0 36px",
              }}
            >
              EduFlow turns every subject into a cinematic learning experience.
              Structured tracks, studio-grade lessons, and real progress tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", gap: 12 }}
            >
              <Link href="/subjects" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--gold)", color: "var(--ink)",
                padding: "12px 24px", borderRadius: 10,
                fontFamily: "var(--font-ui)", fontWeight: 600,
                fontSize: 14, textDecoration: "none",
                transition: "box-shadow 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(232,184,75,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                Browse Subjects →
              </Link>
              {!isAuthenticated && (
                <Link href="/auth/login" style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "12px 24px", borderRadius: 10,
                  border: "1px solid var(--ink-4)", color: "var(--text-2)",
                  fontFamily: "var(--font-ui)", fontSize: 14,
                  textDecoration: "none", transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--ink-4)"; e.currentTarget.style.color = "var(--text-2)"; }}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </div>

          {/* Right: Floating cards stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position: "relative", height: 320,
              perspective: "800px",
            }}
          >
            {subjects.slice(0, 3).map((s, i) => (
              <div key={s.id} style={{
                position: "absolute",
                width: "85%",
                left: `${i * 12}px`,
                top: `${i * 18}px`,
                background: "var(--ink-2)",
                border: "1px solid var(--ink-4)",
                borderRadius: 16,
                padding: "16px 20px",
                transform: `rotateY(${-8 + i * 4}deg) rotateX(${4 - i * 2}deg) scale(${1 - i * 0.05})`,
                transformOrigin: "left center",
                zIndex: 3 - i,
                opacity: 1 - i * 0.2,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}>
                <div style={{
                  height: 2, width: 40,
                  background: CATEGORY_COLORS[s.category ?? ""] ?? "var(--gold)",
                  borderRadius: 999, marginBottom: 12,
                }} />
                <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {s.category}
                </div>
                <div style={{ fontSize: 15, fontFamily: "var(--font-display)", color: "var(--text-1)", fontWeight: 600 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8, fontFamily: "var(--font-mono)" }}>
                  {s.lessonCount} lessons · {s.durationLabel}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          borderTop: "1px solid var(--ink-4)",
          borderBottom: "1px solid var(--ink-4)",
          padding: "18px 0",
        }}
      >
        <div className="shell" style={{
          display: "flex", justifyContent: "center",
          gap: "clamp(24px, 6vw, 80px)", flexWrap: "wrap",
        }}>
          {[
            ["5", "Subjects"],
            ["18+", "Lessons"],
            ["4.9★", "Rating"],
            ["Free", "to Start"],
          ].map(([value, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 18, fontFamily: "var(--font-mono)",
                color: "var(--gold)", fontWeight: 500,
              }}>
                {value}
              </div>
              <div style={{
                fontSize: 11, color: "var(--text-3)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── SUBJECTS GRID ────────────────────────────────────────── */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="shell">
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 28,
            flexWrap: "wrap", gap: 16,
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: 24,
              fontWeight: 600, margin: 0, color: "var(--text-1)",
            }}>
              All Subjects
              <span style={{
                fontSize: 14, color: "var(--text-3)", fontWeight: 400,
                fontFamily: "var(--font-ui)", marginLeft: 10,
              }}>
                ({filtered.length})
              </span>
            </h2>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "6px 14px", borderRadius: 999, fontSize: 12,
                    fontFamily: "var(--font-ui)", cursor: "pointer",
                    border: activeFilter === f ? "1px solid var(--gold)" : "1px solid var(--ink-4)",
                    background: activeFilter === f ? "var(--gold-dim)" : "var(--ink-2)",
                    color: activeFilter === f ? "var(--gold)" : "var(--text-3)",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}>
            {filtered.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} index={i} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .subject-card-elite {
          background: var(--ink-2);
          border: 1px solid var(--ink-4);
          border-radius: 20px;
          padding: 0 20px 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .subject-card-elite:hover {
          transform: translateY(-4px);
          border-color: rgba(232,184,75,0.35);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,184,75,0.1);
        }
      `}</style>
    </main>
  );
}