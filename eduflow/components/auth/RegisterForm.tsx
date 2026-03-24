"use client";

import * as React from "react";
import { Button } from "../ui/Button";

export const RegisterForm: React.FC = () => {
  return (
    <form
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 18,
        marginTop: 8,
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13 }}>Full name</span>
        <input
          type="text"
          required
          style={inputStyle}
          placeholder="Avery Editorial"
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13 }}>Work email</span>
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
          placeholder="Create a strong passphrase"
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13 }}>Team size</span>
        <select style={inputStyle as React.CSSProperties}>
          <option>Just me</option>
          <option>2–10</option>
          <option>11–50</option>
          <option>50+</option>
        </select>
      </label>
      <div
        style={{
          gridColumn: "1/-1",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 6,
        }}
      >
        <Button type="submit">Create account</Button>
        <p className="text-subtle" style={{ fontSize: 12 }}>
          No credit card required. We&apos;ll wire real authentication once your
          backend is connected — for now this is a pixel-perfect front-end.
        </p>
      </div>
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

