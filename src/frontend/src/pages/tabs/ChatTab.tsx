import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
};

type SmartReply = { reply: string; chips: string[] };

// ─── Ayurvedic keyword reply bank ────────────────────────────────────────────
const REPLY_ROUTINE: SmartReply = {
  reply:
    "Great to hear you're being consistent! 🌿 Following your routine daily is the most important step. Keep it up — consistency is key for clearing skin naturally.",
  chips: ["What are the steps again?", "Can I skip moisturizer?", "Diet tips?"],
};
const REPLY_BREAKOUT: SmartReply = {
  reply:
    "For new breakouts, apply the Neem Spot Corrector directly on the spot before bed. Avoid touching your face and keep your pillowcase clean. 🌿",
  chips: ["How long to heal?", "Diet tips?", "Stress and skin?"],
};
const REPLY_DIET: SmartReply = {
  reply:
    "For clear skin & healthy hair, avoid spicy, oily, and processed foods. Include turmeric milk, amla, and plenty of water. Cooling foods like cucumber and coconut water help balance pitta dosha. 🥗",
  chips: ["What foods to avoid?", "Best herbal teas?", "Gut-skin connection?"],
};
const REPLY_NEEM: SmartReply = {
  reply:
    "Neem is one of the most powerful Ayurvedic herbs for acne. It has anti-bacterial and anti-inflammatory properties. Use Neem Acne Gel at night and Neem Cleanser in the morning. 🌿",
  chips: ["How long to use?", "Any side effects?", "Diet tips?"],
};
const REPLY_STRESS: SmartReply = {
  reply:
    "Stress triggers cortisol which worsens acne and hair fall — very common! Try Pranayama (breathing exercises) for 5 mins daily. Ashwagandha is excellent for stress-related concerns. 🧘",
  chips: ["Stress management tips", "Herbal supplements?", "Sleep tips?"],
};
const REPLY_SLEEP: SmartReply = {
  reply:
    "Aim for 7-8 hours of sleep. Skin repairs itself at night — that's why the night routine is so important. Try drinking Brahmi milk before bed for better sleep quality. 🌙",
  chips: ["Night routine tips", "Stress management", "Diet tips?"],
};
const REPLY_OIL: SmartReply = {
  reply:
    "For oily skin, use the Oil Control Serum in the morning and avoid heavy moisturizers. Applying rose water as a toner helps balance sebum production naturally. 💧",
  chips: ["Best toner?", "Diet tips?", "Routine steps?"],
};
const REPLY_SCAR: SmartReply = {
  reply:
    "For acne scars, Kumkumadi oil is the gold standard in Ayurveda. Apply at night after the Neem Gel. Consistent use for 8-12 weeks shows visible results. 🌸",
  chips: ["How to apply?", "How long?", "Any products?"],
};
const REPLY_HAIR: SmartReply = {
  reply:
    "For healthy hair, Bhringraj oil massage twice a week strengthens roots and reduces fall. Pair it with a protein-rich diet. 💇 Avoid hot water on scalp — use lukewarm instead.",
  chips: ["Hair fall tips", "Best hair oil?", "Diet for hair?"],
};
const REPLY_DOSHA: SmartReply = {
  reply:
    "Your dosha profile helps us personalize treatment. Based on your acne type: Pitta dosha governs inflammation and oiliness, Vata causes dryness and sensitivity, Kapha leads to congestion and cysts. 🌿 Tell me your skin type for a precise dosha mapping.",
  chips: ["I have oily skin", "My skin is dry", "Combination skin"],
};
const REPLY_DEFAULT: SmartReply = {
  reply:
    "Great question! Based on Ayurvedic principles, consistency in your daily routine is the most powerful step for clear skin. 🌿 Is there anything specific about your skin or hair you'd like guidance on?",
  chips: ["Tell me about neem", "Diet tips?", "Stress and skin"],
};

const DEFAULT_CHIPS = ["Diet tips?", "Tell me about neem", "Stress and skin"];

const CHECK_IN_PROMPTS = [
  "Did you follow your routine today?",
  "Any new breakouts?",
];

