import { Camera, CheckCircle, ChevronLeft, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatPhase =
  | "entry"
  | "skin_concern"
  | "skin_severity"
  | "skin_type"
  | "skin_lifestyle_sleep"
  | "skin_lifestyle_stress"
  | "hair_concern"
  | "hair_severity"
  | "hair_scalp"
  | "hair_lifestyle_sleep"
  | "hair_lifestyle_stress"
  | "scan"
  | "scan_analyzing"
  | "scan_result"
  | "analysis";

type Message = { id: string; from: "bot" | "user"; text: string };

interface ConsultationData {
  phase: ChatPhase;
  focus: "skin" | "hair" | "both" | null;
  skinConcern: string | null;
  skinSeverity: string | null;
  skinType: string | null;
  skinSleep: string | null;
  skinStress: string | null;
  hairConcern: string | null;
  hairSeverity: string | null;
  hairScalp: string | null;
  hairSleep: string | null;
  hairStress: string | null;
  scanResult: string | null;
}

// ─── Step config ─────────────────────────────────────────────────────────────

const STEP_COUNT: Record<ChatPhase, number> = {
  entry: 1,
  skin_concern: 2,
  skin_severity: 3,
  skin_type: 4,
  skin_lifestyle_sleep: 5,
  skin_lifestyle_stress: 6,
  hair_concern: 2,
  hair_severity: 3,
  hair_scalp: 4,
  hair_lifestyle_sleep: 5,
  hair_lifestyle_stress: 6,
  scan: 7,
  scan_analyzing: 7,
  scan_result: 7,
  analysis: 8,
};

const TOTAL_STEPS = 8;

const PHASE_CHIPS: Record<ChatPhase, string[]> = {
  entry: ["🌿 Skin", "💇 Hair", "🌿 Both"],
  skin_concern: [
    "Acne / Pimples",
    "Pigmentation / Dark Spots",
    "Dark Circles",
    "Wrinkles / Ageing",
    "Dull Skin",
    "Healthy Skin",
  ],
  skin_severity: ["Mild", "Moderate", "Severe"],
  skin_type: ["Oily", "Dry", "Combination", "Sensitive", "Not sure"],
  skin_lifestyle_sleep: ["Less than 5 hrs", "5–7 hrs", "7–9 hrs"],
  skin_lifestyle_stress: ["Low", "Moderate", "High"],
  hair_concern: [
    "Hair Fall",
    "Dandruff",
    "Thinning Hair",
    "Dry / Frizzy Hair",
    "Premature Greying",
    "Scalp Issues",
  ],
  hair_severity: ["Mild", "Moderate", "Severe"],
  hair_scalp: ["Oily Scalp", "Dry Scalp", "Normal Scalp"],
  hair_lifestyle_sleep: ["Less than 5 hrs", "5–7 hrs", "7–9 hrs"],
  hair_lifestyle_stress: ["Low", "Moderate", "High"],
  scan: [],
  scan_analyzing: [],
  scan_result: [],
  analysis: [],
};

const ACNE_TYPES = [
  { type: "Pustules", confidence: 78, dominant: true },
  { type: "Papules", confidence: 65, dominant: false },
  { type: "Blackheads", confidence: 42, dominant: false },
  { type: "Whiteheads", confidence: 31, dominant: false },
  { type: "Nodules", confidence: 12, dominant: false },
];

// ─── Analysis engine ──────────────────────────────────────────────────────────

function computeScore(data: ConsultationData): number {
  let base = 60;
  if (data.skinSeverity === "Mild" || data.hairSeverity === "Mild") base -= 10;
  if (data.skinSeverity === "Severe" || data.hairSeverity === "Severe")
    base += 20;
  if (data.skinStress === "High" || data.hairStress === "High") base += 10;
  if (
    data.skinSleep === "Less than 5 hrs" ||
    data.hairSleep === "Less than 5 hrs"
  )
    base += 8;
  if (data.scanResult) base += 5;
  return Math.min(Math.max(base, 25), 95);
}

function getDosha(data: ConsultationData): string {
  const concern = (data.skinConcern ?? data.hairConcern ?? "").toLowerCase();
  if (
    concern.includes("acne") ||
    concern.includes("pigment") ||
    concern.includes("grey")
  )
    return "Pitta";
  if (
    concern.includes("dry") ||
    concern.includes("thin") ||
    concern.includes("age") ||
    concern.includes("fall")
  )
    return "Vata";
  return "Kapha";
}

function getRootCauses(data: ConsultationData): string[] {
  const causes: string[] = [];
  if (data.skinStress === "High" || data.hairStress === "High")
    causes.push("Chronic stress disrupting hormonal balance");
  if (
    data.skinSleep === "Less than 5 hrs" ||
    data.hairSleep === "Less than 5 hrs"
  )
    causes.push("Insufficient sleep reducing skin repair");
  const concern = (data.skinConcern ?? data.hairConcern ?? "").toLowerCase();
  if (concern.includes("acne"))
    causes.push("Excess sebum and bacterial accumulation");
  else if (concern.includes("fall") || concern.includes("thin"))
    causes.push("Nutritional deficiency weakening follicles");
  else if (concern.includes("dandruff"))
    causes.push("Scalp microbiome imbalance");
  else causes.push("Accumulated toxins (Ama) affecting skin clarity");
  if (causes.length < 3) causes.push("Lifestyle and dietary imbalance");
  return causes.slice(0, 3);
}

function getTreatmentSummary(data: ConsultationData): string {
  const concern = (data.skinConcern ?? data.hairConcern ?? "").toLowerCase();
  if (concern.includes("acne"))
    return "Neem cleanser AM + PM · Kumkumadi spot treatment at night · Avoid dairy & fried foods · Sheetali Pranayama 5 min/day";
  if (concern.includes("pigment") || concern.includes("dark spot"))
    return "Vitamin C serum AM · SPF 50 daily · Kumkumadi oil PM · Include amla & citrus in diet";
  if (concern.includes("fall") || concern.includes("thin"))
    return "Bhringraj oil 2×/week · Protein-rich diet · Brahmi + Amla powder in warm water daily";
  if (concern.includes("dandruff"))
    return "Neem + tea tree scalp oil · Anti-dandruff wash 2–3×/week · Reduce sugar & processed foods";
  return "Gentle cleanser + aloe vera gel + light moisturizer · Hydrate well · Seasonal fruits daily";
}

// ─── Bot response builder ─────────────────────────────────────────────────────

function getNextBotMessage(
  phase: ChatPhase,
  userText: string,
  data: ConsultationData,
): { text: string; nextPhase: ChatPhase; updatedData: ConsultationData } {
  switch (phase) {
    case "entry": {
      const lower = userText.toLowerCase();
      const focus: "skin" | "hair" | "both" =
        lower.includes("hair") && lower.includes("skin")
          ? "both"
          : lower.includes("hair")
            ? "hair"
            : "skin";
      const nextPhase: ChatPhase =
        focus === "hair" ? "hair_concern" : "skin_concern";
      const text =
        focus === "hair"
          ? "Got it! 💇 Let me understand your hair concern better.\n\nWhat is your main hair concern?"
          : "Got it! 🌿 Let me understand your skin better.\n\nWhat is your main skin concern?";
      return {
        text,
        nextPhase,
        updatedData: { ...data, focus, phase: nextPhase },
      };
    }
    case "skin_concern":
      return {
        text: `I see — ${userText}. How severe is it currently?`,
        nextPhase: "skin_severity",
        updatedData: { ...data, skinConcern: userText, phase: "skin_severity" },
      };
    case "skin_severity":
      return {
        text: "Good to know. What is your skin type?",
        nextPhase: "skin_type",
        updatedData: { ...data, skinSeverity: userText, phase: "skin_type" },
      };
    case "skin_type":
      return {
        text: "How many hours of sleep do you typically get each night?",
        nextPhase: "skin_lifestyle_sleep",
        updatedData: {
          ...data,
          skinType: userText,
          phase: "skin_lifestyle_sleep",
        },
      };
    case "skin_lifestyle_sleep":
      return {
        text: "How would you describe your daily stress level?",
        nextPhase: "skin_lifestyle_stress",
        updatedData: {
          ...data,
          skinSleep: userText,
          phase: "skin_lifestyle_stress",
        },
      };
    case "skin_lifestyle_stress": {
      const updated = {
        ...data,
        skinStress: userText,
        phase: "scan" as ChatPhase,
      };
      return {
        text:
          data.focus === "both"
            ? "Great! Now let's check your hair. What is your main hair concern?"
            : "Perfect! Now I'd like to analyze your skin with AI for more accurate results. 📸",
        nextPhase: data.focus === "both" ? "hair_concern" : "scan",
        updatedData:
          data.focus === "both"
            ? { ...updated, phase: "hair_concern" }
            : updated,
      };
    }
    case "hair_concern":
      return {
        text: `Understood — ${userText}. How severe is it?`,
        nextPhase: "hair_severity",
        updatedData: { ...data, hairConcern: userText, phase: "hair_severity" },
      };
    case "hair_severity":
      return {
        text: "What is your scalp type?",
        nextPhase: "hair_scalp",
        updatedData: { ...data, hairSeverity: userText, phase: "hair_scalp" },
      };
    case "hair_scalp":
      return {
        text: "How many hours of sleep do you get each night?",
        nextPhase: "hair_lifestyle_sleep",
        updatedData: {
          ...data,
          hairScalp: userText,
          phase: "hair_lifestyle_sleep",
        },
      };
    case "hair_lifestyle_sleep":
      return {
        text: "How would you describe your daily stress level?",
        nextPhase: "hair_lifestyle_stress",
        updatedData: {
          ...data,
          hairSleep: userText,
          phase: "hair_lifestyle_stress",
        },
      };
    case "hair_lifestyle_stress":
      return {
        text: "Perfect! Now I'd like to analyze your skin with AI for more accurate results. 📸",
        nextPhase: "scan",
        updatedData: { ...data, hairStress: userText, phase: "scan" },
      };
    default:
      return { text: "", nextPhase: "analysis", updatedData: data };
  }
}

// ─── Scan Screen ──────────────────────────────────────────────────────────────

interface ScanScreenProps {
  onImageSelected: (file: File) => void;
  onSkip: () => void;
}

function ScanScreen({ onImageSelected, onSkip }: ScanScreenProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 my-2 p-5 rounded-3xl"
      style={{
        background: "oklch(1 0 0)",
        boxShadow: "0 4px 24px -4px oklch(0.52 0.18 145 / 0.14)",
        border: "1px solid oklch(0.88 0.025 70)",
      }}
    >
      <div className="text-center mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "oklch(0.52 0.18 145 / 0.1)" }}
        >
          <Camera
            className="w-7 h-7"
            style={{ color: "oklch(0.48 0.18 145)" }}
          />
        </div>
        <h3
          className="text-base font-bold mb-1"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "oklch(0.22 0.07 140)",
          }}
        >
          Let's analyze your skin with AI 📸
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.52 0.04 60)",
          }}
        >
          Take a clear photo of your face. Our AI will detect your skin
          condition and improve accuracy.
        </p>
      </div>

      {/* Tips */}
      <div
        className="flex flex-col gap-1.5 mb-4 p-3 rounded-2xl"
        style={{ background: "oklch(0.52 0.18 145 / 0.06)" }}
      >
        {[
          "✅ Good lighting — natural light works best",
          "🚫 No filters or heavy makeup",
          "👁️ Face clearly visible, straight angle",
        ].map((tip) => (
          <p
            key={tip}
            className="text-xs"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.38 0.1 140)",
            }}
          >
            {tip}
          </p>
        ))}
      </div>

      {/* Upload buttons */}
      <div className="flex flex-col gap-2">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImageSelected(f);
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImageSelected(f);
          }}
        />
        <button
          type="button"
          data-ocid="chat.camera_button"
          onClick={() => cameraRef.current?.click()}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98]"
          style={{
            background: "oklch(0.52 0.18 145)",
            color: "#fff",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            boxShadow: "0 4px 12px -2px oklch(0.52 0.18 145 / 0.3)",
          }}
        >
          <Camera className="w-4 h-4" />📷 Take Photo
        </button>
        <button
          type="button"
          data-ocid="chat.gallery_button"
          onClick={() => fileRef.current?.click()}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98]"
          style={{
            background: "oklch(1 0 0)",
            color: "oklch(0.38 0.12 145)",
            border: "1.5px solid oklch(0.52 0.18 145 / 0.35)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <Upload className="w-4 h-4" />
          Upload from Gallery
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-center py-1 transition-all"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.6 0.04 60)",
          }}
        >
          Skip scan →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Analyzing animation ──────────────────────────────────────────────────────

