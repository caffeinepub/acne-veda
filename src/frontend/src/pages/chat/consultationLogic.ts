// Consultation logic: types, flow steps, and results generation

export type FlowType = "skin" | "hair";

export interface ChatMessage {
  key: string;
  question: string;
  options: string[];
}

export type ConsultationAnswers = Record<string, string | undefined> & {
  // Skin — generic
  skinConcern?: string;
  severity?: string;
  skinType?: string;
  sleep?: string;
  stress?: string;
  hydration?: string;
  digestion?: string;
  diet?: string;
  routine?: string;
  // Skin — acne specific
  acneType?: string;
  acneLocation?: string;
  acneTriggers?: string;
  // Skin — pigmentation specific
  pigmentationType?: string;
  sunExposure?: string;
  sunscreen?: string;
  // Skin — dark circles specific
  darkCircleType?: string;
  screenTime?: string;
  familyHistory?: string;
  // Skin — ageing specific
  ageingType?: string;
  // Hair — generic
  hairConcern?: string;
  scalpType?: string;
  protein?: string;
  oiling?: string;
  washing?: string;
  // Hair — hair fall specific
  hairFallPattern?: string;
  hairFallDuration?: string;
  hairFallOnset?: string;
  hairFallDandruff?: string;
  // Hair — dandruff specific
  dandruffType?: string;
  scalpItching?: string;
  scalpRedness?: string;
  // Hair — thinning specific
  thinningPattern?: string;
  familyHairHistory?: string;
  // Hair — dry/frizzy specific
  heatStyling?: string;
  conditioning?: string;
  // Hair — greying specific
  greyingAge?: string;
  greyingProgression?: string;
  greyingFamily?: string;
};

export interface ScanResult {
  whiteheads: number;
  blackheads: number;
  papules: number;
  pustules: number;
  nodules: number;
  dominant: string;
}

export interface ConsultationReport {
  conditionScore: number;
  primaryConcern: string;
  severity: string;
  doshaImbalance: string;
  doshaExplanation: string;
  diagnosis: string;
  rootCauses: string[];
  morningRoutine: string[];
  nightRoutine: string[];
  lifestyleTips: string[];
  dietAvoid: string[];
  dietInclude: string[];
  weeklyPlan: { day: string; task: string }[];
  scanResult: ScanResult | null;
}

function scoreFromSeverity(severity: string): number {
  if (severity === "Mild") return 30 + Math.floor(Math.random() * 15);
  if (severity === "Severe") return 75 + Math.floor(Math.random() * 15);
  return 52 + Math.floor(Math.random() * 18); // Moderate
}

function mapDosha(
  answers: ConsultationAnswers,
  flow: FlowType,
): { dosha: string; explanation: string } {
  const concern = answers.skinConcern || answers.hairConcern || "";
  const skin = answers.skinType || "";
  const scalp = answers.scalpType || "";
  const stress = answers.stress || "";

  if (flow === "hair") {
    if (concern.includes("Dandruff") || scalp.includes("Oily")) {
      return {
        dosha: "Kapha",
        explanation:
          "Excess Kapha leads to oily scalp, dandruff, and sluggish hair follicles.",
      };
    }
    if (
      concern.includes("Premature greying") ||
      skin.includes("Dry") ||
      scalp.includes("Dry")
    ) {
      return {
        dosha: "Vata",
        explanation:
          "Vata imbalance causes dryness, brittleness, hair fall, and premature greying.",
      };
    }
    return {
      dosha: "Pitta",
      explanation:
        "Pitta excess generates scalp inflammation, excess oil, and accelerated hair thinning.",
    };
  }

  if (concern.includes("Acne") || skin === "Oily" || stress === "High") {
    return {
      dosha: "Pitta",
      explanation:
        "Pitta imbalance drives inflammation, excess sebum, and bacterial acne breakouts.",
    };
  }
  if (concern.includes("Wrinkles") || skin === "Dry") {
    return {
      dosha: "Vata",
      explanation:
        "Vata imbalance leads to dryness, dehydration, fine lines, and loss of elasticity.",
    };
  }
  return {
    dosha: "Kapha",
    explanation:
      "Kapha imbalance causes dull, congested skin with enlarged pores and uneven tone.",
  };
}

