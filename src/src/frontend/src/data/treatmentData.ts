export type ConditionType =
  | "whitehead"
  | "blackhead"
  | "papule"
  | "pustule"
  | "nodular";

export interface Medicine {
  name: string;
  dosage: string;
  purpose: string;
  type: "kashayam" | "churnam" | "tablet";
}

export interface Lepa {
  name: string;
  ingredients: string;
  howToUse: string;
  skinTypeNote?: string;
}

export interface TreatmentPlan {
  internalMedicines: Medicine[];
  externalLepas: Lepa[];
  cleansingRoutine: {
    herbalWash: string;
    morning: string;
    evening: string;
    avoid: string;
  };
  diet: {
    include: string[];
    avoid: string[];
  };
  disclaimer: string;
}

export const INTERNAL_MEDICINES: Medicine[] = [
  {
    name: "Varunadi Kashayam",
    dosage: "15–20 ml twice daily before meals",
    purpose: "Reduces Kapha, clears skin, anti-inflammatory",
    type: "kashayam",
  },
  {
    name: "Nimbadi Kashayam",
    dosage: "15–20 ml twice daily before meals",
    purpose: "Anti-bacterial, purifies blood, treats acne and skin infections",
    type: "kashayam",
  },
  {
    name: "Avipattikara Churnam",
    dosage: "1–2 tsp with warm water at night",
    purpose:
      "Relieves excess Pitta, improves digestion, reduces acne flare-ups",
    type: "churnam",
  },
  {
    name: "Guduchi (Tinospora cordifolia) Tablet",
    dosage: "500mg, 2–3 times/day",
    purpose: "Immunity booster, reduces inflammation",
    type: "tablet",
  },
];

const LEPA_TRIPHALA: Lepa = {
  name: "Triphala Lepa",
  ingredients: "Triphala churna + rose water/honey",
  howToUse:
    "Apply 15–20 min, 2–3 times/week. Lightens scars and evens skin tone.",
};

const LEPA_NEEM_TURMERIC: Lepa = {
  name: "Neem & Turmeric Paste",
  ingredients: "Neem powder + turmeric + water",
  howToUse:
    "Apply for 15–20 min. Anti-bacterial, reduces pustules and active breakouts.",
};

const LEPA_MULTANI: Lepa = {
  name: "Multani Mitti Pack",
  ingredients: "Multani mitti + rose water + few drops of tea tree oil",
  howToUse: "Apply for 15 min, 2x/week. Absorbs excess oil, clears blackheads.",
};

const LEPA_SANDALWOOD: Lepa = {
  name: "Sandalwood & Rosewater Lepa",
  ingredients: "Sandalwood powder + rose water",
  howToUse:
    "Apply for 15–20 min. Reduces inflammation, redness, and soothes irritated skin.",
};

const LEPA_PAPAYA: Lepa = {
  name: "Papaya & Honey Pack",
  ingredients: "Ripe papaya mashed + honey",
  howToUse:
    "Apply for 15 min, 2x/week. Gently exfoliates, reduces whiteheads and brightens skin.",
};

const LEPA_ELADI: Lepa = {
  name: "Eladi Churnam Lepa",
  ingredients: "Eladi Churnam + coconut milk or buttermilk",
  howToUse:
    "Mix Eladi Churnam with coconut milk or buttermilk to form a smooth paste. Apply directly on papules and wash off after 15 minutes. Reduces inflammation and soothes active papules.",
};

const LEPA_KOLAKULATHADI: Lepa = {
  name: "Kolakulathadi Choornam + Yava Churnam Lepa",
  ingredients: "Kolakulathadi Choornam + Yava Churnam (equal parts)",
  howToUse:
    "Mix both powders and apply to the face. Leave on for 15–20 minutes, then wash off with lukewarm water. Controls excess oil secretion and clears papules.",
  skinTypeNote: "For Oily Skin",
};

const LEPA_DASHANGA: Lepa = {
  name: "Dashanga Lepa",
  ingredients: "Dashanga churnam + water or rose water",
  howToUse:
    "Apply as a paste for 20 minutes, then wash off. Anti-inflammatory, effective for deep nodules.",
};

const LEPA_KHADIRADI: Lepa = {
  name: "Khadiradi Lepa",
  ingredients: "Khadira + turmeric + ghee base",
  howToUse:
    "Apply for 15 minutes, then wash off with lukewarm water. Reduces deep inflammation and soothes nodular acne.",
};

