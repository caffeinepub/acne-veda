import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { backendInterface } from "../backend.d";
import { ConsultationResults } from "./chat/ConsultationResults";
import { ScanStep } from "./chat/ScanStep";
import {
  type ChatMessage,
  type ConsultationAnswers,
  type FlowType,
  type ScanResult,
  buildResults,
} from "./chat/consultationLogic";

type ChatEntry =
  | { kind: "doctor"; text: string; id: string }
  | { kind: "user"; text: string; id: string }
  | { kind: "typing"; id: string }
  | {
      kind: "choices";
      question: string;
      options: string[];
      stepKey: string;
      id: string;
    };

let msgId = 0;
function uid() {
  return `m${++msgId}`;
}

// ── Step definitions ──────────────────────────────────────────────────────────

const SKIN_STEPS: ChatMessage[] = [
  {
    key: "skinConcern",
    question: "Tell me your main skin concern",
    options: [
      "Acne / Pimples",
      "Pigmentation / Dark spots",
      "Dark circles",
      "Wrinkles / Ageing",
      "Dull / Uneven skin",
      "General maintenance",
    ],
  },
  {
    key: "severity",
    question: "How severe is it?",
    options: ["Mild", "Moderate", "Severe"],
  },
  {
    key: "skinType",
    question: "What is your skin type?",
    options: ["Oily", "Dry", "Combination", "Sensitive", "Not sure"],
  },
  {
    key: "sleep",
    question: "How many hours do you sleep?",
    options: ["Less than 5 hours", "5–7 hours", "7–9 hours"],
  },
  {
    key: "stress",
    question: "How stressed are you daily?",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "hydration",
    question: "How much water do you drink daily?",
    options: ["Less than 1L", "1–2L", "More than 2L"],
  },
  {
    key: "digestion",
    question: "How is your digestion?",
    options: ["Good", "Bloating", "Constipation", "Irregular"],
  },
  {
    key: "diet",
    question: "What do you eat frequently?",
    options: [
      "Oily / Fried foods",
      "Sugary foods",
      "Dairy-heavy diet",
      "Balanced diet",
    ],
  },
  {
    key: "routine",
    question: "Do you follow a skincare routine?",
    options: [
      "No routine",
      "Basic (facewash only)",
      "Regular (cleanser + moisturizer)",
      "Advanced routine",
    ],
  },
];

