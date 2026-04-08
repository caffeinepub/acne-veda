import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Message = { id: string; from: "bot" | "user"; text: string };
type Chip = { label: string };
type SmartReply = { reply: string; chips: string[] };

type ConsultationPhase =
  | "entry"
  | "skin_concern"
  | "skin_severity"
  | "skin_type"
  | "hair_concern"
  | "hair_severity"
  | "hair_type"
  | "recommendation"
  | "freeform";

interface ConsultationState {
  phase: ConsultationPhase;
  focus: "skin" | "hair" | "both" | null;
  skinConcern: string | null;
  skinSeverity: string | null;
  skinType: string | null;
  hairConcern: string | null;
  hairSeverity: string | null;
  hairType: string | null;
}

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
    "Aim for 7–8 hours of sleep. Skin repairs itself at night — that's why the night routine is so important. Try drinking Brahmi milk before bed for better sleep quality. 🌙",
  chips: ["Night routine tips", "Stress management", "Diet tips?"],
};
const REPLY_OIL: SmartReply = {
  reply:
    "For oily skin, use the Oil Control Serum in the morning and avoid heavy moisturizers. Applying rose water as a toner helps balance sebum production naturally. 💧",
  chips: ["Best toner?", "Diet tips?", "Routine steps?"],
};
const REPLY_SCAR: SmartReply = {
  reply:
    "For acne scars, Kumkumadi oil is the gold standard in Ayurveda. Apply at night after the Neem Gel. Consistent use for 8–12 weeks shows visible results. 🌸",
  chips: ["How to apply?", "How long?", "Any products?"],
};
const REPLY_HAIR: SmartReply = {
  reply:
    "For healthy hair, Bhringraj oil massage twice a week strengthens roots and reduces fall. Pair it with a protein-rich diet. 💇 Avoid hot water on scalp — use lukewarm instead.",
  chips: ["Hair fall tips", "Best hair oil?", "Diet for hair?"],
};
const DEFAULT_CHIPS: string[] = [
  "Diet tips?",
  "Tell me about neem",
  "Stress and skin",
];

function getKeywordReply(text: string): SmartReply | null {
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
  return null;
}

