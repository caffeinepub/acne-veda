import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Apple,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  Home,
  Leaf,
  Lock,
  Moon,
  RotateCcw,
  Sparkles,
  Star,
  Sun,
  Wind,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type FlowType = "entry" | "skin" | "hair";

type SkinConcern =
  | "Acne / Pimples"
  | "Pigmentation / Dark spots"
  | "Dark circles"
  | "Wrinkles / Ageing"
  | "Dull / Uneven skin"
  | "General skin maintenance";

type HairConcern =
  | "Hair fall"
  | "Dandruff"
  | "Thinning hair"
  | "Dry / frizzy hair"
  | "Premature greying"
  | "Scalp issues";

type Severity = "Mild" | "Moderate" | "Severe";
type SkinType = "Oily" | "Dry" | "Combination" | "Sensitive" | "Not sure";
type Sleep = "Less than 5 hours" | "5–7 hours" | "7–9 hours";
type Stress = "Low" | "Moderate" | "High";
type Water = "Less than 1L" | "1–2L" | "More than 2L";
type Digestion = "Good" | "Bloating" | "Constipation" | "Irregular";
type DietSkin =
  | "Oily / Fried foods"
  | "Sugary foods"
  | "Dairy-heavy diet"
  | "Balanced diet";
type Routine =
  | "No routine"
  | "Basic (facewash only)"
  | "Regular (cleanser + moisturizer)"
  | "Advanced routine";

type AcneTrigger =
  | "During stress"
  | "Before periods"
  | "After certain foods"
  | "Multiple triggers";
type SunExposure =
  | "Minimal (mostly indoors)"
  | "Moderate (sometimes outdoors)"
  | "High (daily outdoor exposure)";
type Sunscreen = "Yes, daily" | "Sometimes" | "Never";
type SleepQuality = "Very poor" | "Poor" | "Average" | "Good";
type ScreenTime = "Less than 3hrs" | "3–6hrs" | "More than 6hrs";
type AgingType = "Fine lines" | "Loose/sagging skin" | "Both";

type ScalpType = "Oily scalp" | "Dry scalp" | "Normal";
type FallPattern =
  | "Sudden (started recently)"
  | "Gradual (over months)"
  | "Seasonal";
type Protein = "Low" | "Moderate" | "High";
type OilingFreq = "Never" | "Occasionally" | "Weekly" | "Regular (2–3x/week)";
type WashFreq = "Daily" | "Alternate days" | "Weekly";
type ScalpCondition = "Itchy" | "Flaky" | "Oily" | "Normal";

interface SkinAnswers {
  skinConcern?: SkinConcern;
  severity?: Severity;
  skinType?: SkinType;
  sleep?: Sleep;
  stress?: Stress;
  water?: Water;
  digestion?: Digestion;
  diet?: DietSkin;
  routine?: Routine;
  acneTrigger?: AcneTrigger;
  sunExposure?: SunExposure;
  sunscreen?: Sunscreen;
  sleepQuality?: SleepQuality;
  screenTime?: ScreenTime;
  agingType?: AgingType;
  dynamicSunExposure?: SunExposure;
}

interface HairAnswers {
  hairConcern?: HairConcern;
  severity?: Severity;
  scalpType?: ScalpType;
  fallPattern?: FallPattern;
  sleep?: Sleep;
  stress?: Stress;
  water?: Water;
  protein?: Protein;
  oilingFreq?: OilingFreq;
  washFreq?: WashFreq;
  scalpCondition?: ScalpCondition;
  digestion?: Digestion;
}

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
}

interface AnalysisResult {
  conditionScore: number;
  rootCauses: string[];
  dosha: { name: string; description: string; icon: string };
  morningRoutine: string[];
  nightRoutine: string[];
  sleepTip: string;
  stressTip: string;
  foodsToAvoid: string[];
  foodsToInclude: string[];
  weeklyCare: { day: string; activity: string }[];
}

interface Step {
  id: string;
  question: string;
  options: string[];
}

// ─── Analysis Engine ─────────────────────────────────────────────────────────

