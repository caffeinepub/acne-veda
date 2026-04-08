import { Badge } from "@/components/ui/badge";
import { useActor } from "@/hooks/useActor";
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
  Shield,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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
  location?: string;
  triggers?: string[];
};

const products = [
  {
    id: "wash",
    name: "Triphala Cleanser",
    benefit: "Gentle herbal cleanse",
    reason: "Matches your oily skin type",
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

export function HomeTab() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const username = localStorage.getItem("acneveda_user") ?? "User";
  const rawResults = sessionStorage.getItem("acnevedaResults");
  const results: AssessmentResults = rawResults ? JSON.parse(rawResults) : {};

  const acneType = results.acneType ?? "Inflammatory Acne";
  const skinType = results.skinType ?? "Combination";
  const phase = results.phase ?? "Phase 1: Cleanse";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Assessment-incomplete popup logic
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
      style={{ background: "#F0F7FF" }}
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
                background: "#FFFFFF",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              {/* Popup header illustration */}
              <div
                className="px-6 pt-6 pb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "#BFDBFE" }}
                  >
                    <ClipboardList
                      className="w-7 h-7"
                      style={{ color: "#1D4ED8" }}
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
                    <X className="w-4 h-4" style={{ color: "#64748B" }} />
                  </button>
                </div>
              </div>

              {/* Popup body */}
              <div className="px-6 py-5">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#1E3A5F",
                  }}
                >
                  Complete Your Assessment
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#475569",
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
                    background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                    color: "#fff",
                    boxShadow: "0 4px 18px rgba(59,130,246,0.35)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#94A3B8",
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
        style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #F0F7FF 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p
            className="text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "#64748B",
            }}
          >
            {greeting}, 👋
          </p>
          <h1
            className="text-xl font-bold capitalize"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "#1E3A5F",
            }}
          >
            {username}
          </h1>
        </motion.div>

        {/* Treatment summary pill */}
        <motion.div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(59,130,246,0.08)",
            border: "1px solid #E2E8F0",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: "#3B82F6" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#3B82F6",
              }}
            >
              Your Treatment Summary
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className="text-xs"
              style={{
                background: "#DBEAFE",
                color: "#1D4ED8",
                border: "none",
              }}
            >
              {acneType}
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "#D1FAE5",
                color: "#065F46",
                border: "none",
              }}
            >
              {skinType} Skin
            </Badge>
            <Badge
              className="text-xs"
              style={{
                background: "#FEF3C7",
                color: "#92400E",
                border: "none",
              }}
            >
              {phase}
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-2">
        {/* Daily Routine Section */}
        <motion.h2
          className="text-sm font-bold uppercase tracking-wide mb-3"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#64748B",
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
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(59,130,246,0.06)",
            border: "1px solid #E2E8F0",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" style={{ color: "#F59E0B" }} />
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: "#1E3A5F",
                }}
              >
                Morning Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  morningDone === morningSteps.length ? "#D1FAE5" : "#EFF6FF",
                color:
                  morningDone === morningSteps.length ? "#065F46" : "#3B82F6",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      style={{ color: "#22C55E" }}
                    />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: "#CBD5E1" }} />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: step.checked ? "#94A3B8" : "#1E3A5F",
                      textDecoration: step.checked ? "line-through" : "none",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: "#94A3B8",
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
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(59,130,246,0.06)",
            border: "1px solid #E2E8F0",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" style={{ color: "#8B5CF6" }} />
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: "#1E3A5F",
                }}
              >
                Night Routine
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background:
                  nightDone === nightSteps.length ? "#D1FAE5" : "#EFF6FF",
                color: nightDone === nightSteps.length ? "#065F46" : "#3B82F6",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      style={{ color: "#22C55E" }}
                    />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: "#CBD5E1" }} />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: step.checked ? "#94A3B8" : "#1E3A5F",
                      textDecoration: step.checked ? "line-through" : "none",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: "#94A3B8",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Recommendations */}
        <motion.h2
          className="text-sm font-bold uppercase tracking-wide mb-3"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#64748B",
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
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                border: "1px solid #E2E8F0",
              }}
            >
              <div className="w-full h-24" style={{ background: "#F8FAFF" }}>
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
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#1E3A5F",
                  }}
                >
                  {product.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#94A3B8",
                  }}
                >
                  {product.benefit}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#3B82F6",
                    fontSize: "10px",
                  }}
                >
                  {product.reason}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
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
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
              border: "2px solid #3B82F6",
              color: "#3B82F6",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Leaf
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#16A34A" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#15803D",
              }}
            >
              Ayurvedic Tip of the Day
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#166534",
              }}
            >
              Drink warm water with Triphala before bed to support natural
              detoxification and clearer skin over time.
            </p>
          </div>
        </motion.div>

        {/* Dosha info */}
        <motion.div
          className="mt-3 rounded-2xl p-4 flex gap-3"
          style={{
            background: "#FFF7ED",
            border: "1px solid #FED7AA",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        >
          <Sparkles
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#EA580C" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#C2410C",
              }}
            >
              Pitta Dosha Balance
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#9A3412",
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
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
        >
          <Droplets
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#3B82F6" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#1D4ED8",
              }}
            >
              Hydration Reminder
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#1E40AF",
              }}
            >
              Drink 8-10 glasses of water daily. Good hydration supports skin
              cell renewal and reduces acne inflammation.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs py-6" style={{ color: "#94A3B8" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "#3B82F6" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
