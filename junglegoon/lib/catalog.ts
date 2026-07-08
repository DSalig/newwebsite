import { Category, estimateMonthlySales } from "./estimator";
import { listingQuality } from "./scoring";
import { makeRng, makeSeries, Rng } from "./rand";
import { NICHES, Niche } from "./niches";

export type SellerType = "FBA" | "FBM" | "AMZ";

export type Product = {
  asin: string;
  title: string;
  brand: string;
  category: Category;
  nicheId: string;
  nicheName: string;
  price: number;
  bsr: number;
  rating: number;
  reviews: number;
  sellerType: SellerType;
  estMonthlySales: number;
  estMonthlyRevenue: number;
  lqs: number; // listing quality score 1-10
  weightLb: number;
  monthsOnMarket: number;
  salesSeries: number[]; // trailing 12 months, units
};

const BRAND_A = ["Nor", "Vel", "Kes", "Or", "Lum", "Bry", "Hal", "Mar", "Zen", "Fen", "Cas", "Til", "Rov", "Ald", "Pin"];
const BRAND_B = ["dic", "va", "ler", "ra", "to", "wick", "den", "mor", "shi", "gu", "col", "bar", "ver", "na", "dle"];
const BRAND_C = ["", "", "", " Co", " Labs", " Goods", " Home", " Works"];

const MODIFIERS = ["Premium", "Heavy-Duty", "Compact", "Large", "Foldable", "Stainless Steel", "Bamboo", "Silicone", "Adjustable", "Portable", "Pro", "Upgraded"];
const SUFFIXES = ["", "", " — 2 Pack", " with Storage Case", " for Home & Travel", ", Dishwasher Safe", " with E-Guide", ", Gift Ready"];

function makeBrand(rng: Rng): string {
  return rng.pick(BRAND_A) + rng.pick(BRAND_B) + rng.pick(BRAND_C);
}

function makeAsin(rng: Rng): string {
  const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "B0";
  for (let i = 0; i < 8; i++) s += chars[rng.int(0, chars.length - 1)];
  return s;
}

function buildProduct(niche: Niche, idx: number): Product {
  const rng = makeRng(`product:${niche.id}:${idx}`);
  const brand = makeBrand(rng);
  const noun = niche.productNouns[idx % niche.productNouns.length];
  const title = `${brand} ${rng.pick(MODIFIERS)} ${noun}${rng.pick(SUFFIXES)}`;

  // Rank within the niche: earlier products are the incumbents.
  const rankFactor = (idx + 1) / 9; // 0.11 .. 1.0
  const bsr = Math.max(
    40,
    Math.round(Math.pow(10, 2.2 + rankFactor * 2.6) * (0.6 + rng.next() * 0.8))
  );
  const price = Math.max(7.99, Math.round(niche.avgPrice * (0.7 + rng.next() * 0.7) * 100) / 100);
  const reviews = Math.max(
    3,
    Math.round(niche.avgReviews * (1.6 - rankFactor) * (0.5 + rng.next()))
  );
  const rating = Math.min(5, Math.max(3.1, 4.7 - rankFactor * 0.5 + rng.gaussish() * 0.25));
  const estMonthlySales = estimateMonthlySales(niche.category, bsr);
  const monthsOnMarket = rng.int(3, 60);

  return {
    asin: makeAsin(rng),
    title,
    brand,
    category: niche.category,
    nicheId: niche.id,
    nicheName: niche.name,
    price,
    bsr,
    rating: Math.round(rating * 10) / 10,
    reviews,
    sellerType: rng.next() < 0.78 ? "FBA" : rng.next() < 0.85 ? "FBM" : "AMZ",
    estMonthlySales,
    estMonthlyRevenue: Math.round(estMonthlySales * price),
    lqs: listingQuality({
      titleLength: title.length,
      imageCount: rng.int(3, 9),
      bulletCount: rng.int(3, 5),
      hasAPlus: rng.next() < 0.5,
      rating,
    }),
    weightLb: Math.round((0.2 + rng.next() * 4) * 10) / 10,
    monthsOnMarket,
    salesSeries: makeSeries(rng, 12, estMonthlySales, niche.volumeTrendPct * 0.7, 0.18),
  };
}

export const PRODUCTS: Product[] = NICHES.flatMap((niche) =>
  Array.from({ length: 8 }, (_, i) => buildProduct(niche, i))
);

export function productByAsin(asin: string): Product | undefined {
  return PRODUCTS.find((p) => p.asin === asin);
}
