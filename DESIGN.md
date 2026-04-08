# Acne Veda — Design System

**App:** Ayurvedic skincare & haircare analysis platform by Dr. Akash Hari (BAMS)  
**Tagline:** Clear Skin Naturally  
**Version:** 45

---

## Visual Direction

**Tone:** Premium Ayurvedic wellness meets modern dermatology. Medical credibility grounded in traditional Indian healing. No generic wellness clichés.  
**Mood:** Calm, trustworthy, natural, inviting.  
**Differentiation:** Sage green logo + sunset orange accents. Chat-first AI consultation flow. Emphasis on holistic diagnosis blending science + Ayurvedic dosha mapping.

---

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Purpose |
|:------|:-----------|:----------|:--------|
| **Background** | 0.98 0.008 76 | 0.16 0.04 48 | Page base; soft cream |
| **Foreground** | 0.22 0.05 48 | 0.93 0.012 76 | Text; dark charcoal / light cream |
| **Card** | 0.995 0.002 0 | 0.22 0.04 48 | Elevated surfaces; pure white / slate |
| **Primary** | 0.58 0.14 146 | 0.62 0.15 146 | Sage green; CTAs, accents |
| **Secondary** | 0.68 0.18 35 | 0.72 0.18 35 | Sunset orange; highlights, warmth |
| **Accent** | 0.65 0.16 42 | 0.68 0.16 42 | Terracotta; callouts, emphasis |
| **Muted** | 0.94 0.012 76 | 0.28 0.03 48 | Disabled, secondary text |
| **Border** | 0.90 0.015 76 | 0.35 0.03 48 | Dividers, form outlines |
| **Destructive** | 0.577 0.245 27.325 | 0.704 0.191 22.216 | Error states, warnings |

---

## Typography

| Layer | Font | Weights | Scale |
|:------|:-----|:--------|:------|
| Display | Playfair Display (serif) | 400, 700 | h1: 32–40px; h2: 24–28px; h3: 18–22px |
| Body | DM Sans (sans) | 400, 500, 700 | text: 14–16px; button: 14px; small: 12px |

---

## Structural Zones

| Zone | Background | Border | Shadow | Notes |
|:-----|:-----------|:-------|:-------|:------|
| Header | `bg-card` | `border-b border-border` | `shadow-subtle` | Dr. Akash Hari (BAMS) credit visible |
| Content | `bg-background` | None | None | Main canvas; cream base |
| Card/Section | `bg-card` | `border border-border` | `shadow-elevated` | Elevated; used for assessments, results, chat |
| Footer / Nav | `bg-card` | `border-t border-border` | `shadow-elevated` | Bottom nav for mobile; 4 tabs |
| Chat Bubble (User) | `bg-primary` | None | `shadow-subtle` | Sage green, right-aligned |
| Chat Bubble (Doctor) | `bg-card` | `border border-border` | `shadow-subtle` | Light card, left-aligned |
| Button (Primary) | `bg-primary text-primary-foreground` | None | None | Sage green; rounded-lg |
| Button (Secondary) | `bg-secondary text-secondary-foreground` | None | None | Sunset orange; rounded-lg |
| Form Input | `bg-input border border-input` | `border border-border` | None | Light grey/cream input; focus ring sage |

---

## Component Patterns

- **Buttons:** Rounded corners (0.75rem); no shadows; hover: opacity 0.9; active: slight scale down
- **Cards:** `rounded-lg`; `shadow-elevated`; `bg-card`; 16px padding
- **Input Fields:** `rounded-sm` (smaller radius); `bg-input`; `border border-border`; focus ring sage green
- **Progress Bar:** Sage green fill; subtle animation
- **Chat Bubbles:** User (sage bg, right), Doctor (card bg, left); soft radius; typed animation
- **Badge:** `bg-secondary/10` text `text-secondary`; `rounded-full`; 6px padding

---

## Motion & Animation

- **Entrance:** 200ms fade-in + slide-up for modals, cards
- **Transitions:** 300ms ease-out for all interactive state changes
- **Chat Typing:** 400ms per character for natural rhythm
- **Progress Indicators:** Smooth fill animation; no bounce

---

## Spacing & Rhythm

- **Base Unit:** 4px grid
- **Padding:** 12px (sm), 16px (md), 24px (lg), 32px (xl)
- **Gaps:** Cards 16px; sections 24px; page 32px
- **Mobile-First:** Breakpoints at 640px (sm), 1024px (md)

---

## Branding Elements

- **Logo:** Custom green lotus with Ayurvedic aesthetic
- **Tagline:** "Clear Skin Naturally" — visible on splash & welcome
- **Credit Line:** "Made by Dr.Akash Hari (BAMS)" — in header (except e-prescriptions)
- **Emoji Usage:** Real characters (🌿, 📸, 💇, 🔥, 💧, 🧘) — never Unicode escapes

---

## Signature Detail

**AI Consultation Chat Interface:** Doctor avatar on left (professional, warm tones), user messages right (sage green bubble). Progress step counter at top. One question at a time. Multiple-choice buttons. Smooth typing animation. Builds trust through conversational familiarity.

---

## Constraints

- No gradient backgrounds; use layered opacity + color instead
- No neon or glow effects; keep shadows subtle and realistic
- Border radius: only 0, 0.5rem, 0.75rem, full
- Max 3 colors per page (primary + secondary + accent)
- Emoji only as accent; never as primary identifier
- Mobile-first layout; responsive breakpoints clear
