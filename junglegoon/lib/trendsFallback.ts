import { TrendResponse } from "./trends";

// Bundled snapshot used when live Reddit fetching is unavailable (offline,
// blocked network, or rate-limited). Shaped identically to the live payload
// so the UI doesn't care which one it got.
export const FALLBACK_TRENDS: TrendResponse = {
  source: "bundled-demo",
  fetchedAt: null,
  window: "past week (snapshot)",
  note: "Live Reddit fetch unavailable — showing the bundled demo snapshot.",
  items: [
    {
      phrase: "bird feeder camera",
      mentions: 41,
      totalUpvotes: 18234,
      velocityPct: 62,
      subreddits: ["birding", "gardening", "BuyItForLife"],
      suggestedNicheId: "bird-tech",
      samples: [
        { title: "My camera feeder finally caught the pileated woodpecker", subreddit: "birding", score: 4102, url: "https://www.reddit.com/r/birding" },
        { title: "Which smart bird feeder actually lasts more than a season?", subreddit: "BuyItForLife", score: 1287, url: "https://www.reddit.com/r/BuyItForLife" },
      ],
    },
    {
      phrase: "cold plunge",
      mentions: 38,
      totalUpvotes: 15660,
      velocityPct: 44,
      subreddits: ["BuyItForLife", "HomeImprovement"],
      suggestedNicheId: "cold-plunge",
      samples: [
        { title: "Built a backyard cold plunge for under $400 — parts list inside", subreddit: "HomeImprovement", score: 3320, url: "https://www.reddit.com/r/HomeImprovement" },
      ],
    },
    {
      phrase: "walking pad",
      mentions: 35,
      totalUpvotes: 12900,
      velocityPct: 39,
      subreddits: ["BuyItForLife"],
      samples: [
        { title: "Walking pad under a standing desk — 6 month honest review", subreddit: "BuyItForLife", score: 2210, url: "https://www.reddit.com/r/BuyItForLife" },
      ],
    },
    {
      phrase: "sourdough starter",
      mentions: 33,
      totalUpvotes: 11450,
      velocityPct: 18,
      subreddits: ["Sourdough", "Cooking"],
      suggestedNicheId: "sourdough",
      samples: [
        { title: "The jar setup that finally made my starter consistent", subreddit: "Sourdough", score: 1904, url: "https://www.reddit.com/r/Sourdough" },
      ],
    },
    {
      phrase: "lick mat",
      mentions: 29,
      totalUpvotes: 9870,
      velocityPct: 27,
      subreddits: ["dogs"],
      suggestedNicheId: "dog-enrichment",
      samples: [
        { title: "Lick mats turned nail trims from a fight into a spa day", subreddit: "dogs", score: 2688, url: "https://www.reddit.com/r/dogs" },
      ],
    },
    {
      phrase: "pickleball paddle",
      mentions: 27,
      totalUpvotes: 8340,
      velocityPct: 31,
      subreddits: ["Pickleball"],
      suggestedNicheId: "pickleball",
      samples: [
        { title: "Paddle grip tape comparison after 200 hours of play", subreddit: "Pickleball", score: 981, url: "https://www.reddit.com/r/Pickleball" },
      ],
    },
    {
      phrase: "mushroom grow kit",
      mentions: 24,
      totalUpvotes: 7752,
      velocityPct: 48,
      subreddits: ["gardening"],
      suggestedNicheId: "mushroom",
      samples: [
        { title: "First oyster flush from a countertop kit — absurdly easy", subreddit: "gardening", score: 3110, url: "https://www.reddit.com/r/gardening" },
      ],
    },
    {
      phrase: "scalp massager",
      mentions: 23,
      totalUpvotes: 6410,
      velocityPct: 22,
      subreddits: ["HaircareScience"],
      suggestedNicheId: "scalp-care",
      samples: [
        { title: "Rosemary oil + scalp massage routine, 4 month results", subreddit: "HaircareScience", score: 1450, url: "https://www.reddit.com/r/HaircareScience" },
      ],
    },
    {
      phrase: "visual timer",
      mentions: 21,
      totalUpvotes: 5980,
      velocityPct: 35,
      subreddits: ["NewParents", "BuyItForLife"],
      suggestedNicheId: "focus-tools",
      samples: [
        { title: "Visual timers ended our morning-routine meltdowns", subreddit: "NewParents", score: 1732, url: "https://www.reddit.com/r/NewParents" },
      ],
    },
    {
      phrase: "cat shelves",
      mentions: 19,
      totalUpvotes: 5420,
      velocityPct: 16,
      subreddits: ["CatAdvice"],
      suggestedNicheId: "cat-wall",
      samples: [
        { title: "Wall highway for a high-energy bengal — layout that worked", subreddit: "CatAdvice", score: 2011, url: "https://www.reddit.com/r/CatAdvice" },
      ],
    },
    {
      phrase: "learning tower",
      mentions: 17,
      totalUpvotes: 4890,
      velocityPct: 12,
      subreddits: ["NewParents"],
      suggestedNicheId: "montessori",
      samples: [
        { title: "Learning tower vs step stool for a 20-month-old?", subreddit: "NewParents", score: 640, url: "https://www.reddit.com/r/NewParents" },
      ],
    },
    {
      phrase: "packing cubes",
      mentions: 16,
      totalUpvotes: 4630,
      velocityPct: 9,
      subreddits: ["onebag"],
      suggestedNicheId: "packing",
      samples: [
        { title: "Compression cubes that survived 30 flights", subreddit: "onebag", score: 1105, url: "https://www.reddit.com/r/onebag" },
      ],
    },
    {
      phrase: "chainmail scrubber",
      mentions: 14,
      totalUpvotes: 4120,
      velocityPct: 14,
      subreddits: ["castiron"],
      suggestedNicheId: "cast-iron",
      samples: [
        { title: "Chainmail scrubber restored this flea market find", subreddit: "castiron", score: 2980, url: "https://www.reddit.com/r/castiron" },
      ],
    },
    {
      phrase: "air quality monitor",
      mentions: 12,
      totalUpvotes: 3540,
      velocityPct: 26,
      subreddits: ["HomeImprovement", "BuyItForLife"],
      samples: [
        { title: "CO2 monitor readings changed how we ventilate the house", subreddit: "HomeImprovement", score: 1870, url: "https://www.reddit.com/r/HomeImprovement" },
      ],
    },
  ],
};
