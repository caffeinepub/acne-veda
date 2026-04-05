import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const concerns = [
  {
    id: "acne",
    icon: "🌋",
    title: "Acne",
    subtitle: "Pimples, breakouts & blemishes",
    primary: true,
    badge: "Most Common",
  },
  {
    id: "pigmentation",
    icon: "🎨",
    title: "Pigmentation",
    subtitle: "Uneven skin tone & patches",
    primary: false,
  },
  {
    id: "dark-spots",
    icon: "🌑",
    title: "Dark Spots",
    subtitle: "Post-acne marks & sun spots",
    primary: false,
  },
  {
    id: "dark-circles",
    icon: "👁️",
    title: "Dark Circles",
    subtitle: "Under-eye darkness & puffiness",
    primary: false,
  },
  {
    id: "wrinkles",
    icon: "🕰️",
    title: "Wrinkles / Aging",
    subtitle: "Fine lines & loss of firmness",
    primary: false,
  },
  {
    id: "healthy-skin",
    icon: "✨",
    title: "Healthy Skin",
    subtitle: "Maintenance & natural glow",
    primary: false,
  },
];

export function SkinConcernsPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  function handleCardClick(id: string) {
    if (id === "acne") {
      navigate({ to: "/acne-chat" });
    } else {
      toast("Coming Soon 🌿", {
        description: "This concern will be available in the next update.",
        duration: 2800,
      });
    }
  }

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      {/* Leaf decoration top-right */}
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
          role="presentation"
        >
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
          role="presentation"
        >
          <path
            d="M10 90C34 66 36 36 14 10C6 42 -8 70 10 90Z"
            fill="oklch(0.52 0.18 145)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col max-w-sm mx-auto w-full px-5 pt-8 pb-10 min-h-screen">
        {/* Back button */}
        <motion.button
          type="button"
          data-ocid="skin-concerns.link"
          onClick={() => navigate({ to: "/assessment/step3" })}
          className="flex items-center gap-1.5 text-sm font-medium mb-6 w-fit"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.48 0.14 145)",
          }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.06 }}
        >
          <h1
            className="text-2xl font-bold leading-snug mb-1.5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Tell us your skin concern
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            Our AI will create a personalized treatment plan for you
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          {[
            { icon: "🧠", text: "AI + Dermatology Analysis" },
            { icon: "📸", text: "More accurate with photo scan" },
            { icon: "👥", text: "Used by thousands of users" },
          ].map((badge) => (
            <span
              key={badge.text}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: "oklch(0.52 0.18 145 / 0.08)",
                border: "1px solid oklch(0.52 0.18 145 / 0.2)",
                color: "oklch(0.38 0.12 145)",
              }}
            >
              <span>{badge.icon}</span>
              {badge.text}
            </span>
          ))}
        </motion.div>

        {/* Concern cards grid */}
        <div className="grid grid-cols-2 gap-3">
          {concerns.map((concern, idx) => (
            <motion.button
              key={concern.id}
              type="button"
              data-ocid={`skin-concerns.item.${idx + 1}`}
              onClick={() => handleCardClick(concern.id)}
              onMouseEnter={() => setHovered(concern.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative text-left flex flex-col p-4 rounded-3xl transition-all active:scale-[0.97] focus:outline-none"
              style={{
                background: concern.primary ? "oklch(1 0 0)" : "oklch(1 0 0)",
                border: concern.primary
                  ? `2px solid oklch(0.52 0.18 145 / ${hovered === concern.id ? "0.7" : "0.35"})`
                  : `1.5px solid oklch(0.88 0.025 70 / ${hovered === concern.id ? "0" : "1"})`,
                boxShadow: concern.primary
                  ? hovered === concern.id
                    ? "0 6px 28px -4px oklch(0.52 0.18 145 / 0.38), 0 0 0 3px oklch(0.52 0.18 145 / 0.1)"
                    : "0 4px 20px -4px oklch(0.52 0.18 145 / 0.22), 0 0 0 2px oklch(0.52 0.18 145 / 0.06)"
                  : hovered === concern.id
                    ? "0 6px 20px -4px oklch(0.55 0.14 145 / 0.18)"
                    : "0 2px 12px -2px oklch(0.55 0.14 145 / 0.08)",
                transform:
                  hovered === concern.id
                    ? "translateY(-2px) scale(1.01)"
                    : "none",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.2 + idx * 0.06 }}
            >
              {/* "Most Common" badge */}
              {concern.badge && (
                <span
                  className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    background: "oklch(0.52 0.18 145)",
                    color: "oklch(0.99 0.006 80)",
                    fontSize: "0.6rem",
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {concern.badge}
                </span>
              )}

              {/* Icon */}
              <span className="text-2xl mb-2.5 block leading-none">
                {concern.icon}
              </span>

              {/* Title */}
              <span
                className="font-bold text-sm leading-tight mb-1 block"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: concern.primary
                    ? "oklch(0.3 0.1 145)"
                    : "oklch(0.28 0.06 60)",
                }}
              >
                {concern.title}
              </span>

              {/* Subtitle */}
              <span
                className="text-xs leading-snug block"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.6 0.04 60)",
                }}
              >
                {concern.subtitle}
              </span>

              {/* Green accent bar for primary */}
              {concern.primary && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
                  style={{ background: "oklch(0.52 0.18 145 / 0.25)" }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-center text-xs"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.68 0.04 60)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
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
        </motion.p>
      </div>
    </div>
  );
}
