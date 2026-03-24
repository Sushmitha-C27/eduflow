"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoMeta } from "@/components/video/VideoMeta";
import { subjects } from "@/types";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

export default function VideoPage({
  params,
}: {
  params: { subjectId: string; videoId: string };
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const { subjectId, videoId } = params;

  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];
  const allVideos = subject.sections.flatMap((s) => s.videos);
  const currentIndex = allVideos.findIndex((v) => v.id === videoId);
  const section = subject.sections.find((sec) =>
    sec.videos.some((v) => v.id === videoId)
  );
  const video = allVideos[currentIndex] ?? allVideos[0];
  const nextVideo = allVideos[currentIndex + 1] ?? null;
  const remainingVideos = allVideos.slice(currentIndex + 2, currentIndex + 5);

  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowShortcuts(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!completed || !nextVideo) return;
    showToast({ message: "Lesson completed! ✓", type: "success" });
    showToast({ message: `Unlocked: ${nextVideo.title}`, type: "info" });
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c === null || c <= 1) {
          clearInterval(interval);
          router.push(`/subjects/${subjectId}/video/${nextVideo.id}`);
          return null;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [completed, nextVideo, subjectId, router, showToast]);

  if (!video) return null;

  const formatDur = (secs?: number) => {
    if (!secs) return "";
    if (secs >= 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
    return `${Math.floor(secs / 60)}m`;
  };

  return (
    <main style={{ padding: "24px 0 48px" }}>
      <div className="shell">

        {/* TOP: Video Player full width */}
        <div style={{ marginBottom: 24 }}>
          <VideoPlayer
            video={video}
            locked={!!video.locked}
            onCompleted={() => setCompleted(true)}
            nextVideo={nextVideo}
            subjectId={subjectId}
          />
        </div>

        {/* BOTTOM: Two columns */}
        <div className="video-layout-grid" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
          gap: 20,
          alignItems: "start",
        }}>

          {/* Left: Video Meta */}
          <VideoMeta subject={subject} section={section} video={video} />

          {/* Right: Next Up */}
          <aside className="next-up-panel" style={{
            background: "var(--ink-2)",
            border: "1px solid var(--ink-4)",
            borderRadius: 20, padding: 20,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <h4 style={{
              fontFamily: "var(--font-display)",
              fontSize: 16, fontWeight: 600,
              color: "var(--text-1)", margin: 0,
            }}>
              Up Next
            </h4>

            {nextVideo ? (
              <>
                <Link
                  href={`/subjects/${subjectId}/video/${nextVideo.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      borderRadius: 12, overflow: "hidden",
                      border: "1px solid var(--ink-4)",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--ink-4)"}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      position: "relative", aspectRatio: "16/9",
                      background: "var(--ink-3)",
                    }}>
                      {nextVideo.youtubeId && (
                        <img
                          src={`https://img.youtube.com/vi/${nextVideo.youtubeId}/mqdefault.jpg`}
                          alt={nextVideo.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                      {/* Countdown overlay */}
                      {completed && countdown !== null && (
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "rgba(0,0,0,0.75)",
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: 8,
                        }}>
                          <div style={{
                            fontSize: 36, fontWeight: 700,
                            fontFamily: "var(--font-mono)", color: "var(--gold)",
                          }}>
                            {countdown}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                            Autoplaying next lesson
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setCountdown(null);
                              setCompleted(false);
                            }}
                            style={{
                              marginTop: 4, padding: "4px 14px",
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: 999, color: "var(--text-2)",
                              fontSize: 11, cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{
                        fontSize: 13, color: "var(--text-1)",
                        fontWeight: 500, marginBottom: 4, lineHeight: 1.4,
                      }}>
                        {nextVideo.title}
                      </div>
                      <div style={{
                        fontSize: 11, color: "var(--text-3)",
                        fontFamily: "var(--font-mono)",
                      }}>
                        {formatDur(nextVideo.durationSeconds)}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Coming up list */}
                {remainingVideos.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{
                      fontSize: 10, color: "var(--text-3)",
                      textTransform: "uppercase", letterSpacing: "0.14em",
                      fontFamily: "var(--font-mono)",
                    }}>
                      Coming up
                    </div>
                    {remainingVideos.map((v) => (
                      <Link
                        key={v.id}
                        href={`/subjects/${subjectId}/video/${v.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "6px 8px", borderRadius: 8,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--ink-3)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <div style={{
                            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                            background: v.locked
                              ? "var(--rose)"
                              : v.isCompleted ? "var(--jade)" : "var(--ink-4)",
                          }} />
                          <span style={{
                            fontSize: 12, color: "var(--text-2)",
                            flex: 1, overflow: "hidden",
                            textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {v.title}
                          </span>
                          <span style={{
                            fontSize: 11, color: "var(--text-3)",
                            fontFamily: "var(--font-mono)", flexShrink: 0,
                          }}>
                            {formatDur(v.durationSeconds)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: "center", padding: "24px 0",
                color: "var(--text-3)", fontSize: 13,
              }}>
                🎉 Last lesson in this subject!
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      {showShortcuts && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "var(--ink-3)", border: "1px solid var(--ink-4)",
          borderRadius: 12, padding: "12px 16px",
          fontSize: 11, color: "var(--text-3)",
          fontFamily: "var(--font-mono)",
          display: "flex", flexDirection: "column", gap: 5,
          zIndex: 50, pointerEvents: "none",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            color: "var(--text-2)", marginBottom: 2,
            fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            Keyboard Shortcuts
          </div>
          <div><span style={{ color: "var(--gold)" }}>Space</span> — Play / Pause</div>
          <div><span style={{ color: "var(--gold)" }}>← →</span> — Seek 10s</div>
          <div><span style={{ color: "var(--gold)" }}>F</span> — Fullscreen</div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .video-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .next-up-panel {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}