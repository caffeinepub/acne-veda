import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Edit2,
  FileText,
  Globe,
  LogOut,
  Moon,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type AssessmentResults = {
  acneType?: string;
  skinType?: string;
  phase?: string;
};

const GREEN = "oklch(0.52 0.18 145)";

export function ProfileTab() {
  const navigate = useNavigate();
  const username =
    localStorage.getItem("acneveda_user") ??
    sessionStorage.getItem("username") ??
    "User";
  const rawResults = sessionStorage.getItem("acnevedaResults");
  const results: AssessmentResults = rawResults ? JSON.parse(rawResults) : {};

  const acneType = results.acneType ?? "Inflammatory Acne";
  const skinType = results.skinType ?? "Combination";

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("acneveda_user");
    sessionStorage.clear();
    navigate({ to: "/login" });
  };

  const listItems = [
    {
      id: "orders",
      icon: ShoppingBag,
      label: "My Orders",
      color: GREEN,
      bgColor: "oklch(0.52 0.18 145 / 0.1)",
      onClick: () =>
        toast("No orders yet", {
          description: "Your orders will appear here once you purchase a kit.",
        }),
    },
    {
      id: "saved",
      icon: Bookmark,
      label: "Saved Products",
      color: "oklch(0.55 0.18 160)",
      bgColor: "oklch(0.55 0.18 160 / 0.1)",
      onClick: () =>
        toast("No saved products yet", {
          description: "Tap the bookmark icon on any product to save it.",
        }),
    },
    {
      id: "disclaimer",
      icon: FileText,
      label: "Medical Disclaimer",
      color: "oklch(0.6 0.18 70)",
      bgColor: "oklch(0.6 0.18 70 / 0.1)",
      onClick: () => setShowDisclaimer(true),
    },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "oklch(0.97 0.012 80)", paddingBottom: "88px" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-6 pb-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.18 145) 0%, oklch(0.42 0.14 160) 100%)",
        }}
      >
        <h1
          className="text-white text-xl font-bold mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Profile
        </h1>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
          >
            {initial}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg leading-tight">
              {username}
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              {skinType} Skin · {acneType}
            </p>
            <p className="text-white/60 text-xs">Dr. Vaidya AI Patient</p>
          </div>
          <button
            type="button"
            data-ocid="profile.edit_button"
            onClick={() =>
              toast("Coming soon", {
                description: "Profile editing will be available soon.",
              })
            }
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
            aria-label="Edit profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      <div className="px-4 -mt-4 flex flex-col gap-4">
        {/* Settings Card */}
        <motion.div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(1 0 0)",
            boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.08)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p
            className="font-bold text-xs uppercase tracking-wider mb-3"
            style={{
              color: "oklch(0.6 0.04 60)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Settings
          </p>

          <div
            className="flex items-center justify-between py-2.5 border-b"
            style={{ borderColor: "oklch(0.93 0.015 80)" }}
          >
            <div className="flex items-center gap-3">
              <Bell
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.04 60)" }}
              />
              <Label
                htmlFor="notifications"
                className="text-sm font-medium cursor-pointer"
                style={{
                  color: "oklch(0.28 0.07 140)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Notifications
              </Label>
            </div>
            <Switch
              id="notifications"
              data-ocid="profile.switch"
              checked={notificationsOn}
              onCheckedChange={setNotificationsOn}
            />
          </div>

          <div
            className="flex items-center justify-between py-2.5 border-b"
            style={{ borderColor: "oklch(0.93 0.015 80)" }}
          >
            <div className="flex items-center gap-3">
              <Moon
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.04 60)" }}
              />
              <Label
                htmlFor="darkmode"
                className="text-sm font-medium cursor-pointer"
                style={{
                  color: "oklch(0.28 0.07 140)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Dark Mode
              </Label>
            </div>
            <Switch
              id="darkmode"
              data-ocid="profile.switch"
              checked={darkModeOn}
              onCheckedChange={setDarkModeOn}
            />
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <Globe
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.04 60)" }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: "oklch(0.28 0.07 140)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Language
              </span>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                data-ocid="profile.select"
                className="w-28 h-8 text-xs rounded-xl border-none"
                style={{
                  background: "oklch(0.52 0.18 145 / 0.08)",
                  color: GREEN,
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* List Sections */}
        <motion.div
          className="rounded-2xl"
          style={{
            background: "oklch(1 0 0)",
            boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.08)",
            border: "1px solid oklch(0.9 0.02 80)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {listItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              data-ocid={`profile.item.${idx + 1}`}
              onClick={item.onClick}
              className="flex items-center gap-3 w-full px-4 py-3.5 transition-all"
              style={{
                borderBottom:
                  idx < listItems.length - 1
                    ? "1px solid oklch(0.93 0.015 80)"
                    : "none",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: item.bgColor }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span
                className="flex-1 text-sm font-medium text-left"
                style={{
                  color: "oklch(0.28 0.07 140)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {item.label}
              </span>
              <ChevronRight
                className="w-4 h-4"
                style={{ color: "oklch(0.75 0.04 60)" }}
              />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          type="button"
          data-ocid="profile.delete_button"
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: "oklch(0.62 0.22 25 / 0.08)",
            color: "oklch(0.55 0.22 25)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            border: "1px solid oklch(0.62 0.22 25 / 0.2)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>

        <p
          className="text-center text-xs pb-2"
          style={{ color: "oklch(0.6 0.04 60)" }}
        >
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: GREEN }}
          >
            caffeine.ai
          </a>
        </p>
      </div>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent
          data-ocid="profile.dialog"
          className="max-w-sm rounded-3xl"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "oklch(0.22 0.07 140)" }}>
              Medical Disclaimer
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-left space-y-3 pt-2">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.45 0.04 60)" }}
                >
                  This application is intended for informational and assistive
                  purposes only. The recommendations generated by this app are
                  not a substitute for professional medical advice, diagnosis,
                  or treatment.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.45 0.04 60)" }}
                >
                  Always consult a qualified Ayurvedic physician or healthcare
                  provider before starting any regimen. The developers of this
                  application do not assume any responsibility for the accuracy,
                  completeness, or outcomes of the generated recommendations.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.45 0.04 60)" }}
                >
                  Use of this app does not establish a doctor–patient
                  relationship. Any reliance on the information provided is
                  strictly at your own risk.
                </p>
                <button
                  type="button"
                  data-ocid="profile.close_button"
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-all active:scale-[0.98]"
                  style={{ background: GREEN, color: "#fff" }}
                >
                  I Understand
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