interface AnalyzingScreenProps {
  imageUrl: string;
}

function AnalyzingScreen({ imageUrl }: AnalyzingScreenProps) {
  const steps = [
    "Analyzing your skin with AI…",
    "Detecting condition types…",
    "Almost done…",
  ];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStepIndex(i), i * 900),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="mx-4 my-2 rounded-3xl overflow-hidden"
      style={{
        boxShadow: "0 4px 24px -4px oklch(0.52 0.18 145 / 0.2)",
        border: "1px solid oklch(0.52 0.18 145 / 0.2)",
      }}
    >
      {/* Face image with mesh overlay */}
      <div className="relative" style={{ height: "200px" }}>
        <img
          src={imageUrl}
          alt="Face scan"
          className="w-full h-full object-cover"
        />
        {/* SVG mesh overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10,20,40,0.45)" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMid slice"
            aria-label="AI skin scan mesh overlay"
            role="img"
          >
            <title>AI skin scan mesh overlay</title>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Mesh grid lines */}
            {["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7"].map((k, i) => (
              <line
                key={k}
                x1="40"
                y1={30 + i * 20}
                x2="260"
                y2={30 + i * 20}
                stroke="#22d3ee"
                strokeWidth="0.6"
                strokeOpacity="0.5"
                filter="url(#glow)"
              />
            ))}
            {[
              "v0",
              "v1",
              "v2",
              "v3",
              "v4",
              "v5",
              "v6",
              "v7",
              "v8",
              "v9",
              "v10",
              "v11",
            ].map((k, i) => (
              <line
                key={k}
                x1={40 + i * 20}
                y1="30"
                x2={40 + i * 20}
                y2="170"
                stroke="#22d3ee"
                strokeWidth="0.6"
                strokeOpacity="0.5"
                filter="url(#glow)"
              />
            ))}
            {/* Face oval */}
            <ellipse
              cx="150"
              cy="100"
              rx="65"
              ry="80"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              filter="url(#glow)"
            />
            {/* Feature points */}
            {(
              [
                [120, 70, "eye-l"],
                [180, 70, "eye-r"],
                [150, 90, "nose-t"],
                [130, 115, "lip-l"],
                [170, 115, "lip-r"],
                [150, 135, "chin"],
                [108, 95, "cheek-l"],
                [192, 95, "cheek-r"],
                [150, 60, "forehead"],
                [115, 145, "jaw-l"],
                [185, 145, "jaw-r"],
              ] as [number, number, string][]
            ).map(([x, y, key], i) => (
              <motion.circle
                key={key}
                cx={x}
                cy={y}
                r="2.5"
                fill="#22d3ee"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.6, 1] }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1.5,
                }}
              />
            ))}
          </svg>
        </div>
      </div>
      {/* Status */}
      <div className="px-5 py-4" style={{ background: "oklch(1 0 0)" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-semibold text-center mb-2"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.38 0.12 145)",
            }}
          >
            {steps[stepIndex]}
          </motion.p>
        </AnimatePresence>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.9 0.02 80)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "oklch(0.52 0.18 145)" }}
            initial={{ width: "10%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scan result card ─────────────────────────────────────────────────────────

interface ScanResultCardProps {
  onContinue: (dominantType: string) => void;
}

function ScanResultCard({ onContinue }: ScanResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 my-2 p-4 rounded-3xl"
      style={{
        background: "oklch(1 0 0)",
        boxShadow: "0 4px 24px -4px oklch(0.52 0.18 145 / 0.14)",
        border: "1px solid oklch(0.88 0.025 70)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle
          className="w-5 h-5"
          style={{ color: "oklch(0.52 0.18 145)" }}
        />
        <p
          className="text-sm font-bold"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.28 0.1 145)",
          }}
        >
          AI Scan Complete
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        {ACNE_TYPES.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <p
              className="text-xs font-medium w-28 shrink-0"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: item.dominant
                  ? "oklch(0.32 0.14 145)"
                  : "oklch(0.5 0.05 60)",
                fontWeight: item.dominant ? 700 : 500,
              }}
            >
              {item.dominant ? "⭐ " : ""}
              {item.type}
            </p>
            <div
              className="flex-1 h-2 rounded-full"
              style={{ background: "oklch(0.9 0.02 80)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: item.dominant
                    ? "oklch(0.52 0.18 145)"
                    : "oklch(0.68 0.08 145)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${item.confidence}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </div>
            <p
              className="text-xs w-8 text-right"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: item.dominant
                  ? "oklch(0.42 0.14 145)"
                  : "oklch(0.6 0.04 60)",
                fontWeight: item.dominant ? 700 : 400,
              }}
            >
              {item.confidence}%
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        data-ocid="chat.scan_continue_button"
        onClick={() => onContinue(ACNE_TYPES[0].type)}
        className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98]"
        style={{
          background: "oklch(0.52 0.18 145)",
          color: "#fff",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: "0 4px 12px -2px oklch(0.52 0.18 145 / 0.3)",
        }}
      >
        View My Analysis →
      </button>
    </motion.div>
  );
}

