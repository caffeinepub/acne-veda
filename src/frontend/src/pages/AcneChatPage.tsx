import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Chat step definitions ────────────────────────────────────────────────────

type Step = {
  id: number;
  question: string;
  options: string[];
  multiSelect?: boolean;
};

const STEPS: Step[] = [
  {
    id: 1,
    question: "Where do you mostly get acne?",
    options: ["Forehead", "Cheeks", "Chin", "Jawline", "Nose", "All over face"],
  },
  {
    id: 2,
    question: "What type of acne do you see?",
    options: [
      "Whiteheads",
      "Blackheads",
      "Red painful pimples",
      "Pus-filled pimples",
      "Deep cysts",
    ],
  },
  {
    id: 3,
    question: "How severe is your acne?",
    options: ["Mild", "Moderate", "Severe"],
  },
  {
    id: 4,
    question: "What is your skin type?",
    options: ["Oily", "Dry", "Combination", "Sensitive", "Not sure"],
  },
  {
    id: 5,
    question: "Do you experience any of these?",
    options: [
      "Oily food intake",
      "Stress",
      "Poor sleep",
      "Hormonal issues",
      "Dandruff",
      "None",
    ],
    multiSelect: true,
  },
  {
    id: 6,
    question: "How long have you had acne?",
    options: ["Less than 1 month", "1–6 months", "More than 6 months", "Years"],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "chat" | "scan" | "scanning" | "detection" | "results";

type ChatMessage = {
  from: "doctor" | "user";
  text: string;
};

type Answers = Record<number, string | string[]>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildDiagnosis(answers: Answers): string {
  const severity = (answers[3] as string) ?? "Moderate";
  const acneType = (answers[2] as string) ?? "pimples";
  const lower = acneType.toLowerCase();
  let typeDescription = "inflammatory acne";
  if (lower.includes("pus")) typeDescription = "pustular and papular acne";
  else if (lower.includes("cyst")) typeDescription = "cystic acne";
  else if (lower.includes("white"))
    typeDescription = "comedonal acne with whiteheads";
  else if (lower.includes("black"))
    typeDescription = "comedonal acne with blackheads";
  else if (lower.includes("red"))
    typeDescription = "inflammatory acne with papules";
  return `You have ${severity.toLowerCase()} ${typeDescription} with presence of pustules and papules.`;
}

function buildDetectionValues(
  answers: Answers,
): { name: string; value: number; dominant: boolean }[] {
  const acneType = ((answers[2] as string) ?? "").toLowerCase();
  const base = [
    { name: "Whiteheads", value: 42 },
    { name: "Blackheads", value: 38 },
    { name: "Papules", value: 61 },
    { name: "Pustules", value: 55 },
    { name: "Nodules", value: 22 },
  ];
  if (acneType.includes("white")) base[0].value = 78;
  if (acneType.includes("black")) base[1].value = 75;
  if (acneType.includes("red")) {
    base[2].value = 80;
    base[3].value = 70;
  }
  if (acneType.includes("pus")) base[3].value = 88;
  if (acneType.includes("cyst")) base[4].value = 72;

  const maxVal = Math.max(...base.map((b) => b.value));
  return base.map((b) => ({ ...b, dominant: b.value === maxVal }));
}

const SCAN_TEXTS = [
  "Analyzing your skin with AI…",
  "Detecting acne types…",
  "Almost done…",
];

// ─── Canvas Mesh Animation ────────────────────────────────────────────────────

function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const POINT_COUNT = 24;

    type Pt = { x: number; y: number; vx: number; vy: number };
    const points: Pt[] = Array.from({ length: POINT_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    let t = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.018;

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      const CONNECT_DIST = 90;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.75;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i++) {
        const pulse = 0.6 + 0.4 * Math.sin(t + i * 0.7);
        const r = 2.5 + 1.5 * pulse;
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 255, ${0.6 + 0.4 * pulse})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${0.12 * pulse})`;
        ctx.fill();
      }

      const scanY = ((Math.sin(t * 0.7) + 1) / 2) * H;
      const grad = ctx.createLinearGradient(0, scanY - 6, 0, scanY + 6);
      grad.addColorStop(0, "rgba(0,230,255,0)");
      grad.addColorStop(0.5, "rgba(0,230,255,0.45)");
      grad.addColorStop(1, "rgba(0,230,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 6, W, 12);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={380}
      className="absolute inset-0 w-full h-full"
      style={{ borderRadius: "1.5rem" }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AcneChatPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "doctor",
      text: STEPS[0].question,
    },
  ]);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [showTyping, setShowTyping] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>("chat");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanTextIdx, setScanTextIdx] = useState(0);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function handleOptionSelect(option: string) {
    if (showTyping) return;
    const step = STEPS.find((s) => s.id === currentStep);
    if (!step || step.multiSelect) return;

    const newAnswers = { ...answers, [currentStep]: option };
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, { from: "user", text: option }]);
    setTimeout(scrollToBottom, 50);
    setShowTyping(true);

    setTimeout(() => {
      setShowTyping(false);
      if (currentStep < STEPS.length) {
        const nextStep = STEPS.find((s) => s.id === currentStep + 1);
        if (nextStep) {
          setMessages((prev) => [
            ...prev,
            { from: "doctor", text: nextStep.question },
          ]);
          setCurrentStep(currentStep + 1);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "doctor",
            text: "Great! Now let’s do an AI skin scan for even more accurate results. 📸",
          },
        ]);
        setTimeout(() => {
          setScreenMode("scan");
        }, 600);
      }
    }, 900);
  }

  function handleMultiContinue() {
    if (showTyping || multiSelected.length === 0) return;
    const label = multiSelected.join(", ");
    const newAnswers = { ...answers, [currentStep]: multiSelected };
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, { from: "user", text: label }]);
    setMultiSelected([]);
    setShowTyping(true);

    setTimeout(() => {
      setShowTyping(false);
      const nextStep = STEPS.find((s) => s.id === currentStep + 1);
      if (nextStep) {
        setMessages((prev) => [
          ...prev,
          { from: "doctor", text: nextStep.question },
        ]);
        setCurrentStep(currentStep + 1);
      }
    }, 900);
  }

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setScreenMode("scanning");
      setScanTextIdx(0);

      let idx = 0;
      scanIntervalRef.current = setInterval(() => {
        idx = (idx + 1) % SCAN_TEXTS.length;
        setScanTextIdx(idx);
      }, 1100);

      setTimeout(() => {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setScreenMode("detection");
      }, 3500);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const detectionValues = buildDetectionValues(answers);
  const diagnosis = buildDiagnosis(answers);
  const triggers = answers[5] as string[] | undefined;
  const chatProgress = Math.min(currentStep / STEPS.length, 1);

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
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
          role="presentation"
        >
          <path
            d="M90 5C62 22 48 54 68 90C80 56 100 28 90 5Z"
            fill="oklch(0.55 0.14 145)"
          />
        </svg>
      </div>

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {screenMode === "chat" && (
          <motion.div
            key="chat"
            className="flex flex-col max-w-sm mx-auto w-full px-4 pt-8 pb-6 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              data-ocid="acne-chat.link"
              onClick={() => navigate({ to: "/skin-concerns" })}
              className="flex items-center gap-1.5 text-sm font-medium mb-5 w-fit"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.48 0.14 145)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.52 0.14 145)",
                  }}
                >
                  Step {currentStep} of 7
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.6 0.04 60)",
                  }}
                >
                  {Math.round(chatProgress * 100)}%
                </span>
              </div>
              <div
                className="w-full rounded-full h-1.5"
                style={{ background: "oklch(0.9 0.02 80)" }}
              >
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ background: "oklch(0.52 0.18 145)" }}
                  animate={{ width: `${chatProgress * 100}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.52 0.18 145)",
                  boxShadow: "0 4px 14px -2px oklch(0.52 0.18 145 / 0.35)",
                }}
              >
                <span
                  className="text-sm font-bold"
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
                  className="text-base font-bold leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.22 0.07 140)",
                  }}
                >
                  Dr. Vaidya AI 👨‍⚕️
                </h2>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.55 0.04 60)",
                  }}
                >
                  Board-certified AI Dermatologist
                </p>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-0.5"
              style={{ maxHeight: "calc(100vh - 340px)" }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={`${msg.from}-${idx}`}
                  className={`flex items-end gap-2 ${
                    msg.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.from === "doctor" && (
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mb-0.5"
                      style={{ background: "oklch(0.52 0.18 145)" }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: "oklch(0.99 0.006 80)",
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                        }}
                      >
                        DV
                      </span>
                    </div>
                  )}
                  <div
                    className="px-3.5 py-2.5 rounded-2xl max-w-[80%]"
                    style={{
                      background:
                        msg.from === "doctor"
                          ? "oklch(1 0 0)"
                          : "oklch(0.52 0.18 145)",
                      color:
                        msg.from === "doctor"
                          ? "oklch(0.28 0.06 60)"
                          : "oklch(0.99 0.006 80)",
                      boxShadow:
                        msg.from === "doctor"
                          ? "0 2px 12px -2px oklch(0.55 0.14 145 / 0.12)"
                          : "0 4px 16px -2px oklch(0.52 0.18 145 / 0.3)",
                      border:
                        msg.from === "doctor"
                          ? "1px solid oklch(0.9 0.02 80)"
                          : "none",
                      borderBottomLeftRadius:
                        msg.from === "doctor" ? "4px" : undefined,
                      borderBottomRightRadius:
                        msg.from === "user" ? "4px" : undefined,
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: "0.82rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {showTyping && (
                <motion.div
                  className="flex items-end gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-ocid="acne-chat.loading_state"
                >
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "oklch(0.52 0.18 145)" }}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: "oklch(0.99 0.006 80)",
                        fontFamily: "'DM Sans'",
                      }}
                    >
                      DV
                    </span>
                  </div>
                  <div
                    className="px-3.5 py-2.5 rounded-2xl rounded-bl-[4px] flex items-center gap-1.5"
                    style={{
                      background: "oklch(1 0 0)",
                      border: "1px solid oklch(0.9 0.02 80)",
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
              <div ref={chatBottomRef} />
            </div>

            {!showTyping &&
              currentStep <= STEPS.length &&
              (() => {
                const step = STEPS.find((s) => s.id === currentStep);
                if (!step) return null;
                return (
                  <motion.div
                    key={`options-${currentStep}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      {step.options.map((option) => {
                        const isSelected = step.multiSelect
                          ? multiSelected.includes(option)
                          : false;
                        return (
                          <button
                            key={option}
                            type="button"
                            data-ocid="acne-chat.radio"
                            onClick={() => {
                              if (step.multiSelect) {
                                setMultiSelected((prev) =>
                                  prev.includes(option)
                                    ? prev.filter((o) => o !== option)
                                    : [...prev, option],
                                );
                              } else {
                                handleOptionSelect(option);
                              }
                            }}
                            className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
                            style={{
                              fontFamily: "'DM Sans', system-ui, sans-serif",
                              background: isSelected
                                ? "oklch(0.52 0.18 145)"
                                : "oklch(1 0 0)",
                              color: isSelected
                                ? "oklch(0.99 0.006 80)"
                                : "oklch(0.38 0.1 140)",
                              border: isSelected
                                ? "1.5px solid oklch(0.52 0.18 145)"
                                : "1.5px solid oklch(0.52 0.18 145 / 0.35)",
                              boxShadow: isSelected
                                ? "0 4px 12px -2px oklch(0.52 0.18 145 / 0.28)"
                                : "0 1px 4px -1px oklch(0.55 0.14 145 / 0.08)",
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {step.multiSelect && (
                      <motion.button
                        type="button"
                        data-ocid="acne-chat.submit_button"
                        onClick={handleMultiContinue}
                        disabled={multiSelected.length === 0}
                        className="mt-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 self-start"
                        style={{
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                          background:
                            multiSelected.length > 0
                              ? "oklch(0.52 0.18 145)"
                              : "oklch(0.88 0.025 70)",
                          color:
                            multiSelected.length > 0
                              ? "oklch(0.99 0.006 80)"
                              : "oklch(0.62 0.04 60)",
                          boxShadow:
                            multiSelected.length > 0
                              ? "0 4px 14px -2px oklch(0.52 0.18 145 / 0.28)"
                              : "none",
                          cursor:
                            multiSelected.length === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        Continue →
                      </motion.button>
                    )}
                  </motion.div>
                );
              })()}
          </motion.div>
        )}

        {screenMode === "scan" && (
          <motion.div
            key="scan"
            className="flex flex-col max-w-sm mx-auto w-full px-5 pt-10 pb-10 min-h-screen items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="w-full rounded-3xl overflow-hidden p-6 flex flex-col gap-5"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 8px 40px -6px oklch(0.52 0.18 145 / 0.18)",
                border: "1.5px solid oklch(0.9 0.02 80)",
              }}
            >
              <div className="text-center">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.22 0.07 140)",
                  }}
                >
                  Let&apos;s analyze your skin with AI 📸
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.52 0.04 60)",
                  }}
                >
                  Take a clear photo of your face. Our AI will detect your acne
                  type and improve accuracy.
                </p>
              </div>

              <div
                className="rounded-2xl px-4 py-3 flex flex-col gap-2"
                style={{
                  background: "oklch(0.52 0.18 145 / 0.06)",
                  border: "1px solid oklch(0.52 0.18 145 / 0.15)",
                }}
              >
                {["Good lighting", "No filters", "Face clearly visible"].map(
                  (tip) => (
                    <div key={tip} className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                        style={{
                          background: "oklch(0.52 0.18 145)",
                          color: "oklch(0.99 0.006 80)",
                        }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                          color: "oklch(0.38 0.1 140)",
                        }}
                      >
                        {tip}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  data-ocid="acne-chat.upload_button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    background: "oklch(0.52 0.18 145)",
                    color: "oklch(0.99 0.006 80)",
                    boxShadow: "0 6px 22px -4px oklch(0.52 0.18 145 / 0.38)",
                  }}
                >
                  <Camera className="w-4 h-4" />📷 Take Photo
                </button>
                <button
                  type="button"
                  data-ocid="acne-chat.secondary_button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    background: "transparent",
                    border: "2px solid oklch(0.52 0.18 145)",
                    color: "oklch(0.42 0.14 145)",
                  }}
                >
                  <Upload className="w-4 h-4" />📁 Upload from Gallery
                </button>
              </div>

              <p
                className="text-center text-xs"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.58 0.06 145)",
                }}
              >
                📊 More accurate with photo scan
              </p>

              <button
                type="button"
                data-ocid="acne-chat.cancel_button"
                onClick={() => setScreenMode("results")}
                className="text-xs text-center underline underline-offset-2 transition-opacity hover:opacity-60"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.62 0.04 60)",
                }}
              >
                Skip scan &amp; view results
              </button>
            </div>
          </motion.div>
        )}

        {screenMode === "scanning" && uploadedImage && (
          <motion.div
            key="scanning"
            className="flex flex-col max-w-sm mx-auto w-full px-5 pt-8 pb-8 min-h-screen items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="relative w-full overflow-hidden rounded-3xl mb-6"
              style={{ height: "380px" }}
              data-ocid="acne-chat.canvas_target"
            >
              <img
                src={uploadedImage}
                alt="Uploaded face"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  borderRadius: "1.5rem",
                  filter: "brightness(0.6) saturate(0.8)",
                }}
              />
              <MeshCanvas />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <motion.div
                  key={scanTextIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    color: "rgb(0, 230, 255)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(0,200,255,0.3)",
                  }}
                >
                  {SCAN_TEXTS[scanTextIdx]}
                </motion.div>
              </div>
            </div>

            <div
              className="flex items-center gap-2.5"
              data-ocid="acne-chat.loading_state"
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
            </div>
          </motion.div>
        )}

        {screenMode === "detection" && (
          <motion.div
            key="detection"
            className="flex flex-col max-w-sm mx-auto w-full px-5 pt-8 pb-10 min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {uploadedImage && (
              <div
                className="relative w-full h-36 rounded-2xl overflow-hidden mb-5"
                style={{
                  boxShadow: "0 6px 24px -4px oklch(0.52 0.18 145 / 0.18)",
                }}
              >
                <img
                  src={uploadedImage}
                  alt="Scanned face"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.85)" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "oklch(0.52 0.18 145 / 0.3)" }}
                >
                  <span className="text-white text-3xl">✅</span>
                </div>
              </div>
            )}

            <motion.h2
              className="text-2xl font-bold mb-1 text-center"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Detection Complete ✅
            </motion.h2>
            <p
              className="text-sm text-center mb-6"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.04 60)",
              }}
            >
              AI analysis of your skin scan
            </p>

            <div
              className="rounded-3xl p-5 flex flex-col gap-4 mb-5"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 4px 24px -4px oklch(0.52 0.18 145 / 0.12)",
                border: "1.5px solid oklch(0.9 0.02 80)",
              }}
            >
              {detectionValues.map((d, idx) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + idx * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-semibold flex items-center gap-1.5"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        color: d.dominant
                          ? "oklch(0.38 0.14 145)"
                          : "oklch(0.35 0.06 60)",
                      }}
                    >
                      {d.name}
                      {d.dominant && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: "oklch(0.52 0.18 145)",
                            color: "oklch(0.99 0.006 80)",
                            fontSize: "0.6rem",
                          }}
                        >
                          DOMINANT
                        </span>
                      )}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        color: d.dominant
                          ? "oklch(0.42 0.16 145)"
                          : "oklch(0.55 0.04 60)",
                      }}
                    >
                      {d.value}%
                    </span>
                  </div>
                  <div
                    className="w-full rounded-full h-2"
                    style={{ background: "oklch(0.92 0.02 80)" }}
                  >
                    <motion.div
                      className="h-2 rounded-full"
                      style={{
                        background: d.dominant
                          ? "oklch(0.52 0.18 145)"
                          : "oklch(0.72 0.1 145)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.15 + idx * 0.07,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              type="button"
              data-ocid="acne-chat.primary_button"
              onClick={() => setScreenMode("results")}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: "oklch(0.52 0.18 145)",
                color: "oklch(0.99 0.006 80)",
                boxShadow: "0 6px 22px -4px oklch(0.52 0.18 145 / 0.38)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              View Full Results →
            </motion.button>
          </motion.div>
        )}

        {screenMode === "results" && (
          <ResultsScreen
            diagnosis={diagnosis}
            triggers={triggers}
            answers={answers}
            onGoToRoutine={() => {
              const acneType = (answers[2] as string) ?? "Inflammatory Acne";
              const skinType = (answers[4] as string) ?? "Combination";
              sessionStorage.setItem(
                "acnevedaResults",
                JSON.stringify({
                  acneType,
                  skinType,
                  phase: "Phase 1: Cleanse",
                  location: (answers[1] as string) ?? "",
                  triggers: (answers[5] as string[]) ?? [],
                }),
              );
              navigate({ to: "/main" });
            }}
            onStartNew={() => navigate({ to: "/assessment/step1" })}
          />
        )}
      </AnimatePresence>

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