export function classifyCondition(
  answers: ConsultationAnswers,
  flow: FlowType,
): string {
  if (flow === "skin") {
    const concern = answers.skinConcern || "";
    if (concern.includes("Acne")) {
      const type = answers.acneType || "";
      if (type.includes("Whiteheads") || type.includes("Blackheads"))
        return "comedonal acne";
      if (type.includes("Red painful")) return "papular acne";
      if (type.includes("Pus-filled")) return "pustular acne";
      if (type.includes("Deep cysts")) return "nodulocystic acne";
      return "acne";
    }
    if (concern.includes("Pigmentation") || concern.includes("Dark spots")) {
      const pigType = answers.pigmentationType || "";
      const sun = answers.sunExposure || "";
      if (sun.includes("High")) return "sun-induced pigmentation";
      if (pigType.includes("patches")) return "melasma";
      if (pigType.includes("Acne marks"))
        return "post-inflammatory hyperpigmentation";
      return "uneven skin tone";
    }
    if (concern.includes("Dark circles")) {
      const dcType = answers.darkCircleType || "";
      if (dcType.includes("Dark / Pigmented")) return "pigmented dark circles";
      if (dcType.includes("Hollow")) return "hollow dark circles";
      if (dcType.includes("Puffy")) return "vascular dark circles";
      return "dark circles";
    }
    if (concern.includes("Wrinkles") || concern.includes("Ageing")) {
      const ageType = answers.ageingType || "";
      if (ageType.includes("Fine lines")) return "fine lines";
      if (ageType.includes("Deep wrinkles")) return "static wrinkles";
      if (ageType.includes("Sagging")) return "skin laxity";
      return "skin ageing";
    }
    return "";
  }

  // hair flow
  const concern = answers.hairConcern || "";
  if (concern.includes("Hair fall")) {
    const onset = answers.hairFallOnset || "";
    const dandruff = answers.hairFallDandruff || "";
    const family = answers.familyHairHistory || "";
    if (dandruff.includes("Yes")) return "hair fall with dandruff";
    if (onset.includes("Suddenly") || onset.includes("After illness"))
      return "telogen effluvium";
    if (onset.includes("Gradually") && family.includes("Yes"))
      return "androgenetic hair loss";
    return "hair fall";
  }
  if (concern.includes("Dandruff")) {
    const dtype = answers.dandruffType || "";
    if (dtype.toLowerCase().includes("dry white")) return "dry dandruff";
    if (dtype.toLowerCase().includes("oily yellowish")) return "oily dandruff";
    return "dandruff";
  }
  if (concern.includes("Thinning")) {
    const pattern = answers.thinningPattern || "";
    const family = answers.familyHairHistory || "";
    if (family.includes("Yes")) return "early androgenetic thinning";
    if (pattern === "All over") return "diffuse thinning";
    return "hair thinning";
  }
  if (concern.includes("Dry") || concern.toLowerCase().includes("frizzy")) {
    const heat = answers.heatStyling || "";
    const cond = answers.conditioning || "";
    if (heat === "Daily" || cond === "Never") return "frizzy hair";
    return "dry hair";
  }
  if (
    concern.includes("Greying") ||
    concern.toLowerCase().includes("greying")
  ) {
    const age = answers.greyingAge || "";
    const family = answers.greyingFamily || "";
    if (age.includes("Before 20") || age.includes("20–25")) {
      if (family === "Yes") return "genetic premature greying";
      return "stress/nutritional premature greying";
    }
    return "premature greying";
  }
  return "";
}

function buildRootCauses(
  answers: ConsultationAnswers,
  flow: FlowType,
): string[] {
  const causes: string[] = [];
  if (answers.stress === "High" || answers.stress === "Moderate")
    causes.push("Elevated cortisol from chronic stress triggers inflammation");
  if (answers.sleep === "Less than 5 hours")
    causes.push("Sleep deprivation disrupts skin repair and hormonal balance");
  if (answers.hydration === "Less than 1L")
    causes.push("Dehydration impairs toxin elimination and skin cell turnover");
  if (answers.diet === "Oily / Fried foods" || answers.diet === "Sugary foods")
    causes.push(
      "High glycaemic / inflammatory diet aggravates sebum production",
    );
  if (answers.diet === "Dairy-heavy diet")
    causes.push(
      "Dairy consumption linked to hormonal acne in susceptible individuals",
    );
  if (answers.digestion === "Constipation" || answers.digestion === "Bloating")
    causes.push(
      "Poor gut health (Ama accumulation) reflects in skin/hair quality",
    );
  if (flow === "hair" && answers.protein === "Low")
    causes.push("Insufficient protein intake weakens hair shaft structure");
  if (flow === "hair" && answers.oiling === "Never")
    causes.push("Lack of scalp oiling leads to dryness and follicle weakness");

  // Condition-specific root causes
  if (answers.acneTriggers?.includes("Before periods"))
    causes.push("Hormonal fluctuations (likely pre-menstrual)");
  if (answers.acneTriggers?.includes("Certain foods"))
    causes.push("Dietary triggers worsening inflammation");
  if (
    answers.sunExposure === "High (outdoors most of the day)" &&
    (answers.skinConcern?.includes("Pigmentation") ||
      answers.skinConcern?.includes("Wrinkles") ||
      answers.skinConcern?.includes("Ageing"))
  )
    causes.push("Excessive UV exposure accelerating skin damage");
  if (answers.sunscreen === "Rarely / Never")
    causes.push("Lack of sun protection worsening pigmentation and ageing");
  if (answers.screenTime === "More than 5 hours")
    causes.push("High screen time causing eye strain and periorbital stress");
  if (answers.hairFallOnset?.includes("After illness"))
    causes.push("Post-illness recovery affecting the hair growth cycle");
  if (answers.greyingAge?.includes("Before 20"))
    causes.push(
      "Possible nutritional deficiency or genetic predisposition to early greying",
    );

  if (causes.length < 3)
    causes.push(
      "Environmental exposure (pollution, UV, hard water) causing oxidative stress",
    );
  return causes.slice(0, 5);
}

