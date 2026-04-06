# Acne Veda – App Entry Logic & Navigation

## Current State
- `/` (SplashScreen): Auto-redirects to `/welcome` after 2.4s, regardless of login state
- `/welcome`: Shows welcome screen (WelcomeScreen)
- `/login` and `/signup`: Auth pages
- `/dashboard`: Shows legacy assessment dashboard (DashboardPage) — separate from main app
- `/main`: Main app interface with bottom nav (Home, Chat, Progress, Profile) via MainAppPage
- The `MainAppPage` bottom nav has tabs: Home, Chat, Progress, Profile
- Session: `localStorage.getItem('acneveda_user')` stores the username
- Assessment completion tracked via backend `hasHistory()` call
- No smart routing logic exists — all users always go through welcome→login flow

## Requested Changes (Diff)

### Add
- **Entry logic in SplashScreen**: After splash animation, check `localStorage` for session
  - If logged in: go directly to `/main`
  - If not logged in: go to `/welcome`
- **Assessment completion check in HomeTab**: On mount, call `hasHistory()` for the current user. If `false`, show a popup/modal prompting them to complete the assessment.
- **Post-assessment redirect to `/main`**: After completing the full assessment+recommendation flow, route to `/main` instead of `/dashboard`
- **Post-login/signup redirect to assessment flow**: New users after signup should go to `/assessment/step1`, not `/dashboard`
- **Login redirect**: After login, check `hasHistory()` — if completed, go to `/main`; if not, go to `/assessment/step1`
- **Bottom nav tab rename**: Change "Progress" tab to "Products" to match request (4 tabs: Home, Chat, Products, Profile)

### Modify
- **SplashScreen**: Add session check before redirect
- **LoginPage**: After successful login, check history and route accordingly (`/main` vs `/assessment/step1`)
- **SignupPage**: After successful signup, redirect to `/assessment/step1` (not `/dashboard`)
- **AcneChatPage**: Final "Go to My Routine" button should navigate to `/main`
- **MainAppPage**: Rename "Progress" tab to "Products", swap `ProgressTab` for a products-focused tab
- **HomeTab**: Add assessment-incomplete popup modal

### Remove
- The old `/dashboard` route is now redundant as entry point (keep it for backward compat but it should redirect to `/main` if logged in)

## Implementation Plan
1. Update `SplashScreen.tsx`: check localStorage session, route to `/main` if logged in, else `/welcome`
2. Update `LoginPage.tsx`: after login success, call `hasHistory()`, navigate to `/main` if has history, else `/assessment/step1`
3. Update `SignupPage.tsx`: after signup success, redirect to `/assessment/step1` instead of `/dashboard`
4. Update `AcneChatPage.tsx`: change final CTA navigation from wherever it goes to `/main`
5. Update `MainAppPage.tsx`: rename "Progress" tab to "Products", wire a ProductsTab
6. Create `ProductsTab.tsx`: product recommendations screen
7. Update `HomeTab.tsx`: add assessment-incomplete popup — on mount check `hasHistory()`, show sticky modal if `false`
8. Update `DashboardPage.tsx`: redirect to `/main` if already logged in
