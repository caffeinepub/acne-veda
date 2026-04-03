import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function LoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setError("");
    setLoading(true);
    try {
      const hash = await hashPassword(password);
      await actor.login(username.trim(), hash);
      localStorage.setItem("acneveda_user", username.trim());
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("wrong") ||
        msg.toLowerCase().includes("incorrect")
      ) {
        setError("Invalid username or password.");
      } else if (
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("exist")
      ) {
        setError("Account not found. Please sign up.");
      } else {
        setError("Login failed. Please check your credentials.");
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
          <img
            src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
            alt="Acne Veda"
            className="w-10 h-10 rounded-full object-contain bg-white"
            style={{ boxShadow: "0 2px 8px -2px oklch(0.55 0.14 145 / 0.18)" }}
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
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.5 0.05 60)",
            }}
          >
            Sign in to your Acne Veda account
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 mb-6"
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
              data-ocid="login.input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
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
              htmlFor="password"
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
                id="password"
                data-ocid="login.textarea"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-2xl text-sm outline-none transition-all"
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
              <button
                type="button"
                data-ocid="login.toggle"
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
          </div>

          {/* Error */}
          {error && (
            <motion.div
              data-ocid="login.error_state"
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

          {/* Sign In button */}
          <button
            type="submit"
            data-ocid="login.submit_button"
            disabled={loading || !username.trim() || !password}
            className="w-full py-3.5 mt-2 rounded-full text-white font-semibold text-base transition-all active:scale-[0.98] hover:opacity-90"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background:
                !loading && username.trim() && password
                  ? "oklch(0.65 0.2 35)"
                  : "oklch(0.78 0.06 60)",
              boxShadow:
                !loading && username.trim() && password
                  ? "0 4px 20px -2px oklch(0.65 0.2 35 / 0.35), 0 1px 4px -1px oklch(0.65 0.2 35 / 0.2)"
                  : "none",
              cursor:
                loading || !username.trim() || !password
                  ? "not-allowed"
                  : "pointer",
              opacity: loading || !username.trim() || !password ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
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
