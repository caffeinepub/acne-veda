import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type AssistantState = "idle" | "listening" | "speaking";

interface Conversation {
  question: string;
  answer: string;
}

function getResponse(transcript: string): string {
  const t = transcript.toLowerCase();

  if (t.includes("whitehead"))
    return "Whiteheads are closed comedones caused by clogged pores. In Ayurveda, we treat them with Triphala Churna internally and Multani Mitti face pack externally. Avoid dairy and fried foods.";
  if (t.includes("blackhead"))
    return "Blackheads are open comedones. Neem and Turmeric paste works well externally. Internally, take Guduchi tablets and Triphala Churna. Steam your face once a week to open pores.";
  if (t.includes("papule"))
    return "Papules are inflamed bumps indicating active bacterial involvement. Apply Eladi Churnam mixed with coconut milk or buttermilk on the papules and wash after 15 minutes. Internally, Nimbadi Kashayam is very effective.";
  if (t.includes("pustule"))
    return "Pustules are pus-filled lesions requiring careful treatment. Use Patola Katurohinyadi Kashayam and Varunadi Kashayam internally. Externally, Sandalwood and Rosewater lepa helps reduce inflammation.";
  if (t.includes("varunadi"))
    return "Varunadi Kashayam is taken 15 ml twice daily before food mixed with 60 ml warm water. It helps reduce Kapha and clears skin toxins.";
  if (t.includes("nimbadi"))
    return "Nimbadi Kashayam is taken 15 ml twice daily before food mixed with 60 ml warm water. It is excellent for all skin conditions especially acne and inflammation.";
  if (t.includes("patola") || t.includes("katurohinyadi"))
    return "Patola Katurohinyadi Kashayam is taken 15 ml twice daily before food. It purifies the blood and clears pitta-related skin conditions.";
  if (t.includes("avipattikara"))
    return "Avipattikara Churnam is taken 5 grams at night with warm water. It acts as a laxative and removes Ama from the digestive tract, which clears skin from within.";
  if (t.includes("eladi"))
    return "Eladi Churnam is mixed with coconut milk or buttermilk and applied externally on papules. Leave for 15 minutes and wash off with water.";
  if (t.includes("oily skin") || t.includes("oily"))
    return "For oily skin, apply Kolakulathadi Choornam and Yava Churnam as a face pack. This absorbs excess oil and reduces Kapha. Internally, reduce intake of sweets and dairy.";
  if (t.includes("kolakulathadi") || t.includes("yava churnam"))
    return "Kolakulathadi Choornam mixed with Yava Churnam is an excellent face pack for oily skin. Apply on face, let dry, and wash off with water.";
  if (t.includes("diet") || t.includes("what to eat") || t.includes("food"))
    return "For clear skin, eat Amla daily, drink warm water, include green vegetables, and avoid sugar, fried foods, and excess dairy. Pomegranate and papaya are excellent for skin health.";
  if (
    t.includes("anti ageing") ||
    t.includes("anti-ageing") ||
    t.includes("ageing") ||
    t.includes("aging")
  )
    return "For anti-ageing, focus on Rasayana foods: Amla, Ghee, soaked almonds, and fresh fruits. Use Kumkumadi Tailam for facial massage daily. Sleep before 11 PM and practice Pranayama for lasting youthfulness.";
  if (
    t.includes("glowing skin") ||
    t.includes("glow") ||
    t.includes("radiance")
  )
    return "For glowing skin, take Amla daily, drink warm lemon water in the morning, and use Besan Turmeric Milk face pack 2 to 3 times a week. Abhyanga with Kumkumadi oil improves blood circulation and gives natural glow.";
  if (t.includes("kumkumadi"))
    return "Kumkumadi Tailam is a classical Ayurvedic oil used for facial massage. It improves skin complexion, reduces fine lines, and gives a natural glow. Massage 5 to 10 minutes daily or alternate days.";
  if (t.includes("triphala"))
    return "Triphala Churna is taken 5 grams at night with warm water. It detoxifies the body, improves digestion, and purifies blood — all essential for clear skin.";
  if (t.includes("neem") || t.includes("tulsi"))
    return "Neem and Tulsi are powerful anti-bacterial herbs. Use Neem or Tulsi based herbal face wash morning and night. Internally, Neem tablets help purify blood.";
  if (t.includes("lepa") || t.includes("face pack") || t.includes("face mask"))
    return "Popular Ayurvedic Lepas include: Neem Turmeric paste for acne, Multani Mitti for oily skin, Sandalwood Rosewater Lepa for inflammation, and Besan Turmeric Milk pack for glow. Use 2 to 3 times per week.";
  if (
    t.includes("cleansing") ||
    t.includes("face wash") ||
    t.includes("routine")
  )
    return "Use a Neem or Tulsi based herbal face wash morning and night. Avoid soap with SLS. Apply Rose water as toner, and Aloe vera gel as moisturizer. At night, apply a light herbal oil.";
  if (t.includes("lifestyle") || t.includes("habits"))
    return "Sleep before 11 PM, practice Pranayama daily, manage stress, and do face yoga. Avoid excess screen time and processed foods. Drink 8 glasses of warm water daily.";
  if (
    t.includes("sun") ||
    t.includes("sunscreen") ||
    t.includes("sun protection")
  )
    return "In Ayurveda, protect skin from harsh sunlight using Aloe vera gel or Sandalwood paste. Avoid direct sun between 11 AM and 3 PM. Wear protective clothing when outdoors.";
  if (t.includes("stress"))
    return "Stress is a major cause of acne and ageing. Practice Anulom Vilom Pranayama daily for 10 minutes. Ashwagandha can help manage cortisol. Good sleep and yoga are essential.";
  if (t.includes("disclaimer") || t.includes("consult"))
    return "All recommendations are based on classical Ayurvedic principles by Dr. Akash Hari, BAMS. Please consult a qualified Ayurvedic physician before starting any treatment regimen.";

  return "Namaste! I am Dr. Veda, your Ayurvedic skin assistant. You can ask me about acne types like whiteheads or papules, Ayurvedic medicines, diet, face packs, anti-ageing, or glowing skin tips.";
}

