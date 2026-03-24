import React from "react";

interface Props {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<Props> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, ...style }}
  />
);

// Subject card skeleton
export const SubjectCardSkeleton = () => (
  <div style={{
    background: "var(--ink-2)",
    border: "1px solid var(--ink-4)",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}>
    <Skeleton height={3} width={60} borderRadius={999} />
    <Skeleton height={12} width="40%" />
    <Skeleton height={22} width="80%" />
    <Skeleton height={22} width="60%" />
    <Skeleton height={14} width="50%" />
    <Skeleton height={3} borderRadius={999} />
    <Skeleton height={14} width="30%" />
  </div>
);

// Sidebar video skeleton
export const SidebarSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
    <Skeleton height={16} width="60%" />
    <Skeleton height={12} width="40%" style={{ marginBottom: 8 }} />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
        <Skeleton width={10} height={10} borderRadius={999} />
        <Skeleton height={13} style={{ flex: 1 }} />
        <Skeleton width={40} height={11} />
      </div>
    ))}
  </div>
);

// Video meta skeleton
export const VideoMetaSkeleton = () => (
  <div style={{
    background: "var(--ink-2)",
    border: "1px solid var(--ink-4)",
    borderRadius: 24,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }}>
    <Skeleton height={12} width="30%" />
    <Skeleton height={28} width="90%" />
    <Skeleton height={28} width="70%" />
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Skeleton width={36} height={36} borderRadius={999} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <Skeleton height={13} width="40%" />
        <Skeleton height={11} width="30%" />
      </div>
    </div>
    <Skeleton height={14} />
    <Skeleton height={14} width="80%" />
    <div style={{ display: "flex", gap: 8 }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} width={50} height={24} borderRadius={999} />
      ))}
    </div>
    <Skeleton height={3} borderRadius={999} />
    <div style={{ display: "flex", gap: 10 }}>
      <Skeleton width={120} height={34} borderRadius={8} />
      <Skeleton width={120} height={34} borderRadius={8} />
    </div>
  </div>
);