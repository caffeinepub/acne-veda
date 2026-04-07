import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

type ConcernOption = "Skin" | "Hair" | "Both";

export function Step3Chat() {
  const navigate = useNavigate();
  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("acneveda_user") ?? "there")
      : "there";

  const [selected, setSelected] = useState<ConcernOption | null>(null);

  function handleSelect(option: ConcernOption) {
    setSelected(option);
    setTimeout(() => {
      if (option === "Skin") {
        navigate({ to: "/skin-concerns" });
      } else if (option === "Hair") {
        navigate({ to: "/consultation", search: { flow: "hair" } });
      } else {
        navigate({ to: "/skin-concerns" });
      }
    }, 320);
  }

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      <div
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{ opacity: 0.12 }}
        aria-hidden="true"
      >
        <svg
          width="110"
          height="120"
          viewBox="0 0 110 120"
          fill="none"
          role="img"
          aria-label="leaf decoration"
        >
          <title>leaf decoration</title>
          <path
            d="M100 6C70 24 54 58 76 96C88 62 110 32 100 6Z"
            fill="oklch(0.55 0.14 145)"
          />
          <path
            d="M112 2C78 22 60 58 84 94C98 58 120 28 112 2Z"
            fill="oklch(0.62 0.12 145)"
            fillOpacity="0.5"
          />
        </svg>
      </div>
      <div
        className="absolute bottom-0 left-0 pointer-events-none select-none"
        style={{ opacity: 0.08 }}
        aria-hidden="true"
      >
        <svg
          width="90"
          height="100"
          viewBox="0 0 90 100"
          fill="none"
          role="img"
          aria-label="leaf decoration"
        >
          <title>leaf decoration</title>
          <path
            d="M10 90C34 66 36 36 14 10C6 42 -8 70 10 90Z"
            fill="oklch(0.52 0.18 145)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col max-w-sm mx-auto w-full px-5 pt-10 pb-8 min-h-screen">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.52 0.14 145)",
              }}
            >
              Step 3 of 3
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.6 0.04 60)",
              }}
            >
              100%
            </span>
          </div>
          <div
            className="w-full rounded-full h-1.5"
            style={{ background: "oklch(0.9 0.02 80)" }}
          >
            <motion.div
              className="h-1.5 rounded-full"
              style={{ background: "oklch(0.52 0.18 145)" }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.52 0.18 145)",
              boxShadow: "0 4px 16px -2px oklch(0.52 0.18 145 / 0.35)",
            }}
          >
            <span
              className="text-base font-bold"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.99 0.006 80)",
              }}
            >
              DV
            </span>
          </div>
          <div>
            <h2
              className="text-lg font-bold leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
            >
              Dr. Vaidya \uD83D\uDE0A
            </h2>
            <p
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.52 0.04 60)",
              }}
            >
              Hi {username}, thanks for sharing your details.
            </p>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col justify-end gap-4">
          <motion.div
            className="flex items-end gap-2.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mb-1"
              style={{
                background: "oklch(0.52 0.18 145)",
                boxShadow: "0 2px 8px -2px oklch(0.52 0.18 145 / 0.3)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.99 0.006 80)",
                }}
              >
                DV
              </span>
            </div>
            <div className="flex flex-col gap-2.5 max-w-[82%]">
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{
                  background: "oklch(1 0 0)",
                  boxShadow: "0 4px 20px -4px oklch(0.55 0.14 145 / 0.14)",
                  border: "1px solid oklch(0.9 0.02 80)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.3 0.06 60)",
                  }}
                >
                  Are you facing concerns related to:
                </p>
              </div>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 }}
              >
                {(["Skin", "Hair", "Both"] as ConcernOption[]).map(
                  (option, idx) => (
                    <motion.button
                      key={option}
                      type="button"
                      data-ocid="assessment.step3.radio"
                      onClick={() => handleSelect(option)}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        background:
                          selected === option
                            ? "oklch(0.52 0.18 145)"
                            : "oklch(1 0 0)",
                        color:
                          selected === option
                            ? "oklch(0.99 0.006 80)"
                            : "oklch(0.38 0.1 140)",
                        border:
                          selected === option
                            ? "1.5px solid oklch(0.52 0.18 145)"
                            : "1.5px solid oklch(0.52 0.18 145 / 0.4)",
                        boxShadow:
                          selected === option
                            ? "0 4px 14px -2px oklch(0.52 0.18 145 / 0.32)"
                            : "0 2px 8px -2px oklch(0.55 0.14 145 / 0.08)",
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + idx * 0.08 }}
                    >
                      {option === "Skin" && "\uD83C\uDF3F "}
                      {option === "Hair" && "\u2728 "}
                      {option === "Both" && "\uD83D\uDC9A "}
                      {option}
                    </motion.button>
                  ),
                )}
              </motion.div>
            </div>
          </motion.div>

          {selected === null && (
            <motion.div
              className="flex items-center gap-2 ml-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div
                className="px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                style={{
                  background: "oklch(0.9 0.02 80)",
                  border: "1px solid oklch(0.88 0.025 70)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                    style={{
                      background: "oklch(0.55 0.12 145)",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.p
          className="mt-8 text-center text-xs"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.68 0.04 60)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          \u00A9 {new Date().getFullYear()}. Built with \u2764\uFE0F using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-1 hover:opacity-70 transition-opacity"
            style={{ color: "oklch(0.55 0.14 145)" }}
          >
            caffeine.ai
          </a>
        </motion.p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
