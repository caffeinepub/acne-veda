import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LeafDecorations } from "../components/LeafDecorations";

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      <LeafDecorations opacity={0.2} />

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-12 pb-8">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-white"
            style={{
              boxShadow:
                "0 4px 24px -4px oklch(0.55 0.14 145 / 0.2), 0 1px 6px -1px oklch(0.55 0.14 145 / 0.1)",
            }}
          >
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Hero text */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-3xl font-bold leading-tight mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.25 0.07 140)",
            }}
          >
            Your Skin Deserves{" "}
            <span
              style={{ color: "oklch(0.55 0.14 145)", fontStyle: "italic" }}
            >
              Natural Care
            </span>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.48 0.06 60)",
            }}
          >
            Discover personalised Ayurvedic solutions for clear, healthy skin
            &mdash; rooted in ancient wisdom
          </p>
        </motion.div>

        {/* Botanical illustration */}
        <motion.div
          className="flex justify-center my-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            width="200"
            height="100"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <path
              d="M40 90 C50 70, 55 50, 45 20"
              stroke="#4a7c59"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
            />
            <path
              d="M45 20 C35 25, 20 30, 30 45 C40 35, 48 28, 45 20Z"
              fill="#4a7c59"
              fillOpacity="0.35"
            />
            <path
              d="M47 40 C37 40, 25 48, 38 58 C44 48, 48 44, 47 40Z"
              fill="#5a9068"
              fillOpacity="0.3"
            />
            <path
              d="M46 62 C36 58, 28 66, 40 73 C43 65, 46 66, 46 62Z"
              fill="#4a7c59"
              fillOpacity="0.3"
            />
            <circle cx="100" cy="55" r="22" fill="#4a7c59" fillOpacity="0.06" />
            <circle cx="100" cy="55" r="14" fill="#4a7c59" fillOpacity="0.08" />
            <path
              d="M100 33 C95 42, 90 50, 100 55 C110 50, 105 42, 100 33Z"
              fill="#4a7c59"
              fillOpacity="0.4"
            />
            <path
              d="M100 33 C105 42, 110 50, 100 55 C90 50, 95 42, 100 33Z"
              fill="#3d6b4a"
              fillOpacity="0.3"
            />
            <path
              d="M122 55 C113 50, 105 50, 100 55 C105 60, 113 60, 122 55Z"
              fill="#4a7c59"
              fillOpacity="0.4"
            />
            <path
              d="M78 55 C87 50, 95 50, 100 55 C95 60, 87 60, 78 55Z"
              fill="#4a7c59"
              fillOpacity="0.4"
            />
            <circle cx="100" cy="55" r="4" fill="#4a7c59" fillOpacity="0.5" />
            <path
              d="M160 90 C150 70, 145 50, 155 20"
              stroke="#4a7c59"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
            />
            <path
              d="M155 20 C165 25, 180 30, 170 45 C160 35, 152 28, 155 20Z"
              fill="#4a7c59"
              fillOpacity="0.35"
            />
            <path
              d="M153 40 C163 40, 175 48, 162 58 C156 48, 152 44, 153 40Z"
              fill="#5a9068"
              fillOpacity="0.3"
            />
            <path
              d="M154 62 C164 58, 172 66, 160 73 C157 65, 154 66, 154 62Z"
              fill="#4a7c59"
              fillOpacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {["🌿 Ayurvedic", "🩺 AI-Powered", "✅ Free"].map((item) => (
            <span
              key={item}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: "oklch(0.52 0.18 145 / 0.1)",
                color: "oklch(0.38 0.14 145)",
                border: "1px solid oklch(0.52 0.18 145 / 0.2)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>

        <div className="flex-1" />

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            type="button"
            data-ocid="welcome.primary_button"
            onClick={() => navigate({ to: "/signup" })}
            className="w-full py-3.5 rounded-full text-white font-semibold text-base transition-all active:scale-[0.98] hover:opacity-90"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.65 0.2 35)",
              boxShadow: "0 4px 20px -2px oklch(0.65 0.2 35 / 0.35)",
            }}
          >
            Get Started Free
          </button>

          <button
            type="button"
            data-ocid="welcome.secondary_button"
            onClick={() => navigate({ to: "/login" })}
            className="w-full py-3.5 rounded-full font-semibold text-base transition-all active:scale-[0.98]"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.35 0.1 140)",
              border: "1.5px solid oklch(0.55 0.14 145 / 0.4)",
              background: "transparent",
            }}
          >
            Log In
          </button>
        </motion.div>

        <motion.p
          className="text-center text-xs"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.58 0.05 60)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Made by Dr. Akash Hari (BAMS)
        </motion.p>
      </div>
    </div>
  );
}
