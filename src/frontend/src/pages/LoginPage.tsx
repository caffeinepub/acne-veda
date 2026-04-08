import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

export function LoginPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const actorReady = !!actor && !isFetching;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!actorReady) return;
    setError("");
    setLoading(true);
    try {
      const hash = await hashPassword(password);
      await actor.loginUser(username.trim(), hash);
      localStorage.setItem("acneveda_user", username.trim());
      // Check if user has completed assessment; route accordingly
      try {
        const history = await actor.hasHistory(username.trim());
        navigate({ to: history ? "/main" : "/assessment/step1" });
      } catch {
        navigate({ to: "/assessment/step1" });
      }
    } catch (err: any) {
      const msg = err?.message ?? "";
      const raw = String(err);
      const combined = `${msg} ${raw}`.toLowerCase();
      if (
        combined.includes("invalid") ||
        combined.includes("wrong") ||
        combined.includes("incorrect")
      ) {
        setError("Invalid username or password.");
      } else if (
        combined.includes("not found") ||
        combined.includes("no user") ||
        combined.includes("does not exist")
      ) {
        setError("Account not found. Please sign up.");
      } else {
        const displayMsg = msg || raw;
        setError(`Login failed: ${displayMsg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      {/* Leaf accents */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ opacity: 0.15 }}
        aria-hidden="true"
      >
        <svg
          width="100"
          height="110"
          viewBox="0 0 100 110"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M90 10 C65 25, 50 55, 70 90 C80 60, 98 35, 90 10Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
          <path
            d="M100 5 C72 22, 58 55, 78 88 C88 58, 105 32, 100 5Z"
            fill="#5a9068"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8 max-w-sm mx-auto w-full">
        {/* Logo + brand */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{
              boxShadow: "0 2px 8px oklch(0.55 0.14 145 / 0.2)",
            }}
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

        {/* Heading */}
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
            Welcome Back
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.04 60)",
            }}
          >
            Sign in to continue your skin journey
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
        >
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-username"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.08 140)",
              }}
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              data-ocid="login.input"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: "oklch(0.99 0.006 80)",
                border: "1.5px solid oklch(0.88 0.03 80)",
                color: "oklch(0.28 0.08 140)",
              }}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
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
                id="login-password"
                type={showPassword ? "text" : "password"}
                data-ocid="login.input"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: "oklch(0.99 0.006 80)",
                  border: "1.5px solid oklch(0.88 0.03 80)",
                  color: "oklch(0.28 0.08 140)",
                }}
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
          </div>

          {/* Error message */}
          {error && (
            <div
              data-ocid="login.error_state"
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

          {/* Submit */}
          <button
            type="submit"
            data-ocid="login.submit_button"
            disabled={loading || !actorReady || !username.trim() || !password}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white mt-2 transition-all active:scale-[0.98]"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.52 0.18 145)",
              boxShadow: "0 4px 20px -2px oklch(0.52 0.18 145 / 0.32)",
              cursor:
                !loading && actorReady && username.trim() && password
                  ? "pointer"
                  : "not-allowed",
              opacity:
                !loading && actorReady && username.trim() && password
                  ? 1
                  : 0.65,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </span>
            ) : isFetching || !actor ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </motion.form>

        <div className="flex-1" />

        {/* Sign up link */}
        <motion.p
          className="text-center text-sm mt-4"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.4 }}
        >
          <span style={{ color: "oklch(0.55 0.04 60)" }}>
            Don&apos;t have an account?{" "}
          </span>
          <button
            data-ocid="login.link"
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "oklch(0.55 0.14 145)" }}
          >
            Sign Up
          </button>
        </motion.p>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.68 0.04 60)",
          }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-1 hover:opacity-70 transition-opacity"
            style={{ color: "oklch(0.55 0.14 145)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
