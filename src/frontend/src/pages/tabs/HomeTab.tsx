import { Badge } from "@/components/ui/badge";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle2,
  Circle,
  ClipboardList,
  Leaf,
  Moon,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Sun,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { createActor } from "../../backend";

type RoutineStep = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
};

type AssessmentResults = {
  acneType?: string;
  skinType?: string;
  phase?: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────
const MORNING_STEPS: RoutineStep[] = [
  {
    id: "m1",
    label: "Triphala Herbal Wash",
    description: "2 min gentle massage",
    checked: false,
  },
  {
    id: "m2",
    label: "Gentle Cleanser",
    description: "pH-balanced formula",
    checked: false,
  },
  {
    id: "m3",
    label: "Oil Control Serum",
    description: "3-4 drops on damp skin",
    checked: false,
  },
  {
    id: "m4",
    label: "SPF Moisturizer",
    description: "SPF 30+ non-comedogenic",
    checked: false,
  },
];

const NIGHT_STEPS: RoutineStep[] = [
  {
    id: "n1",
    label: "Ayurvedic Face Wash",
    description: "Neem & turmeric blend",
    checked: false,
  },
  {
    id: "n2",
    label: "Neem Acne Gel",
    description: "Leave on overnight",
    checked: false,
  },
  {
    id: "n3",
    label: "Spot Corrector",
    description: "Dab on active spots only",
    checked: false,
  },
  {
    id: "n4",
    label: "Hydra Moisturizer",
    description: "Lightweight night hydration",
    checked: false,
  },
];

const PRODUCTS = [
  {
    id: "wash",
    name: "Triphala Cleanser",
    benefit: "Gentle herbal cleanse",
    reason: "Matches your skin type",
    img: "/assets/generated/acne-facewash.dim_400x400.png",
  },
  {
    id: "serum",
    name: "Neem Oil Serum",
    benefit: "Controls excess sebum",
    reason: "Targets acne triggers",
    img: "/assets/generated/acne-serum.dim_400x400.png",
  },
  {
    id: "spot",
    name: "Spot Corrector",
    benefit: "Targeted acne healing",
    reason: "For active breakouts",
    img: "/assets/generated/acne-spot-treatment.dim_400x400.png",
  },
  {
    id: "moist",
    name: "Hydra Moisturizer",
    benefit: "Non-comedogenic hydration",
    reason: "Won't clog pores",
    img: "/assets/generated/acne-moisturizer.dim_400x400.png",
  },
];

// ─── Routine Step component ───────────────────────────────────────────────────
function RoutineItem({
  step,
  onToggle,
}: {
  step: RoutineStep;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`home.checkbox.${step.id}`}
      onClick={onToggle}
      className="flex items-center gap-3 text-left w-full transition-opacity active:scale-[0.99]"
    >
      <div className="flex-shrink-0">
        {step.checked ? (
          <CheckCircle2
            className="w-5 h-5"
            style={{ color: "oklch(0.52 0.14 146)" }}
          />
        ) : (
          <Circle className="w-5 h-5" style={{ color: "#C8BDB0" }} />
        )}
      </div>
      <div>
        <p
          className="text-sm font-medium"
          style={{
            color: step.checked ? "#B0A090" : "#3D2C1E",
            textDecoration: step.checked ? "line-through" : "none",
          }}
        >
          {step.label}
        </p>
        <p className="text-xs" style={{ color: "#A89880" }}>
          {step.description}
        </p>
      </div>
    </button>
  );
}

