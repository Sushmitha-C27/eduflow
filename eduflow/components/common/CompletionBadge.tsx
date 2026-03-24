import * as React from "react";

interface Props {
  completion: number;
}

export const CompletionBadge: React.FC<Props> = ({ completion }) => {
  const clamped = Math.min(100, Math.max(0, completion));
  return (
    <div
      style={{
        borderRadius: 999,
        padding: "4px 9px",
        border: "1px solid rgba(255,255,255,0.14)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          background: clamped === 100 ? "var(--jade)" : "var(--gold)",
        }}
      />
      <span>{clamped}% Complete</span>
    </div>
  );
};

