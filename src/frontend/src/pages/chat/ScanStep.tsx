import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import {
  type ConsultationAnswers,
  type ScanResult,
  simulateScan,
} from "./consultationLogic";

interface ScanStepProps {
  answers: ConsultationAnswers;
  onComplete: (result: ScanResult) => void;
  onSkip: () => void;
}

type ScanPhase = "prompt" | "analyzing" | "detected";

const ANALYSIS_TEXTS = [
  "Analyzing your skin with AI...",
  "Detecting acne types...",
  "Almost done...",
];

const ACNE_TYPES = [
  { key: "whiteheads", label: "Whiteheads" },
  { key: "blackheads", label: "Blackheads" },
  { key: "papules", label: "Papules" },
  { key: "pustules", label: "Pustules" },
  { key: "nodules", label: "Nodules" },
] as const;

export function ScanStep({ answers, onComplete, onSkip }: ScanStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ScanPhase>("prompt");
  const [analysisIdx, setAnalysisIdx] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    startAnalysis();
  }

  function startAnalysis() {
    setPhase("analyzing");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnalysisIdx(i);
      if (i >= ANALYSIS_TEXTS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          const result = simulateScan(answers);
          setScanResult(result);
          setPhase("detected");
        }, 900);
      }
    }, 800);
  }

  function handleConfirm() {
    if (scanResult) onComplete(scanResult);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "oklch(var(--card))",
        borderColor: "oklch(var(--primary) / 0.25)",
        boxShadow: "0 4px 24px oklch(var(--primary) / 0.08)",
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
        aria-label="Upload face photo"
      />

      <AnimatePresence mode="wait">
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4"
          >
            <div className="text-center space-y-1">
              <p
                className="text-lg font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Let's analyze your skin with AI 📸
              </p>
              <p
                className="text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Take a clear photo of your face. Our AI will detect your acne
                type and improve accuracy.
              </p>
            </div>
            {/* Tips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["Good lighting", "No filters", "Face clearly visible"].map(
                (tip) => (
                  <span
                    key={tip}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "oklch(var(--primary) / 0.1)",
                      color: "oklch(var(--primary))",
                    }}
                  >
                    ✓ {tip}
                  </span>
                ),
              )}
            </div>
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-ocid="scan.take_photo"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.setAttribute("capture", "environment");
                    fileRef.current.click();
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                📷 Take Photo
              </button>
              <button
                type="button"
                data-ocid="scan.upload_gallery"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.removeAttribute("capture");
                    fileRef.current.click();
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95"
                style={{
                  borderColor: "oklch(var(--primary) / 0.4)",
                  color: "oklch(var(--primary))",
                  background: "oklch(var(--card))",
                }}
              >
                📤 Upload from Gallery
              </button>
            </div>
            <button
              type="button"
              data-ocid="scan.skip"
              onClick={onSkip}
              className="w-full py-2 text-xs text-center"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Skip this step →
            </button>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 flex flex-col items-center gap-5"
          >
            {previewUrl && (
              <div className="relative w-36 h-36 rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Face scan"
                  className="w-full h-full object-cover"
                />
                {/* Animated mesh overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MeshOverlay />
                </div>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.p
                key={analysisIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-sm font-medium text-center"
                style={{ color: "oklch(var(--primary))" }}
              >
                {
                  ANALYSIS_TEXTS[
                    Math.min(analysisIdx, ANALYSIS_TEXTS.length - 1)
                  ]
                }
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "detected" && scanResult && (
          <motion.div
            key="detected"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 space-y-4"
          >
            <div className="text-center">
              <p
                className="font-semibold text-sm"
                style={{ color: "oklch(var(--foreground))" }}
              >
                AI Detection Complete ✅
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Dominant type:{" "}
                <strong style={{ color: "oklch(var(--primary))" }}>
                  {scanResult.dominant}
                </strong>
              </p>
            </div>
            <div className="space-y-2">
              {ACNE_TYPES.map(({ key, label }) => {
                const score = scanResult[key];
                const isDominant = label === scanResult.dominant;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        style={{
                          color: isDominant
                            ? "oklch(var(--primary))"
                            : "oklch(var(--foreground))",
                          fontWeight: isDominant ? 700 : 400,
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ color: "oklch(var(--muted-foreground))" }}>
                        {score}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "oklch(var(--muted))" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: isDominant
                            ? "oklch(var(--primary))"
                            : "oklch(var(--primary) / 0.4)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(score, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              data-ocid="scan.confirm"
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              Use this result →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animated SVG mesh overlay
function MeshOverlay() {
  const meshPaths = [
    { id: "hex-outer", d: "M50 10 L90 35 L90 75 L50 100 L10 75 L10 35 Z" },
    { id: "hex-mid", d: "M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z" },
    { id: "hex-inner", d: "M50 30 L72 45 L72 65 L50 80 L28 65 L28 45 Z" },
  ];
  const dotPoints = [
    { id: "dot-top", cx: 50, cy: 20 },
    { id: "dot-tr", cx: 80, cy: 40 },
    { id: "dot-br", cx: 80, cy: 70 },
    { id: "dot-bot", cx: 50, cy: 90 },
    { id: "dot-bl", cx: 20, cy: 70 },
    { id: "dot-tl", cx: 20, cy: 40 },
    { id: "dot-ctr", cx: 50, cy: 50 },
  ];
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {meshPaths.map(({ id, d }, i) => (
        <motion.path
          key={id}
          d={d}
          fill="none"
          stroke="oklch(0.7 0.15 200)"
          strokeWidth="0.8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.3, 0.8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            delay: i * 0.3,
          }}
        />
      ))}
      {dotPoints.map(({ id, cx, cy }, i) => (
        <motion.circle
          key={id}
          cx={cx}
          cy={cy}
          r="1.5"
          fill="oklch(0.75 0.18 195)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            delay: i * 0.2,
          }}
        />
      ))}
    </svg>
  );
}
