import { Badge } from "@/components/ui/badge";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Droplets,
  Leaf,
  Moon,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

const products = [
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
    reason: "Targets your acne triggers",
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
    reason: "Lightweight, won't clog pores",
    img: "/assets/generated/acne-moisturizer.dim_400x400.png",
  },
];

const GREEN = "oklch(0.52 0.18 145)";

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

  const [morningSteps, setMorningSteps] = useState<RoutineStep[]>([
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
  ]);

  const [nightSteps, setNightSteps] = useState<RoutineStep[]>([
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
  ]);

  const morningDone = morningSteps.filter((s) => s.checked).length;
  const nightDone = nightSteps.filter((s) => s.checked).length;

  function toggleMorning(id: string) {
    setMorningSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  }
  function toggleNight(id: string) {
    setNightSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  }

  return (
    <div
      className="relative h-full overflow-y-auto pb-20"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      {/* Assessment Incomplete Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="assessment-popup-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "rgba(15, 23, 42, 0.55)" }}
            data-ocid="home.modal"
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 20px 60px oklch(0.55 0.14 145 / 0.2)",
              }}
            >
              <div
                className="px-6 pt-6 pb-4"
                style={{ background: "oklch(0.52 0.18 145 / 0.08)" }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.52 0.18 145 / 0.15)" }}
                  >
                    <ClipboardList
                      className="w-7 h-7"
                      style={{ color: GREEN }}
                    />
                  </div>
                  <button
                    type="button"
                    data-ocid="home.close_button"
                    onClick={handleDismiss}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.7)" }}
                    aria-label="Dismiss popup"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "oklch(0.5 0.04 60)" }}
                    />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.22 0.07 140)",
                  }}
                >
                  Complete Your Assessment
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.48 0.04 60)",
                  }}
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
                    background: GREEN,
                    color: "#fff",
                    boxShadow: "0 4px 18px oklch(0.52 0.18 145 / 0.35)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Start Assessment →
                </button>
                <button
                  type="button"
                  data-ocid="home.cancel_button"
                  onClick={handleDismiss}
                  className="w-full py-2.5 mt-2 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.6 0.04 60)",
                    background: "transparent",
                  }}
                >
                  Remind me later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "oklch(0.52 0.18 145 / 0.06)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            {greeting}, 👋
          </p>
          <h1
            className="text-xl font-bold capitalize"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            {username}
          </h1>
        </motion.div>

        {/* Treatment summary */}
        <motion.div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: "oklch(1 0 0)",
            boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.08)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: GREEN }} />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: GREEN,
              }}
            >
              Your Treatment Summary
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.52 0.18 145 / 0.12)",
                color: "oklch(0.32 0.14 145)",
                border: "none",
              }}
            >
              {acneType}
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.62 0.12 145 / 0.12)",
                color: "oklch(0.32 0.12 145)",
                border: "none",
              }}
            >
              {skinType} Skin
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.65 0.2 35 / 0.12)",
                color: "oklch(0.42 0.18 35)",
                border: "none",
              }}
            >
              {phase}
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-2">
        <motion.h2
          className="text-sm font-bold uppercase tracking-wide mb-3"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.52 0.04 60)",
          }}
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
            background: "oklch(1 0 0)",
            boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.06)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun
                className="w-4 h-4"
                style={{ color: "oklch(0.65 0.2 70)" }}
              />
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.22 0.07 140)",
                }}
              >
                Morning Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  morningDone === morningSteps.length
                    ? "oklch(0.52 0.18 145 / 0.12)"
                    : "oklch(0.52 0.18 145 / 0.06)",
                color:
                  morningDone === morningSteps.length
                    ? "oklch(0.38 0.14 145)"
                    : GREEN,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {morningDone}/{morningSteps.length} done
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {morningSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                data-ocid={`home.checkbox.${step.id}`}
                onClick={() => toggleMorning(step.id)}
                className="flex items-center gap-3 text-left transition-opacity active:scale-[0.99]"
              >
                <div className="flex-shrink-0">
                  {step.checked ? (
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: GREEN }}
                    />
                  ) : (
                    <Circle
                      className="w-5 h-5"
                      style={{ color: "oklch(0.75 0.04 60)" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: step.checked
                        ? "oklch(0.65 0.04 60)"
                        : "oklch(0.22 0.07 140)",
                      textDecoration: step.checked ? "line-through" : "none",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.65 0.04 60)",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Night Routine */}
        <motion.div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "oklch(1 0 0)",
            boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.06)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon
                className="w-4 h-4"
                style={{ color: "oklch(0.58 0.18 250)" }}
              />
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.22 0.07 140)",
                }}
              >
                Night Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  nightDone === nightSteps.length
                    ? "oklch(0.52 0.18 145 / 0.12)"
                    : "oklch(0.52 0.18 145 / 0.06)",
                color:
                  nightDone === nightSteps.length
                    ? "oklch(0.38 0.14 145)"
                    : GREEN,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {nightDone}/{nightSteps.length} done
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {nightSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                data-ocid={`home.checkbox.${step.id}`}
                onClick={() => toggleNight(step.id)}
                className="flex items-center gap-3 text-left transition-opacity active:scale-[0.99]"
              >
                <div className="flex-shrink-0">
                  {step.checked ? (
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: GREEN }}
                    />
                  ) : (
                    <Circle
                      className="w-5 h-5"
                      style={{ color: "oklch(0.75 0.04 60)" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: step.checked
                        ? "oklch(0.65 0.04 60)"
                        : "oklch(0.22 0.07 140)",
                      textDecoration: step.checked ? "line-through" : "none",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.65 0.04 60)",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products */}
        <motion.h2
          className="text-sm font-bold uppercase tracking-wide mb-3"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: "oklch(0.52 0.04 60)",
          }}
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
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-36 rounded-2xl overflow-hidden"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 2px 8px oklch(0.55 0.14 145 / 0.08)",
                border: "1px solid oklch(0.9 0.02 80)",
              }}
            >
              <div
                className="w-full h-24"
                style={{ background: "oklch(0.52 0.18 145 / 0.04)" }}
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
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.22 0.07 140)",
                  }}
                >
                  {product.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.6 0.04 60)",
                  }}
                >
                  {product.benefit}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: GREEN,
                    fontSize: "10px",
                  }}
                >
                  {product.reason}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

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
              background: GREEN,
              color: "#fff",
              boxShadow: "0 4px 16px oklch(0.52 0.18 145 / 0.35)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
            onClick={() => {
              const el = document.createElement("div");
              el.textContent = "Coming soon — product store launching soon! 🛒";
              el.style.cssText =
                "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:oklch(0.22 0.07 140);color:#fff;padding:10px 20px;border-radius:999px;font-size:13px;font-family:'DM Sans',sans-serif;z-index:9999;pointer-events:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.18)";
              document.body.appendChild(el);
              setTimeout(() => el.remove(), 3500);
            }}
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
              border: "2px solid oklch(0.52 0.18 145 / 0.4)",
              color: GREEN,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
            onClick={() => navigate({ to: "/assessment/step1" })}
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
        </motion.div>

        {/* Ayurvedic tip */}
        <motion.div
          className="mt-4 rounded-2xl p-4 flex gap-3"
          style={{
            background: "oklch(0.52 0.18 145 / 0.06)",
            border: "1px solid oklch(0.52 0.18 145 / 0.18)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Leaf
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: GREEN }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.14 145)",
              }}
            >
              Ayurvedic Tip of the Day
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.1 140)",
              }}
            >
              Drink warm water with Triphala before bed to support natural
              detoxification and clearer skin over time.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-3 rounded-2xl p-4 flex gap-3"
          style={{
            background: "oklch(0.65 0.2 35 / 0.06)",
            border: "1px solid oklch(0.65 0.2 35 / 0.2)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        >
          <Sparkles
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.58 0.2 35)" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.48 0.18 35)",
              }}
            >
              Pitta Dosha Balance
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.14 35)",
              }}
            >
              Inflammatory acne often indicates elevated Pitta. Cooling foods
              like cucumber, coconut water, and amla help restore balance.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-3 rounded-2xl p-4 flex gap-3"
          style={{
            background: "oklch(0.62 0.18 220 / 0.06)",
            border: "1px solid oklch(0.62 0.18 220 / 0.2)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
        >
          <Droplets
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.52 0.18 220)" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.42 0.16 220)",
              }}
            >
              Hydration Reminder
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.14 220)",
              }}
            >
              Drink 8-10 glasses of water daily. Good hydration supports skin
              cell renewal and reduces acne inflammation.
            </p>
          </div>
        </motion.div>

        <p
          className="text-center text-xs py-6"
          style={{ color: "oklch(0.65 0.04 60)" }}
        >
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: GREEN }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
