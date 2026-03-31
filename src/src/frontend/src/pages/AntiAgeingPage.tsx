import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  Clock,
  Dna,
  Droplets,
  FlameKindling,
  Hand,
  Leaf,
  Moon,
  Pill,
  Salad,
  ShieldCheck,
  Sun,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";

const SECTIONS = [
  {
    id: 1,
    icon: Dna,
    emoji: "🧬",
    title: "Understand Ageing",
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-500",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Ageing = loss of <strong>collagen + hydration + elasticity</strong>.
          In Ayurveda, this is primarily due to <strong>Vata imbalance</strong>.
        </p>
        <div>
          <p className="text-sm font-semibold mb-2">Signs of Ageing Skin:</p>
          <ul className="space-y-1">
            {["Fine lines", "Dry skin", "Uneven skin tone", "Pigmentation"].map(
              (sign) => (
                <li
                  key={sign}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                  {sign}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Salad,
    emoji: "🥗",
    title: "Diet for Youthful Skin",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Focus on <strong>Rasayana</strong> (rejuvenating) foods:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700 mb-2">
              ✅ Include Daily
            </p>
            <ul className="space-y-1">
              {[
                "Amla (Vitamin C powerhouse)",
                "Ghee (internal lubrication)",
                "Soaked almonds",
                "Papaya & Pomegranate",
                "Green vegetables",
                "Warm water + herbal teas",
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
                "Excess sugar (damages collagen)",
                "Fried & processed food",
                "Excess caffeine",
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
    emoji: "🧴",
    title: "Daily Skin Routine",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    content: (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-amber-700 mb-2">☀️ Morning</p>
          <ul className="space-y-1">
            {[
              "Gentle herbal face wash (Neem / Tulsi-based)",
              "Rose water toner",
              "Light moisturizer (Aloe vera gel)",
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
              "Apply herbal oil or gel",
              "Under-eye care (almond oil)",
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
    id: 4,
    icon: Leaf,
    emoji: "🌿",
    title: "Ayurvedic Face Packs (Lepa)",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          For glow & anti-ageing (use <strong>2–3 times/week</strong>):
        </p>
        <ul className="space-y-2">
          {[
            "Sandalwood + Rose water",
            "Multani mitti + milk (use less for dry skin)",
            "Turmeric + honey",
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
    id: 5,
    icon: Hand,
    emoji: "💆‍♀️",
    title: "Facial Massage (Very Important)",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-500",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
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
              "Improves circulation",
              "Boosts collagen naturally",
              "Reduces fine lines",
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-medium text-purple-700">
          👉 Massage 5–10 mins daily or alternate days
        </p>
      </div>
    ),
  },
  {
    id: 6,
    icon: Wind,
    emoji: "🧘",
    title: "Lifestyle Correction",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    content: (
      <div className="space-y-3">
        <ul className="space-y-2">
          {[
            { icon: Moon, text: "Sleep before 11 PM (most important)" },
            { icon: FlameKindling, text: "Face yoga practice" },
            { icon: Wind, text: "Pranayama — especially Anulom Vilom" },
            {
              icon: ShieldCheck,
              text: "Manage stress (major cause of ageing)",
            },
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
  {
    id: 7,
    icon: Sun,
    emoji: "🌞",
    title: "Sun Protection",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-500",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Avoid direct harsh sunlight. Use natural protection:
        </p>
        <ul className="space-y-1">
          {[
            "Aloe vera (cooling & protective)",
            "Sandalwood paste (UV-soothing)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-amber-500">☀️</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 8,
    icon: Pill,
    emoji: "💊",
    title: "Internal Ayurvedic Support",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-500",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Optional rejuvenating supplements:
        </p>
        <ul className="space-y-1">
          {[
            { name: "Amla powder", desc: "High Vitamin C, anti-oxidant" },
            { name: "Triphala", desc: "Detoxification & digestion" },
            { name: "Chyawanprash", desc: "Classic Rasayana for longevity" },
          ].map((item) => (
            <li key={item.name} className="flex items-start gap-2 text-sm">
              <Apple className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">{item.name}</strong>{" "}
                <span className="text-muted-foreground">— {item.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export function AntiAgeingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              data-ocid="anti-ageing.back_link"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-rose-500" />
              </div>
              <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
                ✦ Anti-Ageing Protocol
              </Badge>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              Anti-Ageing Skin Care{" "}
              <span className="text-rose-500 italic">Ayurvedic Approach</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Harness the timeless wisdom of Ayurveda to slow ageing naturally —
              through diet, daily rituals, and rejuvenating herbs that restore
              your skin's youthful radiance from within.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`anti-ageing.item.${i + 1}`}
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
