# Acne Veda – AI Skincare Chat Flow

## Current State

The app has a 3-step assessment flow:
- Step1BasicInfo: user fills name, age, sex, occupation
- Step2Analyzing: AI loading animation
- Step3Chat: Dr. Vaidya asks if concern is Skin, Hair, or Both → navigates to `/scan`

The `/scan` page is the existing TensorFlow.js-based image scanner with Ayurvedic results.

The `DashboardPage` has "New Assessment" button → navigates to `/assessment/step1`.

## Requested Changes (Diff)

### Add
- `/skin-concerns` page: Grid of 6 selectable cards (Acne highlighted as primary with glow + "Most Common" tag, Pigmentation, Dark Spots, Dark Circles, Wrinkles/Aging, Healthy Skin). Each card has title + subtitle. Clicking Acne navigates to `/acne-chat`.
- `/acne-chat` page: Full chat-based UI flow with Dr. Vaidya AI. 7-step conversation:
  1. Where do you get acne? (6 options)
  2. What type of acne? (5 options)
  3. Severity? (Mild/Moderate/Severe)
  4. Skin type? (5 options)
  5. Lifestyle triggers? (multi-select, 7 options)
  6. How long? (4 options)
  7. AI Scan: take photo / upload from gallery, photo tips, scan animation (3D mesh overlay), detection output (5 acne types with confidence), then full results screen (diagnosis, causes, treatment plan, product recommendations)
- Progress indicator (Step 1–7) across the chat flow
- Canvas-based animated 3D mesh overlay scanning effect (blue/teal glowing polygonal grid)
- AI detection output showing Whiteheads, Blackheads, Papules, Pustules, Nodules with confidence indicators
- Final results page: Diagnosis, Causes, Treatment Plan (morning/night routine), Recommended Acne Kit (4 product cards)
- Product images generated: face wash, serum, spot treatment, moisturizer
- Trust badge strip: "AI + Dermatology Analysis", "More accurate with photo scan", "Used by thousands of users"

### Modify
- Step3Chat: When user clicks "Skin", navigate to `/skin-concerns` instead of `/scan`
- App.tsx: Add routes for `/skin-concerns` and `/acne-chat`

### Remove
- Nothing removed

## Implementation Plan

1. Generate 4 product images (face wash, serum, spot treatment, moisturizer) with AI image gen
2. Create `SkinConcernsPage.tsx` – grid of 6 concern cards, Acne highlighted with glow + tag
3. Create `AcneChatPage.tsx` – multi-step chat flow (Steps 1–6 with chat bubble UI, progress bar)
4. Create `AcneScanStep.tsx` inside AcneChatPage – Step 7 with camera/upload, scan animation, detection output
5. Create `AcneResultsPage.tsx` – final results with diagnosis, causes, treatment, product kit
6. Update Step3Chat to route "Skin" → `/skin-concerns`
7. Register all new routes in App.tsx
