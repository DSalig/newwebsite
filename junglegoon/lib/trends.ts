// Shared types for Trend Radar — conversational product-trend mining.

export type TrendSample = {
  title: string;
  subreddit: string;
  score: number;
  url: string;
};

export type TrendItem = {
  phrase: string;
  mentions: number; // posts matching this phrase in the window
  totalUpvotes: number;
  velocityPct: number; // week-over-baseline change in mention rate
  subreddits: string[];
  samples: TrendSample[];
  suggestedNicheId?: string; // link into the niche finder when we recognize it
};

export type TrendResponse = {
  source: "reddit-live" | "bundled-demo";
  fetchedAt: string | null; // ISO time for live data, null for bundled
  window: string;
  items: TrendItem[];
  note?: string;
};

/** Subreddits worth mining for FBA-relevant product conversation. */
export const TREND_SUBREDDITS = [
  "BuyItForLife",
  "HomeImprovement",
  "Cooking",
  "castiron",
  "Coffee",
  "Sourdough",
  "dogs",
  "CatAdvice",
  "Pickleball",
  "gardening",
  "birding",
  "boardgames",
  "minipainting",
  "onebag",
  "HaircareScience",
  "NewParents",
] as const;

/**
 * Product-phrase lexicon: two-to-three word phrases we count mentions of.
 * This is deliberately a curated list rather than open NLP — for a personal
 * research tool, high-precision matching on phrases you care about beats
 * noisy noun-phrase extraction. Add phrases here as your watchlist grows.
 */
export const PHRASE_LEXICON: { phrase: string; aliases: string[]; nicheId?: string }[] = [
  { phrase: "cold brew maker", aliases: ["cold brew", "cold brewer"], nicheId: "cold-brew" },
  { phrase: "moka pot", aliases: ["moka"], nicheId: "cold-brew" },
  { phrase: "sourdough starter", aliases: ["starter jar", "levain"], nicheId: "sourdough" },
  { phrase: "banneton basket", aliases: ["banneton", "proofing basket"], nicheId: "sourdough" },
  { phrase: "chainmail scrubber", aliases: ["chain mail scrubber"], nicheId: "cast-iron" },
  { phrase: "carbon steel pan", aliases: ["carbon steel skillet"], nicheId: "cast-iron" },
  { phrase: "compost bin", aliases: ["compost pail", "countertop compost"], nicheId: "compost" },
  { phrase: "packing cubes", aliases: ["compression cubes"], nicheId: "packing" },
  { phrase: "lick mat", aliases: ["licking mat"], nicheId: "dog-enrichment" },
  { phrase: "snuffle mat", aliases: [], nicheId: "dog-enrichment" },
  { phrase: "slow feeder", aliases: ["puzzle feeder"], nicheId: "dog-enrichment" },
  { phrase: "cat shelves", aliases: ["cat wall", "cat perch"], nicheId: "cat-wall" },
  { phrase: "massage gun", aliases: ["percussion massager"], nicheId: "mobility" },
  { phrase: "foam roller", aliases: [], nicheId: "mobility" },
  { phrase: "pickleball paddle", aliases: ["paddle grip"], nicheId: "pickleball" },
  { phrase: "cold plunge", aliases: ["ice bath", "plunge tub"], nicheId: "cold-plunge" },
  { phrase: "go bag", aliases: ["bug out bag", "emergency kit"], nicheId: "emergency" },
  { phrase: "learning tower", aliases: ["montessori tower", "kitchen helper"], nicheId: "montessori" },
  { phrase: "sound machine", aliases: ["white noise machine"], nicheId: "baby-sleep" },
  { phrase: "scalp massager", aliases: ["scalp brush"], nicheId: "scalp-care" },
  { phrase: "rosemary oil", aliases: ["hair oiling"], nicheId: "scalp-care" },
  { phrase: "gua sha", aliases: ["face roller"], nicheId: "face-tools" },
  { phrase: "monitor riser", aliases: ["monitor stand"], nicheId: "desk-ergo" },
  { phrase: "footrest", aliases: ["foot rest"], nicheId: "desk-ergo" },
  { phrase: "cable tray", aliases: ["cable management"], nicheId: "cable-mgmt" },
  { phrase: "visual timer", aliases: ["pomodoro timer", "time timer"], nicheId: "focus-tools" },
  { phrase: "mushroom grow kit", aliases: ["grow bag", "monotub"], nicheId: "mushroom" },
  { phrase: "native plants", aliases: ["wildflower seeds", "native garden"], nicheId: "native-garden" },
  { phrase: "bird feeder camera", aliases: ["smart bird feeder", "camera feeder"], nicheId: "bird-tech" },
  { phrase: "squirrel proof feeder", aliases: ["squirrel baffle"], nicheId: "bird-tech" },
  { phrase: "board game insert", aliases: ["game organizer"], nicheId: "board-game" },
  { phrase: "dice tray", aliases: ["dice tower"], nicheId: "board-game" },
  { phrase: "wet palette", aliases: ["dry palette"], nicheId: "mini-paint" },
  { phrase: "walking pad", aliases: ["under desk treadmill"] },
  { phrase: "sleep earbuds", aliases: ["sleep headphones"] },
  { phrase: "heat pump dryer", aliases: [] },
  { phrase: "electrolyte powder", aliases: ["lmnt", "electrolytes"] },
  { phrase: "blackout curtains", aliases: ["blackout shades"] },
  { phrase: "air quality monitor", aliases: ["co2 monitor"] },
];
