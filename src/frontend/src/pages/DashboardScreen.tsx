import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  ClipboardList,
  HeartHandshake,
  Leaf,
  ScanLine,
  User,
} from "lucide-react";
import { motion } from "motion/react";

const recentAssessments = [
  {
    name: "Priya Sharma",
    condition: "Papular Acne",
    date: "Today, 10:30 AM",
    initials: "PS",
    color: "oklch(0.65 0.12 35)",
  },
  {
    name: "Arjun Menon",
    condition: "Blackheads (Grade II)",
    date: "Yesterday, 3:15 PM",
    initials: "AM",
    color: "oklch(0.55 0.14 145)",
  },
  {
    name: "Kavya Nair",
    condition: "Pustular Acne",
    date: "Apr 1, 11:00 AM",
    initials: "KN",
    color: "oklch(0.6 0.12 260)",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.97_0.012_80)] overflow-hidden">
      {/* Header */}
      <motion.div
        className="px-5 pt-10 pb-5"
        style={{ background: "oklch(0.97 0.012 80)" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-0.5"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.14 145)",
                letterSpacing: "0.12em",
              }}
            >
              Acne Veda
            </p>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
            >
              {getGreeting()}, Doctor &#x1F33F;
            </h1>
            <p
              className="text-sm mt-1"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.5 0.05 60)",
              }}
            >
              What would you like to do today?
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.55 0.14 145 / 0.12)",
            }}
          >
            <User
              className="w-5 h-5"
              style={{ color: "oklch(0.45 0.12 145)" }}
            />
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Stats row */}
        <motion.div
          className="flex gap-2.5 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {[
            { icon: ClipboardList, label: "Assessments", value: "24" },
            { icon: BarChart3, label: "Conditions", value: "5" },
            { icon: Leaf, label: "Natural", value: "100%" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              data-ocid={`dashboard.card.${i + 1}`}
              className="flex-1 rounded-2xl p-3 flex flex-col gap-1"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 1px 6px -1px oklch(0.55 0.14 145 / 0.1)",
              }}
            >
              <stat.icon
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.14 145)" }}
              />
              <p
                className="text-lg font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.25 0.07 140)",
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs leading-none"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.55 0.04 60)",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Action cards */}
        <div className="flex flex-col gap-3.5 mb-6">
          {/* New Assessment card */}
          <motion.div
            data-ocid="dashboard.panel"
            className="rounded-3xl overflow-hidden"
            style={{
              background: "oklch(1 0 0)",
              boxShadow:
                "0 4px 24px -4px oklch(0.65 0.2 35 / 0.16), 0 1px 6px -1px oklch(0.65 0.2 35 / 0.08)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "oklch(0.65 0.2 35 / 0.12)" }}
                >
                  <ScanLine
                    className="w-5 h-5"
                    style={{ color: "oklch(0.62 0.2 35)" }}
                  />
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "oklch(0.65 0.2 35 / 0.1)",
                    color: "oklch(0.58 0.18 35)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Recommended
                </span>
              </div>
              <h2
                className="text-lg font-bold mb-1.5"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.22 0.07 50)",
                }}
              >
                New Assessment
              </h2>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.5 0.05 60)",
                }}
              >
                Analyse skin condition &amp; get personalised Ayurvedic
                treatment
              </p>
              <button
                type="button"
                data-ocid="dashboard.primary_button"
                onClick={() => navigate({ to: "/scan" })}
                className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: "oklch(0.65 0.2 35)",
                  boxShadow: "0 3px 16px -2px oklch(0.65 0.2 35 / 0.3)",
                }}
              >
                Start Scan
              </button>
            </div>
          </motion.div>

          {/* Follow-Up card */}
          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "oklch(1 0 0)",
              boxShadow:
                "0 4px 24px -4px oklch(0.55 0.14 145 / 0.14), 0 1px 6px -1px oklch(0.55 0.14 145 / 0.07)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "oklch(0.55 0.14 145 / 0.12)" }}
                >
                  <HeartHandshake
                    className="w-5 h-5"
                    style={{ color: "oklch(0.48 0.14 145)" }}
                  />
                </div>
              </div>
              <h2
                className="text-lg font-bold mb-1.5"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.22 0.07 140)",
                }}
              >
                Follow-Up
              </h2>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: "oklch(0.5 0.05 60)",
                }}
              >
                Review a previous patient&apos;s treatment progress
              </p>
              <button
                type="button"
                data-ocid="dashboard.edit_button"
                onClick={() => navigate({ to: "/scan" })}
                className="w-full py-3 rounded-full font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: "oklch(0.55 0.14 145)",
                  color: "oklch(0.97 0 0)",
                  boxShadow: "0 3px 16px -2px oklch(0.55 0.14 145 / 0.28)",
                }}
              >
                View Follow-Up
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent assessments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-base font-bold"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.25 0.07 140)",
              }}
            >
              Recent Assessments
            </h3>
            <button
              type="button"
              data-ocid="dashboard.link"
              className="text-xs font-medium"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: "oklch(0.55 0.14 145)",
              }}
            >
              View all
            </button>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            data-ocid="dashboard.list"
            style={{
              background: "oklch(1 0 0)",
              boxShadow: "0 1px 8px -2px oklch(0.55 0.14 145 / 0.08)",
            }}
          >
            {recentAssessments.map((item, index) => (
              <motion.div
                key={item.name}
                data-ocid={`dashboard.item.${index + 1}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[oklch(0.97_0.012_80)]"
                style={{
                  borderBottom:
                    index < recentAssessments.length - 1
                      ? "1px solid oklch(0.93 0.01 80)"
                      : "none",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.36 + index * 0.07 }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: item.color }}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.25 0.06 60)",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.55 0.04 60)",
                    }}
                  >
                    {item.condition}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Calendar
                    className="w-3 h-3"
                    style={{ color: "oklch(0.65 0.04 60)" }}
                  />
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.62 0.04 60)",
                    }}
                  >
                    {item.date}
                  </p>
                </div>
                <ChevronRight
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.72 0.04 60)" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Return to full website */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <Link
            to="/"
            data-ocid="dashboard.link"
            className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.1 145)",
            }}
          >
            &larr; Return to full website
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
