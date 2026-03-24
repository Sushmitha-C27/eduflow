"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

type ToastInput = {
  message: string;
  type?: ToastType;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: number;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyle: Record<ToastType, { border: string; text: string; bg: string }> = {
  success: {
    border: "rgba(78,205,196,0.45)",
    text: "var(--jade)",
    bg: "rgba(78,205,196,0.1)",
  },
  error: {
    border: "rgba(255,107,107,0.45)",
    text: "var(--rose)",
    bg: "rgba(255,107,107,0.1)",
  },
  info: {
    border: "rgba(232,184,75,0.45)",
    text: "var(--gold)",
    bg: "rgba(232,184,75,0.1)",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(({ message, type = "info", durationMs = 3000 }: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const nextToast: ToastItem = { id, message, type, durationMs };
    setToasts((curr) => [...curr, nextToast]);
    window.setTimeout(() => {
      setToasts((curr) => curr.filter((toast) => toast.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 340,
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const skin = toastStyle[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  border: `1px solid ${skin.border}`,
                  color: skin.text,
                  background: `linear-gradient(135deg, ${skin.bg}, rgba(0,0,0,0.7))`,
                  borderRadius: 12,
                  padding: "11px 13px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 18px 28px rgba(0,0,0,0.35)",
                  fontSize: 13,
                }}
              >
                {toast.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