function getKeywordReply(text: string): SmartReply {
  const lower = text.toLowerCase();
  if (
    lower.includes("follow") ||
    lower.includes("routine") ||
    lower.includes("step")
  )
    return REPLY_ROUTINE;
  if (
    lower.includes("breakout") ||
    lower.includes("pimple") ||
    lower.includes("acne")
  )
    return REPLY_BREAKOUT;
  if (lower.includes("diet") || lower.includes("food") || lower.includes("eat"))
    return REPLY_DIET;
  if (lower.includes("neem")) return REPLY_NEEM;
  if (lower.includes("stress") || lower.includes("anxiety"))
    return REPLY_STRESS;
  if (lower.includes("sleep") || lower.includes("tired")) return REPLY_SLEEP;
  if (
    lower.includes("oil") ||
    lower.includes("shiny") ||
    lower.includes("oily")
  )
    return REPLY_OIL;
  if (
    lower.includes("scar") ||
    lower.includes("mark") ||
    lower.includes("pigment")
  )
    return REPLY_SCAR;
  if (
    lower.includes("hair") ||
    lower.includes("fall") ||
    lower.includes("dandruff")
  )
    return REPLY_HAIR;
  if (
    lower.includes("dosha") ||
    lower.includes("pitta") ||
    lower.includes("vata") ||
    lower.includes("kapha")
  )
    return REPLY_DOSHA;
  return REPLY_DEFAULT;
}

function makeWelcomeMessage(username: string): Message {
  return {
    id: "welcome",
    from: "bot",
    text: `Welcome back, ${username}! 🌿 I'm Dr. Vaidya, your AI skin & hair advisor.\n\nThis is your follow-up chat. How is your skin doing today? Feel free to ask me anything about your routine, diet, or concerns.`,
  };
}

export function ChatTab() {
  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("acneveda_user") ?? "there")
      : "there";

  const [messages, setMessages] = useState<Message[]>([
    makeWelcomeMessage(username),
  ]);
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing change
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
      setIsTyping(false);
      const { reply, chips: nextChips } = getKeywordReply(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), from: "bot", text: reply },
      ]);
      setChips(nextChips);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#FAF7F2" }}>
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4 shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.14 146) 0%, oklch(0.42 0.12 155) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}
          >
            AI
          </div>
          <div>
            <h1
              className="text-white text-lg font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              AI Dermatology Chat
            </h1>
            <p className="text-white/70 text-xs">
              Dr. Vaidya AI · Ayurvedic Expert
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#A8E6B0" }}
            />
            <span className="text-white/90 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Daily Check-in prompts */}
      <div
        className="px-4 py-3 shrink-0 flex gap-2 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          borderBottom: "1px solid #E8E0D6",
          background: "#FFFFFF",
        }}
      >
        <span
          className="text-xs font-semibold shrink-0 self-center"
          style={{ color: "#A89880" }}
        >
          Check-in:
        </span>
        {CHECK_IN_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            data-ocid="chat.checkin_button"
            onClick={() => sendMessage(prompt)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.96]"
            style={{
              background: "#EAF4EA",
              border: "1.5px solid #C4DCC4",
              color: "oklch(0.42 0.14 146)",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

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
              transition={{ duration: 0.26 }}
              className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.from === "bot" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
                  style={{ background: "oklch(0.52 0.14 146)", color: "#fff" }}
                >
                  AI
                </div>
              )}
              <div
                className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={{
                  background:
                    msg.from === "user" ? "oklch(0.52 0.14 146)" : "#FFFFFF",
                  color: msg.from === "user" ? "#fff" : "#3D2C1E",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  borderTopRightRadius: msg.from === "user" ? "4px" : "16px",
                  borderTopLeftRadius: msg.from === "bot" ? "4px" : "16px",
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
              style={{ background: "oklch(0.52 0.14 146)", color: "#fff" }}
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
                    background: "#C8BDB0",
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
                key={chip}
                type="button"
                data-ocid="chat.secondary_button"
                onClick={() => sendMessage(chip)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.96]"
                style={{
                  background: "#EAF4EA",
                  border: "1.5px solid #C4DCC4",
                  color: "oklch(0.42 0.14 146)",
                }}
              >
                {chip}
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
          borderTop: "1px solid #E8E0D6",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.05)",
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
            placeholder="Ask Dr. Vaidya anything..."
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
            style={{
              background: "#FAF7F2",
              border: "1.5px solid #E8E0D6",
              color: "#3D2C1E",
            }}
          />
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: input.trim() ? "oklch(0.52 0.14 146)" : "#E8E0D6",
              color: input.trim() ? "#fff" : "#B0A090",
            }}
            aria-label="Send message"
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
