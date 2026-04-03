import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      {/* Subtle top leaf accent */}
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

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8">
        {/* Back button */}
        <motion.button
          type="button"
          data-ocid="login.back_button"
          onClick={() => navigate({ to: "/welcome" })}
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
            Back
          </span>
        </motion.button>

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
          onSubmit={handleSignIn}
          className="flex flex-col gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.32 0.07 140)",
              }}
            >
              Email address
            </label>
            <input
              id="email"
              data-ocid="login.input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
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

          {/* Sign In button */}
          <button
            type="submit"
            data-ocid="login.submit_button"
            className="w-full py-3.5 mt-2 rounded-full text-white font-semibold text-base transition-all active:scale-[0.98] hover:opacity-90"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.65 0.2 35)",
              boxShadow:
                "0 4px 20px -2px oklch(0.65 0.2 35 / 0.35), 0 1px 4px -1px oklch(0.65 0.2 35 / 0.2)",
            }}
          >
            Sign In
          </button>
        </motion.form>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "oklch(0.82 0.02 70)" }}
          />
          <span
            className="text-xs whitespace-nowrap"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.6 0.04 60)",
            }}
          >
            or continue with
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "oklch(0.82 0.02 70)" }}
          />
        </motion.div>

        {/* Social auth */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          {/* Google */}
          <button
            data-ocid="login.secondary_button"
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.97] hover:shadow-md"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(1 0 0)",
              border: "1.5px solid oklch(0.88 0.025 70)",
              color: "oklch(0.28 0.04 50)",
              boxShadow: "0 1px 4px -1px oklch(0 0 0 / 0.06)",
            }}
            aria-label="Continue with Google"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              role="presentation"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Apple */}
          <button
            data-ocid="login.cancel_button"
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.97] hover:shadow-md"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.15 0.02 260)",
              border: "1.5px solid oklch(0.15 0.02 260)",
              color: "oklch(0.98 0 0)",
              boxShadow: "0 1px 4px -1px oklch(0 0 0 / 0.12)",
            }}
            aria-label="Continue with Apple"
          >
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="currentColor"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M13.233 9.611c-.02-2.102 1.716-3.115 1.795-3.165-.978-1.43-2.498-1.625-3.039-1.644-1.296-.131-2.534.763-3.192.763-.658 0-1.68-.743-2.76-.723-1.42.021-2.73.826-3.464 2.1-1.477 2.56-.378 6.356 1.063 8.436.705 1.017 1.543 2.155 2.645 2.114 1.062-.042 1.462-.683 2.745-.683 1.283 0 1.642.683 2.762.66 1.142-.02 1.862-1.036 2.562-2.056.81-1.177 1.143-2.316 1.162-2.374-.025-.011-2.223-.851-2.245-3.378l.006-.01zM11.178 3.24C11.742 2.563 12.125 1.623 12.018.663c-.82.037-1.814.547-2.4 1.237-.526.608-.987 1.576-.864 2.508.913.07 1.848-.462 2.424-1.168z" />
            </svg>
            Apple
          </button>
        </motion.div>

        <div className="flex-1" />

        {/* Sign up link */}
        <motion.p
          className="text-center text-sm"
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
            onClick={() => navigate({ to: "/welcome" })}
            className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "oklch(0.55 0.14 145)" }}
          >
            Get Started
          </button>
        </motion.p>
      </div>
    </div>
  );
}