// ─── Scan Modal ───────────────────────────────────────────────────────────────
function ScanModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 2800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(30,20,10,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        style={{ background: "#FAF7F2" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <h2
            className="font-bold text-lg"
            style={{
              color: "#3D2C1E",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Scan Today 📸
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#EDE8E0" }}
          >
            <X className="w-4 h-4" style={{ color: "#7A6652" }} />
          </button>
        </div>

        <div className="px-5 pb-6">
          {!preview && !done && (
            <>
              <p className="text-sm mb-4" style={{ color: "#7A6652" }}>
                Take a clear photo of your face for daily AI skin tracking.
              </p>
              <div
                className="rounded-2xl p-3 mb-4"
                style={{ background: "#F0EAE0", border: "1px solid #E0D4C4" }}
              >
                {["Good lighting", "No filters", "Face clearly visible"].map(
                  (tip) => (
                    <p
                      key={tip}
                      className="text-xs py-0.5"
                      style={{ color: "#7A6652" }}
                    >
                      ✓ {tip}
                    </p>
                  ),
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="home.camera_button"
                  className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.97]"
                  style={{ background: "oklch(0.52 0.14 146)", color: "#fff" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
                <button
                  type="button"
                  data-ocid="home.upload_button"
                  className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.97]"
                  style={{ background: "#EDE8E0", color: "#3D2C1E" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </>
          )}

          {preview && scanning && (
            <div className="text-center py-4">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden">
                <img
                  src={preview}
                  alt="Scan preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(74,104,76,0.15)" }}
                >
                  <div
                    className="w-32 h-32 rounded-full"
                    style={{
                      border: "2px solid oklch(0.62 0.18 146)",
                      animation: "pulse 1.4s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
              {[
                "Analyzing your skin with AI…",
                "Detecting skin concerns…",
                "Almost done…",
              ].map((txt, i) => (
                <motion.p
                  key={txt}
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.48 0.14 146)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.9 }}
                >
                  {txt}
                </motion.p>
              ))}
            </div>
          )}

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-2"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                style={{ background: "oklch(0.94 0.04 146)" }}
              >
                ✓
              </div>
              <p
                className="font-bold text-base mb-1"
                style={{ color: "#3D2C1E" }}
              >
                Daily scan complete!
              </p>
              <p className="text-sm mb-4" style={{ color: "#7A6652" }}>
                Skin appears stable. Continue your routine for best results.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-bold text-sm"
                style={{ background: "oklch(0.52 0.14 146)", color: "#fff" }}
              >
                Done
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── HomeTab ──────────────────────────────────────────────────────────────────
export function HomeTab() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const username = localStorage.getItem("acneveda_user") ?? "User";
  const rawResults = sessionStorage.getItem("acnevedaResults");
  const results: AssessmentResults = rawResults ? JSON.parse(rawResults) : {};

  const acneType = results.acneType ?? "Inflammatory Acne";
  const skinType = results.skinType ?? "Combination";
  const phase = results.phase ?? "Phase 1: Cleanse";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dismissed =
    sessionStorage.getItem("assessment_popup_dismissed") === "true";
  const [popupDismissed, setPopupDismissed] = useState(dismissed);
  const [showScan, setShowScan] = useState(false);

  const { data: hasHistory, isLoading: historyLoading } = useQuery<boolean>({
    queryKey: ["hasHistory", username],
    queryFn: async () => {
      if (!actor || !username || username === "User") return true;
      try {
        return await actor.hasHistory(username);
      } catch {
        return true;
      }
    },
    enabled: !!actor && !actorFetching && !!username && username !== "User",
  });

  const showPopup = !popupDismissed && hasHistory === false && !historyLoading;

  function handleDismiss() {
    sessionStorage.setItem("assessment_popup_dismissed", "true");
    setPopupDismissed(true);
  }

  const [morningSteps, setMorningSteps] =
    useState<RoutineStep[]>(MORNING_STEPS);
  const [nightSteps, setNightSteps] = useState<RoutineStep[]>(NIGHT_STEPS);

  const morningDone = morningSteps.filter((s) => s.checked).length;
  const nightDone = nightSteps.filter((s) => s.checked).length;

  const toggleMorning = (id: string) =>
    setMorningSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );

  const toggleNight = (id: string) =>
    setNightSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );

  return (
    <div
      className="relative h-full overflow-y-auto pb-20"
      style={{ background: "#FAF7F2" }}
    >
      {/* Assessment Incomplete Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="assessment-popup"
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(40,24,10,0.55)" }}
            data-ocid="home.modal"
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "#FFFFFF",
                boxShadow: "0 24px 64px rgba(40,24,10,0.22)",
              }}
            >
              <div
                className="px-6 pt-6 pb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #F0EAE0 0%, #E8F5E8 100%)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.92 0.06 146)" }}
                  >
                    <ClipboardList
                      className="w-7 h-7"
                      style={{ color: "oklch(0.42 0.14 146)" }}
                    />
                  </div>
                  <button
                    type="button"
                    data-ocid="home.close_button"
                    onClick={handleDismiss}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.8)" }}
                    aria-label="Dismiss popup"
                  >
                    <X className="w-4 h-4" style={{ color: "#7A6652" }} />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#3D2C1E",
                  }}
                >
                  Complete Your Assessment
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#7A6652" }}
                >
                  Get your personalized Ayurvedic treatment plan. It only takes
                  3 minutes.
                </p>
                <button
                  type="button"
                  data-ocid="home.primary_button"
                  onClick={() => navigate({ to: "/assessment/step1" })}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                  style={{
                    background: "oklch(0.52 0.14 146)",
                    color: "#fff",
                    boxShadow: "0 4px 18px oklch(0.52 0.14 146 / 0.35)",
                  }}
                >
                  Start Assessment →
                </button>
                <button
                  type="button"
                  data-ocid="home.cancel_button"
                  onClick={handleDismiss}
                  className="w-full py-2.5 mt-2 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#B0A090", background: "transparent" }}
                >
                  Remind me later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Modal */}
      <AnimatePresence>
        {showScan && <ScanModal onClose={() => setShowScan(false)} />}
      </AnimatePresence>

      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{
          background: "linear-gradient(160deg, #F0EAE0 0%, #FAF7F2 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="text-sm" style={{ color: "#A89880" }}>
              {greeting}, 👋
            </p>
            <h1
              className="text-xl font-bold capitalize"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#3D2C1E",
              }}
            >
              {username}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#A89880" }}>
              Clear Skin Naturally 🌿
            </p>
          </div>

          {/* Scan Today button */}
          <motion.button
            type="button"
            data-ocid="home.scan_button"
            onClick={() => setShowScan(true)}
            whileTap={{ scale: 0.94 }}
            className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all"
            style={{
              background: "oklch(0.52 0.14 146)",
              color: "#fff",
              boxShadow: "0 4px 14px oklch(0.52 0.14 146 / 0.3)",
            }}
          >
            <Camera className="w-4 h-4" />
            <span style={{ fontSize: "10px", fontWeight: 600 }}>
              Scan Today
            </span>
          </motion.button>
        </motion.div>

        {/* Treatment summary card */}
        <motion.div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(74,104,76,0.08)",
            border: "1px solid #E8E0D6",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Leaf
              className="w-4 h-4"
              style={{ color: "oklch(0.52 0.14 146)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "oklch(0.48 0.14 146)" }}
            >
              Treatment Summary
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className="text-xs"
              style={{
                background: "#EAF4EA",
                color: "#2D6A2D",
                border: "none",
              }}
            >
              {acneType}
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "#FFF3E0",
                color: "#8B4513",
                border: "none",
              }}
            >
              {skinType} Skin
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "#F0EAE0",
                color: "#7A6652",
                border: "none",
              }}
            >
              {phase}
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-2">
        {/* Daily Routine heading */}
        <motion.h2
          className="text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: "#A89880" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        >
          Your Daily Routine
        </motion.h2>

        {/* Morning Routine */}
        <motion.div
          className="rounded-2xl p-4 mb-3"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(74,104,76,0.06)",
            border: "1px solid #E8E0D6",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" style={{ color: "#E8832A" }} />
              <span
                className="text-sm font-semibold"
                style={{ color: "#3D2C1E" }}
              >
                Morning Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  morningDone === morningSteps.length ? "#EAF4EA" : "#F0EAE0",
                color:
                  morningDone === morningSteps.length ? "#2D6A2D" : "#7A6652",
              }}
            >
              {morningDone}/{morningSteps.length} done
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {morningSteps.map((step) => (
              <RoutineItem
                key={step.id}
                step={step}
                onToggle={() => toggleMorning(step.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Night Routine */}
        <motion.div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(74,104,76,0.06)",
            border: "1px solid #E8E0D6",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" style={{ color: "#7B68C8" }} />
              <span
                className="text-sm font-semibold"
                style={{ color: "#3D2C1E" }}
              >
                Night Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  nightDone === nightSteps.length ? "#EAF4EA" : "#F0EAE0",
                color: nightDone === nightSteps.length ? "#2D6A2D" : "#7A6652",
              }}
            >
              {nightDone}/{nightSteps.length} done
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {nightSteps.map((step) => (
              <RoutineItem
                key={step.id}
                step={step}
                onToggle={() => toggleNight(step.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Recommended Products */}
        <motion.h2
          className="text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: "#A89880" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Recommended Products
        </motion.h2>

        <motion.div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
        >
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-36 rounded-2xl overflow-hidden"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(74,104,76,0.08)",
                border: "1px solid #E8E0D6",
              }}
            >
              <div
                className="w-full h-24 flex items-center justify-center"
                style={{ background: "#EAF2EA" }}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="p-2">
                <p
                  className="text-xs font-semibold leading-snug"
                  style={{ color: "#3D2C1E" }}
                >
                  {product.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#A89880" }}>
                  {product.benefit}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{ color: "oklch(0.52 0.14 146)", fontSize: "10px" }}
                >
                  {product.reason}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-4 flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <button
            type="button"
            data-ocid="home.primary_button"
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "oklch(0.52 0.14 146)",
              color: "#fff",
              boxShadow: "0 4px 16px oklch(0.52 0.14 146 / 0.35)",
            }}
            onClick={() => window.open("#", "_blank")}
          >
            <ShoppingBag className="w-4 h-4" />
            Buy Full Kit →
          </button>

          <button
            type="button"
            data-ocid="home.secondary_button"
            className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "transparent",
              border: "2px solid oklch(0.52 0.14 146)",
              color: "oklch(0.48 0.14 146)",
            }}
            onClick={() => navigate({ to: "/assessment/step1" })}
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
        </motion.div>

        {/* Ayurvedic Tips */}
        <motion.div
          className="mt-4 rounded-2xl p-4 flex gap-3"
          style={{ background: "#EAF4EA", border: "1px solid #C4DCC4" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Leaf
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#2D6A2D" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ color: "#2D6A2D" }}
            >
              Ayurvedic Tip of the Day
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#3D5C3D" }}>
              Drink warm water with Triphala before bed to support natural
              detoxification and clearer skin over time.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-3 rounded-2xl p-4 flex gap-3"
          style={{ background: "#FFF3E0", border: "1px solid #F5D5A8" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        >
          <Sparkles
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#E8832A" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ color: "#8B4513" }}
            >
              Pitta Dosha Balance
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#7A5024" }}>
              Inflammatory acne often indicates elevated Pitta. Cooling foods
              like cucumber, coconut water, and amla help restore balance.
            </p>
          </div>
        </motion.div>

        {/* Made by credit */}
        <p className="text-center text-xs py-4" style={{ color: "#B0A090" }}>
          Made by Dr.Akash Hari (BAMS) · Clear Skin Naturally 🌿
        </p>

        <p className="text-center text-xs pb-6" style={{ color: "#C8BDB0" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "oklch(0.52 0.14 146)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
