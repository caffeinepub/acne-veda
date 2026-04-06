import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { LeafDecorations } from "../components/LeafDecorations";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem("acneveda_user");
      navigate({ to: user ? "/main" : "/welcome" });
    }, 2400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      <LeafDecorations opacity={0.22} />

      <motion.div
        className="flex flex-col items-center gap-6 z-10"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div
            className="w-36 h-36 rounded-full overflow-hidden"
            style={{
              boxShadow:
                "0 8px 40px -8px oklch(0.55 0.14 145 / 0.22), 0 2px 12px -2px oklch(0.55 0.14 145 / 0.12)",
            }}
          >
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="w-full h-full object-contain bg-white"
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <h1
            className="text-4xl font-bold tracking-tight mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.28 0.08 140)",
            }}
          >
            Acne Veda
          </h1>
          <p
            className="text-base tracking-widest uppercase"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.55 0.14 145)",
              letterSpacing: "0.2em",
            }}
          >
            Clear Skin Naturally
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <div
            className="h-px w-8"
            style={{ background: "oklch(0.55 0.14 145 / 0.4)" }}
          />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            role="presentation"
          >
            <circle
              cx="6"
              cy="6"
              r="2"
              fill="oklch(0.55 0.14 145)"
              fillOpacity="0.5"
            />
            <circle
              cx="6"
              cy="6"
              r="5"
              stroke="oklch(0.55 0.14 145)"
              strokeOpacity="0.3"
              strokeWidth="0.8"
            />
          </svg>
          <div
            className="h-px w-8"
            style={{ background: "oklch(0.55 0.14 145 / 0.4)" }}
          />
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.55 0.14 145 / 0.5)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
