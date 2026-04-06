import { Progress } from "@/components/ui/progress";
import { Camera, Flame, TrendingDown, TrendingUp, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProgressTab() {
  const [streak, setStreak] = useState<number>(() => {
    const stored = localStorage.getItem("acneveda_streak");
    return stored ? Number.parseInt(stored, 10) : 0;
  });

  const [beforeImg, setBeforeImg] = useState<string | null>(() => {
    return localStorage.getItem("acneveda_before_img");
  });

  const [afterImg, setAfterImg] = useState<string | null>(() => {
    return localStorage.getItem("acneveda_after_img");
  });

  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const addStreakDay = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("acneveda_streak", String(newStreak));
    toast.success(`🔥 ${newStreak} day streak! Keep it up!`);
  };

  const resetStreak = () => {
    setStreak(0);
    localStorage.setItem("acneveda_streak", "0");
    toast("Streak reset");
  };

  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setBeforeImg(result);
      localStorage.setItem("acneveda_before_img", result);
      toast.success("Before photo saved!");
    };
    reader.readAsDataURL(file);
  };

  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAfterImg(result);
      localStorage.setItem("acneveda_after_img", result);
      toast.success("After photo saved!");
    };
    reader.readAsDataURL(file);
  };

  const weekNum = Math.min(Math.floor(streak / 7) + 1, 12);
  const weekProgress = ((weekNum - 1) / 11) * 100;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "#F0F7FF", paddingBottom: "88px" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4"
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-white/80 text-sm mb-0.5">Track your journey</p>
          <h1
            className="text-white text-xl font-bold"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
            }}
          >
            Progress Tracker
          </h1>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-ocid="progress.card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6" style={{ color: "#FB923C" }} />
              <div>
                <p className="text-white font-bold text-2xl leading-none">
                  {streak}
                </p>
                <p className="text-white/70 text-xs">day streak</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="progress.primary_button"
                onClick={addStreakDay}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                + Add Day
              </button>
              <button
                type="button"
                data-ocid="progress.secondary_button"
                onClick={resetStreak}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Treatment Journey Progress */}
        <motion.div
          className="rounded-2xl p-4"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="font-bold text-sm"
              style={{
                color: "#1E293B",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Treatment Journey
            </p>
            <span
              className="text-xs font-semibold"
              style={{ color: "#3B82F6" }}
            >
              Week {weekNum} of 12
            </span>
          </div>
          <Progress
            value={weekProgress}
            className="h-2"
            style={{ background: "#E2E8F0" }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              Week 1
            </span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              Week 12
            </span>
          </div>
        </motion.div>

        {/* Before / After Comparison */}
        <motion.div
          className="rounded-2xl p-4"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="font-bold text-sm mb-3"
            style={{
              color: "#1E293B",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Before &amp; After
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Before */}
            <div className="flex flex-col gap-2">
              <p
                className="text-xs font-semibold text-center"
                style={{ color: "#64748B" }}
              >
                Before
              </p>
              <button
                type="button"
                data-ocid="progress.upload_button"
                onClick={() => beforeRef.current?.click()}
                className="relative w-full h-28 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98] overflow-hidden"
                style={{
                  background: beforeImg ? "transparent" : "#F0F7FF",
                  border: beforeImg ? "none" : "2px dashed #BFDBFE",
                }}
              >
                {beforeImg ? (
                  <img
                    src={beforeImg}
                    alt="Before"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <Camera className="w-6 h-6" style={{ color: "#93C5FD" }} />
                    <span className="text-xs" style={{ color: "#93C5FD" }}>
                      Add photo
                    </span>
                  </>
                )}
              </button>
              <input
                ref={beforeRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBeforeUpload}
              />
            </div>

            {/* After */}
            <div className="flex flex-col gap-2">
              <p
                className="text-xs font-semibold text-center"
                style={{ color: "#64748B" }}
              >
                After
              </p>
              <button
                type="button"
                data-ocid="progress.upload_button"
                onClick={() => afterRef.current?.click()}
                className="relative w-full h-28 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98] overflow-hidden"
                style={{
                  background: afterImg ? "transparent" : "#F0F7FF",
                  border: afterImg ? "none" : "2px dashed #BFDBFE",
                }}
              >
                {afterImg ? (
                  <img
                    src={afterImg}
                    alt="After"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <Camera className="w-6 h-6" style={{ color: "#93C5FD" }} />
                    <span className="text-xs" style={{ color: "#93C5FD" }}>
                      Add photo
                    </span>
                  </>
                )}
              </button>
              <input
                ref={afterRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAfterUpload}
              />
            </div>
          </div>
        </motion.div>

        {/* Improvement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p
            className="font-bold text-sm mb-3"
            style={{
              color: "#1E293B",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Improvement Stats
          </p>
          <div className="grid grid-cols-3 gap-3">
            {/* Acne Reduction */}
            <div
              className="rounded-2xl p-3 flex flex-col items-center gap-1.5"
              style={{
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              data-ocid="progress.item.1"
            >
              <TrendingDown className="w-5 h-5" style={{ color: "#10B981" }} />
              <p className="text-xl font-bold" style={{ color: "#10B981" }}>
                42%
              </p>
              <p
                className="text-center text-xs leading-tight"
                style={{ color: "#64748B" }}
              >
                Acne Reduction
              </p>
            </div>

            {/* Active Breakouts */}
            <div
              className="rounded-2xl p-3 flex flex-col items-center gap-1.5"
              style={{
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              data-ocid="progress.item.2"
            >
              <TrendingDown className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <p className="text-xl font-bold" style={{ color: "#F59E0B" }}>
                3
              </p>
              <p
                className="text-center text-xs leading-tight"
                style={{ color: "#64748B" }}
              >
                Active Breakouts
              </p>
            </div>

            {/* Oil Level */}
            <div
              className="rounded-2xl p-3 flex flex-col items-center gap-1.5"
              style={{
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              data-ocid="progress.item.3"
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#3B82F6" }} />
              <p
                className="text-xl font-bold leading-tight"
                style={{ color: "#3B82F6" }}
              >
                Mod
              </p>
              <p
                className="text-center text-xs leading-tight"
                style={{ color: "#64748B" }}
              >
                Oil Level ↓
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
