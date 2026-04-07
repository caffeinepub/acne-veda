# Acne Veda – Beauty & Wellness AI Consultation System

## Current State
- App has `/splash`, `/welcome`, `/login`, `/signup`, `/dashboard`, `/assessment/step1-3`, `/skin-concerns`, `/acne-chat`, `/main` (4-tab interface), `/scan`, `/admin`, `/anti-ageing`, `/glowing-skin`
- Step3Chat currently only lets users pick Skin/Hair/Both then redirects to `/skin-concerns` (Skin) or `/scan` (Hair)
- `/skin-concerns` shows a grid of concern cards, clicking Acne goes to `/acne-chat` (7-step acne-specific chat)
- Backend has: registerUser, login, addAssessmentHistory, hasHistory — but **the generated bindings (backend.did.js, backend.d.ts, declarations) are EMPTY** which causes IC0537 canister errors
- The `src/src/backend/main.mo` is an empty actor `actor {}` — this is the file actually compiled
- The `src/backend/main.mo` has real logic but is NOT the one being compiled

## Requested Changes (Diff)

### Add
- New route `/consultation` — full conversational AI advisor (Skin + Hair flows)
- `ConsultationPage.tsx` — implements the entire SKIN and HAIR consultation engine
  - Entry: "What would you like to focus on today?" → Skin / Hair
  - SKIN flow: 10 steps with smart branching based on concern
  - HAIR flow: 11 steps with smart branching
  - Analysis engine: condition score (0-100), root causes, Ayurvedic dosha mapping
  - Final report screen: condition summary, severity, root cause analysis, daily routine, lifestyle fix, diet suggestions, weekly care plan, future-ready product section placeholder
- Fix backend: copy real backend logic from `src/backend/main.mo` into `src/src/backend/main.mo` (the one that gets compiled) and add `saveConsultationResult` and `getConsultationResults` methods
- Regenerate backend bindings to match the actual Motoko code
- Add `/consultation` route to `App.tsx`
- Add navigation to consultation from `Step3Chat.tsx` — "Hair" option goes to `/consultation` (pre-seeded to Hair flow); a new `/consultation` entry in the main app Chat tab

### Modify
- `Step3Chat.tsx`: "Hair" button navigates to `/consultation?flow=hair` instead of `/scan`
- `ChatTab.tsx`: add a button/shortcut to start a new consultation at `/consultation`
- `src/src/backend/main.mo`: replace empty actor with full backend logic including consultation storage

### Remove
- Nothing removed; existing pages preserved

## Implementation Plan
1. Fix `src/src/backend/main.mo` — copy full user auth logic + add consultation result storage
2. Regenerate `backend.d.ts`, `backend.did.js`, `backend.did.d.ts` to expose all backend methods
3. Create `src/frontend/src/pages/ConsultationPage.tsx` — full multi-step chat UI with branching logic, analysis engine, and report screen
4. Register `/consultation` route in `App.tsx`
5. Update `Step3Chat.tsx` to route Hair to `/consultation?flow=hair`
6. Update `ChatTab.tsx` to include a "Start New Consultation" CTA linking to `/consultation`
