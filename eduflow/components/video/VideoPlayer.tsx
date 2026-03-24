"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { Lock, Play, Pause, RotateCcw, RotateCw, Maximize, Volume2, VolumeX } from "lucide-react";
import type { SubjectVideo } from "@/types";
import Link from "next/link";
import { useToast } from "../ui/ToastProvider";

interface Props {
  video: SubjectVideo;
  locked?: boolean;
  onCompleted?: () => void;
  nextVideo?: SubjectVideo | null;
  subjectId?: string;
}

interface YouTubePlayerLike {
  getCurrentTime: () => Promise<number>;
  getDuration: () => number;
  getPlayerState: () => Promise<number>;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
}

export const VideoPlayer: React.FC<Props> = ({
  video, locked, onCompleted, nextVideo, subjectId
}) => {
  const playerRef = useRef<YouTubePlayerLike | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastProgressToastAt = useRef(0);
  const { showToast } = useToast();

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2500);
  };

  // Progress interval (UI update every 500ms)
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(async () => {
      if (playerRef.current) {
        const t = await playerRef.current.getCurrentTime();
        setCurrentTime(t);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [playing]);

  // Progress tracking to backend every 5s
  useEffect(() => {
    const isMockVideo = isNaN(Number(video.id));
    if (isMockVideo) return; // skip for mock string IDs
    if (!playing) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("eduflow-auth") || "{}")?.state?.accessToken
      : null;

    const interval = setInterval(async () => {
      if (!playerRef.current || !API_BASE || !accessToken) return;
      try {
        const t = await playerRef.current.getCurrentTime();
        await fetch(`${API_BASE}/api/progress/videos/${video.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ lastPositionSeconds: Math.floor(t) }),
        });
        if (Date.now() - lastProgressToastAt.current > 15000) {
          lastProgressToastAt.current = Date.now();
          showToast({ message: "Progress saved", type: "info", durationMs: 2000 });
        }
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, [playing, video.id, showToast]);

  // Resume from last position on mount
  useEffect(() => {
    const isMockVideo = isNaN(Number(video.id));
    if (isMockVideo) return; // skip for mock string IDs

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("eduflow-auth") || "{}")?.state?.accessToken
      : null;

    if (!API_BASE || !accessToken) return;

    fetch(`${API_BASE}/api/progress/videos/${video.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.lastPositionSeconds > 5 && playerRef.current) {
          playerRef.current.seekTo(data.lastPositionSeconds, true);
          setCurrentTime(data.lastPositionSeconds);
        }
      })
      .catch(() => {});
  }, [video.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = async (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (!playerRef.current) return;
      if (e.code === "Space") {
        e.preventDefault();
        const state = await playerRef.current.getPlayerState();
        if (state === 1) { playerRef.current.pauseVideo(); setPlaying(false); }
        else { playerRef.current.playVideo(); setPlaying(true); }
      }
      if (e.code === "ArrowLeft") {
        const t = await playerRef.current.getCurrentTime();
        playerRef.current.seekTo(Math.max(0, t - 10), true);
      }
      if (e.code === "ArrowRight") {
        const t = await playerRef.current.getCurrentTime();
        playerRef.current.seekTo(t + 10, true);
      }
      if (e.code === "KeyF") {
        if (document.fullscreenElement) document.exitFullscreen();
        else containerRef.current?.requestFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const seek = async (secs: number) => {
    if (!playerRef.current) return;
    const t = await playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, t + secs), true);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) { playerRef.current.pauseVideo(); setPlaying(false); }
    else { playerRef.current.playVideo(); setPlaying(true); }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); }
    else { playerRef.current.mute(); setMuted(true); }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    playerRef.current?.setVolume(val);
    setMuted(val === 0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    playerRef.current?.seekTo(t, true);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      style={{
        position: "relative", borderRadius: 20,
        overflow: "hidden", aspectRatio: "16/9",
        background: "#000", cursor: showControls ? "default" : "none",
      }}
    >
      {/* YouTube iframe */}
      <YouTube
        videoId={video.youtubeId}
        opts={{
          width: "100%", height: "100%",
          playerVars: { autoplay: 0, rel: 0, modestbranding: 1, controls: 0 },
        }}
        style={{ width: "100%", height: "100%", pointerEvents: locked ? "none" : "auto" }}
        onReady={(e: { target: YouTubePlayerLike }) => {
          playerRef.current = e.target;
          const d = e.target.getDuration();
          setDuration(d);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => {
          setPlaying(false);
          setShowCompletion(true);
          onCompleted?.();
        }}
      />

      {/* LOCKED OVERLAY */}
      {locked && (
        <div style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(12px)",
          background: "rgba(0,0,0,0.7)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 16, zIndex: 10,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,107,107,0.15)",
            border: "1px solid rgba(255,107,107,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={28} color="var(--rose)" />
          </div>
          <div style={{ textAlign: "center", maxWidth: 280 }}>
            <div style={{
              fontSize: 16, fontWeight: 600,
              color: "var(--text-1)", marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}>
              Lesson Locked
            </div>
            <div style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.5 }}>
              Complete the previous lesson to unlock this one
            </div>
          </div>
          {subjectId && (
            <Link href={`/subjects/${subjectId}`} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--gold)", color: "var(--ink)",
              padding: "8px 20px", borderRadius: 999,
              fontFamily: "var(--font-ui)", fontWeight: 600,
              fontSize: 13, textDecoration: "none",
            }}>
              ← Go to Previous
            </Link>
          )}
        </div>
      )}

      {/* COMPLETION OVERLAY */}
      {showCompletion && !locked && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 20, zIndex: 10,
          animation: "fadeIn 0.4s ease",
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--jade)" strokeWidth="3" opacity="0.3" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--jade)" strokeWidth="3"
              strokeDasharray="226" strokeDashoffset="0"
              style={{ animation: "drawCircle 0.6s ease forwards" }}
            />
            <polyline points="24,42 36,54 58,30" fill="none" stroke="var(--jade)" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="50" strokeDashoffset="0"
              style={{ animation: "drawCheck 0.4s 0.5s ease forwards" }}
            />
          </svg>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 22, fontFamily: "var(--font-display)",
              fontWeight: 700, color: "var(--text-1)", marginBottom: 6,
            }}>
              Lesson Complete!
            </div>
            <div style={{ fontSize: 14, color: "var(--text-3)" }}>
              {nextVideo ? "Ready for the next one?" : "You've completed this subject! 🎉"}
            </div>
          </div>
          {nextVideo && subjectId && (
            <Link href={`/subjects/${subjectId}/video/${nextVideo.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--gold)", color: "var(--ink)",
              padding: "12px 28px", borderRadius: 12,
              fontFamily: "var(--font-ui)", fontWeight: 700,
              fontSize: 15, textDecoration: "none",
              boxShadow: "0 0 24px rgba(232,184,75,0.4)",
            }}>
              Next Lesson →
            </Link>
          )}
          <button onClick={() => setShowCompletion(false)} style={{
            background: "transparent", border: "none",
            color: "var(--text-3)", fontSize: 12, cursor: "pointer",
          }}>
            Replay lesson
          </button>
        </div>
      )}

      {/* CUSTOM CONTROLS */}
      {!locked && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          padding: "32px 16px 12px",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 5,
        }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="range" min={0} max={duration || 100}
              value={currentTime} step={0.5}
              onChange={handleScrub}
              style={{
                width: "100%", height: 4, appearance: "none",
                background: `linear-gradient(to right, var(--gold) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                borderRadius: 999, cursor: "pointer", outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button aria-label={playing ? "Pause video" : "Play video"} onClick={togglePlay} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, display: "flex" }}>
              <span className="visually-hidden">{playing ? "Pause video" : "Play video"}</span>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button aria-label="Seek backward 10 seconds" onClick={() => seek(-10)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 4, display: "flex" }}>
              <RotateCcw size={15} />
            </button>
            <button aria-label="Seek forward 10 seconds" onClick={() => seek(10)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 4, display: "flex" }}>
              <RotateCw size={15} />
            </button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-mono)", marginLeft: 4 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div style={{ flex: 1 }} />
            <button aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 4, display: "flex" }}>
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range" min={0} max={100} value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              style={{ width: 70, height: 3, appearance: "none", background: `linear-gradient(to right, rgba(255,255,255,0.8) ${volume}%, rgba(255,255,255,0.2) ${volume}%)`, borderRadius: 999, cursor: "pointer" }}
            />
            <button
              onClick={() => document.fullscreenElement ? document.exitFullscreen() : containerRef.current?.requestFullscreen()}
              aria-label="Toggle fullscreen"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 4, display: "flex" }}
            >
              <Maximize size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes drawCircle {
          from { stroke-dashoffset: 226 }
          to { stroke-dashoffset: 0 }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 50 }
          to { stroke-dashoffset: 0 }
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 12px; height: 12px;
          border-radius: 50%; background: var(--gold); cursor: pointer;
        }
      `}</style>
    </div>
  );
};