export function VoiceAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === "en-IN") ||
      voices.find(
        (v) =>
          v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
      ) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setState("speaking");
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    window.speechSynthesis.speak(utter);
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      alert(
        "Sorry, your browser doesn't support voice input. Please try Chrome or Edge.",
      );
      return;
    }

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setState("listening");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript as string;
      const answer = getResponse(transcript);
      setConversation({ question: transcript, answer });
      setState("idle");
      setTimeout(() => speak(answer), 100);
    };

    recognition.onerror = () => setState("idle");
    recognition.onend = () => {
      setState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [supported, speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const handleMicClick = () => {
    if (state === "idle") startListening();
    else if (state === "listening") stopListening();
    else if (state === "speaking") {
      window.speechSynthesis.cancel();
      setState("idle");
    }
  };

  const micConfig = {
    idle: {
      icon: <Mic className="w-4 h-4" />,
      className: "bg-emerald-600 hover:bg-emerald-700 text-white",
      label: "Tap to ask",
    },
    listening: {
      icon: <MicOff className="w-4 h-4" />,
      className: "bg-red-500 hover:bg-red-600 text-white",
      label: "Listening...",
    },
    speaking: {
      icon: <Volume2 className="w-4 h-4" />,
      className: "bg-emerald-500 hover:bg-emerald-600 text-white",
      label: "Speaking...",
    },
  };

  const mic = micConfig[state];

  return (
    <div
      className="fixed bottom-6 right-4 z-50 flex flex-col-reverse items-end gap-3 sm:flex-row-reverse sm:items-end"
      data-ocid="voice_assistant.panel"
    >
      {/* Doctor Widget Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
        className="flex flex-col items-center w-28 rounded-2xl bg-white border border-emerald-100 shadow-xl overflow-hidden"
      >
        {/* Avatar image — cropped to head/shoulders */}
        <div className="w-full h-20 overflow-hidden bg-emerald-50">
          <img
            src="/assets/generated/dr-veda-avatar.dim_400x500.png"
            alt="Dr. Veda"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Name + status */}
        <div className="w-full px-2 pt-1.5 pb-0.5 text-center">
          <p className="text-[11px] font-semibold text-emerald-800 leading-tight">
            🌿 Dr. Veda
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={state}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-[9px] font-medium mt-0.5 leading-tight ${
                state === "listening"
                  ? "text-red-500"
                  : state === "speaking"
                    ? "text-emerald-600"
                    : "text-muted-foreground"
              }`}
            >
              {mic.label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Mic button */}
        <div className="relative flex items-center justify-center w-full py-2">
          {/* Pulse ring */}
          {(state === "listening" || state === "speaking") && (
            <motion.div
              className={`absolute rounded-full w-8 h-8 ${
                state === "listening" ? "bg-red-400" : "bg-emerald-400"
              }`}
              animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0, 0.35] }}
              transition={{
                duration: 1.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <button
            type="button"
            onClick={handleMicClick}
            aria-label={mic.label}
            data-ocid="voice_assistant.button"
            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              mic.className
            }`}
          >
            {mic.icon}
          </button>
        </div>
      </motion.div>

      {/* Chat Bubble — above on mobile, to the left on desktop */}
      <AnimatePresence>
        {conversation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[min(18rem,calc(100vw-2rem))] max-h-[60vh] flex flex-col rounded-2xl bg-white border border-emerald-100 shadow-xl overflow-hidden mb-1"
          >
            {/* Bubble Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 border-b border-emerald-100 shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/dr-veda-avatar.dim_400x500.png"
                  alt="Dr. Veda"
                  className="w-7 h-7 rounded-full object-cover object-top border-2 border-emerald-200"
                />
                <div>
                  <p className="text-xs font-semibold text-emerald-800 leading-none">
                    Dr. Veda
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-[9px] bg-emerald-100 text-emerald-700 border-0 px-1 py-0 h-3.5 mt-0.5"
                  >
                    Ayurvedic Assistant
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConversation(null)}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-emerald-100"
                data-ocid="voice_assistant.close_button"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages — scrollable so long answers don't clip off-screen */}
            <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
              {/* User question */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-emerald-600 text-white text-xs leading-relaxed">
                  {conversation.question}
                </div>
              </div>
              {/* Assistant answer */}
              <div className="flex justify-start">
                <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-gray-50 border border-gray-100 text-gray-800 text-xs leading-relaxed">
                  {conversation.answer}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
