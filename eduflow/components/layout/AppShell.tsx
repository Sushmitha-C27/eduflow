import React from "react";
import { TopBar } from "./TopBar";
import { SubjectSidebar } from "../sidebar/SubjectSidebar";

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  showSidebar = true,
}) => {
  return (
    <div className="app-grid">
      <TopBar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showSidebar ? "300px minmax(0,1fr)" : "minmax(0,1fr)",
          minHeight: 0,
        }}
      >
        {showSidebar && (
          <aside
            style={{
              borderRight: "1px solid rgba(255,255,255,0.05)",
              background:
                "radial-gradient(circle at top, rgba(232,184,75,0.09), transparent 55%), var(--ink-2)",
            }}
          >
            {/* <SubjectSidebar /> */}
          </aside>
        )}
        <div
          style={{
            minHeight: "0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