const CLEANSING_ROUTINE = {
  herbalWash:
    "Wash face with Triphala Kashayam (cooled decoction) — use as a gentle herbal face wash 1–2 times daily. Anti-inflammatory, antibacterial, and helps clear acne lesions naturally.",
  morning: "Lukewarm water + mild Ayurvedic cleanser (Neem or Tulsi based)",
  evening:
    "Cleanse to remove sweat/oil using Triphala or Aloe vera-based cleanser",
  avoid: "Soaps with high SLS or alcohol content",
};

const DIET = {
  include: [
    "Fresh vegetables & fruits — especially bitter gourd, cucumber, papaya, pomegranate",
    "Whole grains — brown rice, millets",
    "Legumes in moderation",
    "Plenty of warm water throughout the day",
    "Green tea or herbal teas (Triphala, Neem, Guduchi)",
  ],
  avoid: [
    "Deep-fried foods and oily snacks",
    "Excess sugar and dairy (especially cheese, whole milk)",
    "Processed foods and fast food",
    "Spicy, hot, and sour foods — especially if you have pustules or inflamed acne",
  ],
};

const DISCLAIMER =
  "Dosage may vary based on age, weight, and Prakriti (constitution). Consult an Ayurvedic physician before starting any treatment.";

export const TREATMENT_BY_CONDITION: Record<ConditionType, TreatmentPlan> = {
  whitehead: {
    internalMedicines: INTERNAL_MEDICINES,
    externalLepas: [LEPA_PAPAYA, LEPA_TRIPHALA],
    cleansingRoutine: CLEANSING_ROUTINE,
    diet: DIET,
    disclaimer: DISCLAIMER,
  },
  blackhead: {
    internalMedicines: INTERNAL_MEDICINES,
    externalLepas: [LEPA_MULTANI, LEPA_TRIPHALA],
    cleansingRoutine: CLEANSING_ROUTINE,
    diet: DIET,
    disclaimer: DISCLAIMER,
  },
  papule: {
    internalMedicines: INTERNAL_MEDICINES,
    externalLepas: [LEPA_ELADI, LEPA_KOLAKULATHADI],
    cleansingRoutine: CLEANSING_ROUTINE,
    diet: DIET,
    disclaimer: DISCLAIMER,
  },
  pustule: {
    internalMedicines: INTERNAL_MEDICINES,
    externalLepas: [LEPA_NEEM_TURMERIC, LEPA_SANDALWOOD, LEPA_TRIPHALA],
    cleansingRoutine: CLEANSING_ROUTINE,
    diet: DIET,
    disclaimer: DISCLAIMER,
  },
  nodular: {
    internalMedicines: INTERNAL_MEDICINES,
    externalLepas: [LEPA_DASHANGA, LEPA_KHADIRADI],
    cleansingRoutine: CLEANSING_ROUTINE,
    diet: DIET,
    disclaimer: DISCLAIMER,
  },
};

export const CONDITION_INFO: Record<
  ConditionType,
  { label: string; description: string; color: string }
> = {
  whitehead: {
    label: "Whitehead",
    description:
      "Closed comedones — clogged pores covered by a thin layer of skin, appearing as small white or flesh-colored bumps.",
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  blackhead: {
    label: "Blackhead",
    description:
      "Open comedones — oxidized melanin and sebum in open pores gives the characteristic dark appearance.",
    color: "bg-stone-100 text-stone-800 border-stone-300",
  },
  papule: {
    label: "Papule",
    description:
      "Inflamed, raised bumps without pus. Pink or red, tender to touch — indicates active inflammation.",
    color: "bg-rose-50 text-rose-800 border-rose-200",
  },
  pustule: {
    label: "Pustule",
    description:
      "Inflamed pimples containing pus — yellow or white center with red base. Require careful treatment.",
    color: "bg-red-50 text-red-800 border-red-200",
  },
  nodular: {
    label: "Nodular Acne",
    description:
      "Deep, solid, painful lumps beneath the skin — large inflamed lesions requiring intensive Ayurvedic care.",
    color: "bg-purple-50 text-purple-800 border-purple-200",
  },
};

export function getStoredTreatments(): Record<ConditionType, TreatmentPlan> {
  try {
    const raw = localStorage.getItem("acneveda_treatments");
    if (!raw) return TREATMENT_BY_CONDITION;
    const stored = JSON.parse(raw) as Partial<
      Record<ConditionType, TreatmentPlan>
    >;
    return {
      ...TREATMENT_BY_CONDITION,
      ...stored,
    };
  } catch {
    return TREATMENT_BY_CONDITION;
  }
}

export function saveTreatments(
  data: Record<ConditionType, TreatmentPlan>,
): void {
  localStorage.setItem("acneveda_treatments", JSON.stringify(data));
}