function buildSkinRoutine(answers: ConsultationAnswers): {
  morning: string[];
  night: string[];
} {
  const concern = answers.skinConcern || "";
  const skin = answers.skinType || "Combination";
  const isAcne = concern.includes("Acne");
  const isOily = skin === "Oily";
  const isDry = skin === "Dry";

  const morning = [
    isOily
      ? "Gel-based neem & turmeric face wash"
      : "Gentle cream cleanser with rose water",
    isAcne
      ? "Niacinamide 5% + zinc serum"
      : isDry
        ? "Hyaluronic acid serum"
        : "Vitamin C brightening serum",
    isOily
      ? "Oil-free gel moisturizer with aloe vera"
      : "Light moisturizer with ceramides",
    "Broad-spectrum SPF 50 sunscreen (non-comedogenic)",
  ];
  const night = [
    "Double cleanse: oil cleanser then gentle face wash",
    isAcne
      ? "Salicylic acid 2% toner on affected areas"
      : "Rose water toning mist",
    isAcne
      ? "Benzoyl peroxide 2.5% spot treatment on active pimples"
      : isDry
        ? "Bakuchiol (natural retinol) serum"
        : "Retinol 0.3% cream",
    isDry
      ? "Rich shea butter / Kumkumadi oil night cream"
      : "Oil-free overnight gel mask",
  ];
  return { morning, night };
}

function buildHairRoutine(_answers: ConsultationAnswers): {
  morning: string[];
  night: string[];
} {
  const morning = [
    "Scalp massage with warm coconut or bhringraj oil (5 min)",
    "Wide-tooth comb detangling from tips to roots",
    "Protein-rich breakfast (eggs, nuts, lentils) for hair nourishment",
    "Keep hair loosely tied to reduce mechanical stress",
  ];
  const night = [
    "Apply warm oil (bhringraj / amla) to scalp and leave overnight",
    "Gentle massage using fingertips in circular motion",
    "Braid or wrap hair loosely in silk scarf before sleep",
    "Take ashwagandha or biotin supplement (consult Ayurvedic physician)",
  ];
  return { morning, night };
}

function buildDiet(
  answers: ConsultationAnswers,
  flow: FlowType,
  dosha: string,
): { avoid: string[]; include: string[] } {
  const avoid: string[] = [];
  const include: string[] = [];

  if (dosha === "Pitta") {
    avoid.push(
      "Spicy & fried foods",
      "Alcohol & caffeine",
      "Sour fermented foods",
      "Red meat",
    );
    include.push(
      "Cucumber & coconut water",
      "Mint, coriander & fennel",
      "Sweet fruits (mango, grapes)",
      "Ghee & coconut oil",
    );
  } else if (dosha === "Vata") {
    avoid.push(
      "Raw & cold foods",
      "Carbonated drinks",
      "Crackers & dry snacks",
      "Excess caffeine",
    );
    include.push(
      "Warm soups & stews",
      "Sesame seeds & walnuts",
      "Sweet potatoes & beets",
      "Warm milk with ashwagandha",
    );
  } else {
    avoid.push(
      "Dairy & cold drinks",
      "Heavy sweets & desserts",
      "Deep fried snacks",
      "Excess salt",
    );
    include.push(
      "Bitter greens (kale, fenugreek)",
      "Warm ginger & pepper tea",
      "Light grains (quinoa, millet)",
      "Honey (in moderation)",
    );
  }

  if (flow === "hair" && answers.protein === "Low") {
    include.push("Lentils, legumes & seeds for keratin building");
  }
  return { avoid, include };
}

