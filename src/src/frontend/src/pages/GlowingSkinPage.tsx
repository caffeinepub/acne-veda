import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  Droplets,
  Flame,
  Hand,
  Leaf,
  Moon,
  Salad,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";

const SECTIONS = [
  {
    id: 1,
    icon: Sparkles,
    emoji: "✨",
    title: "Root Concept of Glowing Skin",
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-500",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          In Ayurveda, glowing skin ={" "}
          <strong>Healthy Rasa + Rakta Dhatu + Balanced Doshas</strong>{" "}
          (especially Pitta & Vata).
        </p>
        <ul className="space-y-2">
          {[
            "Good digestion → clear, radiant skin",
            "Good blood quality → natural inner glow",
            "Balanced Pitta → even tone & luminosity",
          ].map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 2,
    icon: Salad,
    emoji: "🥗",
    title: "Diet for Natural Glow",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    content: (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700 mb-2">
              ✅ Eat Daily
            </p>
            <ul className="space-y-1">
              {[
                "Amla (best natural glow booster)",
                "Ghee — 1 tsp/day for radiance",
                "Papaya & Pomegranate",
                "Banana",
                "Green leafy vegetables",
                "Warm water (detox support)",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 mb-2">❌ Avoid</p>
            <ul className="space-y-1">
              {[
                "Junk food",
                "Excess spicy & oily food (↑ Pitta)",
                "Cold drinks",
                "Excess sugar",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Droplets,
    emoji: "💧",
    title: "Hydration & Detox",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "text-cyan-600",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Start your day with:</p>
        <div className="bg-white/60 rounded-xl p-3 border border-cyan-100">
          <p className="text-sm font-semibold text-cyan-700">
            👉 Warm water + lemon or honey
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">You can also add:</p>
          <ul className="space-y-1">
            {["Jeera water", "Coriander water"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Droplets className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Helps remove toxins (Ama) for clear, glowing skin
        </p>
      </div>
    ),
  },
  {
    id: 4,
    icon: Apple,
    emoji: "🧴",
    title: "Daily Skin Routine",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
    content: (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-amber-700 mb-2">☀️ Morning</p>
          <ul className="space-y-1">
            {[
              "Herbal cleanser (Neem / Tulsi-based)",
              "Rose water toner",
              "Aloe vera gel moisturizer",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-700 mb-2">🌙 Night</p>
          <ul className="space-y-1">
            {[
              "Clean face properly",
              "Aloe vera gel OR",
              "Kumkumadi oil (few drops)",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: Leaf,
    emoji: "🌿",
    title: "Face Packs for Instant Glow",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Use <strong>2–3 times/week</strong>:
        </p>
        <ul className="space-y-2">
          {[
            "Besan + turmeric + milk",
            "Sandalwood + rose water",
            "Aloe vera + honey",
          ].map((pack) => (
            <li
              key={pack}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-emerald-500">🌿</span>
              {pack}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 6,
    icon: Hand,
    emoji: "💆‍♀️",
    title: "Abhyanga — Face Massage",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-500",
    content: (
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-2">Recommended Oils:</p>
          <ul className="space-y-1">
            {["Kumkumadi tailam", "Nalpamaradi oil"].map((oil) => (
              <li
                key={oil}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="text-purple-400">✦</span>
                {oil}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Benefits:</p>
          <ul className="space-y-1">
            {[
              "Improves blood circulation",
              "Gives natural inner glow",
              "Delays ageing signs",
            ].map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-medium text-purple-700">
          👉 5–10 mins, 3–4 times/week
        </p>
      </div>
    ),
  },
  {
    id: 7,
    icon: Wind,
    emoji: "🧘",
    title: "Lifestyle = Glow Factor",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    content: (
      <div className="space-y-2">
        <ul className="space-y-2">
          {[
            { icon: Moon, text: "Sleep before 11 PM" },
            { icon: Flame, text: "Reduce stress (major glow killer)" },
            { icon: Wind, text: "Pranayama daily" },
            { icon: Sun, text: "Light exercise / yoga" },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="w-4 h-4 text-teal-500 flex-shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export function GlowingSkinPage() {
  const isOddCount = SECTIONS.length % 2 !== 0;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              data-ocid="glowing-skin.back_link"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                ✦ Natural Glow Protocol
              </Badge>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              How to Get{" "}
              <span className="text-yellow-600 italic">Glowing Skin</span> in
              Ayurveda
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Unlock your skin's natural luminosity through Ayurvedic diet,
              rejuvenating face packs, Abhyanga massage, and holistic lifestyle
              practices that shine from within.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isLastOdd = isOddCount && i === SECTIONS.length - 1;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={isLastOdd ? "sm:col-span-2" : ""}
                data-ocid={`glowing-skin.item.${i + 1}`}
              >
                <Card
                  className={`h-full border-2 ${section.color} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-5 h-5 ${section.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Step {section.id}
                        </p>
                        <CardTitle className="font-serif text-base leading-tight">
                          {section.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator className="mb-4 mx-6" />
                  <CardContent>{section.content}</CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardContent className="pt-5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Disclaimer:</strong> Results vary based on individual
                  body type (Prakriti). Consult a qualified Ayurvedic
                  practitioner before starting any regimen.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
