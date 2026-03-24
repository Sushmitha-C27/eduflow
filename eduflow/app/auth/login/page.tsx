"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/ToastProvider";
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/subjects");
    }
  }, [isAuthenticated, router]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      const name = email === "test@eduflow.com" ? "Sushmitha" : "Learner";
      showToast({ message: `Welcome back, ${name}!`, type: "info" });
      router.push("/subjects");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="auth-logo-icon">E</div>
          <div>
            <div className="auth-logo-name">EDUFLOW</div>
            <div className="auth-logo-sub">Editorial Learning Studio</div>
          </div>
        </div>
        <div className="auth-left-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="auth-left-quote">
          <div className="quote-mark">&quot;</div>
          <p className="quote-text">
            Learning is not the filling of a pail, but the lighting of a fire.
          </p>
          <div className="quote-author">— W.B. Yeats</div>
        </div>
        <div className="auth-testimonial">
          <div className="testimonial-avatar">SK</div>
          <div>
            <p className="testimonial-text">&quot;EduFlow changed how I learn. The structure keeps me on track.&quot;</p>
            <div className="testimonial-name">Sanya K. · Frontend Developer</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <motion.div
        className="auth-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Welcome back.</h1>
          <p className="auth-subtext">Continue your learning journey.</p>

          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <div className={`floating-field ${fieldErrors.email ? "field-error" : ""}`}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: "" })); }}
                  placeholder=" "
                  autoComplete="email"
                />
                <label htmlFor="email">Email address</label>
              </div>
              {fieldErrors.email && <span className="field-err-msg">{fieldErrors.email}</span>}
            </div>

            <div className="field-group">
              <div className={`floating-field ${fieldErrors.password ? "field-error" : ""}`}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: "" })); }}
                  placeholder=" "
                  autoComplete="current-password"
                />
                <label htmlFor="password">Password</label>
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <span className="field-err-msg">{fieldErrors.password}</span>}
            </div>

            <motion.button
              type="submit"
              className="auth-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : "Sign in"}
            </motion.button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register">Register</Link>
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        .auth-layout {
          display: flex;
          min-height: 100vh;
          background: var(--ink);
        }
        .auth-left {
          width: 45%;
          background: var(--ink);
          border-right: 1px solid var(--ink-4);
          display: flex;
          flex-direction: column;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) { .auth-left { display: none; } .auth-right { width: 100%; } }
        .auth-left-logo { display: flex; align-items: center; gap: 0.75rem; z-index: 1; }
        .auth-logo-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--gold); color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: 1rem;
        }
        .auth-logo-name { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.15em; color: var(--text-1); }
        .auth-logo-sub { font-size: 0.65rem; letter-spacing: 0.1em; color: var(--text-3); text-transform: uppercase; }
        .auth-left-shapes { position: absolute; inset: 0; pointer-events: none; }
        .shape { position: absolute; border-radius: 50%; opacity: 0.06; }
        .shape-1 { width: 300px; height: 300px; background: var(--gold); top: -80px; right: -80px; animation: floatA 8s ease-in-out infinite; }
        .shape-2 { width: 200px; height: 200px; background: var(--jade); bottom: 200px; left: -60px; animation: floatB 10s ease-in-out infinite; }
        .shape-3 { width: 150px; height: 150px; background: var(--gold); bottom: 80px; right: 40px; animation: floatA 12s ease-in-out infinite reverse; }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(15px) rotate(-5deg)} }
        .auth-left-quote { flex: 1; display: flex; flex-direction: column; justify-content: center; z-index: 1; padding: 2rem 0; }
        .quote-mark { font-family: var(--font-display); font-size: 5rem; color: var(--gold); line-height: 1; opacity: 0.4; }
        .quote-text { font-family: var(--font-display); font-size: 1.4rem; color: var(--text-1); line-height: 1.5; font-style: italic; font-weight: 300; margin: 0 0 1rem; }
        .quote-author { font-size: 0.8rem; color: var(--text-3); letter-spacing: 0.05em; }
        .auth-testimonial { display: flex; align-items: flex-start; gap: 0.75rem; z-index: 1; background: var(--ink-2); border: 1px solid var(--ink-4); border-radius: 12px; padding: 1rem; }
        .testimonial-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gold-dim); border: 1px solid var(--gold); color: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; flex-shrink: 0; }
        .testimonial-text { font-size: 0.8rem; color: var(--text-2); line-height: 1.5; margin: 0 0 0.25rem; }
        .testimonial-name { font-size: 0.7rem; color: var(--text-3); }
        .auth-right { width: 55%; background: var(--ink-2); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-heading { font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; font-style: italic; color: var(--text-1); margin: 0 0 0.5rem; }
        .auth-subtext { color: var(--text-2); font-size: 0.95rem; margin: 0 0 2rem; }
        .auth-error { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); color: #ff6b6b; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .floating-field { position: relative; }
        .floating-field input { width: 100%; background: var(--ink-3); border: 1px solid var(--ink-4); border-radius: 10px; padding: 1.25rem 1rem 0.5rem; color: var(--text-1); font-family: var(--font-ui); font-size: 0.95rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .floating-field input:focus { border-color: var(--gold); }
        .floating-field.field-error input { border-color: var(--rose); }
        .floating-field label { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 0.9rem; pointer-events: none; transition: all 0.2s; }
        .floating-field input:focus ~ label,
        .floating-field input:not(:placeholder-shown) ~ label { top: 0.6rem; transform: none; font-size: 0.7rem; color: var(--gold); }
        .pw-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-3); cursor: pointer; padding: 0; display: flex; }
        .field-err-msg { font-size: 0.75rem; color: var(--rose); padding-left: 0.25rem; }
        .auth-btn { width: 100%; padding: 0.875rem; background: var(--gold); color: var(--ink); border: none; border-radius: 10px; font-family: var(--font-ui); font-size: 0.95rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; transition: box-shadow 0.2s; }
        .auth-btn:hover { box-shadow: 0 0 24px rgba(232,184,75,0.35); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-switch { text-align: center; color: var(--text-3); font-size: 0.85rem; margin-top: 1.5rem; }
        .auth-switch a { color: var(--gold); text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}