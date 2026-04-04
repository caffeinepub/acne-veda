import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";

export function Step2Analyzing() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/assessment/step3" });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-6"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      {/* Leaf decoration top-right */}
      <div
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{ opacity: 0.1 }}
        aria-hidden="true"
      >
        <svg
          width="100"
          height="110"
          viewBox="0 0 100 110"
          fill="none"
          role="img"
          aria-label="leaf decoration"
        >
          <title>leaf decoration</title>
          <path
            d="M90 5C62 22 48 54 68 90C80 56 100 28 90 5Z"
            fill="oklch(0.55 0.14 145)"
          />
        </svg>
      </div>
      {/* Leaf decoration bottom-left */}
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

      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Progress */}
        <motion.div
          className="w-full mb-10"
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
              Step 2 of 3
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.6 0.04 60)",
              }}
            >
              66%
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
              animate={{ width: "66%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            role="img"
            aria-label="AI analysis illustration"
          >
            <title>AI analysis illustration</title>
            {/* Outer glow ring */}
            <circle cx="90" cy="90" r="78" fill="oklch(0.52 0.18 145 / 0.07)" />
            <circle cx="90" cy="90" r="64" fill="oklch(0.52 0.18 145 / 0.10)" />
            {/* Face circle */}
            <circle cx="90" cy="90" r="50" fill="oklch(0.52 0.18 145 / 0.16)" />
            <circle
              cx="90"
              cy="90"
              r="48"
              stroke="oklch(0.52 0.18 145)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 4"
            />
            {/* Person silhouette */}
            <circle cx="90" cy="80" r="16" fill="oklch(0.52 0.18 145 / 0.5)" />
            <path
              d="M62 118 C62 102 74 96 90 96 C106 96 118 102 118 118"
              fill="oklch(0.52 0.18 145 / 0.4)"
            />
            {/* Magnifying glass */}
            <circle
              cx="116"
              cy="62"
              r="14"
              stroke="oklch(0.42 0.16 145)"
              strokeWidth="3"
              fill="oklch(0.92 0.03 80)"
            />
            <line
              x1="126"
              y1="72"
              x2="136"
              y2="82"
              stroke="oklch(0.42 0.16 145)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Sparkle elements */}
            <g fill="oklch(0.62 0.18 145)">
              <polygon
                points="54,42 56,48 62,48 57,52 59,58 54,54 49,58 51,52 46,48 52,48"
                fillOpacity="0.7"
              />
            </g>
            <circle
              cx="140"
              cy="45"
              r="4"
              fill="oklch(0.65 0.18 145)"
              fillOpacity="0.7"
            />
            <circle
              cx="148"
              cy="38"
              r="2.5"
              fill="oklch(0.65 0.18 145)"
              fillOpacity="0.55"
            />
            <circle
              cx="38"
              cy="120"
              r="3"
              fill="oklch(0.65 0.18 145)"
              fillOpacity="0.5"
            />
            {/* Leaf accent */}
            <path
              d="M146 100 C140 92 130 90 128 98 C134 96 140 102 146 100Z"
              fill="oklch(0.52 0.18 145)"
              fillOpacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Analyzing your profile…
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            Preparing your personalized questions
          </p>
        </motion.div>

        {/* Pulsing dots */}
        <motion.div
          className="flex items-center gap-2.5 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          data-ocid="assessment.step2.loading_state"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-pulse-dot"
              style={{
                background: "oklch(0.52 0.18 145)",
                animationDelay: `${i * 0.22}s`,
              }}
            />
          ))}
        </motion.div>

        {/* Skip link */}
        <motion.button
          type="button"
          data-ocid="assessment.step2.link"
          onClick={() => navigate({ to: "/assessment/step3" })}
          className="text-sm underline underline-offset-2 transition-opacity hover:opacity-60"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.56 0.08 60)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Skip
        </motion.button>
      </div>

      {/* Pulsing dot keyframes injected via style tag */}
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
