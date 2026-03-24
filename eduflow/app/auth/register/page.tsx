"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function getPasswordStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#ff6b6b", "#f59e0b", "#4ecdc4", "#6ee7b7"];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) { router.push("/subjects"); return null; }

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    if (!agreed) errs.terms = "You must agree to the terms";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      await register(form.email, form.password, form.name);
      router.push("/subjects");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setFieldErrors(p => ({ ...p, [field]: "" }));
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
            The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.
          </p>
          <div className="quote-author">— Brian Herbert</div>
        </div>
        <div className="auth-perks">
          {["Structured learning paths", "Progress tracking across devices", "Resume exactly where you left off"].map(p => (
            <div key={p} className="perk-item">
              <div className="perk-check"><Check size={12} /></div>
              <span>{p}</span>
            </div>
          ))}
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
          <h1 className="auth-heading">Start learning.</h1>
          <p className="auth-subtext">Create your free account today.</p>

          <AnimatePresence>
            {error && (
              <motion.div className="auth-error"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name */}
            <div className="field-group">
              <div className={`floating-field ${fieldErrors.name ? "field-error" : ""}`}>
                <input id="name" type="text" value={form.name}
                  onChange={e => update("name", e.target.value)} placeholder=" " />
                <label htmlFor="name">Full name</label>
              </div>
              {fieldErrors.name && <span className="field-err-msg">{fieldErrors.name}</span>}
            </div>

            {/* Email */}
            <div className="field-group">
              <div className={`floating-field ${fieldErrors.email ? "field-error" : ""}`}>
                <input id="email" type="email" value={form.email}
                  onChange={e => update("email", e.target.value)} placeholder=" " />
                <label htmlFor="email">Email address</label>
              </div>
              {fieldErrors.email && <span className="field-err-msg">{fieldErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="field-group">
              <div className={`floating-field ${fieldErrors.password ? "field-error" : ""}`}>
                <input id="password" type={showPw ? "text" : "password"} value={form.password}
                  onChange={e => update("password", e.target.value)} placeholder=" " />
                <label htmlFor="password">Password</label>
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="strength-bar">
                  <div className="strength-track">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="strength-seg"
                        style={{ background: i <= strength ? strengthColors[strength] : "var(--ink-4)", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {fieldErrors.password && <span className="field-err-msg">{fieldErrors.password}</span>}
            </div>

            {/* Confirm */}
            <div className="field-group">
              <div className={`floating-field ${fieldErrors.confirm ? "field-error" : ""}`}>
                <input id="confirm" type={showPw ? "text" : "password"} value={form.confirm}
                  onChange={e => update("confirm", e.target.value)} placeholder=" " />
                <label htmlFor="confirm">Confirm password</label>
              </div>
              {fieldErrors.confirm && <span className="field-err-msg">{fieldErrors.confirm}</span>}
            </div>

            {/* Terms */}
            <div className="terms-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setFieldErrors(p => ({ ...p, terms: "" })); }} />
                <span className="checkbox-box" />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {fieldErrors.terms && <span className="field-err-msg">{fieldErrors.terms}</span>}
            </div>

            <motion.button type="submit" className="auth-btn" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? <Loader2 size={18} className="spin" /> : "Create account"}
            </motion.button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        .auth-layout { display: flex; min-height: 100vh; background: var(--ink); }
        .auth-left { width: 45%; background: var(--ink); border-right: 1px solid var(--ink-4); display: flex; flex-direction: column; padding: 2.5rem; position: relative; overflow: hidden; }
        @media (max-width: 768px) { .auth-left { display: none; } .auth-right { width: 100%; } }
        .auth-left-logo { display: flex; align-items: center; gap: 0.75rem; z-index: 1; }
        .auth-logo-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--gold); color: var(--ink); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 1rem; }
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
        .quote-text { font-family: var(--font-display); font-size: 1.3rem; color: var(--text-1); line-height: 1.5; font-style: italic; font-weight: 300; margin: 0 0 1rem; }
        .quote-author { font-size: 0.8rem; color: var(--text-3); letter-spacing: 0.05em; }
        .auth-perks { display: flex; flex-direction: column; gap: 0.75rem; z-index: 1; }
        .perk-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--text-2); }
        .perk-check { width: 20px; height: 20px; border-radius: 50%; background: var(--gold-dim); border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; color: var(--gold); flex-shrink: 0; }
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
        .floating-field input:focus ~ label, .floating-field input:not(:placeholder-shown) ~ label { top: 0.6rem; transform: none; font-size: 0.7rem; color: var(--gold); }
        .pw-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-3); cursor: pointer; padding: 0; display: flex; }
        .field-err-msg { font-size: 0.75rem; color: var(--rose); padding-left: 0.25rem; }
        .strength-bar { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; }
        .strength-track { display: flex; gap: 3px; flex: 1; }
        .strength-seg { flex: 1; height: 3px; border-radius: 999px; }
        .strength-label { font-size: 0.7rem; width: 40px; }
        .terms-row { display: flex; flex-direction: column; gap: 0.25rem; }
        .checkbox-label { display: flex; align-items: flex-start; gap: 0.625rem; cursor: pointer; font-size: 0.82rem; color: var(--text-2); }
        .checkbox-label input[type="checkbox"] { display: none; }
        .checkbox-box { width: 16px; height: 16px; border: 1px solid var(--ink-4); border-radius: 4px; background: var(--ink-3); flex-shrink: 0; margin-top: 1px; transition: all 0.2s; }
        .checkbox-label input:checked + .checkbox-box { background: var(--gold); border-color: var(--gold); }
        .checkbox-label a { color: var(--gold); text-decoration: none; }
        .auth-btn { width: 100%; padding: 0.875rem; background: var(--gold); color: var(--ink); border: none; border-radius: 10px; font-family: var(--font-ui); font-size: 0.95rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.25rem; transition: box-shadow 0.2s; }
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