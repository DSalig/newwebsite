import { makeRng, makeSeries } from "./rand";
import { NICHES } from "./niches";

export type Keyword = {
  phrase: string;
  nicheId: string;
  nicheName: string;
  volume: number; // monthly searches
  trendPct: number; // 12-month change
  volumeSeries: number[];
  competingProducts: number;
  ppcBid: number; // suggested exact-match bid, $
  difficulty: number; // 1-100
};

const PREFIXES = ["", "best ", "", ""];
const SUFFIX_VARIANTS = ["", " for beginners", " small", " set", " amazon", " reviews", " large", " kit"];

function buildKeywords(): Keyword[] {
  const out: Keyword[] = [];
  for (const niche of NICHES) {
    const rng = makeRng(`keywords:${niche.id}`);
    const variants = new Set<string>();
    for (const seed of niche.seeds) {
      variants.add(seed);
      while (variants.size < niche.seeds.indexOf(seed) * 3 + 3) {
        variants.add((rng.pick(PREFIXES) + seed + rng.pick(SUFFIX_VARIANTS)).trim());
      }
    }
    let rank = 0;
    for (const phrase of variants) {
      const isHead = niche.seeds.includes(phrase);
      const volume = Math.round(
        (niche.searchVolume / (isHead ? 3 : 9 + rank * 2)) * (0.7 + rng.next() * 0.6)
      );
      const trendPct = Math.round(niche.volumeTrendPct + rng.gaussish() * 12);
      out.push({
        phrase,
        nicheId: niche.id,
        nicheName: niche.name,
        volume,
        trendPct,
        volumeSeries: makeSeries(rng, 12, volume, trendPct),
        competingProducts: Math.round((300 + niche.avgReviews * (isHead ? 2.2 : 0.9)) * (0.6 + rng.next() * 0.8)),
        ppcBid: Math.round((0.35 + (niche.avgPrice / 40) * (0.5 + rng.next())) * 100) / 100,
        difficulty: Math.min(100, Math.max(5, Math.round(niche.scores.competition * (isHead ? 1.1 : 0.75) + rng.gaussish() * 8))),
      });
      rank++;
    }
  }
  return out.sort((a, b) => b.volume - a.volume);
}

export const KEYWORDS: Keyword[] = buildKeywords();
