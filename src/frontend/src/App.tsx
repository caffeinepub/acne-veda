import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminPage } from "./pages/AdminPage";
import { ChatConsultationPage } from "./pages/ChatConsultationPage";
import { LoginPage } from "./pages/LoginPage";
import { MainAppPage } from "./pages/MainAppPage";
import { SignupPage } from "./pages/SignupPage";
import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { Step1BasicInfo } from "./pages/assessment/Step1BasicInfo";

// Layout without nav header — used for all mobile-first screens
function NoHeaderLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({ component: Outlet });

const noHeaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "no-header",
  component: NoHeaderLayout,
});

// Root / splash screen
const homeRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/",
  component: SplashScreen,
});

const welcomeRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/welcome",
  component: WelcomeScreen,
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

// Full-screen AI chat consultation (first-time flow, no tabs)
const chatRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/chat",
  component: ChatConsultationPage,
});

const mainAppRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/main",
  component: MainAppPage,
});

const adminRoute = createRoute({
  getParentRoute: () => noHeaderRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  noHeaderRoute.addChildren([
    homeRoute,
    welcomeRoute,
    loginRoute,
    signupRoute,
    assessmentStep1Route,
    chatRoute,
    mainAppRoute,
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
