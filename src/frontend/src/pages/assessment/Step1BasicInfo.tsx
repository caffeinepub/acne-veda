import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function Step1BasicInfo() {
  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("acneveda_user") ?? "there")
      : "there";

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState([24]);
  const [sex, setSex] = useState<string | null>(null);
  const [occupation, setOccupation] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  function handleContinue() {
    // Save basic info to localStorage for use in chat
    if (typeof window !== "undefined") {
      localStorage.setItem("acneveda_fullname", fullName);
      localStorage.setItem("acneveda_age", String(age[0]));
      if (sex) localStorage.setItem("acneveda_sex", sex);
      if (occupation) localStorage.setItem("acneveda_occupation", occupation);
      // Signal that chat tab should open on arrival and show entry question
      sessionStorage.setItem("acneveda_pending_tab", "chat");
      sessionStorage.setItem("acneveda_chat_new_consultation", "1");
    }

    // Show brief "Initializing AI…" overlay, then navigate to /main with ?tab=chat
    setInitializing(true);
    setTimeout(() => {
      // Use direct location to pass the tab param without router type constraints
      window.location.href = "/main?tab=chat";
    }, 1600);
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
          role="img"
          aria-label="leaf decoration"
        >
          <title>leaf decoration</title>
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

      {/* AI Initializing overlay */}
      <AnimatePresence>
        {initializing && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "oklch(0.97 0.012 80)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center gap-6 text-center px-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.52 0.18 145 / 0.12)",
                  border: "2px solid oklch(0.52 0.18 145 / 0.3)",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Brain
                    className="w-9 h-9"
                    style={{ color: "oklch(0.48 0.18 145)" }}
                  />
                </motion.div>
              </div>
              <div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.22 0.07 140)",
                  }}
                >
                  Initializing AI…
                </h2>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: "oklch(0.52 0.04 60)",
                  }}
                >
                  Preparing your personalized consultation with Dr. Vaidya
                </p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "oklch(0.52 0.18 145)" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-36 px-5 pt-10 max-w-sm mx-auto w-full">
        {/* Progress */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.52 0.14 145)",
              }}
            >
              Step 1 of 1
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.6 0.04 60)",
              }}
            >
              Basic Info
            </span>
          </div>
          <div
            className="w-full rounded-full h-1.5"
            style={{ background: "oklch(0.9 0.02 80)" }}
          >
            <motion.div
              className="h-1.5 rounded-full"
              style={{ background: "oklch(0.52 0.18 145)" }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <h1
            className="text-3xl font-bold leading-snug mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "oklch(0.22 0.07 140)",
            }}
          >
            Hi, {username} 👋
          </h1>
          <p
            className="text-sm mb-3"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            Let&apos;s get to know you before we begin
          </p>
          {/* Dr. Vaidya chip */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.52 0.18 145 / 0.1)",
              border: "1px solid oklch(0.52 0.18 145 / 0.25)",
              color: "oklch(0.38 0.14 145)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <span>🩺</span>
            <span>
              Our AI assistant Dr. Vaidya will guide your personalized skin
              &amp; hair analysis
            </span>
          </div>
        </motion.div>

        {/* Disclaimer card */}
        <motion.div
          className="mb-5 p-4 rounded-3xl"
          style={{
            background: "oklch(1 0 0)",
            boxShadow: "0 4px 24px -4px oklch(0.55 0.14 145 / 0.12)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "oklch(0.52 0.18 145 / 0.1)" }}
            >
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: "oklch(0.48 0.16 145)" }}
              />
            </div>
            <div>
              <p
                className="text-xs leading-relaxed mb-2"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.38 0.06 60)",
                }}
              >
                This assessment is for informational purposes only and does not
                replace professional medical advice. Your data is secure and
                used only for personalization.
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.58 0.04 60)",
                }}
              >
                By continuing, you agree to our{" "}
                <span
                  className="underline underline-offset-1"
                  style={{ color: "oklch(0.48 0.14 145)" }}
                >
                  Terms &amp; Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="full-name"
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.08 140)",
              }}
            >
              Full Name
            </label>
            <Input
              id="full-name"
              data-ocid="assessment.step1.input"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 text-sm"
              style={{
                borderRadius: "14px",
                border: "1px solid oklch(0.88 0.025 70)",
                background: "oklch(1 0 0)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                boxShadow: "0 2px 8px -2px oklch(0.55 0.14 145 / 0.06)",
              }}
            />
          </div>

          {/* Age slider */}
          <div>
            <p
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.08 140)",
              }}
            >
              Age:{" "}
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.52 0.18 145)",
                  fontSize: "1rem",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                {age[0]}
              </span>
            </p>
            <div
              className="px-3 py-3.5 rounded-2xl"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.88 0.025 70)",
                boxShadow: "0 2px 8px -2px oklch(0.55 0.14 145 / 0.06)",
              }}
            >
              <Slider
                data-ocid="assessment.step1.toggle"
                min={13}
                max={70}
                step={1}
                value={age}
                onValueChange={setAge}
                className="w-full"
                aria-label="Age"
              />
              <div
                className="flex justify-between mt-1.5 text-xs"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.62 0.04 60)",
                }}
              >
                <span>13</span>
                <span>70</span>
              </div>
            </div>
          </div>

          {/* Sex pills */}
          <div>
            <p
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.08 140)",
              }}
            >
              Sex
            </p>
            <div className="flex gap-2 flex-wrap">
              {["Male", "Female", "Prefer not to say"].map((option) => (
                <button
                  key={option}
                  type="button"
                  data-ocid="assessment.step1.radio"
                  onClick={() => setSex(option)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    background:
                      sex === option ? "oklch(0.52 0.18 145)" : "oklch(1 0 0)",
                    color:
                      sex === option
                        ? "oklch(0.99 0.006 80)"
                        : "oklch(0.42 0.06 60)",
                    border:
                      sex === option
                        ? "1.5px solid oklch(0.52 0.18 145)"
                        : "1.5px solid oklch(0.88 0.025 70)",
                    boxShadow:
                      sex === option
                        ? "0 4px 12px -2px oklch(0.52 0.18 145 / 0.28)"
                        : "0 1px 4px -1px oklch(0.55 0.14 145 / 0.06)",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Occupation dropdown */}
          <div>
            <p
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.38 0.08 140)",
              }}
            >
              Occupation
            </p>
            <Select onValueChange={setOccupation}>
              <SelectTrigger
                data-ocid="assessment.step1.select"
                className="w-full h-12 text-sm"
                aria-label="Occupation"
                style={{
                  borderRadius: "14px",
                  border: "1px solid oklch(0.88 0.025 70)",
                  background: "oklch(1 0 0)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxShadow: "0 2px 8px -2px oklch(0.55 0.14 145 / 0.06)",
                  color:
                    occupation !== null
                      ? "oklch(0.28 0.07 140)"
                      : "oklch(0.6 0.04 60)",
                }}
              >
                <SelectValue placeholder="Select your occupation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Working Professional">
                  Working Professional
                </SelectItem>
                <SelectItem value="Homemaker">Homemaker</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* What happens next preview */}
        <motion.div
          className="mt-6 p-4 rounded-3xl"
          style={{
            background: "oklch(0.52 0.18 145 / 0.06)",
            border: "1px solid oklch(0.52 0.18 145 / 0.18)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.42 0.14 145)",
            }}
          >
            What happens next
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              {
                icon: MessageCircle,
                label: "AI Chat Consultation",
                desc: "Dr. Vaidya asks smart, targeted questions",
              },
              {
                icon: Sparkles,
                label: "Skin/Hair Analysis",
                desc: "AI scan for accurate acne type detection",
              },
              {
                icon: Brain,
                label: "Personalized Report",
                desc: "Ayurvedic treatment plan & diet tips",
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.52 0.18 145 / 0.12)" }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.48 0.18 145)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.32 0.1 140)",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.55 0.04 60)",
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-5 pb-6 pt-4"
        style={{
          background:
            "linear-gradient(to top, oklch(0.97 0.012 80) 80%, transparent)",
        }}
      >
        <div className="max-w-sm mx-auto">
          <Button
            type="button"
            data-ocid="assessment.step1.submit_button"
            onClick={handleContinue}
            disabled={initializing}
            className="w-full h-14 text-base font-semibold rounded-2xl transition-all active:scale-[0.98] hover:opacity-90 text-white"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: "oklch(0.52 0.18 145)",
              boxShadow: "0 6px 24px -4px oklch(0.52 0.18 145 / 0.38)",
              border: "none",
            }}
          >
            {initializing ? "Initializing AI…" : "Start AI Analysis →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