function buildRecommendation(state: ConsultationState): string {
  const parts: string[] = [];
  if (state.skinConcern) {
    const concern = state.skinConcern.toLowerCase();
    const severity = state.skinSeverity ?? "moderate";
    const skinType = state.skinType ?? "combination";
    parts.push(
      `🌿 **Skin Analysis:**\nYou have ${severity.toLowerCase()} ${concern} with ${skinType.toLowerCase()} skin.`,
    );
    if (concern.includes("acne")) {
      parts.push(
        "**Morning:** Neem cleanser → Rose water toner → Oil control serum → Light sunscreen.",
      );
      parts.push(
        "**Night:** Neem cleanser → Kumkumadi spot treatment → Neem acne gel.",
      );
      parts.push(
        "**Diet:** Avoid dairy, fried foods & sugar. Include amla, turmeric, and coconut water. 💧",
      );
      parts.push(
        "**Dosha:** Pitta imbalance detected. Practice 5 min Sheetali Pranayama daily.",
      );
    } else if (concern.includes("pigment") || concern.includes("dark spot")) {
      parts.push(
        "**Morning:** Gentle cleanser → Vitamin C serum → SPF 50 sunscreen (key!).",
      );
      parts.push("**Night:** Kumkumadi oil → Saffron face pack (2x/week).");
      parts.push(
        "**Diet:** Include citrus fruits, berries, and green leafy vegetables. 🥗",
      );
    } else if (concern.includes("dark circle")) {
      parts.push(
        "**Eye care:** Apply cold rose water on eyes for 10 min each morning.",
      );
      parts.push(
        "**Night:** Almond oil under-eye massage with ring finger gently.",
      );
      parts.push(
        "**Lifestyle:** Limit screen time before bed. Sleep on your back when possible.",
      );
    } else if (concern.includes("wrinkle") || concern.includes("age")) {
      parts.push("**Morning:** Vitamin C + Hyaluronic acid serum → SPF.");
      parts.push(
        "**Night:** Kumkumadi oil facial massage with gua sha (5 min).",
      );
      parts.push(
        "**Diet:** Include walnuts, avocado, and collagen-rich foods. 🌱",
      );
    } else {
      parts.push(
        "**Routine:** Gentle cleanser → Aloe vera gel → Light moisturizer → SPF.",
      );
      parts.push(
        "**Diet:** Hydrate well. Include seasonal fruits and vegetables. 🥗",
      );
    }
  }
  if (state.hairConcern) {
    const concern = state.hairConcern.toLowerCase();
    const severity = state.hairSeverity ?? "moderate";
    parts.push(
      `\n💇 **Hair Analysis:**\nYou have ${severity.toLowerCase()} ${concern}.`,
    );
    if (concern.includes("fall") || concern.includes("thin")) {
      parts.push(
        "**Oil routine:** Bhringraj oil massage 2x/week — leave overnight, wash with mild shampoo.",
      );
      parts.push(
        "**Diet:** Increase protein (lentils, eggs, nuts). Add biotin-rich foods like sweet potato.",
      );
      parts.push(
        "**Supplement:** Brahmi + Amla powder in warm water every morning. 🌿",
      );
    } else if (concern.includes("dandruff") || concern.includes("scalp")) {
      parts.push(
        "**Scalp treatment:** Neem + tea tree scalp oil — apply and leave for 30 min before wash.",
      );
      parts.push(
        "**Wash routine:** Use anti-dandruff shampoo 2–3x/week. Avoid hot water on scalp.",
      );
      parts.push(
        "**Diet:** Reduce sugary and processed foods. Include probiotic-rich foods. 💧",
      );
    } else if (concern.includes("grey") || concern.includes("gray")) {
      parts.push("**Oil:** Bhringraj + black sesame oil massage 3x/week.");
      parts.push(
        "**Diet:** Include curry leaves, amla, and copper-rich foods (sesame seeds, cashews).",
      );
      parts.push("**Internal:** Triphala churna with warm water at night. 🌿");
    } else {
      parts.push(
        "**Routine:** Weekly oiling → mild shampoo → conditioning mask on lengths.",
      );
      parts.push(
        "**Diet:** Stay hydrated. Include omega-3 rich foods like flaxseeds. 🥗",
      );
    }
  }
  parts.push(
    "\n✨ This is a personalized Ayurvedic plan for you. Results show in 4–8 weeks with consistency. Ask me anything about your routine!",
  );
  return parts.join("\n\n");
}

const SKIN_CONCERNS = [
  "Acne / Pimples",
  "Pigmentation / Dark Spots",
  "Dark Circles",
  "Wrinkles / Ageing",
  "Dull Skin",
  "General Maintenance",
];
const SKIN_SEVERITIES = ["Mild", "Moderate", "Severe"];
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Not sure"];
const HAIR_CONCERNS = [
  "Hair Fall",
  "Dandruff",
  "Thinning Hair",
  "Dry / Frizzy Hair",
  "Premature Greying",
  "Scalp Issues",
];
const HAIR_SEVERITIES = ["Mild", "Moderate", "Severe"];
const HAIR_TYPES = ["Oily Scalp", "Dry Scalp", "Normal Scalp"];
const ENTRY_CHIPS = ["🌿 Skin", "💇 Hair", "🌿 Both"];

function getChipsForPhase(phase: ConsultationPhase): string[] {
  switch (phase) {
    case "entry":
      return ENTRY_CHIPS;
    case "skin_concern":
      return SKIN_CONCERNS;
    case "skin_severity":
      return SKIN_SEVERITIES;
    case "skin_type":
      return SKIN_TYPES;
    case "hair_concern":
      return HAIR_CONCERNS;
    case "hair_severity":
      return HAIR_SEVERITIES;
    case "hair_type":
      return HAIR_TYPES;
    default:
      return DEFAULT_CHIPS;
  }
}

