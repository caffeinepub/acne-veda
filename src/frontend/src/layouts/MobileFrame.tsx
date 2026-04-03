import { Outlet } from "@tanstack/react-router";

export function MobileFrame() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[oklch(0.97_0.012_80)]">
      <div className="w-full max-w-sm mx-auto flex flex-col min-h-screen relative overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