const HAIR_STEPS: ChatMessage[] = [
  {
    key: "hairConcern",
    question: "Tell me your main hair concern",
    options: [
      "Hair fall",
      "Dandruff",
      "Thinning hair",
      "Dry / frizzy hair",
      "Premature greying",
      "Scalp issues",
    ],
  },
  {
    key: "severity",
    question: "How severe is it?",
    options: ["Mild", "Moderate", "Severe"],
  },
  {
    key: "scalpType",
    question: "What is your scalp type?",
    options: ["Oily scalp", "Dry scalp", "Normal"],
  },
  {
    key: "sleep",
    question: "How many hours do you sleep?",
    options: ["Less than 5 hours", "5–7 hours", "7–9 hours"],
  },
  {
    key: "stress",
    question: "How stressed are you daily?",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "hydration",
    question: "How much water do you drink daily?",
    options: ["Less than 1L", "1–2L", "More than 2L"],
  },
  {
    key: "protein",
    question: "How is your protein intake?",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "oiling",
    question: "How often do you oil your hair?",
    options: ["Never", "Occasionally", "Weekly", "Regular"],
  },
  {
    key: "washing",
    question: "How often do you wash your hair?",
    options: ["Daily", "Alternate days", "Weekly"],
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function ChatConsultationPage() {
  const navigate = useNavigate();
  const { actor: rawActor } = useActor(createActor);
  const actor = rawActor as unknown as backendInterface | null;
  const bottomRef = useRef<HTMLDivElement>(null);

  const [flow, setFlow] = useState<FlowType | null>(null);
  const [answers, setAnswers] = useState<ConsultationAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [phase, setPhase] = useState<
    "flow-select" | "chat" | "scan" | "generating" | "results"
  >("flow-select");
  const [saving, setSaving] = useState(false);
  const [addingTyping, setAddingTyping] = useState(false);

  const steps =
    flow === "skin" ? SKIN_STEPS : flow === "hair" ? HAIR_STEPS : [];
  const totalSteps = steps.length + 1; // +1 for scan step

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  });

  function appendTypingThenQuestion(msg: ChatMessage, delay = 900) {
    const typingId = uid();
    setChatLog((prev) => [...prev, { kind: "typing", id: typingId }]);
    setAddingTyping(true);
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev.filter((e) => e.id !== typingId),
        { kind: "doctor", text: msg.question, id: uid() },
        {
          kind: "choices",
          question: msg.question,
          options: msg.options,
          stepKey: msg.key,
          id: uid(),
        },
      ]);
      setAddingTyping(false);
    }, delay);
  }

  function startFlow(selectedFlow: FlowType) {
    setFlow(selectedFlow);
    setPhase("chat");
    setStepIndex(0);
    const first = (selectedFlow === "skin" ? SKIN_STEPS : HAIR_STEPS)[0];
    const greetText =
      selectedFlow === "skin"
        ? "Great! I'm Dr. Vaidya AI 👨‍⚕️. I'll guide you through a quick skin consultation. Let's start!"
        : "Wonderful! I'm Dr. Vaidya AI 👨‍⚕️. I'll help you with your hair concerns. Just answer a few questions!";
    setChatLog([
      { kind: "doctor", text: greetText, id: uid() },
      { kind: "doctor", text: first.question, id: uid() },
      {
        kind: "choices",
        question: first.question,
        options: first.options,
        stepKey: first.key,
        id: uid(),
      },
    ]);
  }

  function handleChoice(stepKey: string, choice: string) {
    if (addingTyping) return;
    // Remove the choices card, add user bubble
    setChatLog((prev) => [
      ...prev.filter((e) => !(e.kind === "choices" && e.stepKey === stepKey)),
      { kind: "user", text: choice, id: uid() },
    ]);
    const newAnswers = { ...answers, [stepKey]: choice };
    setAnswers(newAnswers);

    // Hair: insert hair-fall-pattern step if "Hair fall" selected
    const enrichedSteps: ChatMessage[] = [...steps];
    if (
      flow === "hair" &&
      newAnswers.hairConcern === "Hair fall" &&
      !enrichedSteps.find((s) => s.key === "hairFallPattern")
    ) {
      enrichedSteps.splice(3, 0, {
        key: "hairFallPattern",
        question: "What is your hair fall pattern?",
        options: ["Sudden", "Gradual", "Seasonal"],
      });
    }

    const nextIndex = stepIndex + 1;
    if (nextIndex < enrichedSteps.length) {
      setStepIndex(nextIndex);
      appendTypingThenQuestion(enrichedSteps[nextIndex]);
    } else {
      // Move to scan step
      setStepIndex(nextIndex);
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            kind: "doctor",
            text: "Almost there! Let's analyze your skin with AI for a more accurate report 📸",
            id: uid(),
          },
        ]);
        setPhase("scan");
      }, 700);
    }
  }

  function handleScanComplete(result: ScanResult | null) {
    setScanResult(result);
    setPhase("generating");
    setTimeout(() => setPhase("results"), 2200);
  }

  async function handleGoToRoutine() {
    if (!actor) {
      navigate({ to: "/main" });
      return;
    }
    setSaving(true);
    try {
      const username = sessionStorage.getItem("acneveda_username") || "guest";
      const results = buildResults(answers, flow!, scanResult);
      const rootCausesArr: string[] = results.rootCauses;
      const reportObj = {
        morningRoutine: results.morningRoutine,
        nightRoutine: results.nightRoutine,
        dietAvoid: results.dietAvoid,
        dietInclude: results.dietInclude,
        weeklyPlan: results.weeklyPlan,
        lifestyleTips: results.lifestyleTips,
      };
      await actor.saveConsultationResult(
        username,
        flow!,
        BigInt(results.conditionScore),
        results.primaryConcern,
        results.severity,
        results.doshaImbalance,
        rootCausesArr,
        JSON.stringify(reportObj),
        BigInt(Date.now()),
      );
      await actor.addAssessmentHistory(username);
    } catch {
      // silently continue — don't block navigation on backend error
    }
    setSaving(false);
    navigate({ to: "/main" });
  }

  const results =
    phase === "results" ? buildResults(answers, flow!, scanResult) : null;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: "oklch(var(--background))",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 py-3 border-b"
        style={{
          borderColor: "oklch(var(--border))",
          background: "oklch(var(--card))",
        }}
      >
        <button
          type="button"
          data-ocid="chat.back_button"
          onClick={() => navigate({ to: "/main" })}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "oklch(var(--muted))" }}
          aria-label="Go back"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Dr. Vaidya AI 👨‍⚕️
          </p>
          <p
            className="text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            AI Dermatology Consultation
          </p>
        </div>
        {phase === "chat" && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: "oklch(var(--primary) / 0.12)",
              color: "oklch(var(--primary))",
            }}
          >
            Step {Math.min(stepIndex + 1, totalSteps)} / {totalSteps}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {phase === "chat" && (
        <div
          className="shrink-0 h-1"
          style={{ background: "oklch(var(--muted))" }}
        >
          <motion.div
            className="h-full rounded-r-full"
            style={{ background: "oklch(var(--primary))" }}
            animate={{
              width: `${Math.round((stepIndex / totalSteps) * 100)}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "flow-select" && (
            <FlowSelectScreen key="flow-select" onSelect={startFlow} />
          )}

          {(phase === "chat" || phase === "scan") && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3 p-4 pb-6"
              style={{ maxWidth: "480px", margin: "0 auto" }}
            >
              {chatLog.map((entry) => (
                <ChatBubble
                  key={entry.id}
                  entry={entry}
                  onChoice={handleChoice}
                />
              ))}
              {phase === "scan" && (
                <ScanStep
                  answers={answers}
                  onComplete={handleScanComplete}
                  onSkip={() => handleScanComplete(null)}
                />
              )}
              <div ref={bottomRef} />
            </motion.div>
          )}

          {phase === "generating" && <GeneratingScreen key="generating" />}

          {phase === "results" && results && (
            <ConsultationResults
              key="results"
              results={results}
              onGoToRoutine={handleGoToRoutine}
              saving={saving}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Flow Select Screen ────────────────────────────────────────────────────────

function FlowSelectScreen({
  onSelect,
}: { onSelect: (flow: FlowType) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-full gap-8 px-6 py-12"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      <div className="text-center space-y-2">
        <div className="text-4xl mb-3">🌿</div>
        <h1
          className="text-2xl font-bold"
          style={{
            color: "oklch(var(--foreground))",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          What would you like to focus on today?
        </h1>
        <p
          className="text-sm"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Choose a consultation type to begin your personalized Ayurvedic
          analysis
        </p>
      </div>
      <div className="w-full grid grid-cols-2 gap-4">
        {[
          {
            flow: "skin" as FlowType,
            icon: "✨",
            label: "Skin",
            desc: "Acne, pigmentation, dark circles, ageing & more",
            color: "oklch(var(--primary))",
          },
          {
            flow: "hair" as FlowType,
            icon: "💇",
            label: "Hair",
            desc: "Hair fall, dandruff, thinning, greying & more",
            color: "oklch(var(--secondary))",
          },
        ].map(({ flow, icon, label, desc, color }) => (
          <motion.button
            key={flow}
            type="button"
            data-ocid={`chat.select_${flow}`}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(flow)}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center"
            style={{
              background: "oklch(var(--card))",
              borderColor: color,
              boxShadow: "0 4px 20px oklch(var(--primary) / 0.08)",
            }}
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p
                className="font-bold text-base"
                style={{ color: "oklch(var(--foreground))" }}
              >
                {label}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {desc}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
      <div
        className="flex flex-wrap gap-3 justify-center text-xs"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        {[
          "AI + Dermatology Analysis",
          "Used by thousands",
          "More accurate with photo scan",
        ].map((t) => (
          <span key={t} className="flex items-center gap-1">
            <span style={{ color: "oklch(var(--primary))" }}>✓</span> {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Chat Bubble ───────────────────────────────────────────────────────────────

function ChatBubble({
  entry,
  onChoice,
}: { entry: ChatEntry; onChoice: (key: string, choice: string) => void }) {
  if (entry.kind === "typing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end gap-2"
      >
        <DoctorAvatar />
        <div
          className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center"
          style={{ background: "oklch(var(--primary) / 0.12)" }}
        >
          {["dot0", "dot1", "dot2"].map((key, i) => (
            <motion.div
              key={key}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(var(--primary))" }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.8,
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }
  if (entry.kind === "doctor") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-end gap-2"
      >
        <DoctorAvatar />
        <div
          className="px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[78%] text-sm leading-relaxed"
          style={{
            background: "oklch(var(--primary) / 0.12)",
            color: "oklch(var(--foreground))",
          }}
        >
          {entry.text}
        </div>
      </motion.div>
    );
  }
  if (entry.kind === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div
          className="px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[72%] text-sm font-medium"
          style={{
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
        >
          {entry.text}
        </div>
      </motion.div>
    );
  }
  if (entry.kind === "choices") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 pt-1"
      >
        {entry.options.map((opt) => (
          <button
            key={opt}
            type="button"
            data-ocid={`chat.choice_${entry.stepKey}`}
            onClick={() => onChoice(entry.stepKey, opt)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all active:scale-95"
            style={{
              background: "oklch(var(--card))",
              borderColor: "oklch(var(--primary) / 0.4)",
              color: "oklch(var(--primary))",
            }}
          >
            {opt}
          </button>
        ))}
      </motion.div>
    );
  }
  return null;
}

function DoctorAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-base"
      style={{ background: "oklch(var(--primary) / 0.18)" }}
    >
      👨‍⚕️
    </div>
  );
}

// ── Generating Screen ─────────────────────────────────────────────────────────

function GeneratingScreen() {
  const texts = [
    "Analyzing your responses...",
    "Mapping dosha imbalances...",
    "Generating personalized report...",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % texts.length), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-16"
    >
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid oklch(var(--primary) / 0.25)" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid oklch(var(--primary))",
            borderTopColor: "transparent",
          }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🌿
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-base font-medium text-center"
          style={{ color: "oklch(var(--foreground))" }}
        >
          {texts[idx]}
        </motion.p>
      </AnimatePresence>
      <p
        className="text-xs text-center"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        Combining Ayurvedic wisdom with modern dermatology
      </p>
    </motion.div>
  );
}
