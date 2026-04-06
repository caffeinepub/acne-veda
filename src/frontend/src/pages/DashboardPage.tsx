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
    } else {
      // If already logged in, redirect to main app
      navigate({ to: "/main" });
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
          width="120"
          height="130"
          viewBox="0 0 120 130"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M110 10 C78 28, 60 68, 85 110 C97 75, 118 42, 110 10Z"
            fill="#4a7c59"
            fillOpacity="0.6"
          />
          <path
            d="M120 5 C85 25, 68 65, 95 108 C107 72, 128 38, 120 5Z"
            fill="#5a9068"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 pt-6 pb-8 max-w-sm mx-auto w-full">
        {/* Header: logo + logout */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full overflow-hidden"
              style={{
                boxShadow: "0 2px 8px oklch(0.55 0.14 145 / 0.18)",
              }}
            >
              <img
                src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
                alt="Acne Veda"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.35 0.1 140)",
              }}
            >
              Acne Veda
            </span>
          </div>
          <button
            type="button"
            data-ocid="dashboard.delete_button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "12px",
              color: "oklch(0.48 0.14 25)",
              background: "oklch(0.96 0.04 25 / 0.5)",
              border: "1px solid oklch(0.88 0.06 25)",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </motion.div>

        {/* Greeting */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <p
            className="text-sm mb-1"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.06 60)",
            }}
          >
            {getGreeting()},
          </p>
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.28 0.08 140)",
            }}
          >
            Welcome, {username} 👋
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.04 60)",
            }}
          >
            Made by Dr. Akash Hari (BAMS)
          </p>
        </motion.div>

        {/* Assessment cards */}
        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "oklch(0.55 0.14 145)" }}
            />
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            {/* New Assessment */}
            <button
              type="button"
              data-ocid="dashboard.primary_button"
              onClick={() => navigate({ to: "/assessment/step1" })}
              className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-all active:scale-[0.98] hover:shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.45 0.16 158))",
                boxShadow: "0 6px 24px -4px oklch(0.52 0.18 145 / 0.35)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.99 0.006 80 / 0.15)" }}
              >
                <ScanLine
                  className="w-6 h-6"
                  style={{ color: "oklch(0.99 0.006 80)" }}
                />
              </div>
              <div>
                <p
                  className="font-bold text-base mb-0.5"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.99 0.006 80)",
                  }}
                >
                  New Assessment
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.99 0.006 80 / 0.8)",
                  }}
                >
                  Start your personalized skin analysis
                </p>
              </div>
            </button>

            {/* Follow-up — only shown if user has history */}
            {hasHistory && (
              <button
                type="button"
                data-ocid="dashboard.secondary_button"
                onClick={() => navigate({ to: "/main" })}
                className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-all active:scale-[0.98] hover:shadow-md"
                style={{
                  background: "oklch(0.99 0.006 80)",
                  border: "1.5px solid oklch(0.88 0.04 80)",
                  boxShadow: "0 4px 16px -4px oklch(0.55 0.04 60 / 0.12)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.95 0.06 145 / 0.3)" }}
                >
                  <HeartHandshake
                    className="w-6 h-6"
                    style={{ color: "oklch(0.48 0.14 145)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-bold text-base mb-0.5"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.28 0.08 140)",
                    }}
                  >
                    Follow-up
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.55 0.04 60)",
                    }}
                  >
                    Continue your treatment journey
                  </p>
                </div>
              </button>
            )}
          </motion.div>
        )}

        {/* Ayurvedic tip */}
        <motion.div
          className="mt-6 rounded-2xl p-4 flex gap-3"
          style={{
            background: "oklch(0.96 0.04 145 / 0.4)",
            border: "1px solid oklch(0.88 0.06 145 / 0.4)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <Leaf
            className="w-4 h-4 flex-shrink-0 mt-0.5"
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
            (Dinacharya) — including oil cleansing, proper sleep, and a balanced
            diet — are the foundation of clear, radiant skin.
          </p>
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
