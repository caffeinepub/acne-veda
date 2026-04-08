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
    if (
      pending === "chat" ||
      pending === "home" ||
      pending === "products" ||
      pending === "profile"
    ) {
      return pending as Tab;
    }
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

  // Sync URL param when tab changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", activeTab);
      window.history.replaceState(null, "", url.toString());
    }
  }, [activeTab]);

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
        background: "#FAF7F2",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Main content area */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
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
          background: "#FFFFFF",
          borderTop: "1px solid #E8E0D6",
          boxShadow: "0 -4px 20px rgba(74,104,76,0.08)",
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
                aria-label={tab.label}
              >
                <div
                  className="w-10 h-6 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: isActive
                      ? "oklch(0.94 0.04 146)"
                      : "transparent",
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: isActive ? "oklch(0.48 0.14 146)" : "#A89880",
                    }}
                  />
                </div>
                <span
                  className="font-medium transition-colors"
                  style={{
                    color: isActive ? "oklch(0.48 0.14 146)" : "#A89880",
                    fontSize: "10px",
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
