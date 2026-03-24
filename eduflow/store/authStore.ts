"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setTokens: (token: string) => void;
  setUser: (user: User) => void;
}

const MOCK_USERS = [
  { email: "test@eduflow.com", password: "test123", name: "Sushmitha", id: 1 },
  { email: "demo@eduflow.com", password: "demo123", name: "Demo User", id: 2 },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Mock auth fallback
        if (!API_BASE) {
          await new Promise((r) => setTimeout(r, 800));
          const found = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
          );
          if (!found) throw new Error("Invalid email or password");
          set({
            isAuthenticated: true,
            accessToken: "mock-token",
            user: {
              id: found.id,
              email: found.email,
              name: found.name,
              createdAt: new Date().toISOString(),
            },
          });
          return;
        }
        // Real API
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Invalid email or password");
        }
        const data = await res.json();
        set({
          isAuthenticated: true,
          accessToken: data.accessToken,
          user: data.user,
        });
      },

      register: async (email, password, name) => {
        if (!API_BASE) {
          await new Promise((r) => setTimeout(r, 800));
          const exists = MOCK_USERS.find((u) => u.email === email);
          if (exists) throw new Error("Email already in use");
          set({
            isAuthenticated: true,
            accessToken: "mock-token",
            user: {
              id: Date.now(),
              email,
              name,
              createdAt: new Date().toISOString(),
            },
          });
          return;
        }
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Registration failed");
        }
        const data = await res.json();
        set({
          isAuthenticated: true,
          accessToken: data.accessToken,
          user: data.user,
        });
      },

      logout: () => {
        if (API_BASE) {
          fetch(`${API_BASE}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setTokens: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "eduflow-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);