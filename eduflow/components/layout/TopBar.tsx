"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";

export const TopBar = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(20px)",
        background:
          "linear-gradient(to bottom, rgba(13,13,13,0.96), rgba(13,13,13,0.82))",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBlock: 14,
        }}
      >
        {/* Left: Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="fade-border"
              style={{
                width: 30,
                height: 30,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "radial-gradient(circle at 0 0, rgba(232,184,75,0.7), transparent 55%), #111",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginTop: 2,
                }}
              >
                E
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.22em",
                  fontSize: 11,
                  textTransform: "uppercase",
                }}
              >
                EduFlow
              </span>
              <span
                className="text-subtle"
                style={{ fontSize: 11, letterSpacing: "0.14em" }}
              >
                Editorial Learning Studio
              </span>
            </div>
          </Link>
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginLeft: 28,
              fontSize: 13,
            }}
          >
            <Link href="/subjects">Subjects</Link>
            {isAuthenticated && <Link href="/profile">Profile</Link>}
          </nav>
        </div>

        {/* Right: Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAuthenticated ? (
            <>
              <Badge variant="outline">Streak · 4 days</Badge>
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 999,
                    padding: "4px 8px 4px 4px",
                    color: "var(--text-2)",
                    cursor: "pointer",
                  }}
                >
                  <Avatar initials={initials} />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-2)",
                      fontFamily: "var(--font-ui)",
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      minWidth: 180,
                      borderRadius: 12,
                      background: "var(--ink-2)",
                      border: "1px solid var(--ink-4)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
                      overflow: "hidden",
                      zIndex: 60,
                    }}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      style={menuItemStyle}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/subjects"
                      onClick={() => setMenuOpen(false)}
                      style={menuItemStyle}
                    >
                      All Subjects
                    </Link>
                    <button type="button" onClick={handleLogout} style={menuButtonStyle}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Join free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const menuItemStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  fontSize: 13,
  color: "var(--text-2)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const menuButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 13,
  color: "var(--rose)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};