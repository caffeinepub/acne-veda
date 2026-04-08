import { Home, MessageCircle, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChatTab } from "./tabs/ChatTab";
import { HomeTab } from "./tabs/HomeTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { ProfileTab } from "./tabs/ProfileTab";

type Tab = "home" | "chat" | "products" | "profile";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: User },
];

function getInitialTab(): Tab {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (
      tabParam === "chat" ||
      tabParam === "home" ||
      tabParam === "products" ||
      tabParam === "profile"
    ) {
      return tabParam as Tab;
    }
    const pending = sessionStorage.getItem("acneveda_pending_tab");
    if (pending === "chat") return "chat";
  }
  return "home";
}

export function MainAppPage() {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("acneveda_pending_tab");
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "chat":
        return <ChatTab />;
      case "products":
        return <ProductsTab />;
      case "profile":
        return <ProfileTab />;
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative mx-auto"
      style={{
        maxWidth: "430px",
        background: "oklch(0.97 0.012 80)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div
        className="flex-1 overflow-hidden relative"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          maxWidth: "430px",
          background: "oklch(1 0 0)",
          borderTop: "1px solid oklch(0.9 0.02 80)",
          boxShadow: "0 -4px 16px oklch(0.55 0.14 145 / 0.08)",
          height: "64px",
          zIndex: 50,
        }}
      >
        <div className="flex h-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-ocid={`nav.${tab.id}_tab`}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90"
              >
                <div
                  className="w-9 h-6 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: isActive
                      ? "oklch(0.52 0.18 145 / 0.1)"
                      : "transparent",
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: isActive
                        ? "oklch(0.52 0.18 145)"
                        : "oklch(0.65 0.04 60)",
                    }}
                  />
                </div>
                <span
                  className="font-medium transition-colors"
                  style={{
                    color: isActive
                      ? "oklch(0.52 0.18 145)"
                      : "oklch(0.65 0.04 60)",
                    fontSize: "10px",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
