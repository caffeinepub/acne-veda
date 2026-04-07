import { useNavigate } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
};

type Chip = {
  label: string;
};

type SmartReply = { reply: string; chips: string[] };

const REPLY_ROUTINE: SmartReply = {
  reply:
    "Great to hear you're being consistent! \uD83C\uDF3F Following your routine daily is the most important step. Keep it up \u2014 consistency is key for clearing acne naturally.",
  chips: [
    "What are the steps again?",
    "Can I skip moisturizer?",
    "Any new breakouts?",
  ],
};
const REPLY_NO_ROUTINE: SmartReply = {
  reply:
    "No worries! It happens. Try to get back on track today \u2014 even doing just the cleanser step is better than nothing. \uD83D\uDC9A Small steps matter.",
  chips: ["Remind me the steps", "Any new breakouts?", "Diet tips?"],
};
const REPLY_BREAKOUT: SmartReply = {
  reply:
    "For new breakouts, apply the Neem Spot Corrector directly on the spot before bed. Avoid touching your face and try to keep your pillowcase clean. \uD83C\uDF3F",
  chips: ["How long to heal?", "Can I pop it?", "Diet tips?"],
};
const REPLY_NO_BREAKOUT: SmartReply = {
  reply:
    "That's wonderful progress! \uD83C\uDF89 Your Ayurvedic routine is working. Keep maintaining it and you'll continue to see improvement.",
  chips: ["Show my progress", "When to advance phase?", "Maintenance tips?"],
};
const REPLY_DIET: SmartReply = {
  reply:
    "For acne-prone skin, avoid spicy, oily, and processed foods. Include turmeric milk, amla, and plenty of water. Cooling foods like cucumber and coconut water help balance pitta dosha. \uD83E\uDD57",
  chips: ["What foods to avoid?", "Best herbal teas?", "Gut-skin connection?"],
};
const REPLY_NEEM: SmartReply = {
  reply:
    "Neem is one of the most powerful Ayurvedic herbs for acne. It has anti-bacterial and anti-inflammatory properties. Use the Neem Acne Gel at night and the Neem Cleanser in the morning. \uD83C\uDF3F",
  chips: ["How long to use?", "Any side effects?", "Diet tips?"],
};
const REPLY_STRESS: SmartReply = {
  reply:
    "Stress triggers cortisol which worsens acne \u2014 very common! Try Pranayama (breathing exercises) for 5 mins daily. Ashwagandha is also excellent for stress-related acne. \uD83E\uDDD8",
  chips: ["Stress management tips", "Herbal supplements?", "Sleep tips?"],
};
const REPLY_SLEEP: SmartReply = {
  reply:
    "Aim for 7\u20138 hours of sleep. Skin repairs itself at night \u2014 that's why the night routine is so important. Try drinking Brahmi milk before bed for better sleep quality. \uD83C\uDF19",
  chips: ["Night routine tips", "Stress management", "Diet tips?"],
};
const REPLY_OIL: SmartReply = {
  reply:
    "For oily skin, use the Oil Control Serum in the morning and avoid heavy moisturizers. Applying rose water as a toner helps balance sebum production naturally. \uD83D\uDCA7",
  chips: ["Best toner?", "Diet tips?", "Routine steps?"],
};
const REPLY_SCAR: SmartReply = {
  reply:
    "For acne scars, Kumkumadi oil is the gold standard in Ayurveda. Apply at night after the Neem Gel. Consistent use for 8\u201312 weeks shows visible results. \uD83C\uDF38",
  chips: ["How to apply?", "How long?", "Any products?"],
};
const DEFAULT_CHIPS: string[] = [
  "Diet tips?",
  "Tell me about neem",
  "Stress and acne",
];