// ─── Results Screen ──────────────────────────────────────────────────────────────────

function ResultsScreen({
  diagnosis,
  triggers,
  answers: _answers,
  onGoToRoutine,
  onStartNew,
}: {
  diagnosis: string;
  triggers?: string[];
  answers?: Record<number, string | string[]>;
  onGoToRoutine: () => void;
  onStartNew: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"morning" | "night">("morning");

  const causesHighlighted = {
    stress: triggers?.includes("Stress") ?? false,
    oilyFood: triggers?.includes("Oily food intake") ?? false,
    sleep: triggers?.includes("Poor sleep") ?? false,
  };

  const products = [
    {
      id: "wash",
      name: "Purifying Cleanser",
      benefit: "Deep cleanse without stripping",
      img: "/assets/generated/acne-facewash.dim_400x400.png",
    },
    {
      id: "serum",
      name: "Oil Control Serum",
      benefit: "Balance sebum & clear pores",
      img: "/assets/generated/acne-serum.dim_400x400.png",
    },
    {
      id: "spot",
      name: "Spot Corrector",
      benefit: "Targeted acne healing",
      img: "/assets/generated/acne-spot-treatment.dim_400x400.png",
    },
    {
      id: "moist",
      name: "Hydra Moisturizer",
      benefit: "Non-comedogenic hydration",
      img: "/assets/generated/acne-moisturizer.dim_400x400.png",
    },
  ];

  return (
    <motion.div
      key="results"
      className="flex flex-col max-w-sm mx-auto w-full px-5 pt-8 pb-12 min-h-screen"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-ocid="acne-chat.card"
    >
      {/* Diagnosis Banner */}
      <motion.div
        className="rounded-3xl p-5 mb-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.42 0.2 195))",
          boxShadow: "0 8px 36px -6px oklch(0.52 0.18 145 / 0.38)",
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.48 }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          AI + Dermatology Diagnosis
        </p>
        <h2
          className="text-lg font-bold leading-snug"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "oklch(0.99 0.006 80)",
          }}
        >
          {diagnosis}
        </h2>
      </motion.div>

      {/* Root Causes */}
      <motion.div
        className="rounded-3xl p-5 mb-4"
        style={{
          background: "oklch(1 0 0)",
          boxShadow: "0 4px 20px -4px oklch(0.55 0.14 145 / 0.1)",
          border: "1.5px solid oklch(0.9 0.02 80)",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3
          className="text-sm font-bold mb-3 uppercase tracking-wider"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.38 0.08 140)",
          }}
        >
          Root Causes
        </h3>
        <div className="flex flex-col gap-2.5">
          {[
            { icon: "💧", label: "Excess oil production", highlight: false },
            { icon: "🦠", label: "Bacterial activity", highlight: false },
            {
              icon: "🍕",
              label: `Lifestyle triggers (${
                [
                  causesHighlighted.oilyFood ? "diet" : null,
                  causesHighlighted.stress ? "stress" : null,
                  causesHighlighted.sleep ? "poor sleep" : null,
                ]
                  .filter(Boolean)
                  .join(", ") || "diet, stress"
              })`,
              highlight: causesHighlighted.stress || causesHighlighted.oilyFood,
            },
          ].map((cause) => (
            <div
              key={cause.label}
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl"
              style={{
                background: cause.highlight
                  ? "oklch(0.52 0.18 145 / 0.08)"
                  : "oklch(0.97 0.008 80)",
                border: cause.highlight
                  ? "1px solid oklch(0.52 0.18 145 / 0.2)"
                  : "1px solid transparent",
              }}
            >
              <span className="text-base flex-shrink-0">{cause.icon}</span>
              <span
                className="text-sm leading-snug"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: cause.highlight
                    ? "oklch(0.35 0.12 145)"
                    : "oklch(0.42 0.06 60)",
                  fontWeight: cause.highlight ? 600 : 400,
                }}
              >
                {cause.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Treatment Plan */}
      <motion.div
        className="rounded-3xl p-5 mb-4"
        style={{
          background: "oklch(1 0 0)",
          boxShadow: "0 4px 20px -4px oklch(0.55 0.14 145 / 0.1)",
          border: "1.5px solid oklch(0.9 0.02 80)",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        <h3
          className="text-sm font-bold mb-3 uppercase tracking-wider"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.38 0.08 140)",
          }}
        >
          Treatment Plan
        </h3>
        <div
          className="flex gap-1 rounded-full p-1 mb-4"
          style={{ background: "oklch(0.94 0.02 80)" }}
        >
          {(["morning", "night"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid="acne-chat.tab"
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-full text-xs font-semibold capitalize transition-all"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background:
                  activeTab === tab ? "oklch(0.52 0.18 145)" : "transparent",
                color:
                  activeTab === tab
                    ? "oklch(0.99 0.006 80)"
                    : "oklch(0.52 0.06 60)",
                boxShadow:
                  activeTab === tab
                    ? "0 2px 8px -1px oklch(0.52 0.18 145 / 0.32)"
                    : "none",
              }}
            >
              {tab === "morning" ? "☀️ Morning" : "🌙 Night"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "morning" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2.5"
          >
            {(activeTab === "morning"
              ? [
                  {
                    step: 1,
                    name: "Purifying Cleanser",
                    desc: "Gentle foam, morning clean",
                  },
                  {
                    step: 2,
                    name: "Oil Control Serum",
                    desc: "Controls sebum through the day",
                  },
                ]
              : [
                  {
                    step: 1,
                    name: "Acne Treatment Gel",
                    desc: "Targets active breakouts overnight",
                  },
                  {
                    step: 2,
                    name: "Spot Corrector",
                    desc: "Fades marks & reduces inflammation",
                  },
                ]
            ).map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 px-3 py-2.5 rounded-2xl"
                style={{ background: "oklch(0.97 0.008 80)" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: "oklch(0.52 0.18 145)",
                    color: "oklch(0.99 0.006 80)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.3 0.08 140)",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.58 0.04 60)",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Recommended Acne Kit */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26 }}
      >
        <h3
          className="text-sm font-bold mb-3 uppercase tracking-wider"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.38 0.08 140)",
          }}
        >
          💰 Recommended Acne Kit
        </h3>
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((prod, idx) => (
            <motion.div
              key={prod.id}
              className="flex-none snap-start rounded-3xl overflow-hidden flex flex-col"
              style={{
                width: "145px",
                background: "oklch(1 0 0)",
                boxShadow: "0 4px 16px -4px oklch(0.55 0.14 145 / 0.14)",
                border: "1.5px solid oklch(0.9 0.02 80)",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.07 }}
              data-ocid={`acne-chat.item.${idx + 1}`}
            >
              <div
                className="w-full h-28 overflow-hidden"
                style={{ background: "oklch(0.96 0.01 80)" }}
              >
                <img
                  src={prod.img}
                  alt={prod.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p
                  className="text-xs font-bold mb-1 leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.28 0.07 140)",
                  }}
                >
                  {prod.name}
                </p>
                <p
                  className="text-xs leading-snug mb-2.5 flex-1"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.58 0.04 60)",
                  }}
                >
                  {prod.benefit}
                </p>
                <button
                  type="button"
                  data-ocid="acne-chat.button"
                  onClick={() =>
                    toast("View Full Kit", {
                      description: "Product details coming soon!",
                      duration: 2200,
                    })
                  }
                  className="text-xs font-semibold py-1.5 rounded-full transition-all active:scale-95"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    border: "1.5px solid oklch(0.52 0.18 145)",
                    color: "oklch(0.42 0.14 145)",
                    background: "transparent",
                  }}
                >
                  View Full Kit →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <motion.button
          type="button"
          data-ocid="acne-chat.primary_button"
          onClick={onGoToRoutine}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "oklch(0.52 0.18 145)",
            color: "oklch(0.99 0.006 80)",
            boxShadow: "0 6px 22px -4px oklch(0.52 0.18 145 / 0.38)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          Go to My Routine →
        </motion.button>
        <motion.button
          type="button"
          data-ocid="acne-chat.secondary_button"
          onClick={onStartNew}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "transparent",
            border: "2px solid oklch(0.52 0.18 145)",
            color: "oklch(0.42 0.14 145)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
        >
          Start New Assessment
        </motion.button>
      </div>

      <p
        className="mt-8 text-center text-xs"
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: "oklch(0.68 0.04 60)",
        }}
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
      </p>
    </motion.div>
  );
}
