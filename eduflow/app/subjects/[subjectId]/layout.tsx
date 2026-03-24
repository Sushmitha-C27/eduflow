"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SubjectSidebar } from "@/components/sidebar/SubjectSidebar";
import { subjects } from "@/types";

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const subjectId = params?.subjectId as string;
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--ink)" }}>

      {/* ── Sidebar (desktop) ── */}
      <aside style={{
        width: 280,
        flexShrink: 0,
        background: "var(--ink-2)",
        borderRight: "1px solid var(--ink-4)",
        position: "sticky",
        top: 56,
        height: "calc(100vh - 56px)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
        className="sidebar-desktop"
      >
        <SubjectSidebar subject={subject} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 40, display: "none",
          }}
          className="sidebar-overlay"
        />
      )}
      <aside
        style={{
          position: "fixed", top: 56, left: 0,
          width: 280, height: "calc(100vh - 56px)",
          background: "var(--ink-2)",
          borderRight: "1px solid var(--ink-4)",
          zIndex: 50, overflowY: "auto",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          display: "none",
        }}
        className="sidebar-mobile"
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: "var(--ink-2)",
            borderBottom: "1px solid var(--ink-4)",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid var(--ink-4)",
              background: "var(--ink-3)",
              color: "var(--text-2)",
            }}
          >
            ✕
          </button>
        </div>
        <SubjectSidebar subject={subject} />
      </aside>

      {/* ── Mobile toggle button ── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sidebar-toggle"
        style={{
          position: "fixed", bottom: 24, left: 24,
          zIndex: 60, width: 44, height: 44,
          borderRadius: "50%", background: "var(--gold)",
          color: "var(--ink)", border: "none", cursor: "pointer",
          display: "none", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: flex !important; }
          .sidebar-overlay { display: block !important; }
          .sidebar-toggle { display: flex !important; }
          .sidebar-mobile {
            width: 100vw !important;
            height: calc(100vh - 56px) !important;
          }
        }
      `}</style>
    </div>
  );
}