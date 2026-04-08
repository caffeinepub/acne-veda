import { useActor } from "@caffeineai/core-infrastructure";
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
import { createActor } from "../backend";

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
    {
      label: "Contains a symbol (@, #, $, %\u2026)",
      pass: /[^a-zA-Z0-9]/.test(pw),
    },
  ];
}

export function SignupPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);

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
  const actorReady = !!actor && !isFetching;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!actorReady || !canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const hash = await hashPassword(password);
      await actor.registerUser(username.trim(), hash);
      localStorage.setItem("acneveda_user", username.trim());
      navigate({ to: "/assessment/step1" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const raw = String(err);
      const combined = `${msg} ${raw}`.toLowerCase();
      if (
        combined.includes("taken") ||
        combined.includes("already") ||
        combined.includes("exist")
      ) {
        setError("That username is already taken. Please choose another.");
      } else if (combined.includes("invalid") || combined.includes("short")) {
        setError("Username or password is invalid. Please check and retry.");
      } else {
        setError(`Sign up failed: ${msg || raw}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    background: "oklch(0.99 0.006 80)",
    border: "1.5px solid oklch(0.88 0.03 80)",
    color: "oklch(0.28 0.08 140)",
  };

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ opacity: 0.12 }}
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
            d="M10 10 C35 25, 50 55, 30 90 C20 60, 2 35, 10 10Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8 max-w-sm mx-auto w-full">
        <motion.button
          type="button"
          data-ocid="signup.back_button"
          onClick={() => navigate({ to: "/welcome" })}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-70 self-start"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.45 0.1 140)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 2px 8px oklch(0.55 0.14 145 / 0.2)" }}
          >
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="w-full h-full object-contain bg-white"
            />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.14 145)",
              }}
            >
              Acne Veda
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.6 0.04 60)",
              }}
            >
              Clear Skin Naturally
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.28 0.08 140)",
            }}
          >
            Create Account
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.04 60)",
            }}
          >
            Join Acne Veda and start your skin journey
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSignup}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-username"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.08 140)",
              }}
            >
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              data-ocid="signup.input"
              autoComplete="username"
              placeholder="Choose a username (min 3 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "oklch(0.55 0.14 145)";
                e.target.style.boxShadow =
                  "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "oklch(0.88 0.03 80)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-password"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.08 140)",
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                data-ocid="signup.input"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.55 0.14 145)";
                  e.target.style.boxShadow =
                    "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "oklch(0.88 0.03 80)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "oklch(0.6 0.04 60)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                {checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    {check.pass ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.55 0.18 145)" }}
                      />
                    ) : (
                      <Circle
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.75 0.04 60)" }}
                      />
                    )}
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        color: check.pass
                          ? "oklch(0.45 0.14 145)"
                          : "oklch(0.6 0.04 60)",
                      }}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-confirm"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.08 140)",
              }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                data-ocid="signup.input"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={{
                  ...inputStyle,
                  border:
                    confirm.length > 0
                      ? passwordsMatch
                        ? "1.5px solid oklch(0.55 0.18 145)"
                        : "1.5px solid oklch(0.62 0.2 25)"
                      : "1.5px solid oklch(0.88 0.03 80)",
                }}
                onFocus={(e) => {
                  if (!passwordsMatch) return;
                  e.target.style.boxShadow =
                    "0 0 0 3px oklch(0.55 0.14 145 / 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "oklch(0.6 0.04 60)" }}
                aria-label={showConfirm ? "Hide password" : "Show password"}
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
                className="text-xs mt-0.5"
                data-ocid="signup.error_state"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.55 0.2 25)",
                }}
              >
                Passwords do not match
              </p>
            )}
          </div>

          {error && (
            <div
              data-ocid="signup.error_state"
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: "oklch(0.96 0.04 25)",
                border: "1px solid oklch(0.85 0.08 25)",
                color: "oklch(0.45 0.18 25)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            data-ocid="signup.submit_button"
            disabled={!canSubmit || loading || !actorReady}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white mt-2 transition-all active:scale-[0.98]"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background:
                canSubmit && !loading && actorReady
                  ? "oklch(0.65 0.2 35)"
                  : "oklch(0.78 0.06 60)",
              boxShadow:
                canSubmit && !loading && actorReady
                  ? "0 4px 20px -2px oklch(0.65 0.2 35 / 0.35)"
                  : "none",
              cursor:
                canSubmit && !loading && actorReady ? "pointer" : "not-allowed",
              opacity: canSubmit && !loading && actorReady ? 1 : 0.7,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account…
              </span>
            ) : isFetching || !actor ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting…
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