function getNextBotMessage(
  phase: ConsultationPhase,
  userText: string,
  state: ConsultationState,
): {
  text: string;
  nextPhase: ConsultationPhase;
  updatedState: ConsultationState;
} {
  switch (phase) {
    case "entry": {
      const lower = userText.toLowerCase();
      const focus: "skin" | "hair" | "both" =
        lower.includes("hair") && lower.includes("skin")
          ? "both"
          : lower.includes("hair")
            ? "hair"
            : "skin";
      const nextPhase: ConsultationPhase =
        focus === "hair" ? "hair_concern" : "skin_concern";
      const updated = { ...state, phase: nextPhase, focus };
      const text =
        focus === "hair"
          ? "Got it! 💇 Let me understand your hair concern better.\n\nTell me your main hair concern:"
          : "Got it! 🌿 Let me understand your skin better.\n\nTell me your main skin concern:";
      return { text, nextPhase, updatedState: updated };
    }
    case "skin_concern": {
      const updated = {
        ...state,
        skinConcern: userText,
        phase: "skin_severity" as ConsultationPhase,
      };
      return {
        text: `I see — ${userText}. How severe is it currently?`,
        nextPhase: "skin_severity",
        updatedState: updated,
      };
    }
    case "skin_severity": {
      const updated = {
        ...state,
        skinSeverity: userText,
        phase: "skin_type" as ConsultationPhase,
      };
      return {
        text: "Good to know. What is your skin type?",
        nextPhase: "skin_type",
        updatedState: updated,
      };
    }
    case "skin_type": {
      const updated = { ...state, skinType: userText };
      if (state.focus === "both") {
        return {
          text: "Perfect! Now let's look at your hair. What is your main hair concern?",
          nextPhase: "hair_concern",
          updatedState: { ...updated, phase: "hair_concern" },
        };
      }
      const finalState = {
        ...updated,
        phase: "recommendation" as ConsultationPhase,
      };
      return {
        text: buildRecommendation(finalState),
        nextPhase: "freeform",
        updatedState: finalState,
      };
    }
    case "hair_concern": {
      const updated = {
        ...state,
        hairConcern: userText,
        phase: "hair_severity" as ConsultationPhase,
      };
      return {
        text: `Understood — ${userText}. How severe is it?`,
        nextPhase: "hair_severity",
        updatedState: updated,
      };
    }
    case "hair_severity": {
      const updated = {
        ...state,
        hairSeverity: userText,
        phase: "hair_type" as ConsultationPhase,
      };
      return {
        text: "What is your scalp type?",
        nextPhase: "hair_type",
        updatedState: updated,
      };
    }
    case "hair_type": {
      const finalState = {
        ...state,
        hairType: userText,
        phase: "recommendation" as ConsultationPhase,
      };
      return {
        text: buildRecommendation(finalState),
        nextPhase: "freeform",
        updatedState: finalState,
      };
    }
    default: {
      const kw = getKeywordReply(userText);
      return {
        text: kw
          ? kw.reply
          : "Great question! Based on Ayurvedic principles, I'd recommend focusing on your daily routine consistently. 🌿 Is there anything specific you'd like to know?",
        nextPhase: "freeform",
        updatedState: state,
      };
    }
  }
}

const INITIAL_CONSULTATION: ConsultationState = {
  phase: "entry",
  focus: null,
  skinConcern: null,
  skinSeverity: null,
  skinType: null,
  hairConcern: null,
  hairSeverity: null,
  hairType: null,
};

function makeEntryMessage(username: string): Message {
  return {
    id: "welcome",
    from: "bot",
    text: `Hi ${username}! 👋 I'm Dr. Vaidya, your AI health advisor.\n\nWhat would you like help with today?`,
  };
}
function makeFollowUpMessage(username: string): Message {
  return {
    id: "followup-welcome",
    from: "bot",
    text: `Welcome back, ${username}! 🌿\n\nHow can I help you today? Feel free to ask about your routine, diet, products, or any new concerns.`,
  };
}

const GREEN = "oklch(0.52 0.18 145)";

