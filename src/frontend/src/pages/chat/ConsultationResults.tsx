import { motion } from "motion/react";
import type { ConsultationReport } from "./consultationLogic";

interface ConsultationResultsProps {
  results: ConsultationReport;
  onGoToRoutine: () => void;
  saving: boolean;
}

export function ConsultationResults({
  results,
  onGoToRoutine,
  saving,
}: ConsultationResultsProps) {
  const score = results.conditionScore;
  const circumference = 2 * Math.PI * 38;
  const strokeDash = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-6 space-y-5 pb-10"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xl font-bold"
          style={{
            color: "oklch(var(--foreground))",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Your Personalized Report 🌿
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Based on AI + Ayurvedic Analysis
        </p>
      </div>

      {/* Condition Score */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0 w-24 h-24">
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              aria-label={`Condition score: ${score} out of 100`}
              role="img"
            >
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="oklch(var(--muted))"
                strokeWidth="6"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="oklch(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                transform="rotate(-90 48 48)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeDash }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-2xl font-bold"
                style={{ color: "oklch(var(--primary))" }}
              >
                {score}
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                /100
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium mb-1"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              CONDITION SCORE
            </p>
            <SeverityBadge severity={results.severity} />
            <p
              className="text-sm mt-2 leading-relaxed"
              style={{ color: "oklch(var(--foreground))" }}
            >
              {results.diagnosis}
            </p>
          </div>
        </div>
      </Card>

      {/* Dosha */}
      <Card>
        <SectionTitle>🧘 Ayurvedic Dosha Mapping</SectionTitle>
        <div className="flex items-start gap-3 mt-3">
          <div
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              background: "oklch(var(--primary) / 0.12)",
              color: "oklch(var(--primary))",
            }}
          >
            {results.doshaImbalance}
          </div>
          <p
            className="text-sm flex-1"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {results.doshaExplanation}
          </p>
        </div>
      </Card>

      {/* Root Causes */}
      <Card>
        <SectionTitle>🔍 Root Cause Analysis</SectionTitle>
        <ul className="mt-3 space-y-2">
          {results.rootCauses.map((cause) => (
            <li
              key={cause}
              className="flex items-start gap-2 text-sm"
              style={{ color: "oklch(var(--foreground))" }}
            >
              <span
                className="mt-0.5 shrink-0"
                style={{ color: "oklch(var(--primary))" }}
              >
                ●
              </span>
              {cause}
            </li>
          ))}
        </ul>
      </Card>

      {/* Daily Routine */}
      <Card>
        <SectionTitle>☀️ Daily Routine</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "oklch(var(--secondary))" }}
            >
              Morning
            </p>
            {results.morningRoutine.map((step) => (
              <div
                key={step}
                className="flex items-start gap-1.5 mb-1.5 text-xs"
                style={{ color: "oklch(var(--foreground))" }}
              >
                <span
                  className="mt-0.5"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  ✓
                </span>{" "}
                {step}
              </div>
            ))}
          </div>
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "oklch(var(--primary))" }}
            >
              Night
            </p>
            {results.nightRoutine.map((step) => (
              <div
                key={step}
                className="flex items-start gap-1.5 mb-1.5 text-xs"
                style={{ color: "oklch(var(--foreground))" }}
              >
                <span
                  className="mt-0.5"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  ✓
                </span>{" "}
                {step}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Lifestyle Tips */}
      <Card>
        <SectionTitle>🌙 Lifestyle Fixes</SectionTitle>
        <div className="space-y-2 mt-3">
          {results.lifestyleTips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-2 text-sm p-3 rounded-xl"
              style={{
                background: "oklch(var(--muted))",
                color: "oklch(var(--foreground))",
              }}
            >
              <span style={{ color: "oklch(var(--secondary))" }}>💡</span> {tip}
            </div>
          ))}
        </div>
      </Card>

      {/* Diet */}
      <Card>
        <SectionTitle>🍽️ Diet Suggestions</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "oklch(var(--destructive))" }}
            >
              Avoid
            </p>
            <div className="flex flex-wrap gap-1.5">
              {results.dietAvoid.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "oklch(var(--destructive) / 0.1)",
                    color: "oklch(var(--destructive))",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "oklch(var(--primary))" }}
            >
              Include
            </p>
            <div className="flex flex-wrap gap-1.5">
              {results.dietInclude.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "oklch(var(--primary) / 0.1)",
                    color: "oklch(var(--primary))",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Plan */}
      <Card>
        <SectionTitle>🗓️ Weekly Care Plan</SectionTitle>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {results.weeklyPlan.map(({ day, task }) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "oklch(var(--primary) / 0.12)",
                  color: "oklch(var(--primary))",
                }}
              >
                {day.slice(0, 2)}
              </div>
              <p
                className="text-center text-xs leading-tight"
                style={{
                  color: "oklch(var(--muted-foreground))",
                  fontSize: "9px",
                }}
              >
                {task}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <motion.button
        type="button"
        data-ocid="results.go_to_routine"
        onClick={onGoToRoutine}
        disabled={saving}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl text-base font-bold transition-all"
        style={{
          background: saving ? "oklch(var(--muted))" : "oklch(var(--primary))",
          color: saving
            ? "oklch(var(--muted-foreground))"
            : "oklch(var(--primary-foreground))",
        }}
      >
        {saving ? "Saving..." : "Go to My Routine →"}
      </motion.button>

      <p
        className="text-center text-xs pb-2"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        Results are based on AI + Ayurvedic analysis. Consult an Ayurvedic
        physician before starting any regimen.
      </p>
    </motion.div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        background: "oklch(var(--card))",
        borderColor: "oklch(var(--border))",
        boxShadow: "0 2px 12px oklch(var(--foreground) / 0.04)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-sm font-semibold"
      style={{ color: "oklch(var(--foreground))" }}
    >
      {children}
    </p>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    Mild: "oklch(0.68 0.14 145)",
    Moderate: "oklch(0.72 0.18 55)",
    Severe: "oklch(0.65 0.22 30)",
  };
  const color = colors[severity] || colors.Moderate;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${color}20`, color }}
    >
      {severity}
    </span>
  );
}
