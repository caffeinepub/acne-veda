import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { MobileFrame } from "./layouts/MobileFrame";
import { AdminPage } from "./pages/AdminPage";
import { AntiAgeingPage } from "./pages/AntiAgeingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GlowingSkinPage } from "./pages/GlowingSkinPage";
import { LoginPage } from "./pages/LoginPage";
import { ScanPage } from "./pages/ScanPage";
import { SignupPage } from "./pages/SignupPage";
import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";

// Layout with nav header — used for content pages
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="flex items-center shrink-0"
            data-ocid="nav.home_link"
          >
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda – Clear Skin Naturally"
              className="h-10 sm:h-12 w-auto object-contain max-w-[100px] sm:max-w-[160px]"
            />
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/scan"
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              data-ocid="nav.scan_tab"
            >
              <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Analyse Skin</span>
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
      <Toaster />
    </div>
  );
}

// Layout without nav header — used for splash, welcome, login, dashboard (full-screen mobile designs)
function NoHeaderLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

// Root route — bare shell, no layout
const rootRoute = createRootRoute({ component: Outlet });

// No-header layout route (splash, welcome, login, signup, dashboard)
const noHeaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "no-header",
  component: NoHeaderLayout,
});

// Splash screen at "/" (home)
const homeRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/",
  component: SplashScreen,
});

// Auth & dashboard routes — directly under no-header (no MobileFrame wrapper)
const loginRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/signup",
  component: SignupPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/dashboard",
  component: DashboardPage,
});

// Mobile app routes inside MobileFrame, parented under no-header
const mobileRootRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  id: "mobile",
  component: MobileFrame,
});
const welcomeRoute = createRoute({
  getParentRoute: () => mobileRootRoute,
  path: "/welcome",
  component: WelcomeScreen,
});

// Header layout route (content pages)
const headerRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "header",
  component: RootLayout,
});
const scanRoute = createRoute({
  getParentRoute: () => headerRoute,
  path: "/scan",
  component: ScanPage,
});
const antiAgeingRoute = createRoute({
  getParentRoute: () => headerRoute,
  path: "/anti-ageing",
  component: AntiAgeingPage,
});
const glowingSkinRoute = createRoute({
  getParentRoute: () => headerRoute,
  path: "/glowing-skin",
  component: GlowingSkinPage,
});
const adminRoute = createRoute({
  getParentRoute: () => headerRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  noHeaderRoute.addChildren([
    homeRoute,
    loginRoute,
    signupRoute,
    dashboardRoute,
    mobileRootRoute.addChildren([welcomeRoute]),
  ]),
  headerRoute.addChildren([
    scanRoute,
    antiAgeingRoute,
    glowingSkinRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
