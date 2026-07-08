// BSR → estimated monthly unit sales, per category.
//
// Modeled as a power-law curve (sales = a * BSR^-k), the same shape the
// commercial tools (JungleScout, Helium 10) fit to their sample data. The
// coefficients here are hand-tuned to publicly discussed reference points
// (e.g. BSR ~100 in Home & Kitchen ≈ 2-3k units/mo) — good enough for
// relative comparisons, not gospel.

export type CategoryCurve = { a: number; k: number };

export const CATEGORIES = [
  "Home & Kitchen",
  "Pet Supplies",
  "Sports & Outdoors",
  "Baby",
  "Beauty & Personal Care",
  "Office Products",
  "Patio, Lawn & Garden",
  "Toys & Games",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_CURVES: Record<Category, CategoryCurve> = {
  "Home & Kitchen": { a: 185000, k: 0.92 },
  "Pet Supplies": { a: 95000, k: 0.9 },
  "Sports & Outdoors": { a: 110000, k: 0.9 },
  Baby: { a: 60000, k: 0.88 },
  "Beauty & Personal Care": { a: 140000, k: 0.93 },
  "Office Products": { a: 70000, k: 0.88 },
  "Patio, Lawn & Garden": { a: 65000, k: 0.87 },
  "Toys & Games": { a: 120000, k: 0.9 },
};

export function estimateMonthlySales(category: Category, bsr: number): number {
  if (!Number.isFinite(bsr) || bsr < 1) return 0;
  const { a, k } = CATEGORY_CURVES[category];
  return Math.max(0, Math.round(a * Math.pow(bsr, -k)));
}

/** Sample points for drawing the category curve (log-spaced BSR 1 → 200k). */
export function curveSamples(category: Category, points = 60): { bsr: number; sales: number }[] {
  const out: { bsr: number; sales: number }[] = [];
  const logMin = Math.log10(1);
  const logMax = Math.log10(200000);
  for (let i = 0; i < points; i++) {
    const bsr = Math.round(Math.pow(10, logMin + ((logMax - logMin) * i) / (points - 1)));
    out.push({ bsr, sales: estimateMonthlySales(category, bsr) });
  }
  return out;
}
