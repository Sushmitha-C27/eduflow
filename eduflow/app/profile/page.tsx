"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
import { subjects } from "@/types";
import { useAuthStore } from "@/store/authStore";

type ProfileVideo = {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  durationSeconds: number;
  isCompleted: boolean;
  youtubeId?: string;
  watchedAt: Date;
};

type Achievement = {
  title: string;
  icon: string;
  unlocked: boolean;
};

function getInitials(name?: string) {
  if (!name) return "EF";
  return name.split(" ").filter(Boolean).map((c) => c[0]?.toUpperCase()).join("").slice(0, 2);
}

function formatHours(totalSeconds: number) {
  return `${(totalSeconds / 3600).toFixed(1)}h`;
}

function formatRelativeDay(date: Date) {
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

// ── Edit Profile Modal ──────────────────────────────────────────
function EditProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: { name?: string; email?: string } | null;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // fake save delay
    onSave(name.trim());
    setToast("Profile updated!");
    setSaving(false);
    setTimeout(() => { onClose(); }, 800);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "var(--ink-2)",
          border: "1px solid var(--ink-4)",
          borderRadius: 20, padding: 28,
          width: "100%", maxWidth: 420,
          display: "flex", flexDirection: "column", gap: 20,
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-display)",
            fontSize: 20, fontWeight: 700, fontStyle: "italic",
          }}>
            Edit Profile
          </h3>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "var(--text-3)", cursor: "pointer",
            display: "flex", padding: 4,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Avatar preview */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--gold)", color: "var(--ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700,
            border: "1px solid rgba(232,184,75,0.6)",
          }}>
            {getInitials(name || user?.name)}
          </div>
          <div>
            <div style={{ fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>
              {name || user?.name || "Your Name"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Name field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              background: "var(--ink-3)", border: "1px solid var(--ink-4)",
              borderRadius: 10, padding: "10px 14px",
              color: "var(--text-1)", fontSize: 14,
              outline: "none", fontFamily: "var(--font-ui)",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--gold)"}
            onBlur={e => e.target.style.borderColor = "var(--ink-4)"}
            placeholder="Enter your name"
          />
        </div>

        {/* Email (read-only) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Email (cannot be changed)
          </label>
          <input
            value={user?.email ?? ""}
            disabled
            style={{
              background: "var(--ink-3)", border: "1px solid var(--ink-4)",
              borderRadius: 10, padding: "10px 14px",
              color: "var(--text-3)", fontSize: 14,
              fontFamily: "var(--font-ui)", cursor: "not-allowed",
            }}
          />
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            background: "rgba(78,205,196,0.1)",
            border: "1px solid rgba(78,205,196,0.3)",
            borderRadius: 8, padding: "8px 12px",
            fontSize: 13, color: "var(--jade)",
          }}>
            ✓ {toast}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 8,
            background: "transparent", border: "1px solid var(--ink-4)",
            color: "var(--text-2)", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontSize: 13,
          }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            style={{
              padding: "8px 18px", borderRadius: 8,
              background: "var(--gold)", border: "none",
              color: "var(--ink)", cursor: "pointer",
              fontFamily: "var(--font-ui)", fontWeight: 600,
              fontSize: 13, opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Profile Page ───────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace("/auth/login");
  }, [isAuthenticated, mounted, router]);

  const handleSaveName = (name: string) => {
    if (user) setUser({ ...user, name });
  };

  const profile = useMemo(() => {
    const allSubjectProgress = subjects.map((subject) => {
      const videos = subject.sections.flatMap((s) => s.videos);
      const completed = videos.filter((v) => v.isCompleted).length;
      const total = videos.length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      const latestVideo =
        videos.find((v) => !v.isCompleted && !v.locked) ??
        videos.find((v) => !v.locked) ??
        videos[0];
      return {
        id: subject.id, title: subject.title,
        category: subject.category ?? "General",
        completed, total, percent,
        isComplete: total > 0 && completed === total,
        continueHref: latestVideo
          ? `/subjects/${subject.id}/video/${latestVideo.id}`
          : `/subjects/${subject.id}`,
      };
    });

    const allVideos: ProfileVideo[] = subjects.flatMap((subject) =>
      subject.sections.flatMap((section) =>
        section.videos.map((video, index) => ({
          id: video.id, title: video.title,
          subjectId: subject.id, subjectName: subject.title,
          durationSeconds: video.durationSeconds ?? 0,
          isCompleted: video.isCompleted,
          youtubeId: video.youtubeId,
          watchedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
        }))
      )
    );

    const recent = allVideos
      .filter((v) => v.isCompleted || !v.id.includes("locked"))
      .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())
      .slice(0, 5);

    const completedLessons = allSubjectProgress.reduce((acc, s) => acc + s.completed, 0);
    const totalDuration = allVideos.reduce((acc, v) => acc + v.durationSeconds, 0);
    const streakDays = 6;

    const achievements: Achievement[] = [
      { title: "First Lesson", icon: "🌱", unlocked: completedLessons >= 1 },
      { title: "5 Lessons", icon: "🔥", unlocked: completedLessons >= 5 },
      { title: "10 Lessons", icon: "⚡", unlocked: completedLessons >= 10 },
      { title: "Course Complete", icon: "🏆", unlocked: allSubjectProgress.some((s) => s.isComplete) },
      { title: "7 Day Streak", icon: "📅", unlocked: streakDays >= 7 },
      { title: "Focused Learner", icon: "🧠", unlocked: totalDuration >= 10 * 3600 },
    ];

    return {
      subjects: allSubjectProgress, recent,
      stats: { completedLessons, enrolledSubjects: allSubjectProgress.length, totalDuration, streakDays },
      achievements,
    };
  }, []);

  if (!mounted || !isAuthenticated) return <FullPageLoader />;

  const hasNoProgress = profile.stats.completedLessons === 0;

  return (
    <main className="page-enter">
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveName}
        />
      )}

      <section className="shell profile-shell">
        <div className="profile-container">
          <section className="glass-panel profile-header">
            <div className="profile-main">
              <Avatar initials={getInitials(user?.name)} className="profile-avatar" />
              <div className="profile-headings">
                <h1 className="profile-name">{user?.name ?? "EduFlow Learner"}</h1>
                <p className="profile-email">{user?.email ?? "test@eduflow.com"}</p>
                <p className="profile-member">
                  Member since{" "}
                  {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(undefined, {
                    month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowEditModal(true)}>
              Edit profile
            </Button>
          </section>

          <section className="stats-grid">
            {[
              { label: "Total lessons completed", value: profile.stats.completedLessons, color: "var(--jade)" },
              { label: "Subjects enrolled", value: profile.stats.enrolledSubjects, color: "var(--gold)" },
              { label: "Hours learned", value: formatHours(profile.stats.totalDuration), color: "var(--text-1)" },
              { label: "Current streak", value: `${profile.stats.streakDays} days`, color: "var(--text-1)" },
            ].map((stat) => (
              <article key={stat.label} className="stat-card">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
              </article>
            ))}
          </section>

          {hasNoProgress && (
            <section className="glass-panel profile-section" style={{ textAlign: "center" }}>
              <svg width="130" height="70" viewBox="0 0 130 70" aria-hidden="true">
                <rect x="10" y="18" width="32" height="32" rx="8" fill="rgba(232,184,75,0.14)" />
                <rect x="52" y="26" width="26" height="18" rx="4" fill="rgba(255,255,255,0.08)" />
                <circle cx="99" cy="35" r="14" fill="rgba(78,205,196,0.14)" />
              </svg>
              <h3 style={{ margin: "8px 0" }}>Your journey starts now</h3>
              <p className="text-muted">Complete your first lesson to unlock streaks and achievements.</p>
              <Link href="/subjects" style={{
                display: "inline-flex", marginTop: 12,
                background: "var(--gold)", color: "var(--ink)",
                padding: "10px 24px", borderRadius: 10,
                fontWeight: 600, fontSize: 14,
              }}>
                Browse Subjects →
              </Link>
            </section>
          )}

          <section className="glass-panel profile-section">
            <h2 className="section-title">Your Learning Journey</h2>
            <div className="journey-list">
              {profile.subjects.map((subject, index) => (
                <div key={subject.id} className="journey-item">
                  <div className="journey-header">
                    <div>
                      <h3 className="journey-title">{subject.title}</h3>
                      <span className="journey-category">{subject.category}</span>
                    </div>
                    {subject.isComplete && <span className="complete-badge">✓ Completed</span>}
                  </div>
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.percent}%` }}
                      transition={{ duration: 0.7, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="journey-meta">
                    <p>{subject.completed} of {subject.total} lessons · {subject.percent}% complete</p>
                    <Link href={subject.continueHref} className="journey-cta">Continue Learning →</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel profile-section">
            <h2 className="section-title">Recently Watched</h2>
            <div className="recent-list">
              {profile.recent.map((video) => (
                <article key={video.id} className="recent-item">
                  <div className="thumb-wrap">
                    {video.youtubeId ? (
                      <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title} className="recent-thumb" />
                    ) : (
                      <div className="recent-thumb fallback-thumb" />
                    )}
                  </div>
                  <div className="recent-content">
                    <h3 className="recent-title">{video.title}</h3>
                    <p className="recent-meta">{video.subjectName} · {formatRelativeDay(video.watchedAt)}</p>
                  </div>
                  <Link href={`/subjects/${video.subjectId}/video/${video.id}`} className="resume-btn">
                    Resume
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="glass-panel profile-section">
            <h2 className="section-title">Achievement Badges</h2>
            <div className="badge-row">
              {profile.achievements.map((badge) => (
                <div key={badge.title} className={`achievement-badge ${badge.unlocked ? "unlocked" : "locked"}`}>
                  <div className="achievement-icon">
                    {badge.unlocked ? badge.icon : <Lock size={14} />}
                  </div>
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        .profile-shell { display: flex; justify-content: center; }
        .profile-container { width: 100%; max-width: 48rem; display: flex; flex-direction: column; gap: 1rem; }
        .profile-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .profile-main { display: flex; align-items: center; gap: 1rem; }
        .profile-avatar { width: 84px; height: 84px; border-radius: 999px; background: var(--gold); color: var(--ink); border: 1px solid rgba(232,184,75,0.6); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; box-shadow: 0 12px 28px rgba(0,0,0,0.35); }
        .profile-name { margin: 0; font-family: var(--font-display); font-size: 32px; line-height: 1.1; }
        .profile-email { margin-top: 0.3rem; color: var(--text-2); font-size: 0.95rem; }
        .profile-member { margin-top: 0.45rem; color: var(--text-3); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.6)); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 0.95rem; backdrop-filter: blur(14px); transition: transform 0.2s ease, border-color 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.14); }
        .stat-label { font-size: 0.75rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.45rem; }
        .stat-value { margin: 0; font-size: 1.55rem; font-weight: 700; }
        .profile-section { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .section-title { margin: 0; font-size: 1.5rem; }
        .journey-list { display: flex; flex-direction: column; gap: 1rem; }
        .journey-item { border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1rem; background: rgba(0,0,0,0.28); }
        .journey-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.7rem; gap: 0.75rem; }
        .journey-title { margin: 0; font-size: 1.02rem; }
        .journey-category { margin-top: 0.25rem; display: inline-flex; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold); border: 1px solid rgba(232,184,75,0.25); background: rgba(232,184,75,0.1); border-radius: 999px; padding: 0.2rem 0.55rem; }
        .complete-badge { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--jade); border: 1px solid rgba(78,205,196,0.3); background: rgba(78,205,196,0.1); border-radius: 999px; padding: 0.3rem 0.55rem; white-space: nowrap; }
        .progress-track { height: 10px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--jade), #7de7e0); }
        .journey-meta { margin-top: 0.7rem; display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; color: var(--text-2); font-size: 0.84rem; }
        .journey-cta { color: var(--gold); font-weight: 600; white-space: nowrap; }
        .recent-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .recent-item { display: grid; grid-template-columns: 120px 1fr auto; gap: 0.8rem; align-items: center; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0.55rem; background: rgba(0,0,0,0.26); }
        .thumb-wrap { width: 120px; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .recent-thumb { width: 100%; height: 100%; object-fit: cover; display: block; }
        .fallback-thumb { background: var(--ink-3); }
        .recent-title { margin: 0 0 0.25rem 0; font-size: 0.95rem; }
        .recent-meta { color: var(--text-3); font-size: 0.78rem; }
        .resume-btn { border: 1px solid rgba(232,184,75,0.35); color: var(--gold); border-radius: 999px; padding: 0.35rem 0.8rem; font-size: 0.78rem; font-weight: 600; }
        .badge-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem; }
        .achievement-badge { border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 0.8rem; display: flex; align-items: center; gap: 0.55rem; font-size: 0.8rem; }
        .achievement-icon { width: 26px; height: 26px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .achievement-badge.unlocked { background: rgba(78,205,196,0.08); border-color: rgba(78,205,196,0.25); color: var(--text-1); }
        .achievement-badge.unlocked .achievement-icon { background: rgba(78,205,196,0.2); }
        .achievement-badge.locked { background: rgba(255,255,255,0.02); color: var(--text-3); }
        .achievement-badge.locked .achievement-icon { background: rgba(255,255,255,0.06); }
        @media (max-width: 960px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) { .profile-header { flex-direction: column; align-items: flex-start; } .journey-meta { flex-direction: column; align-items: flex-start; } .recent-item { grid-template-columns: 1fr; } .thumb-wrap { width: 100%; } .badge-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
    </main>
  );
}