function getBotResponse(text: string): SmartReply {
  const lower = text.toLowerCase();
  if (
    lower.includes("follow") ||
    lower.includes("yes") ||
    lower.includes("did")
  )
    return REPLY_ROUTINE;
  if (
    lower.includes("didn't") ||
    lower.includes("no routine") ||
    lower.includes("forgot")
  )
    return REPLY_NO_ROUTINE;
  if (
    lower.includes("breakout") ||
    lower.includes("pimple") ||
    lower.includes("new")
  )
    return REPLY_BREAKOUT;
  if (
    lower.includes("no breakout") ||
    lower.includes("clear") ||
    lower.includes("better")
  )
    return REPLY_NO_BREAKOUT;
  if (lower.includes("diet") || lower.includes("food") || lower.includes("eat"))
    return REPLY_DIET;
  if (lower.includes("neem")) return REPLY_NEEM;
  if (lower.includes("stress") || lower.includes("anxiety"))
    return REPLY_STRESS;
  if (lower.includes("sleep") || lower.includes("tired")) return REPLY_SLEEP;
  if (lower.includes("oil") || lower.includes("shiny")) return REPLY_OIL;
  if (lower.includes("scar") || lower.includes("mark")) return REPLY_SCAR;
  if (lower.includes("routine") || lower.includes("step")) return REPLY_ROUTINE;
  return {
    reply:
      "Great question! Based on Ayurvedic principles, I'd recommend focusing on your daily routine consistently. Each skin type needs personalized care \u2014 your treatment plan has been tailored just for you. \uD83C\uDF3F Is there anything specific about your skin you'd like to know?",
    chips: DEFAULT_CHIPS,
  };
}

export function ChatTab() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "bot",
      text: "Namaste! \uD83D\uDE4F I'm Dr. Vaidya AI, your Ayurvedic skin advisor. I'm here to help you with your skincare journey. Let me start with your daily check-in:",
    },
  ]);
  const [chips, setChips] = useState<Chip[]>([
    { label: "Did you follow your routine today?" },
    { label: "Any new breakouts?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrolling on message/typing change is intentional
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChips([]);
    setIsTyping(true);
    setTimeout(() => {
      const { reply, chips: newChips } = getBotResponse(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), from: "bot", text: reply },
      ]);
      setChips(newChips.map((c) => ({ label: c })));
    }, 1100);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F0F7FF", paddingBottom: "0" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4 shrink-0"
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
          >
            AI
          </div>
          <div>
            <h1
              className="text-white text-lg font-bold"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
              }}
            >
              AI Dermatology Chat
            </h1>
            <p className="text-white/70 text-xs">
              Dr. Vaidya AI \u2022 Ayurvedic Expert
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#4ADE80" }}
            />
            <span className="text-white/90 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mt-3 mb-1 rounded-2xl p-4 flex items-center gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.18 145) 0%, oklch(0.58 0.16 160) 100%)",
          boxShadow: "0 4px 20px oklch(0.52 0.18 145 / 0.25)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Sparkles className="w-5 h-5" style={{ color: "white" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            \uD83C\uDF3F Start a New Consultation
          </p>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.8)",
              marginTop: "2px",
            }}
          >
            Get personalized skin & hair advice
          </p>
        </div>
        <button
          type="button"
          data-ocid="chat.consultation_button"
          onClick={() => navigate({ to: "/consultation" })}
          className="shrink-0 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95"
          style={{
            background: "rgba(255,255,255,0.95)",
            color: "oklch(0.38 0.14 145)",
            fontFamily: "DM Sans, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Start \u2192
        </button>
      </motion.div>

      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ paddingBottom: "80px" }}
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
                  style={{ background: "#10B981", color: "#fff" }}
                >
                  AI
                </div>
              )}
              <div
                className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: msg.from === "user" ? "#3B82F6" : "#fff",
                  color: msg.from === "user" ? "#fff" : "#1E293B",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  borderTopRightRadius: msg.from === "user" ? "4px" : "16px",
                  borderTopLeftRadius: msg.from === "bot" ? "4px" : "16px",
                  fontFamily:
                    "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          </AnimatePresence>
        ))}

        {isTyping && (
          <motion.div
            className="flex gap-2 items-end"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "#10B981", color: "#fff" }}
            >
              AI
            </div>
            <div
              className="px-3.5 py-3 rounded-2xl flex gap-1 items-center"
              style={{
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#94A3B8",
                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {!isTyping && chips.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 pl-9"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                data-ocid="chat.secondary_button"
                onClick={() => sendMessage(chip.label)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.96]"
                style={{
                  background: "#EFF6FF",
                  border: "1.5px solid #BFDBFE",
                  color: "#3B82F6",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {chip.label}
              </button>
            ))}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="absolute bottom-16 left-0 right-0 px-4 py-3"
        style={{
          background: "#fff",
          borderTop: "1px solid #E2E8F0",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            data-ocid="chat.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about your skin..."
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
            style={{
              background: "#F0F7FF",
              border: "1.5px solid #E2E8F0",
              color: "#1E293B",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: input.trim() ? "#3B82F6" : "#E2E8F0",
              color: input.trim() ? "#fff" : "#94A3B8",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
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
