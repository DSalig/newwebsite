// Opportunity scoring — the JungleScout-style demand vs. competition read.

export type NicheScores = {
  demand: number; // 0-100
  competition: number; // 0-100 (higher = harder)
  opportunity: number; // 1-10
};

export type NicheRawStats = {
  searchVolume: number; // monthly, exact-ish
  estTopSellerSales: number; // units/mo of the #1 product
  avgReviews: number;
  topBrandShare: number; // 0-1, revenue share of the biggest brand
  entrenchedSellers: number; // sellers with 1000+ reviews in the top 10
};

export function computeNicheScores(raw: NicheRawStats): NicheScores {
  // Demand: log-scaled blend of search volume and top-seller velocity.
  const volScore = Math.min(1, Math.log10(Math.max(10, raw.searchVolume)) / 5.7); // 500k ≈ 1.0
  const salesScore = Math.min(1, Math.log10(Math.max(10, raw.estTopSellerSales)) / 3.7); // 5k/mo ≈ 1.0
  const demand = Math.round((volScore * 0.55 + salesScore * 0.45) * 100);

  // Competition: review moat + brand concentration + entrenched seller count.
  const reviewScore = Math.min(1, Math.log10(Math.max(10, raw.avgReviews)) / 4); // 10k ≈ 1.0
  const shareScore = Math.min(1, raw.topBrandShare / 0.6);
  const entrenchedScore = Math.min(1, raw.entrenchedSellers / 8);
  const competition = Math.round(
    (reviewScore * 0.5 + shareScore * 0.25 + entrenchedScore * 0.25) * 100
  );

  // Opportunity: demand you can actually get at.
  const ratio = demand / Math.max(20, competition);
  const opportunity = Math.max(1, Math.min(10, Math.round(ratio * 4.5)));
  return { demand, competition, opportunity };
}

export function opportunityLabel(score: number): "High" | "Medium" | "Low" {
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

/** Listing Quality Score 1-10 from listing attributes. */
export function listingQuality(input: {
  titleLength: number;
  imageCount: number;
  bulletCount: number;
  hasAPlus: boolean;
  rating: number;
}): number {
  let s = 0;
  s += Math.min(2, input.titleLength / 80); // fuller titles up to ~160 chars
  s += Math.min(3, (input.imageCount / 7) * 3);
  s += Math.min(2, (input.bulletCount / 5) * 2);
  s += input.hasAPlus ? 1.5 : 0;
  s += Math.min(1.5, ((input.rating - 3) / 2) * 1.5);
  return Math.max(1, Math.min(10, Math.round(s)));
}
