"use client";

import * as React from "react";
import { Button } from "../ui/Button";

export const LoginForm: React.FC = () => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: 8,
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13 }}>Email</span>
        <input
          type="email"
          required
          style={inputStyle}
          placeholder="you@studio.co"
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13 }}>Password</span>
        <input
          type="password"
          required
          style={inputStyle}
          placeholder="••••••••"
        />
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
          marginBottom: 8,
          fontSize: 12,
          color: "var(--text-3)",
        }}
      >
        <span>Forgot password?</span>
        <span>Use magic link</span>
      </div>
      <Button type="submit">Sign in</Button>
      <p className="text-subtle" style={{ fontSize: 12 }}>
        By continuing you agree to our experimental learning terms. This is a
        visual prototype — authentication will be wired to your backend.
      </p>
    </form>
  );
};

const inputStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  padding: "10px 14px",
  backgroundColor: "rgba(12,12,12,0.9)",
  color: "var(--text-1)",
  fontSize: 13,
  outline: "none",
};