const WEEKLY_SKIN = [
  { day: "Mon", task: "Double cleanse + clay mask" },
  { day: "Tue", task: "Vitamin C serum + SPF focus" },
  { day: "Wed", task: "Gentle exfoliation (BHA/AHA)" },
  { day: "Thu", task: "Sheet mask + extra hydration" },
  { day: "Fri", task: "Spot treatment & neem pack" },
  { day: "Sat", task: "Multani mitti + rose water mask" },
  { day: "Sun", task: "Rest day: minimal routine, SPF only" },
];

const WEEKLY_HAIR = [
  { day: "Mon", task: "Oil scalp massage (bhringraj)" },
  { day: "Tue", task: "Protein hair mask (egg / curd)" },
  { day: "Wed", task: "Mild shampoo wash" },
  { day: "Thu", task: "Leave-in conditioner treatment" },
  { day: "Fri", task: "Scalp massage with warm oil" },
  { day: "Sat", task: "Deep conditioning mask" },
  { day: "Sun", task: "Rest day: no heat styling" },
];

export function buildResults(
  answers: ConsultationAnswers,
  flow: FlowType,
  scanResult: ScanResult | null,
): ConsultationReport {
  const severity = answers.severity || "Moderate";
  const conditionScore = scoreFromSeverity(severity);
  const { dosha, explanation } = mapDosha(answers, flow);
  const rootCauses = buildRootCauses(answers, flow);

  const primaryConcern =
    answers.skinConcern || answers.hairConcern || "Skin & Hair Health";

  const routines =
    flow === "skin" ? buildSkinRoutine(answers) : buildHairRoutine(answers);
  const { avoid, include } = buildDiet(answers, flow, dosha);

  const classification = classifyCondition(answers, flow);

  const scanNote = scanResult
    ? ` AI scan detected ${scanResult.dominant} as dominant acne type.`
    : "";

  let diagnosis: string;
  if (classification) {
    const rootCauseSummary =
      rootCauses.length > 0
        ? rootCauses[0].toLowerCase()
        : `${dosha} dosha imbalance`;
    diagnosis = `Based on your responses, your condition appears to be ${classification}. This suggests ${rootCauseSummary}.${scanNote} The severity appears ${severity.toLowerCase()} based on your assessment. Ayurvedic intervention combined with a targeted routine can show visible improvement in 6–12 weeks.`;
  } else {
    diagnosis =
      flow === "skin"
        ? `You have ${severity.toLowerCase()} ${primaryConcern.toLowerCase()} with ${dosha} dosha imbalance.${scanNote} Ayurvedic intervention combined with a targeted skincare routine can resolve this in 6–12 weeks.`
        : `You have ${severity.toLowerCase()} ${primaryConcern.toLowerCase()} linked to ${dosha} imbalance. A consistent hair care regimen and dietary changes will show visible improvement in 8–10 weeks.`;
  }

  const lifestyleTips = [
    answers.sleep === "Less than 5 hours"
      ? "Aim for 7–8 hours of sleep — skin regenerates most between 10 PM–2 AM"
      : "Maintain your good sleep schedule; avoid screens 30 min before bed",
    answers.stress === "High"
      ? "Practice 10-minute pranayama (deep breathing) daily to lower cortisol"
      : "Add 20-minute walks daily to improve circulation and reduce stress",
  ];

  return {
    conditionScore,
    primaryConcern,
    severity,
    doshaImbalance: dosha,
    doshaExplanation: explanation,
    diagnosis,
    rootCauses,
    morningRoutine: routines.morning,
    nightRoutine: routines.night,
    lifestyleTips,
    dietAvoid: avoid,
    dietInclude: include,
    weeklyPlan: flow === "skin" ? WEEKLY_SKIN : WEEKLY_HAIR,
    scanResult,
  };
}

export function simulateScan(answers: ConsultationAnswers): ScanResult {
  // Deterministic simulation based on answers
  const concern = answers.skinConcern || "";
  const skin = answers.skinType || "Combination";
  const severity = answers.severity || "Moderate";

  const base = severity === "Mild" ? 20 : severity === "Severe" ? 65 : 42;
  const isOily = skin === "Oily";
  const isAcne = concern.includes("Acne");

  const whitehead = isOily ? base + 10 : base - 5;
  const blackhead = isOily ? base + 15 : base;
  const papule = isAcne ? base + 20 : base - 10;
  const pustule = isAcne && severity !== "Mild" ? base + 15 : base - 15;
  const nodule = severity === "Severe" ? base + 5 : base - 20;

  const scores = {
    whiteheads: whitehead,
    blackheads: blackhead,
    papules: papule,
    pustules: pustule,
    nodules: Math.max(nodule, 5),
  };
  const entries = Object.entries(scores) as [string, number][];
  const dominant = entries.sort((a, b) => b[1] - a[1])[0][0];
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return { ...scores, dominant: capitalize(dominant) };
}
