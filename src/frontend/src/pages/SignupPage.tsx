import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface StrengthCheck {
  label: string;
  pass: boolean;
}

function getChecks(pw: string): StrengthCheck[] {
  return [
    { label: "At least 8 characters", pass: pw.length >= 8 },
    { label: "Contains a lowercase letter", pass: /[a-z]/.test(pw) },
    { label: "Contains an uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "Contains a symbol (@, #, $, %…)", pass: /[^a-zA-Z0-9]/.test(pw) },
  ];
}

export function SignupPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checks = getChecks(password);
  const allStrong = checks.every((c) => c.pass);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit = username.trim().length >= 3 && allStrong && passwordsMatch;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const hash = await hashPassword(password);
      await actor.registerUser(username.trim(), hash);
      localStorage.setItem("acneveda_user", username.trim());
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (
        msg.toLowerCase().includes("taken") ||
        msg.toLowerCase().includes("exist")
      ) {
        setError("That username is already taken. Please choose another.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      {/* Leaf accent */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ opacity: 0.15 }}
        aria-hidden="true"
      >
        <svg
          width="110"
          height="120"
          viewBox="0 0 110 120"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M100 8 C72 26, 55 58, 76 96 C87 65, 108 38, 100 8Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
          <path
            d="M112 4 C80 24, 64 58, 88 94 C100 62, 118 34, 112 4Z"
            fill="#5a9068"
            fillOpacity="0.45"
          />
        </svg>
      </div>
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ opacity: 0.1 }}
        aria-hidden="true"
      >
        <svg
          width="90"
          height="100"
          viewBox="0 0 90 100"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M10 90 C32 68, 35 38, 14 12 C6 42, -8 68, 10 90Z"
            fill="#c87941"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8 max-w-sm mx-auto w-full">
        {/* Back button */}
        <motion.button
          type="button"
          data-ocid="signup.back_button"
          onClick={() => navigate({ to: "/login" })}
          className="flex items-center gap-1.5 mb-8 w-fit -ml-1"
          style={{ color: "oklch(0.4 0.08 140)" }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Back to Login
          </span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="w-10 h-10 rounded-full object-contain bg-white"
              style={{
                boxShadow: "0 2px 8px -2px oklch(0.55 0.14 145 / 0.18)",
              }}
            />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.14 145)",
                letterSpacing: "0.12em",
              }}
            >
              Acne Veda
            </span>
          </div>
          <h1
            className="text-3xl font-bold mb-1.5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Create Account
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.5 0.05 60)",
            }}
          >
            Begin your Ayurvedic skin journey
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSignup}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.32 0.07 140)",
              }}
            >
              Username
            </label>
            <input
              id="username"
              data-ocid="signup.input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dr_akash"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: "oklch(1 0 0)",
                border: "1.5px solid oklch(0.88 0.025 70)",
                color: "oklch(0.2 0.04 50)",
                fontSize: "16px",
                boxShadow: "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "oklch(0.55 0.14 145 / 0.6)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.88 0.025 70)";
                e.currentTarget.style.boxShadow =
                  "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)";
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="pw"
              className="text-sm font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.32 0.07 140)",
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="pw"
                data-ocid="signup.textarea"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-2xl text-sm outline-none transition-all"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: "oklch(1 0 0)",
                  border: `1.5px solid ${password.length > 0 && !allStrong ? "oklch(0.6 0.2 27)" : "oklch(0.88 0.025 70)"}`,
                  color: "oklch(0.2 0.04 50)",
                  fontSize: "16px",
                  boxShadow: "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "oklch(0.55 0.14 145 / 0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    password.length > 0 && !allStrong
                      ? "oklch(0.6 0.2 27)"
                      : "oklch(0.88 0.025 70)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)";
                }}
              />
              <button
                type="button"
                data-ocid="signup.toggle"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                style={{ color: "oklch(0.55 0.06 140)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Strength checklist */}
            {password.length > 0 && (
              <motion.div
                className="mt-1.5 flex flex-col gap-1 pl-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                data-ocid="signup.panel"
              >
                {checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    {check.pass ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.55 0.15 145)" }}
                      />
                    ) : (
                      <Circle
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.72 0.04 60)" }}
                      />
                    )}
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        color: check.pass
                          ? "oklch(0.42 0.12 145)"
                          : "oklch(0.55 0.04 60)",
                      }}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-sm font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.32 0.07 140)",
              }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                data-ocid="signup.select"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-2xl text-sm outline-none transition-all"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: "oklch(1 0 0)",
                  border: `1.5px solid ${confirm.length > 0 && !passwordsMatch ? "oklch(0.6 0.2 27)" : confirm.length > 0 && passwordsMatch ? "oklch(0.55 0.15 145)" : "oklch(0.88 0.025 70)"}`,
                  color: "oklch(0.2 0.04 50)",
                  fontSize: "16px",
                  boxShadow: "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "oklch(0.55 0.14 145 / 0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
                }}
                onBlur={(e) => {
                  const border =
                    confirm.length > 0 && !passwordsMatch
                      ? "oklch(0.6 0.2 27)"
                      : confirm.length > 0 && passwordsMatch
                        ? "oklch(0.55 0.15 145)"
                        : "oklch(0.88 0.025 70)";
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow =
                    "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)";
                }}
              />
              <button
                type="button"
                data-ocid="signup.checkbox"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                style={{ color: "oklch(0.55 0.06 140)" }}
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirm.length > 0 && !passwordsMatch && (
              <p
                className="text-xs pl-1"
                data-ocid="signup.error_state"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.55 0.2 27)",
                }}
              >
                Passwords do not match.
              </p>
            )}
            {confirm.length > 0 && passwordsMatch && (
              <p
                className="text-xs pl-1"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.42 0.12 145)",
                }}
              >
                ✓ Passwords match
              </p>
            )}
          </div>

          {/* Server error */}
          {error && (
            <motion.div
              data-ocid="signup.error_state"
              className="px-4 py-3 rounded-2xl text-sm"
              style={{
                background: "oklch(0.97 0.04 27)",
                border: "1px solid oklch(0.85 0.1 27)",
                color: "oklch(0.45 0.18 27)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Sign Up button */}
          <button
            type="submit"
            data-ocid="signup.submit_button"
            disabled={!canSubmit || loading}
            className="w-full py-3.5 mt-1 rounded-full text-white font-semibold text-base transition-all active:scale-[0.98]"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background:
                canSubmit && !loading
                  ? "oklch(0.65 0.2 35)"
                  : "oklch(0.78 0.06 60)",
              boxShadow:
                canSubmit && !loading
                  ? "0 4px 20px -2px oklch(0.65 0.2 35 / 0.35), 0 1px 4px -1px oklch(0.65 0.2 35 / 0.2)"
                  : "none",
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              opacity: canSubmit && !loading ? 1 : 0.7,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account…
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </motion.form>

        <motion.p
          className="mt-6 text-center text-sm"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.4 }}
        >
          <span style={{ color: "oklch(0.55 0.04 60)" }}>
            Already have an account?{" "}
          </span>
          <button
            data-ocid="signup.link"
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "oklch(0.55 0.14 145)" }}
          >
            Log In
          </button>
        </motion.p>
      </div>
    </div>
  );
}
