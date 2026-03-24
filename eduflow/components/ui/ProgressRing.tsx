"use client";

import { motion } from "framer-motion";

type RingSize = "sm" | "md" | "lg";

const sizeMap: Record<RingSize, number> = {
  sm: 24,
  md: 48,
  lg: 80,
};

export function ProgressRing({
  value,
  size = "md",
  strokeWidth = 4,
}: {
  value: number;
  size?: RingSize;
  strokeWidth?: number;
}) {
  const px = sizeMap[size];
  const radius = (px - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={px / 2}
        cy={px / 2}
        r={radius}
        fill="none"
        stroke="var(--ink-4)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={px / 2}
        cy={px / 2}
        r={radius}
        fill="none"
        stroke="var(--jade)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      />
    </svg>
  );
}
