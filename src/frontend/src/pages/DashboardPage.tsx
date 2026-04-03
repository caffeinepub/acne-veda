import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  HeartHandshake,
  Leaf,
  Loader2,
  LogOut,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const storedUser =
    typeof window !== "undefined"
      ? localStorage.getItem("acneveda_user")
      : null;
  const username = storedUser ?? "";

  // Auth guard — redirect to /login if no user
  useEffect(() => {
    if (!storedUser) {
      navigate({ to: "/login" });
    }
  }, [storedUser, navigate]);

  const { data: hasHistory, isLoading: historyLoading } = useQuery<boolean>({
    queryKey: ["hasHistory", username],
    queryFn: async () => {
      if (!actor || !username) return false;
      return actor.hasHistory(username);
    },
    enabled: !!actor && !actorFetching && !!username,
  });

  function handleLogout() {
    localStorage.removeItem("acneveda_user");
    navigate({ to: "/login" });
  }

  if (!storedUser) return null;

  return (
    <div className="relative flex flex-col min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      {/* Leaf accent top-right */}
      <div
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{ opacity: 0.14 }}
        aria-hidden="true"
      >
        <svg
          width="130"
          height="140"
          viewBox="0 0 130 140"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M120 8 C88 28, 70 68, 95 112 C108 76, 132 44, 120 8Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
          <path
            d="M134 3 C98 26, 78 68, 104 110 C118 72, 142 38, 134 3Z"
            fill="#5a9068"
            fillOpacity="0.45"
          />
        </svg>
      </div>
      {/* Leaf accent bottom-left */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none select-none"
        style={{ opacity: 0.1 }}
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
            d="M12 100 C38 74, 40 42, 16 12 C6 46, -10 78, 12 100Z"
            fill="#c87941"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-10 pb-8 max-w-sm mx-auto w-full">
        {/* Top row: logo + logout */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="w-9 h-9 rounded-full object-contain bg-white"
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
          <button
            type="button"
            data-ocid="dashboard.delete_button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80 active:scale-95"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.94 0.025 70)",
              color: "oklch(0.4 0.06 50)",
              border: "1px solid oklch(0.86 0.03 70)",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </motion.div>

        {/* Greeting */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <p
            className="text-xs font-medium uppercase tracking-widest mb-1"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.14 145)",
              letterSpacing: "0.12em",
            }}
          >
            {getGreeting()}
          </p>
          <h1
            className="text-3xl font-bold leading-tight mb-1"
            data-ocid="dashboard.card"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Welcome, {username} 🌿
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.5 0.05 60)",
            }}
          >
            {hasHistory
              ? "Continue your skin care journey."
              : "Begin your Ayurvedic skin journey."}
          </p>
        </motion.div>

        {/* Action buttons */}
        {historyLoading || actorFetching ? (
          <motion.div
            data-ocid="dashboard.loading_state"
            className="flex flex-col items-center justify-center gap-3 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "oklch(0.55 0.14 145)" }}
            />
            <p
              className="text-sm"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.05 60)",
              }}
            >
              Loading your profile…
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* New Assessment card */}
            <motion.div
              data-ocid="dashboard.panel"
              className="rounded-3xl overflow-hidden"
              style={{
                background: "oklch(1 0 0)",
                boxShadow:
                  "0 4px 28px -4px oklch(0.65 0.2 35 / 0.18), 0 1px 6px -1px oklch(0.65 0.2 35 / 0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.65 0.2 35 / 0.12)" }}
                  >
                    <ScanLine
                      className="w-6 h-6"
                      style={{ color: "oklch(0.62 0.2 35)" }}
                    />
                  </div>
                  {!hasHistory && (
                    <span
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "oklch(0.65 0.2 35 / 0.1)",
                        color: "oklch(0.58 0.18 35)",
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    >
                      <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                  )}
                </div>
                <h2
                  className="text-xl font-bold mb-1.5"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.22 0.07 50)",
                  }}
                >
                  New Assessment
                </h2>
                <p
                  className="text-sm mb-5 leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.5 0.05 60)",
                  }}
                >
                  Analyse your skin and receive personalised Ayurvedic treatment
                  recommendations.
                </p>
                <button
                  type="button"
                  data-ocid="dashboard.primary_button"
                  onClick={() => navigate({ to: "/scan" })}
                  className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    background: "oklch(0.65 0.2 35)",
                    boxShadow: "0 4px 18px -2px oklch(0.65 0.2 35 / 0.32)",
                  }}
                >
                  Start New Assessment
                </button>
              </div>
            </motion.div>

            {/* Follow-up card — only shown for returning users */}
            {hasHistory && (
              <motion.div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "oklch(1 0 0)",
                  boxShadow:
                    "0 4px 28px -4px oklch(0.55 0.14 145 / 0.16), 0 1px 6px -1px oklch(0.55 0.14 145 / 0.08)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.27 }}
              >
                <div className="p-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: "oklch(0.55 0.14 145 / 0.12)" }}
                  >
                    <HeartHandshake
                      className="w-6 h-6"
                      style={{ color: "oklch(0.48 0.14 145)" }}
                    />
                  </div>
                  <h2
                    className="text-xl font-bold mb-1.5"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "oklch(0.22 0.07 140)",
                    }}
                  >
                    Follow-Up
                  </h2>
                  <p
                    className="text-sm mb-5 leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.5 0.05 60)",
                    }}
                  >
                    Continue monitoring your skin and track your Ayurvedic
                    treatment progress.
                  </p>
                  <button
                    type="button"
                    data-ocid="dashboard.secondary_button"
                    onClick={() => navigate({ to: "/scan" })}
                    className="w-full py-3.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      background: "transparent",
                      border: "2px solid oklch(0.55 0.14 145)",
                      color: "oklch(0.42 0.14 145)",
                    }}
                  >
                    Continue Follow-Up
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Leaf tip */}
        {!historyLoading && (
          <motion.div
            className="mt-8 rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: "oklch(0.55 0.14 145 / 0.07)",
              border: "1px solid oklch(0.55 0.14 145 / 0.15)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            <Leaf
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.48 0.14 145)" }}
            />
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.1 140)",
              }}
            >
              <strong>Ayurvedic tip:</strong> Consistent daily routines
              (Dinacharya) — including oil cleansing, proper sleep, and a
              balanced diet — are the foundation of clear, radiant skin.
            </p>
          </motion.div>
        )}

        {/* Back to website */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <button
            type="button"
            data-ocid="dashboard.link"
            onClick={() => navigate({ to: "/" })}
            className="text-sm transition-opacity hover:opacity-70"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.1 145)",
            }}
          >
            ← Return to full website
          </button>
        </motion.div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.68 0.04 60)",
          }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
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
