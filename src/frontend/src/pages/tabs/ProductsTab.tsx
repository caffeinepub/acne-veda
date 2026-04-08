import { useNavigate } from "@tanstack/react-router";
import { Leaf, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";

type Product = {
  id: string;
  name: string;
  benefit: string;
  description: string;
  img: string;
  rating: number;
  reviews: number;
  category: "skin" | "hair";
};

const PRODUCTS: Product[] = [
  {
    id: "wash",
    name: "Triphala Cleanser",
    benefit: "Gentle herbal cleanse",
    description:
      "Balances all doshas, removes impurities without stripping skin barrier.",
    img: "/assets/generated/acne-facewash.dim_400x400.png",
    rating: 4.8,
    reviews: 312,
    category: "skin",
  },
  {
    id: "serum",
    name: "Neem Oil Serum",
    benefit: "Controls excess sebum",
    description:
      "Neem + turmeric blend targets bacteria and reduces inflammation.",
    img: "/assets/generated/acne-serum.dim_400x400.png",
    rating: 4.7,
    reviews: 241,
    category: "skin",
  },
  {
    id: "spot",
    name: "Spot Corrector",
    benefit: "Targeted acne healing",
    description:
      "Fast-acting Ayurvedic formula for active breakouts and blemishes.",
    img: "/assets/generated/acne-spot-treatment.dim_400x400.png",
    rating: 4.9,
    reviews: 188,
    category: "skin",
  },
  {
    id: "moist",
    name: "Hydra Moisturizer",
    benefit: "Non-comedogenic hydration",
    description:
      "Lightweight, won't clog pores. Suitable for all acne-prone skin types.",
    img: "/assets/generated/acne-moisturizer.dim_400x400.png",
    rating: 4.6,
    reviews: 275,
    category: "skin",
  },
  {
    id: "hairoil",
    name: "Bhringraj Hair Oil",
    benefit: "Reduces hair fall",
    description:
      "Ancient Ayurvedic formula with Bhringraj, Amla, and Brahmi for strong roots.",
    img: "/assets/generated/acne-serum.dim_400x400.png",
    rating: 4.8,
    reviews: 420,
    category: "hair",
  },
  {
    id: "shampoo",
    name: "Neem Herbal Shampoo",
    benefit: "Clears dandruff naturally",
    description:
      "Neem + tea tree oil anti-dandruff shampoo for healthy scalp balance.",
    img: "/assets/generated/acne-facewash.dim_400x400.png",
    rating: 4.6,
    reviews: 197,
    category: "hair",
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      data-ocid={`products.item.${index + 1}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 12px rgba(74,104,76,0.08)",
        border: "1px solid #E8E0D6",
      }}
    >
      <div
        className="relative w-full aspect-square"
        style={{ background: "#EAF2EA" }}
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
            style={{ color: "#E8832A", fill: "#E8832A" }}
          />
          <span
            className="text-xs font-semibold"
            style={{ color: "#8B4513", fontSize: "10px" }}
          >
            {product.rating}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p
            className="font-semibold text-sm leading-snug"
            style={{ color: "#3D2C1E" }}
          >
            {product.name}
          </p>
          <p
            className="text-xs mt-0.5 leading-relaxed"
            style={{ color: "#7A6652" }}
          >
            {product.benefit}
          </p>
        </div>
        <button
          type="button"
          data-ocid={`products.detail.${index + 1}`}
          className="mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
          style={{
            background: "#EAF4EA",
            color: "oklch(0.42 0.14 146)",
            border: "1px solid #C4DCC4",
          }}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export function ProductsTab() {
  const navigate = useNavigate();

  const skinProducts = PRODUCTS.filter((p) => p.category === "skin");
  const hairProducts = PRODUCTS.filter((p) => p.category === "hair");

  return (
    <div
      className="h-full overflow-y-auto pb-20"
      style={{ background: "#FAF7F2" }}
    >
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{
          background: "linear-gradient(160deg, #EAF2EA 0%, #FAF7F2 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Leaf
              className="w-5 h-5"
              style={{ color: "oklch(0.52 0.14 146)" }}
            />
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#3D2C1E",
              }}
            >
              Recommended Products
            </h1>
          </div>
          <p className="text-sm" style={{ color: "#A89880" }}>
            Personalized for your skin & hair type
          </p>
        </motion.div>

        {/* Trust badges */}
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
              style={{ background: "#EAF4EA", color: "oklch(0.38 0.14 146)" }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="px-4 pt-3">
        {/* Skin Care section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-3"
        >
          <div
            className="h-5 w-1 rounded-full"
            style={{ background: "oklch(0.52 0.14 146)" }}
          />
          <h2
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: "#3D2C1E" }}
          >
            Skin Care
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {skinProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Hair Care section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-3"
        >
          <div
            className="h-5 w-1 rounded-full"
            style={{ background: "#E8832A" }}
          />
          <h2
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: "#3D2C1E" }}
          >
            Hair Care
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {hairProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={skinProducts.length + i}
            />
          ))}
        </div>

        {/* Full Kit CTA */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="button"
            data-ocid="products.primary_button"
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "oklch(0.52 0.14 146)",
              color: "#fff",
              boxShadow: "0 6px 24px oklch(0.52 0.14 146 / 0.3)",
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Buy Full Kit →
          </button>

          <p className="text-center text-xs mt-2" style={{ color: "#B0A090" }}>
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
            style={{ color: "oklch(0.48 0.14 146)" }}
            onClick={() => navigate({ to: "/assessment/step1" })}
          >
            Retake Assessment for Updated Recommendations
          </button>
        </motion.div>

        <p className="text-center text-xs pb-6" style={{ color: "#C8BDB0" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "oklch(0.52 0.14 146)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
