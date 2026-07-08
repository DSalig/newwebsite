# JungleGoon 🦍

Personal Amazon FBA research console — a standalone JungleScout-style toolkit
plus a conversational **Trend Radar** that mines Reddit for what people are
talking themselves into buying.

Fully standalone: its own `package.json`, no coupling to anything else in this
repository. Lift the `junglegoon/` folder into its own repo whenever you want.

## Run it

```bash
cd junglegoon
npm install
npm run dev        # http://localhost:3100
```

No environment variables, no database, no accounts. Watchlist and ideas persist
in your browser's localStorage.

## The tools

| Page | What it does |
|---|---|
| **Dashboard** | Top opportunities and fastest-rising niches at a glance |
| **Product Database** | Filter/sort ~190 products by price, BSR, est. sales/revenue, reviews, rating, listing quality — cap reviews + floor revenue to find weak incumbents |
| **Niche Finder** | 24 niches scored on demand vs. competition → 1–10 opportunity score |
| **Keyword Scout** | Volume, 12-mo trend, competing products, PPC bid, difficulty per keyword |
| **Sales Estimator** | BSR → est. monthly units per category (fitted power-law curves), interactive chart |
| **Trend Radar** | Live scan of 16 FBA-relevant subreddits: product-phrase mentions this week vs. trailing month → velocity. Falls back to a bundled snapshot offline |
| **Idea Vault** | Brand/product ideas board: spark → researching → validated → shelved |
| **Product Tracker** | Watchlist with velocity sparklines |

## Where the data comes from (and its honesty)

- **Trend Radar is real**: it hits Reddit's public JSON endpoints server-side
  (`/api/trends`), counts mentions of a curated product-phrase lexicon
  (`lib/trends.ts` — add your own phrases there), and computes week-over-month
  velocity. Results cache for 15 minutes. When the network says no, it serves a
  clearly-labeled bundled snapshot.
- **Everything else is a modeled demo dataset**: products, niches, and keywords
  are generated deterministically (`lib/catalog.ts`, `lib/niches.ts`,
  `lib/keywords.ts`) with realistic shapes — BSR→sales power-law curves
  (`lib/estimator.ts`), demand/competition scoring (`lib/scoring.ts`). The
  numbers are plausible, not scraped. The point is that the *pipes and scoring
  are real*, so swapping in live data later is a data-source change, not a
  rewrite.

## Planned next (the "functionality added later" list)

- Real product data source: Keepa API or an Apify Amazon scraper feeding
  `lib/catalog.ts`'s `Product` shape
- More conversation sources: TikTok/YouTube via scraper actors, Google Trends
- Persistence beyond localStorage (Supabase) once it needs to be multi-device
- Alerts: BSR/velocity thresholds on tracked products
