import * as React from "react";
import * as RadixProgress from "@radix-ui/react-progress";

interface ProgressBarProps {
  value: number;
  color?: "gold" | "jade";
  subtle?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "gold",
  subtle = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const accent =
    color === "jade"
      ? "linear-gradient(90deg, #4ecdc4, #9be7e4)"
      : "linear-gradient(90deg, #e8b84b, #f4d57d)";

  return (
    <RadixProgress.Root
      value={clamped}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 999,
        width: "100%",
        height: subtle ? 4 : 6,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <RadixProgress.Indicator
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundImage: accent,
          transition: "width 360ms var(--transition-snap)",
        }}
      />
    </RadixProgress.Root>
  );
};

