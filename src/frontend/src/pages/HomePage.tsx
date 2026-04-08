import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Droplets,
  HeartHandshake,
  Leaf,
  Microscope,
  Pill,
  Salad,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

const CONDITIONS = [
  {
    name: "Whiteheads",
    emoji: "⚪",
    description:
      "Closed comedones formed when pores become clogged with sebum and dead skin cells, covered by a thin layer of skin.",
    severity: "Mild",
  },
  {
    name: "Blackheads",
    emoji: "⚫",
    description:
      "Open comedones where oxidized melanin and sebum create the characteristic dark appearance at the pore opening.",
    severity: "Mild",
  },
  {
    name: "Papules",
    emoji: "🔴",
    description:
      "Small, raised inflamed bumps without visible pus. Indicates active bacterial involvement and requires prompt treatment.",
    severity: "Moderate",
  },
  {
    name: "Pustules",
    emoji: "🟡",
    description:
      "Inflamed, pus-filled lesions with a white or yellow center. Require careful Ayurvedic management to prevent scarring.",
    severity: "Moderate–Severe",
  },
];

const TREATMENT_CATEGORIES = [
  {
    icon: Pill,
    title: "Internal Medicines",
    description:
      "Classical Ayurvedic formulations like Triphala Churna, Chitrakadi Vati, Guduchi, Manjishtha & Yashtimadhu to detox, boost immunity, and purify blood from within.",
    image: "/assets/generated/internal-medicines.dim_600x400.jpg",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    icon: Leaf,
    title: "External Lepas",
    description:
      "Customised face packs: Neem & Turmeric Paste, Multani Mitti, Sandalwood Rosewater Lepa, and Papaya & Honey Pack — each targeting specific skin conditions.",
    image: "/assets/generated/external-lepas.dim_600x400.jpg",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    icon: Salad,
    title: "Diet & Lifestyle",
    description:
      "Guidance on foods that balance Pitta and Kapha doshas — including healing teas, vegetables, and lifestyle corrections for lasting skin health.",
    image: "/assets/generated/diet-ayurvedic.dim_600x400.jpg",
    color: "bg-lime-50 border-lime-200",
    iconColor: "text-lime-600",
  },
  {
    icon: Droplets,
    title: "Cleansing Routine",
    description:
      "Morning Neem/Tulsi-based cleansing and evening Triphala/Aloe vera routine — gentle, SLS-free protocols that respect the skin's natural microbiome.",
    image: null,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    condition: "Pustules & Papules",
    text: "After 3 months of following the Ayurvedic protocol suggested here, my skin has transformed. The Neem & Turmeric paste and Guduchi tablets worked remarkably well.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    location: "Bangalore",
    condition: "Blackheads",
    text: "The Multani Mitti pack recommendation was spot on. Combined with the dietary changes — cutting dairy and fried foods — my blackheads cleared within weeks.",
    rating: 5,
  },
  {
    name: "Deepika Nair",
    location: "Chennai",
    condition: "Whiteheads",
    text: "I was sceptical at first, but the Papaya & Honey pack along with Triphala Churna at night made a visible difference. My skin is so much clearer now.",
    rating: 5,
  },
];

const STARS = [1, 2, 3, 4, 5];

