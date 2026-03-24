import * as React from "react";

interface LockOverlayProps {
  compact?: boolean;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({ compact }) => {
  if (compact) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(13,13,13,0.92), rgba(13,13,13,0.78))",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingInline: 12,
          gap: 6,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "var(--rose)",
          }}
        >
          ⨯
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          Locked
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at top, rgba(0,0,0,0.86), rgba(0,0,0,0.98))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(0,0,0,0.75)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--rose)",
        }}
      >
        Locked Lesson
      </span>
      <p style={{ maxWidth: 260, textAlign: "center", fontSize: 13 }}>
        Create an account to unlock this lesson and sync your progress.
      </p>
    </div>
  );
};