export function ChatTab() {
  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("acneveda_user") ?? "there")
      : "there";
  const chatCompleted =
    typeof window !== "undefined"
      ? sessionStorage.getItem("chatCompleted") === "true"
      : false;

  const [messages, setMessages] = useState<Message[]>([
    chatCompleted ? makeFollowUpMessage(username) : makeEntryMessage(username),
  ]);
  const [chips, setChips] = useState<Chip[]>(
    chatCompleted
      ? DEFAULT_CHIPS.map((l) => ({ label: l }))
      : ENTRY_CHIPS.map((l) => ({ label: l })),
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [consultation, setConsultation] =
    useState<ConsultationState>(INITIAL_CONSULTATION);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("acneveda_chat_new_consultation");
    }
  }, []);

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
      if (chatCompleted) {
        const kw = getKeywordReply(text);
        const botText = kw
          ? kw.reply
          : "Great question! Based on Ayurvedic principles, I'd recommend focusing on your daily routine consistently. 🌿 Is there anything specific you'd like to know?";
        const nextChips = kw ? kw.chips : DEFAULT_CHIPS;
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), from: "bot", text: botText },
        ]);
        setChips(nextChips.map((c) => ({ label: c })));
        return;
      }
      const {
        text: botText,
        nextPhase,
        updatedState,
      } = getNextBotMessage(consultation.phase, text, consultation);
      setConsultation(updatedState);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), from: "bot", text: botText },
      ]);
      const nextChips = getChipsForPhase(nextPhase);
      setChips(nextChips.map((c) => ({ label: c })));
    }, 900);
  };

  const startNewConsultation = () => {
    setConsultation(INITIAL_CONSULTATION);
    setMessages([makeEntryMessage(username)]);
    setChips(ENTRY_CHIPS.map((l) => ({ label: l })));
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.97 0.012 80)", paddingBottom: "0" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4 shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.18 145) 0%, oklch(0.42 0.14 160) 100%)",
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
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {chatCompleted ? "Follow-up Chat" : "AI Dermatology Chat"}
            </h1>
            <p
              className="text-white/70 text-xs"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Dr. Vaidya AI • Ayurvedic Expert
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "oklch(0.75 0.2 145)" }}
            />
            <span
              className="text-white/90 text-xs"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Online
            </span>
          </div>
        </div>
      </div>

      {/* New Consultation Banner */}
      {(chatCompleted ||
        consultation.phase === "freeform" ||
        consultation.phase === "recommendation") && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-4 mt-3 mb-1 rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{
            background: "oklch(0.52 0.18 145 / 0.08)",
            border: "1px solid oklch(0.52 0.18 145 / 0.2)",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "oklch(0.35 0.12 145)",
              fontWeight: 600,
            }}
          >
            {chatCompleted
              ? "🌿 Need a full new analysis?"
              : "🌿 Start a new consultation"}
          </p>
          <button
            type="button"
            data-ocid="chat.consultation_button"
            onClick={
              chatCompleted
                ? () => {
                    window.location.href = "/assessment/step1";
                  }
                : startNewConsultation
            }
            className="px-3 py-1.5 rounded-xl font-semibold text-xs transition-all active:scale-95"
            style={{
              background: GREEN,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {chatCompleted ? "New Assessment →" : "Restart →"}
          </button>
        </motion.div>
      )}

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
                  style={{ background: GREEN, color: "#fff" }}
                >
                  AI
                </div>
              )}
              <div
                className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={{
                  background: msg.from === "user" ? GREEN : "oklch(1 0 0)",
                  color: msg.from === "user" ? "#fff" : "oklch(0.22 0.07 140)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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

        {isTyping && (
          <motion.div
            className="flex gap-2 items-end"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: GREEN, color: "#fff" }}
            >
              AI
            </div>
            <div
              className="px-3.5 py-3 rounded-2xl flex gap-1 items-center"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
                  background: "oklch(0.52 0.18 145 / 0.08)",
                  border: "1.5px solid oklch(0.52 0.18 145 / 0.3)",
                  color: GREEN,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
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
          background: "oklch(1 0 0)",
          borderTop: "1px solid oklch(0.9 0.02 80)",
          boxShadow: "0 -2px 12px oklch(0.55 0.14 145 / 0.06)",
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
              background: "oklch(0.52 0.18 145 / 0.06)",
              border: "1.5px solid oklch(0.9 0.02 80)",
              color: "oklch(0.28 0.07 140)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          />
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: input.trim() ? GREEN : "oklch(0.9 0.02 80)",
              color: input.trim() ? "#fff" : "oklch(0.6 0.04 60)",
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
