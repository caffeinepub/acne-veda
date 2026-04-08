import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MobileFrame } from "./layouts/MobileFrame";
import { AdminPage } from "./pages/AdminPage";
import { AntiAgeingPage } from "./pages/AntiAgeingPage";
import { ChatPage } from "./pages/ChatPage";
import { GlowingSkinPage } from "./pages/GlowingSkinPage";
import { LoginPage } from "./pages/LoginPage";
import { MainAppPage } from "./pages/MainAppPage";
import { SignupPage } from "./pages/SignupPage";
import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { Step1BasicInfo } from "./pages/assessment/Step1BasicInfo";

function NoHeaderLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

function HeaderLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center shrink-0"
            data-ocid="nav.home_link"
          >
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda – Clear Skin Naturally"
              className="h-10 sm:h-12 w-auto object-contain max-w-[100px] sm:max-w-[160px]"
            />
          </a>
          <span
            className="text-xs font-medium"
            style={{ color: "oklch(0.55 0.04 60)" }}
          >
            Made by Dr. Akash Hari (BAMS)
          </span>
        </div>
      </header>
      <Outlet />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Outlet });

const noHeaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "no-header",
  component: NoHeaderLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/",
  component: SplashScreen,
});

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

const assessmentStep1Route = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/assessment/step1",
  component: Step1BasicInfo,
});

const mainAppRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/main",
  component: MainAppPage,
});

const chatPageRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/chat",
  component: ChatPage,
});

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

const headerRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "header",
  component: HeaderLayout,
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
    assessmentStep1Route,
    mainAppRoute,
    chatPageRoute,
    mobileRootRoute.addChildren([welcomeRoute]),
  ]),
  headerRoute.addChildren([antiAgeingRoute, glowingSkinRoute, adminRoute]),
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