const WELLNESS_GUIDES = [
  {
    icon: Clock,
    emoji: "⏳",
    title: "Anti-Ageing Skin Care",
    subtitle: "Ayurvedic Approach",
    description:
      "Slow ageing naturally with Rasayana foods, Kumkumadi massage, daily Vata-balancing rituals, and internal Ayurvedic support for lasting youthfulness.",
    to: "/anti-ageing",
    color: "bg-rose-50 border-rose-200 hover:border-rose-300",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    btnClass: "bg-rose-500 hover:bg-rose-600 text-white",
    tags: ["Anti-Ageing", "Rasayana", "Kumkumadi"],
    ocid: "wellness.anti-ageing.card",
    btnOcid: "wellness.anti-ageing.button",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Glowing Skin Guide",
    subtitle: "Natural Radiance",
    description:
      "Unlock your skin's natural luminosity through Ayurvedic diet, Abhyanga face massage, hydration rituals, and lifestyle practices that make you glow from within.",
    to: "/glowing-skin",
    color: "bg-yellow-50 border-yellow-200 hover:border-yellow-300",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    btnClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
    tags: ["Glow", "Abhyanga", "Detox"],
    ocid: "wellness.glowing-skin.card",
    btnOcid: "wellness.glowing-skin.button",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Cover */}
      <section className="relative overflow-hidden bg-[#f5f2ec]">
        {/* Full cover photo */}
        <div className="w-full flex items-center justify-center py-10 sm:py-14 px-4">
          <motion.img
            src="/assets/cover-logo.jpg"
            alt="Acne Veda – Clear Skin Naturally"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl object-contain"
          />
        </div>
        {/* Tagline & CTA below logo */}
        <div className="relative max-w-3xl mx-auto px-4 pb-14 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              ✦ BAMS Certified Ayurvedic Analysis
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Know Your Skin,{" "}
              <span className="text-primary italic">Heal Naturally</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Upload a photo to detect whiteheads, blackheads, papules, and
              pustules — then receive a personalised Ayurvedic treatment plan
              crafted by a certified BAMS physician.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8"
                data-ocid="home.scan_button"
              >
                <Link to="/main">
                  <ScanLine className="w-5 h-5 mr-2" /> Analyse My Skin
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                data-ocid="home.learn_button"
              >
                <a href="#treatments">Learn About Treatments</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary/5 border-y border-primary/10 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "4", label: "Conditions Detected" },
            { value: "5+", label: "Ayurvedic Medicines" },
            { value: "5", label: "Lepa Formulations" },
            { value: "100%", label: "Natural Ingredients" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-serif text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conditions We Detect */}
      <section
        className="max-w-5xl mx-auto px-4 py-16 sm:py-20"
        id="conditions"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Conditions We <span className="text-primary">Detect</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our AI analyses four primary acne conditions, each requiring a
            tailored Ayurvedic approach.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONDITIONS.map((cond, i) => (
            <motion.div
              key={cond.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`conditions.item.${i + 1}`}
            >
              <Card className="h-full hover:shadow-warm transition-shadow border-border">
                <CardHeader className="pb-2">
                  <div className="text-3xl mb-2">{cond.emoji}</div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-serif">
                      {cond.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {cond.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {cond.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wellness & Beauty Guides */}
      <section className="bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-yellow-50/60 border-y border-border py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              ✦ Wellness & Beauty Guides
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Beyond Acne —{" "}
              <span className="text-primary">Total Skin Wellness</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our in-depth Ayurvedic guides for age-defying care and
              radiant skin — written with the wisdom of classical texts and
              modern Ayurvedic practice.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {WELLNESS_GUIDES.map((guide, i) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  data-ocid={guide.ocid}
                >
                  <Card
                    className={`h-full border-2 ${guide.color} transition-all hover:shadow-lg`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl ${guide.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
                        >
                          <Icon className={`w-7 h-7 ${guide.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {guide.subtitle}
                          </p>
                          <CardTitle className="font-serif text-xl leading-tight">
                            {guide.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {guide.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {guide.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-xs ${guide.badgeColor}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        asChild
                        className={`rounded-full w-full ${guide.btnClass}`}
                        data-ocid={guide.btnOcid}
                      >
                        <Link to={guide.to}>
                          Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ayurvedic Treatment Approach */}
      <section
        className="bg-muted/30 border-b border-border py-16 sm:py-20"
        id="treatments"
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              ✦ Classical Ayurvedic Protocol
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Ayurvedic Treatment <span className="text-primary">Approach</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our recommendations are based on classical Ayurvedic principles
              formulated by a certified BAMS physician — addressing skin
              conditions from the root through internal purification and
              external healing.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {TREATMENT_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`treatments.item.${i + 1}`}
                >
                  <Card
                    className={`h-full border-2 ${cat.color} overflow-hidden hover:shadow-warm transition-shadow`}
                  >
                    {cat.image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/60 ${cat.iconColor}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <CardTitle className="font-serif text-lg">
                          {cat.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8"
              data-ocid="treatments.scan_button"
            >
              <Link to="/main">
                Get My Treatment Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
            How It <span className="text-primary">Works</span>
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Microscope,
              step: "01",
              title: "Upload & Analyse",
              desc: "Take or upload a clear photo of the affected area. Our AI scans for acne conditions in seconds.",
            },
            {
              icon: ShieldCheck,
              step: "02",
              title: "Get Diagnosed",
              desc: "Conditions like whiteheads, blackheads, papules, and pustules are detected with confidence scores.",
            },
            {
              icon: HeartHandshake,
              step: "03",
              title: "Follow Your Plan",
              desc: "Receive a comprehensive Ayurvedic treatment plan including medicines, lepas, diet, and cleansing routines.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 font-serif font-bold text-xs text-primary/50">
                  {step.step}
                </span>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 border-t border-border py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Patient <span className="text-primary">Stories</span>
            </h2>
            <p className="text-muted-foreground">
              Real results from real people using Ayurvedic skin care.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <Card className="h-full border-border hover:shadow-warm transition-shadow">
                  <CardContent className="pt-5">
                    <div className="flex gap-0.5 mb-3">
                      {STARS.slice(0, t.rating).map((s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">
                      "{t.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.location} · {t.condition}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
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
          <p className="text-xs text-muted-foreground/70 mt-2">
            For educational purposes only. Always consult a qualified Ayurvedic
            physician before starting any treatment.
          </p>
        </div>
      </footer>
    </main>
  );
}