// ─── Final analysis card ──────────────────────────────────────────────────────

interface AnalysisCardProps {
  data: ConsultationData;
}

function AnalysisCard({ data }: AnalysisCardProps) {
  const score = computeScore(data);
  const dosha = getDosha(data);
  const causes = getRootCauses(data);
  const treatment = getTreatmentSummary(data);

  const doshaColor =
    dosha === "Pitta"
      ? "oklch(0.62 0.2 30)"
      : dosha === "Vata"
        ? "oklch(0.58 0.18 250)"
        : "oklch(0.52 0.18 145)";

  // Circle math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 my-2 rounded-3xl overflow-hidden"
      style={{
        background: "oklch(1 0 0)",
        boxShadow: "0 6px 32px -4px oklch(0.52 0.18 145 / 0.16)",
        border: "1px solid oklch(0.88 0.025 70)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.18 145 / 0.08) 0%, oklch(0.97 0.012 80) 100%)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.52 0.14 145)",
          }}
        >
          ✨ AI Analysis Results
        </p>
        {/* Score circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg
              className="w-20 h-20 -rotate-90"
              aria-label="Condition score"
              role="img"
            >
              <title>Condition score circle</title>
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="oklch(0.9 0.02 80)"
                strokeWidth="6"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="oklch(0.52 0.18 145)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-xl font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.28 0.12 145)",
                }}
              >
                {score}
              </span>
              <span
                className="text-[9px]"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.58 0.04 60)",
                }}
              >
                /100
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold leading-snug mb-1"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
            >
              {score < 40
                ? "Mild Concern"
                : score < 65
                  ? "Moderate Concern"
                  : "Significant Concern"}
            </p>
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: `${doshaColor}1a`,
                color: doshaColor,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {dosha} imbalance
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Root causes */}
        <div className="mt-4 mb-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.42 0.06 60)",
            }}
          >
            Root Causes
          </p>
          <div className="flex flex-col gap-1.5">
            {causes.map((cause) => (
              <div key={cause} className="flex items-start gap-2">
                <span className="text-base leading-none mt-0.5">•</span>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.4 0.06 60)",
                  }}
                >
                  {cause}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment summary */}
        <div
          className="p-3 rounded-2xl mb-4"
          style={{
            background: "oklch(0.52 0.18 145 / 0.06)",
            border: "1px solid oklch(0.52 0.18 145 / 0.15)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.42 0.14 145)",
            }}
          >
            🌿 Ayurvedic Plan (Preview)
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.38 0.08 140)",
            }}
          >
            {treatment}
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          data-ocid="chat.view_plan_button"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("chatCompleted", "true");
              window.location.href = "/main?tab=home";
            }
          }}
          className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
          style={{
            background: "oklch(0.52 0.18 145)",
            color: "#fff",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            boxShadow: "0 6px 20px -4px oklch(0.52 0.18 145 / 0.38)",
          }}
        >
          View My Full Plan →
        </button>
        <p
          className="text-center text-xs mt-2"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.62 0.04 60)",
          }}
        >
          Personalized Ayurvedic treatment report
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main ChatPage ────────────────────────────────────────────────────────────

