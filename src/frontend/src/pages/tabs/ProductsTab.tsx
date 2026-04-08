import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";

const products = [
  {
    id: "wash",
    name: "Triphala Cleanser",
    benefit: "Gentle herbal cleanse",
    description: "Balances all doshas, removes impurities without stripping.",
    img: "/assets/generated/acne-facewash.dim_400x400.png",
    rating: 4.8,
    reviews: 312,
  },
  {
    id: "serum",
    name: "Neem Oil Serum",
    benefit: "Controls excess sebum",
    description: "Neem + turmeric blend targets bacteria and reduces oil.",
    img: "/assets/generated/acne-serum.dim_400x400.png",
    rating: 4.7,
    reviews: 241,
  },
  {
    id: "spot",
    name: "Spot Corrector",
    benefit: "Targeted acne healing",
    description: "Fast-acting Ayurvedic formula for active breakouts.",
    img: "/assets/generated/acne-spot-treatment.dim_400x400.png",
    rating: 4.9,
    reviews: 188,
  },
  {
    id: "moist",
    name: "Hydra Moisturizer",
    benefit: "Non-comedogenic hydration",
    description: "Lightweight, won't clog pores. Suitable for acne-prone skin.",
    img: "/assets/generated/acne-moisturizer.dim_400x400.png",
    rating: 4.6,
    reviews: 275,
  },
];

const GREEN = "oklch(0.52 0.18 145)";

export function ProductsTab() {
  const navigate = useNavigate();

  return (
    <div
      className="h-full overflow-y-auto pb-20"
      style={{ background: "oklch(0.97 0.012 80)" }}
    >
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "oklch(0.52 0.18 145 / 0.06)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-5 h-5" style={{ color: GREEN }} />
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "oklch(0.22 0.07 140)",
              }}
            >
              Acne Kit
            </h1>
          </div>
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.52 0.04 60)",
            }}
          >
            Recommended for your skin type
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2 mt-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {[
            "🌿 100% Ayurvedic",
            "✅ Dermatologist Approved",
            "🚫 No Chemicals",
          ].map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.52 0.18 145 / 0.12)",
                color: "oklch(0.38 0.14 145)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="px-4 pt-2">
        {/* Hero image */}
        <motion.div
          className="w-full rounded-2xl overflow-hidden mb-4"
          style={{ height: "140px", border: "1px solid oklch(0.9 0.02 80)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src="/assets/generated/ayurvedic-products-hero.dim_800x400.jpg"
            alt="Ayurvedic Skincare Kit"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              data-ocid={`products.item.${i + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "oklch(1 0 0)",
                boxShadow: "0 2px 12px oklch(0.55 0.14 145 / 0.08)",
                border: "1px solid oklch(0.9 0.02 80)",
              }}
            >
              <div
                className="relative w-full aspect-square"
                style={{ background: "oklch(0.52 0.18 145 / 0.04)" }}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  <Star
                    className="w-2.5 h-2.5"
                    style={{
                      color: "oklch(0.65 0.2 70)",
                      fill: "oklch(0.65 0.2 70)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.42 0.14 70)", fontSize: "10px" }}
                  >
                    {product.rating}
                  </span>
                </div>
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <p
                    className="font-semibold text-sm leading-snug"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.22 0.07 140)",
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: "oklch(0.55 0.04 60)",
                    }}
                  >
                    {product.benefit}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`products.item.${i + 1}`}
                  className="mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: "oklch(0.52 0.18 145 / 0.1)",
                    color: GREEN,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    border: "1px solid oklch(0.52 0.18 145 / 0.25)",
                  }}
                >
                  View Product
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-5 mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="button"
            data-ocid="products.primary_button"
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: GREEN,
              color: "#fff",
              boxShadow: "0 6px 24px oklch(0.52 0.18 145 / 0.35)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Buy Full Kit →
          </button>
          <p
            className="text-center text-xs mt-2"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: "oklch(0.6 0.04 60)",
            }}
          >
            Free shipping on orders above ₹599
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            type="button"
            data-ocid="products.secondary_button"
            className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{
              color: GREEN,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
            onClick={() => navigate({ to: "/assessment/step1" })}
          >
            Retake Assessment for Updated Recommendations
          </button>
        </motion.div>

        <p
          className="text-center text-xs pb-4"
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
    </div>
  );
}