function analyzeResults(
  flow: "skin" | "hair",
  skin: SkinAnswers,
  hair: HairAnswers,
): AnalysisResult {
  let score = 50;

  const severity = flow === "skin" ? skin.severity : hair.severity;
  const sleep = flow === "skin" ? skin.sleep : hair.sleep;
  const stress = flow === "skin" ? skin.stress : hair.stress;
  const water = flow === "skin" ? skin.water : hair.water;
  const digestion = flow === "skin" ? skin.digestion : hair.digestion;
  const diet = skin.diet;

  if (severity === "Mild") score -= 15;
  else if (severity === "Severe") score += 20;

  if (sleep === "Less than 5 hours") score += 10;
  else if (sleep === "5–7 hours") score += 3;
  else if (sleep === "7–9 hours") score -= 8;

  if (stress === "High") score += 10;
  else if (stress === "Moderate") score += 4;
  else if (stress === "Low") score -= 8;

  if (water === "Less than 1L") score += 8;
  else if (water === "1–2L") score += 2;
  else if (water === "More than 2L") score -= 5;

  if (digestion === "Constipation" || digestion === "Irregular") score += 8;
  else if (digestion === "Bloating") score += 4;
  else if (digestion === "Good") score -= 5;

  if (diet === "Oily / Fried foods" || diet === "Sugary foods") score += 8;
  else if (diet === "Balanced diet") score -= 5;

  score = Math.max(0, Math.min(100, score));

  const rootCauses: string[] = [];
  if (stress === "High")
    rootCauses.push("Stress-induced hormonal fluctuations");
  if (sleep === "Less than 5 hours")
    rootCauses.push("Sleep deprivation affecting skin regeneration");
  if (diet === "Oily / Fried foods" || diet === "Sugary foods")
    rootCauses.push("Pro-inflammatory diet triggering flare-ups");
  if (
    digestion === "Constipation" ||
    digestion === "Irregular" ||
    digestion === "Bloating"
  )
    rootCauses.push("Gut-skin axis imbalance (Ama accumulation)");
  if (water === "Less than 1L")
    rootCauses.push("Dehydration reducing skin barrier function");
  if (rootCauses.length === 0)
    rootCauses.push("Mild lifestyle factors contributing to imbalance");

  let dosha: AnalysisResult["dosha"];
  if (flow === "skin") {
    const c = skin.skinConcern;
    if (c === "Acne / Pimples" || c === "Pigmentation / Dark spots") {
      dosha = {
        name: "Pitta",
        icon: "🔥",
        description:
          "Excess heat (Pitta) is driving inflammation, redness, and breakouts. Cooling practices and anti-inflammatory foods will restore balance.",
      };
    } else if (c === "Wrinkles / Ageing" || c === "Dull / Uneven skin") {
      dosha = {
        name: "Vata",
        icon: "🌬️",
        description:
          "Excess Vata is causing dryness, fine lines, and loss of elasticity. Nourishing oils, warm foods, and grounding practices will help.",
      };
    } else {
      dosha = {
        name: "Kapha",
        icon: "💧",
        description:
          "Kapha accumulation is leading to oiliness and dullness. Stimulating circulation and a lighter diet will restore radiance.",
      };
    }
  } else {
    const c = hair.hairConcern;
    if (c === "Hair fall" || c === "Thinning hair") {
      dosha = {
        name: "Vata",
        icon: "🌬️",
        description:
          "Elevated Vata is weakening hair follicles and causing hair fall. Warm oiling, protein-rich diet, and stress management are key.",
      };
    } else if (c === "Premature greying" || c === "Scalp issues") {
      dosha = {
        name: "Pitta",
        icon: "🔥",
        description:
          "Pitta excess is triggering early greying and scalp inflammation. Cooling herbs like Bhringraj and Amla will nourish deeply.",
      };
    } else {
      dosha = {
        name: "Kapha",
        icon: "💧",
        description:
          "Kapha excess is causing dandruff and oily scalp build-up. Regular cleansing with light, stimulating herbs will restore scalp health.",
      };
    }
  }

  let morningRoutine: string[];
  let nightRoutine: string[];

  if (flow === "skin") {
    const c = skin.skinConcern;
    const st = skin.skinType;
    if (c === "Acne / Pimples") {
      morningRoutine = [
        "Wash face with Neem + Tulsi cleanser (lukewarm water)",
        "Apply Rose water toner — balances pH, cools Pitta",
        "Lightweight Niacinamide serum — controls sebum",
        "Broad-spectrum SPF 30+ sunscreen (non-comedogenic)",
      ];
      nightRoutine = [
        "Double-cleanse: oil cleanser → Neem facewash",
        "Apply Triphala toner for antioxidant protection",
        "Spot-treat active pimples with Neem gel or Salicylic acid",
        "Light, non-comedogenic moisturizer (aloe vera-based)",
      ];
    } else if (c === "Pigmentation / Dark spots") {
      morningRoutine = [
        "Gentle Vitamin C cleanser to brighten and protect",
        "Kojic acid + Niacinamide serum — fades pigmentation",
        "SPF 50+ sunscreen — critical for dark spot prevention",
        "Drink warm Amla juice on empty stomach",
      ];
      nightRoutine = [
        "Cleanse with Milk + Honey based cleanser",
        "Kumkumadi oil — traditional Ayurvedic pigmentation treatment",
        "Glycolic acid exfoliant (2–3 times per week only)",
        "Rich moisturizer with Licorice root extract",
      ];
    } else if (c === "Dark circles") {
      morningRoutine = [
        "Cool water splash — reduces puffiness instantly",
        "Apply chilled rose water-soaked cotton pads for 5 mins",
        "Vitamin C + Caffeine eye serum — brightens dark circles",
        "Sunscreen (don’t skip around the eyes!)",
      ];
      nightRoutine = [
        "Gentle milk-based cleanser (no harsh rubbing)",
        "Almond oil massage around eyes — clockwise, light pressure",
        "Retinol eye cream (2x weekly for collagen boost)",
        "Sleep on your back to reduce fluid pooling",
      ];
    } else if (c === "Wrinkles / Ageing") {
      morningRoutine = [
        "Antioxidant cleanser with Turmeric and Vitamin E",
        "Hyaluronic acid serum — plumps fine lines",
        "Vitamin C serum — protects from free radicals",
        "High-SPF broad-spectrum sunscreen (the #1 anti-ageing step)",
      ];
      nightRoutine = [
        "Oil cleanse with Ashwagandha-infused face oil",
        "Retinol or Bakuchiol serum (Ayurvedic retinol alternative)",
        "Face massage with Rosehip oil for 5 mins (upward strokes)",
        "Thick moisturizer to lock in hydration overnight",
      ];
    } else {
      const isDry = st === "Dry" || st === "Sensitive";
      morningRoutine = [
        isDry ? "Creamy hydrating cleanser" : "Foam cleanser for brightening",
        "Vitamin C + Niacinamide serum for radiance",
        "Hydrating toner with Rosewater and Cucumber",
        "SPF 30+ moisturizing sunscreen",
      ];
      nightRoutine = [
        "Double cleanse — remove all impurities",
        "AHA exfoliant (glycolic/lactic acid) — 2x weekly",
        "Brightening serum with Saffron or Turmeric extract",
        "Overnight mask with Honey and Aloe vera",
      ];
    }
  } else {
    const c = hair.hairConcern;
    const st = hair.scalpType;
    if (c === "Hair fall" || c === "Thinning hair") {
      morningRoutine = [
        "Scalp massage with warm Bhringraj oil (5 mins)",
        "Take Biotin + Iron supplement with breakfast",
        "Use a wide-tooth comb — never brush wet hair",
        "Tie loosely — avoid tight hairstyles that stress follicles",
      ];
      nightRoutine = [
        "Apply Onion seed oil or Castor oil to scalp",
        "Gentle circular massage for 10 minutes",
        "Sleep on a silk pillowcase to reduce friction",
        "Take Ashwagandha before bed — reduces cortisol",
      ];
    } else if (c === "Dandruff" || c === "Scalp issues") {
      morningRoutine = [
        "Anti-dandruff shampoo with Neem or Ketoconazole (2–3x/week)",
        "Apply diluted Tea Tree oil to affected areas",
        "Stay hydrated — dry scalp worsens dandruff",
        st === "Oily scalp"
          ? "Avoid heavy conditioners on scalp"
          : "Use scalp-soothing conditioner on ends",
      ];
      nightRoutine = [
        "Pre-wash treatment: Coconut oil + few drops of Neem oil",
        "Leave for 1–2 hours before washing",
        "Triphala powder scalp mask (1x weekly) — detoxifies",
        "Ensure your pillowcase is clean and washed weekly",
      ];
    } else if (c === "Dry / frizzy hair") {
      morningRoutine = [
        "Leave-in conditioner with Argan or Amla oil",
        "Microfiber towel — never rough-dry with regular towel",
        "Air dry when possible — heat damages keratin",
        "Serum with Aloe vera for frizz control",
      ];
      nightRoutine = [
        "Deep condition mask with Egg, Honey and Coconut oil",
        "Braid loosely before sleeping to prevent tangles",
        "Silk or satin pillowcase to preserve moisture",
        "Brahmi oil scalp massage — 2x weekly for deep nourishment",
      ];
    } else {
      morningRoutine = [
        "Gentle sulfate-free shampoo (suitable for regular use)",
        "Cold water final rinse for added shine",
        "Lightweight Bhringraj hair serum for strength",
        "Iron + B12 supplement with breakfast",
      ];
      nightRoutine = [
        "Coconut + Amla oil warm scalp massage",
        "Comb gently from tips to roots",
        "Silk pillowcase for hair protection",
        "Keep scalp clean — wash 2–3x weekly",
      ];
    }
  }

  let sleepTip: string;
  if (sleep === "Less than 5 hours")
    sleepTip =
      "You're getting critically low sleep. Aim to be in bed by 10:30 PM — skin and hair cells regenerate between 11 PM–2 AM. Start with a 30-min earlier bedtime this week.";
  else if (sleep === "5–7 hours")
    sleepTip =
      "You're close! Getting to 7–8 hours will significantly improve your results. Try Brahmi milk (1 tsp Brahmi powder in warm milk) 30 minutes before bed.";
  else
    sleepTip =
      "Great sleep schedule! Maintain this consistency. Ensure your bedroom is cool, dark, and screen-free 30 minutes before sleep for deepest rest.";

  let stressTip: string;
  if (stress === "High")
    stressTip =
      "High stress is likely your biggest trigger. Start with just 5 minutes of Anulom Vilom (alternate nostril breathing) daily. Add Ashwagandha 300mg capsule in the morning.";
  else if (stress === "Moderate")
    stressTip =
      "Moderate stress is manageable. Regular exercise (even a 20-min walk) dramatically reduces cortisol. Try journaling before bed to process daily stressors.";
  else
    stressTip =
      "Excellent! Low stress is a powerful ally. Continue your stress management practices and consider adding Brahmi supplement for cognitive clarity.";

  let foodsToAvoid: string[];
  let foodsToInclude: string[];

  if (flow === "skin") {
    const c = skin.skinConcern;
    if (c === "Acne / Pimples") {
      foodsToAvoid = [
        "Dairy (milk, cheese)",
        "High-glycemic foods",
        "Fried & oily foods",
        "Excess sugar",
        "Processed snacks",
      ];
      foodsToInclude = [
        "Turmeric golden milk",
        "Green leafy vegetables",
        "Zinc-rich seeds",
        "Amla / Indian gooseberry",
        "Coconut water",
      ];
    } else if (c === "Pigmentation / Dark spots") {
      foodsToAvoid = [
        "Alcohol",
        "Processed foods",
        "Trans fats",
        "Refined sugar",
      ];
      foodsToInclude = [
        "Vitamin C foods (citrus, guava)",
        "Tomatoes (lycopene)",
        "Green tea",
        "Saffron water",
        "Pomegranate",
      ];
    } else if (c === "Wrinkles / Ageing") {
      foodsToAvoid = [
        "Sugar & refined carbs",
        "Excess alcohol",
        "Deep-fried foods",
        "Excessive salt",
      ];
      foodsToInclude = [
        "Avocado & healthy fats",
        "Collagen-boosting bone broth",
        "Blueberries & berries",
        "Walnuts (Omega-3)",
        "Ashwagandha",
      ];
    } else {
      foodsToAvoid = ["Spicy foods", "Processed meals", "Excess caffeine"];
      foodsToInclude = [
        "Hydrating fruits (cucumber, watermelon)",
        "Seasonal vegetables",
        "Herbal teas",
        "Flaxseeds",
      ];
    }
  } else {
    const c = hair.hairConcern;
    if (c === "Hair fall" || c === "Thinning hair") {
      foodsToAvoid = [
        "Crash dieting",
        "Excess sugar",
        "Fried junk food",
        "Alcohol",
      ];
      foodsToInclude = [
        "Eggs & lean protein",
        "Spinach (iron)",
        "Pumpkin seeds (zinc)",
        "Amla juice (Vitamin C)",
        "Lentils & legumes",
      ];
    } else if (c === "Dandruff") {
      foodsToAvoid = [
        "Sugary foods",
        "Excess dairy",
        "Yeast-based foods",
        "Oily fried foods",
      ];
      foodsToInclude = [
        "Probiotic foods (curd, fermented)",
        "Zinc-rich foods",
        "Omega-3 (flaxseed, walnuts)",
        "Neem herbal decoction",
      ];
    } else {
      foodsToAvoid = ["Excess alcohol", "Processed foods", "Crash diets"];
      foodsToInclude = [
        "Protein-rich foods",
        "Biotin sources (eggs, nuts)",
        "Iron-rich greens",
        "Hydrate 2L+ daily",
      ];
    }
  }

  const weeklyCare = [
    {
      day: "Mon",
      activity:
        flow === "skin"
          ? "Cleanse + Vitamin C serum + SPF"
          : "Oil scalp massage + nourishing shampoo",
    },
    {
      day: "Tue",
      activity:
        flow === "skin"
          ? "Gentle exfoliation + hydrating mask"
          : "Deep condition hair mask (30 mins)",
    },
    { day: "Wed", activity: "30-min walk + 2L water intake focus" },
    {
      day: "Thu",
      activity:
        flow === "skin"
          ? "Spot treatment + sheet mask"
          : "Scalp detox treatment",
    },
    { day: "Fri", activity: "Dietary check-in: add a new healthy food" },
    {
      day: "Sat",
      activity:
        flow === "skin"
          ? "Steam facial + clay mask"
          : "Pre-wash herbal oil treatment",
    },
    { day: "Sun", activity: "Rest, early sleep, and gratitude journaling" },
  ];

  return {
    conditionScore: score,
    rootCauses,
    dosha,
    morningRoutine,
    nightRoutine,
    sleepTip,
    stressTip,
    foodsToAvoid,
    foodsToInclude,
    weeklyCare,
  };
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function getSkinSteps(skinConcern?: SkinConcern): Step[] {
  const base: Step[] = [
    {
      id: "skinConcern",
      question: "Tell me your main skin concern 🌿",
      options: [
        "Acne / Pimples",
        "Pigmentation / Dark spots",
        "Dark circles",
        "Wrinkles / Ageing",
        "Dull / Uneven skin",
        "General skin maintenance",
      ],
    },
    {
      id: "severity",
      question: "How severe is it?",
      options: ["Mild", "Moderate", "Severe"],
    },
    {
      id: "skinType",
      question: "What is your skin type?",
      options: ["Oily", "Dry", "Combination", "Sensitive", "Not sure"],
    },
    {
      id: "sleep",
      question: "How many hours do you sleep per night? 😴",
      options: ["Less than 5 hours", "5–7 hours", "7–9 hours"],
    },
    {
      id: "stress",
      question: "How stressed are you on a daily basis?",
      options: ["Low", "Moderate", "High"],
    },
    {
      id: "water",
      question: "How much water do you drink daily? 💧",
      options: ["Less than 1L", "1–2L", "More than 2L"],
    },
    {
      id: "digestion",
      question: "How is your digestion? (Important for skin health)",
      options: ["Good", "Bloating", "Constipation", "Irregular"],
    },
    {
      id: "diet",
      question: "What do you eat most frequently?",
      options: [
        "Oily / Fried foods",
        "Sugary foods",
        "Dairy-heavy diet",
        "Balanced diet",
      ],
    },
    {
      id: "routine",
      question: "Do you follow a skincare routine? ✨",
      options: [
        "No routine",
        "Basic (facewash only)",
        "Regular (cleanser + moisturizer)",
        "Advanced routine",
      ],
    },
  ];
  if (skinConcern === "Acne / Pimples") {
    base.push({
      id: "acneTrigger",
      question: "Do your breakouts increase...",
      options: [
        "During stress",
        "Before periods",
        "After certain foods",
        "Multiple triggers",
      ],
    });
  } else if (skinConcern === "Pigmentation / Dark spots") {
    base.push({
      id: "sunExposure",
      question: "What's your sun exposure level?",
      options: [
        "Minimal (mostly indoors)",
        "Moderate (sometimes outdoors)",
        "High (daily outdoor exposure)",
      ],
    });
    base.push({
      id: "sunscreen",
      question: "Do you use sunscreen? ☀️",
      options: ["Yes, daily", "Sometimes", "Never"],
    });
  } else if (skinConcern === "Dark circles") {
    base.push({
      id: "sleepQuality",
      question: "How would you rate your sleep quality?",
      options: ["Very poor", "Poor", "Average", "Good"],
    });
    base.push({
      id: "screenTime",
      question: "How many hours of screen time do you have daily? 📱",
      options: ["Less than 3hrs", "3–6hrs", "More than 6hrs"],
    });
  } else if (skinConcern === "Wrinkles / Ageing") {
    base.push({
      id: "agingType",
      question: "What do you notice more?",
      options: ["Fine lines", "Loose/sagging skin", "Both"],
    });
    base.push({
      id: "dynamicSunExposure",
      question: "How much sun exposure do you get?",
      options: [
        "Minimal (mostly indoors)",
        "Moderate (sometimes outdoors)",
        "High (daily outdoor exposure)",
      ],
    });
  }
  return base;
}

function getHairSteps(hairConcern?: HairConcern): Step[] {
  const base: Step[] = [
    {
      id: "hairConcern",
      question: "Tell me your main hair concern 💇",
      options: [
        "Hair fall",
        "Dandruff",
        "Thinning hair",
        "Dry / frizzy hair",
        "Premature greying",
        "Scalp issues",
      ],
    },
    {
      id: "severity",
      question: "How severe is it?",
      options: ["Mild", "Moderate", "Severe"],
    },
    {
      id: "scalpType",
      question: "What is your scalp type?",
      options: ["Oily scalp", "Dry scalp", "Normal"],
    },
  ];
  if (
    !hairConcern ||
    hairConcern === "Hair fall" ||
    hairConcern === "Thinning hair"
  ) {
    base.push({
      id: "fallPattern",
      question: "What's your hair fall pattern?",
      options: [
        "Sudden (started recently)",
        "Gradual (over months)",
        "Seasonal",
      ],
    });
  }
  base.push(
    {
      id: "sleep",
      question: "How many hours do you sleep per night? 😴",
      options: ["Less than 5 hours", "5–7 hours", "7–9 hours"],
    },
    {
      id: "stress",
      question: "How stressed are you daily?",
      options: ["Low", "Moderate", "High"],
    },
    {
      id: "water",
      question: "How much water do you drink daily? 💧",
      options: ["Less than 1L", "1–2L", "More than 2L"],
    },
    {
      id: "protein",
      question: "How is your protein intake? 🥚",
      options: ["Low", "Moderate", "High"],
    },
    {
      id: "oilingFreq",
      question: "How often do you oil your hair?",
      options: ["Never", "Occasionally", "Weekly", "Regular (2–3x/week)"],
    },
    {
      id: "washFreq",
      question: "How often do you wash your hair?",
      options: ["Daily", "Alternate days", "Weekly"],
    },
    {
      id: "scalpCondition",
      question: "How would you describe your scalp condition?",
      options: ["Itchy", "Flaky", "Oily", "Normal"],
    },
    {
      id: "digestion",
      question: "How is your digestion? (Affects hair health too)",
      options: ["Good", "Bloating", "Constipation", "Irregular"],
    },
  );
  return base;
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const scoreColor =
    score <= 40
      ? "oklch(0.55 0.18 145)"
      : score <= 70
        ? "oklch(0.78 0.18 80)"
        : "oklch(0.58 0.22 25)";
  const label = score <= 40 ? "Good" : score <= 70 ? "Moderate" : "Needs Care";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <title>Condition Score</title>
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="oklch(0.92 0.02 80)"
          strokeWidth="10"
        />
        <motion.circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform="rotate(-90 65 65)"
        />
        <text
          x="65"
          y="60"
          textAnchor="middle"
          style={{
            fontSize: "26px",
            fontWeight: 700,
            fill: scoreColor,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {score}
        </text>
        <text
          x="65"
          y="80"
          textAnchor="middle"
          style={{
            fontSize: "11px",
            fill: "oklch(0.52 0.04 60)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {label}
        </text>
      </svg>
      <span
        style={{
          fontSize: "12px",
          color: "oklch(0.55 0.04 60)",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        Condition Score
      </span>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-5"
      style={{
        background: "oklch(1 0 0)",
        boxShadow: "0 2px 16px oklch(0.52 0.18 145 / 0.07)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div style={{ color: "oklch(0.52 0.18 145)" }}>{icon}</div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "oklch(0.25 0.08 140)",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: "1px solid oklch(0.95 0.015 80)" }}
    >
      <span
        style={{
          fontSize: "13px",
          color: "oklch(0.55 0.04 60)",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "oklch(0.32 0.08 140)",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function RoutineStep({
  num,
  text,
  color,
}: { num: number; text: string; color: "warm" | "cool" }) {
  const bg = color === "warm" ? "oklch(0.88 0.12 80)" : "oklch(0.82 0.1 260)";
  const textC =
    color === "warm" ? "oklch(0.42 0.12 60)" : "oklch(0.38 0.12 260)";
  return (
    <div className="flex items-start gap-2.5 mb-2">
      <div
        style={{
          minWidth: "22px",
          height: "22px",
          borderRadius: "6px",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: textC,
          fontFamily: "DM Sans, sans-serif",
          marginTop: "1px",
        }}
      >
        {num}
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "oklch(0.38 0.06 50)",
          fontFamily: "DM Sans, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function LifestipCard({
  icon,
  label,
  tip,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  tip: string;
  color: "purple" | "green";
}) {
  const bg =
    color === "purple"
      ? "oklch(0.94 0.06 290 / 0.4)"
      : "oklch(0.94 0.06 145 / 0.4)";
  const border =
    color === "purple"
      ? "oklch(0.82 0.1 290 / 0.4)"
      : "oklch(0.82 0.1 145 / 0.4)";
  const iconColor =
    color === "purple" ? "oklch(0.5 0.16 290)" : "oklch(0.45 0.16 145)";
  const labelColor =
    color === "purple" ? "oklch(0.35 0.12 290)" : "oklch(0.35 0.12 145)";
  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: iconColor }}>{icon}</div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: labelColor,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "oklch(0.38 0.05 60)",
          fontFamily: "DM Sans, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {tip}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConsultationPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { flow?: string };

  const [flow, setFlow] = useState<FlowType>("entry");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [skinAnswers, setSkinAnswers] = useState<SkinAnswers>({});
  const [hairAnswers, setHairAnswers] = useState<HairAnswers>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const skinSteps = getSkinSteps(skinAnswers.skinConcern);
  const hairSteps = getHairSteps(hairAnswers.hairConcern);
  const activeSteps =
    flow === "skin" ? skinSteps : flow === "hair" ? hairSteps : [];
  const totalSteps = activeSteps.length;
  const currentStep = activeSteps[currentStepIndex];

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount to check URL param
  useEffect(() => {
    if (search?.flow === "hair") {
      setFlow("hair");
      const steps = getHairSteps(undefined);
      setMessages([{ id: "init-hair", from: "bot", text: steps[0].question }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  function startFlow(selectedFlow: "skin" | "hair") {
    setFlow(selectedFlow);
    const steps =
      selectedFlow === "skin"
        ? getSkinSteps(undefined)
        : getHairSteps(undefined);
    setCurrentStepIndex(0);
    setMessages([{ id: "q-0", from: "bot", text: steps[0].question }]);
  }

  function handleAnswer(answer: string) {
    if (pendingAnswer !== null) return;
    setPendingAnswer(answer);
    const userMsg: ChatMessage = {
      id: `u-${currentStepIndex}-${Date.now()}`,
      from: "user",
      text: answer,
    };
    setMessages((prev) => [...prev, userMsg]);

    if (flow === "skin") {
      const step = skinSteps[currentStepIndex];
      setSkinAnswers((prev) => ({ ...prev, [step.id]: answer }));
    } else {
      const step = hairSteps[currentStepIndex];
      setHairAnswers((prev) => ({ ...prev, [step.id]: answer }));
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const nextIndex = currentStepIndex + 1;

      let updatedSkinAnswers = skinAnswers;
      let updatedHairAnswers = hairAnswers;
      if (flow === "skin") {
        const step = skinSteps[currentStepIndex];
        updatedSkinAnswers = { ...skinAnswers, [step.id]: answer };
      } else {
        const step = hairSteps[currentStepIndex];
        updatedHairAnswers = { ...hairAnswers, [step.id]: answer };
      }

      const updatedSkinSteps = getSkinSteps(
        updatedSkinAnswers.skinConcern as SkinConcern | undefined,
      );
      const updatedHairSteps = getHairSteps(
        updatedHairAnswers.hairConcern as HairConcern | undefined,
      );
      const updatedSteps =
        flow === "skin" ? updatedSkinSteps : updatedHairSteps;

      if (nextIndex < updatedSteps.length) {
        const nextStep = updatedSteps[nextIndex];
        setCurrentStepIndex(nextIndex);
        setMessages((prev) => [
          ...prev,
          { id: `q-${nextIndex}`, from: "bot", text: nextStep.question },
        ]);
      } else {
        const res = analyzeResults(
          flow as "skin" | "hair",
          updatedSkinAnswers,
          updatedHairAnswers,
        );
        setResult(res);
        setMessages((prev) => [
          ...prev,
          {
            id: "done",
            from: "bot",
            text: "✅ Great! I have all the information I need. Generating your personalized report now...",
          },
        ]);
        setTimeout(() => setShowReport(true), 1200);
      }
      setPendingAnswer(null);
    }, 600);
  }

  function resetConsultation() {
    setFlow("entry");
    setCurrentStepIndex(0);
    setSkinAnswers({});
    setHairAnswers({});
    setMessages([]);
    setShowReport(false);
    setResult(null);
    setIsTyping(false);
    setPendingAnswer(null);
  }

  // ── Report Screen ─────────────────────────────────────────────────────────
  if (showReport && result) {
    const isHair = flow === "hair";
    const concernLabel = isHair
      ? hairAnswers.hairConcern
      : skinAnswers.skinConcern;
    const typeLabel = isHair ? hairAnswers.scalpType : skinAnswers.skinType;
    const severity = isHair ? hairAnswers.severity : skinAnswers.severity;

    return (
      <div
        className="min-h-screen pb-12"
        style={{ background: "oklch(0.97 0.012 80)" }}
        data-ocid="consultation.page"
      >
        <div
          className="sticky top-0 z-20 px-4 py-3"
          style={{
            background: "oklch(0.99 0.006 80)",
            borderBottom: "1px solid oklch(0.9 0.02 80)",
            boxShadow: "0 2px 12px oklch(0.52 0.18 145 / 0.08)",
          }}
        >
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: "oklch(0.52 0.18 145)", color: "white" }}
            >
              DV
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "oklch(0.22 0.07 140)",
                }}
              >
                Dr. Vaidya AI
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "oklch(0.55 0.04 60)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Your Personalized Report 📊
              </p>
            </div>
            <div className="ml-auto">
              <span
                style={{
                  background:
                    result.conditionScore <= 40
                      ? "oklch(0.92 0.08 145)"
                      : result.conditionScore <= 70
                        ? "oklch(0.94 0.1 80)"
                        : "oklch(0.94 0.1 25)",
                  color:
                    result.conditionScore <= 40
                      ? "oklch(0.35 0.14 145)"
                      : result.conditionScore <= 70
                        ? "oklch(0.5 0.14 60)"
                        : "oklch(0.45 0.16 25)",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {severity || "Moderate"}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 flex flex-col items-center gap-3"
            style={{
              background: "oklch(1 0 0)",
              boxShadow: "0 4px 24px oklch(0.52 0.18 145 / 0.1)",
            }}
            data-ocid="consultation.report.card"
          >
            <ScoreGauge score={result.conditionScore} />
            <p
              style={{
                fontSize: "13px",
                color: "oklch(0.5 0.04 60)",
                textAlign: "center",
                fontFamily: "DM Sans, sans-serif",
                maxWidth: 280,
                lineHeight: 1.5,
              }}
            >
              Based on your {isHair ? "hair" : "skin"} profile and lifestyle
              factors
            </p>
          </motion.div>

          <SectionCard
            title="Condition Summary"
            icon={<Activity className="w-4 h-4" />}
            delay={0.1}
          >
            <InfoRow
              label={isHair ? "Hair Concern" : "Skin Concern"}
              value={concernLabel || "—"}
            />
            <InfoRow
              label={isHair ? "Scalp Type" : "Skin Type"}
              value={typeLabel || "—"}
            />
            <InfoRow label="Severity" value={severity || "—"} />
            {!isHair && skinAnswers.stress && (
              <InfoRow label="Stress Level" value={skinAnswers.stress} />
            )}
            {isHair && hairAnswers.fallPattern && (
              <InfoRow label="Fall Pattern" value={hairAnswers.fallPattern} />
            )}
          </SectionCard>

          <SectionCard
            title="Root Cause Analysis"
            icon={<AlertCircle className="w-4 h-4" />}
            delay={0.15}
          >
            <div className="space-y-2">
              {result.rootCauses.map((cause, i) => (
                <motion.div
                  key={cause}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl"
                  style={{
                    background: "oklch(0.96 0.03 25 / 0.5)",
                    border: "1px solid oklch(0.9 0.06 25 / 0.4)",
                  }}
                  data-ocid={`consultation.cause.item.${i + 1}`}
                >
                  <AlertCircle
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    style={{ color: "oklch(0.58 0.18 25)" }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: "oklch(0.35 0.08 30)",
                      fontFamily: "DM Sans, sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {cause}
                  </span>
                </motion.div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Ayurvedic Dosha Mapping"
            icon={<Leaf className="w-4 h-4" />}
            delay={0.2}
          >
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: "oklch(0.95 0.04 145 / 0.4)",
                border: "1px solid oklch(0.85 0.08 145 / 0.4)",
              }}
            >
              <span style={{ fontSize: "28px", lineHeight: 1 }}>
                {result.dosha.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "oklch(0.28 0.1 140)",
                    marginBottom: "4px",
                  }}
                >
                  {result.dosha.name} Imbalance
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "oklch(0.42 0.06 140)",
                    fontFamily: "DM Sans, sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {result.dosha.description}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Daily Routine"
            icon={<Clock className="w-4 h-4" />}
            delay={0.25}
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Sun
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.18 80)" }}
                  />
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "oklch(0.3 0.08 60)",
                    }}
                  >
                    Morning Routine
                  </span>
                </div>
                {result.morningRoutine.map((step, i) => (
                  <RoutineStep
                    key={step}
                    num={i + 1}
                    text={step}
                    color="warm"
                  />
                ))}
              </div>
              <div
                style={{ height: "1px", background: "oklch(0.92 0.02 80)" }}
              />
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Moon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.55 0.14 260)" }}
                  />
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "oklch(0.3 0.06 260)",
                    }}
                  >
                    Night Routine
                  </span>
                </div>
                {result.nightRoutine.map((step, i) => (
                  <RoutineStep
                    key={step}
                    num={i + 1}
                    text={step}
                    color="cool"
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Lifestyle Fix"
            icon={<Heart className="w-4 h-4" />}
            delay={0.3}
          >
            <LifestipCard
              icon={<Moon className="w-4 h-4" />}
              label="Sleep"
              tip={result.sleepTip}
              color="purple"
            />
            <LifestipCard
              icon={<Wind className="w-4 h-4" />}
              label="Stress Reduction"
              tip={result.stressTip}
              color="green"
            />
          </SectionCard>

          <SectionCard
            title="Diet Suggestions"
            icon={<Apple className="w-4 h-4" />}
            delay={0.35}
          >
            <div className="space-y-3">
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "oklch(0.48 0.18 25)",
                    marginBottom: "8px",
                    fontFamily: "DM Sans, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  🚫 Avoid
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.foodsToAvoid.map((food) => (
                    <span
                      key={food}
                      style={{
                        background: "oklch(0.95 0.05 25 / 0.5)",
                        border: "1px solid oklch(0.85 0.1 25 / 0.4)",
                        color: "oklch(0.45 0.16 25)",
                        borderRadius: "100px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "oklch(0.38 0.14 145)",
                    marginBottom: "8px",
                    fontFamily: "DM Sans, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  ✅ Include
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.foodsToInclude.map((food) => (
                    <span
                      key={food}
                      style={{
                        background: "oklch(0.94 0.06 145 / 0.5)",
                        border: "1px solid oklch(0.82 0.1 145 / 0.5)",
                        color: "oklch(0.35 0.14 145)",
                        borderRadius: "100px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Weekly Care Plan"
            icon={<Calendar className="w-4 h-4" />}
            delay={0.4}
          >
            <div className="space-y-2">
              {result.weeklyCare.map((item, i) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.05 }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.97 0.015 145 / 0.4)"
                        : "oklch(0.99 0.005 80)",
                  }}
                  data-ocid={`consultation.weekly.item.${i + 1}`}
                >
                  <span
                    style={{
                      minWidth: "36px",
                      height: "36px",
                      background: "oklch(0.52 0.18 145)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    {item.day}
                  </span>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "oklch(0.35 0.06 60)",
                      fontFamily: "DM Sans, sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.activity}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Coming Soon"
            icon={<Sparkles className="w-4 h-4" />}
            delay={0.45}
          >
            <div className="space-y-2.5">
              {[
                {
                  icon: <Star className="w-4 h-4" />,
                  label: "Premium Detailed Report",
                  sub: "Unlock in-depth analysis & PDF download",
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  label: "Product Recommendations",
                  sub: "Curated Ayurvedic products for your concern",
                },
                {
                  icon: <Activity className="w-4 h-4" />,
                  label: "Progress Tracker",
                  sub: "Track improvement over weeks",
                },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "oklch(0.97 0.01 80)",
                    border: "1.5px dashed oklch(0.85 0.04 80)",
                    opacity: 0.8,
                  }}
                >
                  <div style={{ color: "oklch(0.62 0.08 80)" }}>
                    {feat.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "oklch(0.45 0.06 60)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {feat.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "oklch(0.6 0.04 60)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {feat.sub}
                    </p>
                  </div>
                  <Lock
                    className="w-4 h-4"
                    style={{ color: "oklch(0.7 0.04 60)" }}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              data-ocid="consultation.report.retake_button"
              onClick={resetConsultation}
              className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: "oklch(0.52 0.18 145)",
                color: "white",
                fontSize: "15px",
                fontFamily: "DM Sans, sans-serif",
                boxShadow: "0 4px 20px oklch(0.52 0.18 145 / 0.35)",
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Retake Consultation
            </button>
            <button
              type="button"
              data-ocid="consultation.report.dashboard_button"
              onClick={() => navigate({ to: "/main" })}
              className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: "oklch(0.99 0.006 80)",
                color: "oklch(0.35 0.1 140)",
                fontSize: "15px",
                fontFamily: "DM Sans, sans-serif",
                border: "1.5px solid oklch(0.82 0.1 145)",
              }}
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          </div>

          <p
            className="text-center py-4"
            style={{
              fontSize: "11px",
              color: "oklch(0.65 0.04 60)",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-1"
              style={{ color: "oklch(0.52 0.14 145)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ── Entry Screen ─────────────────────────────────────────────────────────
  if (flow === "entry") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5 pb-10"
        style={{ background: "oklch(0.97 0.012 80)" }}
        data-ocid="consultation.page"
      >
        <div className="w-full max-w-sm mb-4">
          <button
            type="button"
            data-ocid="consultation.back_button"
            onClick={() => navigate({ to: "/main" })}
            className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
            style={{
              color: "oklch(0.52 0.14 145)",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </button>
        </div>
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.52 0.18 145)",
                boxShadow: "0 8px 32px oklch(0.52 0.18 145 / 0.35)",
              }}
            >
              <span style={{ fontSize: "32px" }}>🌿</span>
            </div>
          </div>
          <h1
            className="text-center mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "24px",
              color: "oklch(0.22 0.07 140)",
              lineHeight: 1.2,
            }}
          >
            Dr. Vaidya AI
          </h1>
          <p
            className="text-center mb-2"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            Your Ayurvedic Skin & Hair Advisor
          </p>
          <p
            className="text-center mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "oklch(0.45 0.08 140)",
            }}
          >
            What would you like to focus on today?
          </p>
          <div className="space-y-3">
            <motion.button
              type="button"
              data-ocid="consultation.skin_button"
              onClick={() => startFlow("skin")}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full py-4 px-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 4px 20px oklch(0.52 0.18 145 / 0.12)",
                border: "1.5px solid oklch(0.85 0.08 145 / 0.6)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.94 0.07 145 / 0.6)" }}
              >
                <Leaf
                  className="w-6 h-6"
                  style={{ color: "oklch(0.45 0.18 145)" }}
                />
              </div>
              <div className="text-left">
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "oklch(0.28 0.1 140)",
                  }}
                >
                  Skin
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px",
                    color: "oklch(0.52 0.06 140)",
                  }}
                >
                  Acne, pigmentation, ageing & more
                </p>
              </div>
              <ChevronRight
                className="w-5 h-5 ml-auto"
                style={{ color: "oklch(0.55 0.14 145)" }}
              />
            </motion.button>
            <motion.button
              type="button"
              data-ocid="consultation.hair_button"
              onClick={() => startFlow("hair")}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full py-4 px-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 4px 20px oklch(0.62 0.1 290 / 0.1)",
                border: "1.5px solid oklch(0.85 0.08 290 / 0.5)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.94 0.06 290 / 0.5)" }}
              >
                <span style={{ fontSize: "24px" }}>💇</span>
              </div>
              <div className="text-left">
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "oklch(0.28 0.08 290)",
                  }}
                >
                  Hair
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px",
                    color: "oklch(0.52 0.06 290)",
                  }}
                >
                  Hair fall, dandruff, scalp care & more
                </p>
              </div>
              <ChevronRight
                className="w-5 h-5 ml-auto"
                style={{ color: "oklch(0.55 0.12 290)" }}
              />
            </motion.button>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            {["🔬 AI Analysis", "🌿 Ayurvedic", "🔒 Private"].map((badge) => (
              <div
                key={badge}
                style={{
                  background: "oklch(0.94 0.04 145 / 0.5)",
                  border: "1px solid oklch(0.85 0.06 145 / 0.5)",
                  borderRadius: "100px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  color: "oklch(0.38 0.1 140)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
        <p
          className="mt-10 text-center"
          style={{
            fontSize: "11px",
            color: "oklch(0.65 0.04 60)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-1"
            style={{ color: "oklch(0.52 0.14 145)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    );
  }

  // ── Chat Flow Screen ─────────────────────────────────────────────────────
  const progress = totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.012 80)" }}
      data-ocid="consultation.page"
    >
      <div
        className="sticky top-0 z-20 px-4 pt-4 pb-3"
        style={{
          background: "oklch(0.99 0.006 80)",
          borderBottom: "1px solid oklch(0.9 0.02 80)",
        }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              data-ocid="consultation.back_button"
              onClick={resetConsultation}
              className="flex items-center gap-1.5"
              style={{
                color: "oklch(0.52 0.14 145)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.52 0.18 145)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                DV
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "oklch(0.28 0.08 140)",
                }}
              >
                Dr. Vaidya AI
              </span>
            </div>
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "oklch(0.52 0.14 145)",
              }}
              data-ocid="consultation.progress_label"
            >
              Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
            </span>
          </div>
          <div
            className="w-full rounded-full h-1.5"
            style={{ background: "oklch(0.9 0.02 80)" }}
          >
            <motion.div
              className="h-1.5 rounded-full"
              style={{ background: "oklch(0.52 0.18 145)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {msg.from === "bot" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: "oklch(0.52 0.18 145)",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 700,
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    DV
                  </div>
                )}
                <div
                  className="max-w-[78%] px-4 py-3 rounded-2xl"
                  style={{
                    background:
                      msg.from === "user"
                        ? "oklch(0.52 0.18 145)"
                        : "oklch(1 0 0)",
                    color:
                      msg.from === "user" ? "white" : "oklch(0.28 0.06 50)",
                    borderTopLeftRadius: msg.from === "bot" ? "4px" : "16px",
                    borderTopRightRadius: msg.from === "user" ? "4px" : "16px",
                    boxShadow: "0 2px 12px oklch(0.52 0.18 145 / 0.1)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="flex justify-start gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.52 0.18 145)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                DV
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{
                  background: "oklch(1 0 0)",
                  boxShadow: "0 2px 12px oklch(0.52 0.18 145 / 0.1)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "oklch(0.52 0.18 145)",
                      animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {!isTyping && !showReport && currentStep && (
        <div
          className="px-4 py-4"
          style={{
            background: "oklch(0.99 0.006 80)",
            borderTop: "1px solid oklch(0.92 0.02 80)",
            boxShadow: "0 -4px 20px oklch(0.52 0.18 145 / 0.06)",
          }}
        >
          <div className="max-w-lg mx-auto space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {currentStep.options.map((opt, idx) => (
                  <motion.button
                    key={opt}
                    type="button"
                    data-ocid={`consultation.option.${idx + 1}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={pendingAnswer !== null}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      background:
                        pendingAnswer === opt
                          ? "oklch(0.52 0.18 145)"
                          : "oklch(0.97 0.015 145 / 0.5)",
                      color:
                        pendingAnswer === opt ? "white" : "oklch(0.32 0.1 140)",
                      border:
                        pendingAnswer === opt
                          ? "1.5px solid oklch(0.52 0.18 145)"
                          : "1.5px solid oklch(0.85 0.08 145 / 0.6)",
                      boxShadow:
                        pendingAnswer === opt
                          ? "0 4px 14px oklch(0.52 0.18 145 / 0.28)"
                          : "none",
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
