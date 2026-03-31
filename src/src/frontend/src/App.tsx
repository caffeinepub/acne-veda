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
import { AdminPage } from "./pages/AdminPage";
import { AntiAgeingPage } from "./pages/AntiAgeingPage";
import { GlowingSkinPage } from "./pages/GlowingSkinPage";
import { HomePage } from "./pages/HomePage";
import { ScanPage } from "./pages/ScanPage";

// Layout with nav
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
              to="/"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              data-ocid="nav.home_tab"
            >
              Home
            </Link>
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

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: ScanPage,
});
const antiAgeingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anti-ageing",
  component: AntiAgeingPage,
});
const glowingSkinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/glowing-skin",
  component: GlowingSkinPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  scanRoute,
  antiAgeingRoute,
  glowingSkinRoute,
  adminRoute,
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
