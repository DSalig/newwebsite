import { NextResponse } from "next/server";
import { PHRASE_LEXICON, TREND_SUBREDDITS, TrendItem, TrendResponse } from "@/lib/trends";
import { FALLBACK_TRENDS } from "@/lib/trendsFallback";

// Mines Reddit's public JSON endpoints for product-phrase mentions.
// No auth required; a descriptive User-Agent keeps us within Reddit's
// unauthenticated etiquette. Falls back to the bundled snapshot whenever
// the network says no.

export const dynamic = "force-dynamic";

type RedditPost = {
  title: string;
  selftext?: string;
  subreddit: string;
  score: number;
  permalink: string;
};

const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { at: number; data: TrendResponse } | null = null;

async function fetchSub(sub: string, window: "week" | "month"): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${sub}/top.json?t=${window}&limit=75&raw_json=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "JungleGoon/0.1 (personal FBA research tool)" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`r/${sub} ${window}: HTTP ${res.status}`);
  const json = await res.json();
  const children: { data: RedditPost }[] = json?.data?.children ?? [];
  return children.map((c) => c.data);
}

function textOf(p: RedditPost): string {
  return `${p.title} ${p.selftext ?? ""}`.toLowerCase();
}

function matches(text: string, phrase: string, aliases: string[]): boolean {
  return [phrase, ...aliases].some((t) => text.includes(t.toLowerCase()));
}

function mine(weekPosts: RedditPost[], monthPosts: RedditPost[]): TrendItem[] {
  const items: TrendItem[] = [];
  for (const entry of PHRASE_LEXICON) {
    const weekHits = weekPosts.filter((p) => matches(textOf(p), entry.phrase, entry.aliases));
    if (weekHits.length === 0) continue;
    const monthHits = monthPosts.filter((p) => matches(textOf(p), entry.phrase, entry.aliases));
    // Baseline: month window ≈ 4.3 weeks of the same conversation rate.
    const baselinePerWeek = Math.max(0.5, monthHits.length / 4.3);
    const velocityPct = Math.round(((weekHits.length - baselinePerWeek) / baselinePerWeek) * 100);
    const top = [...weekHits].sort((a, b) => b.score - a.score);
    items.push({
      phrase: entry.phrase,
      mentions: weekHits.length,
      totalUpvotes: weekHits.reduce((s, p) => s + p.score, 0),
      velocityPct,
      subreddits: [...new Set(weekHits.map((p) => p.subreddit))],
      suggestedNicheId: entry.nicheId,
      samples: top.slice(0, 3).map((p) => ({
        title: p.title,
        subreddit: p.subreddit,
        score: p.score,
        url: `https://www.reddit.com${p.permalink}`,
      })),
    });
  }
  return items.sort((a, b) => b.mentions * (1 + b.velocityPct / 100) - a.mentions * (1 + a.velocityPct / 100));
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const settled = await Promise.allSettled(
      TREND_SUBREDDITS.flatMap((sub) => [fetchSub(sub, "week"), fetchSub(sub, "month")])
    );
    const weekPosts: RedditPost[] = [];
    const monthPosts: RedditPost[] = [];
    settled.forEach((r, i) => {
      if (r.status !== "fulfilled") return;
      (i % 2 === 0 ? weekPosts : monthPosts).push(...r.value);
    });

    // If nearly everything failed (proxy/rate limit), don't serve junk.
    if (weekPosts.length < 50) {
      return NextResponse.json(FALLBACK_TRENDS);
    }

    const data: TrendResponse = {
      source: "reddit-live",
      fetchedAt: new Date().toISOString(),
      window: "past week vs. trailing month",
      items: mine(weekPosts, monthPosts),
    };
    cache = { at: Date.now(), data };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(FALLBACK_TRENDS);
  }
}