const INITIAL_DATA: ConsultationData = {
  phase: "entry",
  focus: null,
  skinConcern: null,
  skinSeverity: null,
  skinType: null,
  skinSleep: null,
  skinStress: null,
  hairConcern: null,
  hairSeverity: null,
  hairScalp: null,
  hairSleep: null,
  hairStress: null,
  scanResult: null,
};

function makeWelcomeMessage(username: string): Message {
  return {
    id: "welcome",
    from: "bot",
    text: `Hi ${username}! 👋 I'm Dr. Vaidya, your AI wellness advisor.\n\nWhat would you like to focus on today?`,
  };
}

export function ChatPage() {
  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("acneveda_user") ?? "there")
      : "there";

  const [messages, setMessages] = useState<Message[]>([
    makeWelcomeMessage(username),
  ]);
  const [chips, setChips] = useState<string[]>(PHASE_CHIPS.entry);
  const [data, setData] = useState<ConsultationData>(INITIAL_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanAnalyzing, setScanAnalyzing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, [messages.length, isTyping, data.phase]);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "bot", text },
    ]);
  }, []);

  const sendChip = useCallback(
    (text: string) => {
      if (
        data.phase === "scan" ||
        data.phase === "scan_analyzing" ||
        data.phase === "scan_result" ||
        data.phase === "analysis"
      )
        return;

      const userMsg: Message = {
        id: Date.now().toString(),
        from: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setChips([]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const {
          text: botText,
          nextPhase,
          updatedData,
        } = getNextBotMessage(data.phase, text, data);
        setData(updatedData);

        if (nextPhase === "scan") {
          addBotMessage(botText);
          setTimeout(() => {
            setData((prev) => ({ ...prev, phase: "scan" }));
          }, 400);
        } else {
          addBotMessage(botText);
          const nextChips = PHASE_CHIPS[nextPhase] ?? [];
          setTimeout(() => setChips(nextChips), 300);
        }
      }, 850);
    },
    [data, addBotMessage],
  );

  const handleImageSelected = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setScanImage(url);
    setScanAnalyzing(true);
    setData((prev) => ({ ...prev, phase: "scan_analyzing" }));

    // Simulate analysis
    setTimeout(() => {
      setScanAnalyzing(false);
      setData((prev) => ({ ...prev, phase: "scan_result" }));
    }, 3000);
  }, []);

  const handleSkipScan = useCallback(() => {
    addBotMessage(
      "No problem! I have enough information to build your analysis. 🌿",
    );
    setTimeout(() => {
      setData((prev) => ({ ...prev, phase: "analysis" }));
    }, 600);
  }, [addBotMessage]);

  const handleScanContinue = useCallback(
    (dominantType: string) => {
      addBotMessage(
        `AI scan detected **${dominantType}** as your dominant condition. Generating your personalized report now... 🌿`,
      );
      setData((prev) => ({
        ...prev,
        scanResult: dominantType,
        phase: "analysis",
      }));
    },
    [addBotMessage],
  );

  const currentStep = STEP_COUNT[data.phase] ?? 1;

  return (
    <div
      className="flex flex-col min-h-screen mx-auto"
      style={{
        maxWidth: "430px",
        background: "oklch(0.97 0.012 80)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-safe-top flex items-center gap-3 h-14 shrink-0"
        style={{
          background: "oklch(1 0 0)",
          borderBottom: "1px solid oklch(0.9 0.02 80)",
          boxShadow: "0 1px 8px -2px oklch(0.55 0.14 145 / 0.1)",
        }}
      >
        <button
          type="button"
          data-ocid="chat.back_button"
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "oklch(0.52 0.18 145 / 0.08)" }}
          aria-label="Go back"
        >
          <ChevronLeft
            className="w-5 h-5"
            style={{ color: "oklch(0.48 0.18 145)" }}
          />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "oklch(0.52 0.18 145)", color: "#fff" }}
          >
            AI
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold leading-none truncate"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
            >
              Dr. Vaidya AI
            </p>
            <p className="text-xs" style={{ color: "oklch(0.52 0.18 145)" }}>
              🟢 AI Consultation
            </p>
          </div>
        </div>
        {/* Close / exit */}
        <button
          type="button"
          data-ocid="chat.close_button"
          onClick={() => {
            window.location.href = "/main?tab=home";
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "oklch(0.9 0.02 80)" }}
          aria-label="Exit consultation"
        >
          <X className="w-4 h-4" style={{ color: "oklch(0.5 0.04 60)" }} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="px-4 py-2 shrink-0"
        style={{
          background: "oklch(1 0 0)",
          borderBottom: "1px solid oklch(0.92 0.015 80)",
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.52 0.14 145)" }}
          >
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-xs" style={{ color: "oklch(0.62 0.04 60)" }}>
            {data.phase === "analysis"
              ? "Complete!"
              : data.phase === "scan" ||
                  data.phase === "scan_analyzing" ||
                  data.phase === "scan_result"
                ? "AI Scan"
                : "Consultation"}
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.9 0.02 80)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "oklch(0.52 0.18 145)" }}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ paddingBottom: "24px" }}
      >
        {messages.map((msg) => (
          <AnimatePresence key={msg.id}>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.from === "bot" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
                  style={{ background: "oklch(0.52 0.18 145)", color: "#fff" }}
                >
                  AI
                </div>
              )}
              <div
                className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={{
                  background:
                    msg.from === "user"
                      ? "oklch(0.52 0.18 145)"
                      : "oklch(1 0 0)",
                  color: msg.from === "user" ? "#fff" : "oklch(0.22 0.07 140)",
                  boxShadow: "0 1px 4px oklch(0.55 0.14 145 / 0.08)",
                  borderTopRightRadius: msg.from === "user" ? "4px" : "16px",
                  borderTopLeftRadius: msg.from === "bot" ? "4px" : "16px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          </AnimatePresence>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex gap-2 items-end"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "oklch(0.52 0.18 145)", color: "#fff" }}
            >
              AI
            </div>
            <div
              className="px-3.5 py-3 rounded-2xl flex gap-1 items-center"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 1px 4px oklch(0.55 0.14 145 / 0.08)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "oklch(0.7 0.04 80)",
                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Choice chips */}
        {!isTyping &&
          chips.length > 0 &&
          data.phase !== "scan" &&
          data.phase !== "scan_analyzing" &&
          data.phase !== "scan_result" &&
          data.phase !== "analysis" && (
            <motion.div
              className="flex flex-wrap gap-2 pl-9"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  data-ocid="chat.option_chip"
                  onClick={() => sendChip(chip)}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-[0.96]"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1.5px solid oklch(0.52 0.18 145 / 0.35)",
                    color: "oklch(0.42 0.14 145)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxShadow: "0 1px 4px oklch(0.55 0.14 145 / 0.06)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          )}

        {/* Scan screen */}
        {data.phase === "scan" && !scanImage && (
          <ScanScreen
            onImageSelected={handleImageSelected}
            onSkip={handleSkipScan}
          />
        )}

        {/* Analyzing screen */}
        {data.phase === "scan_analyzing" && scanAnalyzing && scanImage && (
          <AnalyzingScreen imageUrl={scanImage} />
        )}

        {/* Scan results */}
        {data.phase === "scan_result" && !scanAnalyzing && (
          <ScanResultCard onContinue={handleScanContinue} />
        )}

        {/* Final analysis */}
        {data.phase === "analysis" && <AnalysisCard data={data} />}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
