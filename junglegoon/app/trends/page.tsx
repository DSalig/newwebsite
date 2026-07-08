"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { TrendResponse } from "@/lib/trends";
import { nicheById } from "@/lib/niches";
import { fmtCompact, fmtInt, fmtPct } from "@/lib/format";
import { useIdeas } from "@/lib/store";

export default function TrendRadar() {
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { ideas, addIdea } = useIdeas();

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/trends");
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as TrendResponse);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const savedTitles = new Set(ideas.map((i) => i.title));

  return (
    <>
      <div className="page-head">
        <h1>Trend Radar</h1>
        <p>
          Where JungleScout reads sales data, this reads the conversation. JungleGoon counts product
          mentions across {`FBA-relevant subreddits`} for the past week, compares against the trailing
          month, and surfaces what people are suddenly talking themselves into buying. Save the good
          ones to the <Link href="/ideas">Idea Vault</Link>.
        </p>
      </div>

      <div className="controls">
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? "Scanning Reddit…" : "↻ Rescan"}
        </button>
        {data && (
          <span className="muted">
            {data.source === "reddit-live"
              ? `Live from Reddit · ${data.window} · fetched ${new Date(data.fetchedAt!).toLocaleTimeString()}`
              : data.window}
          </span>
        )}
      </div>

      {data?.source === "bundled-demo" && (
        <div className="notice">
          <strong>Demo snapshot.</strong> {data.note} The live scan needs outbound access to
          reddit.com — it retries automatically on the next visit or rescan.
        </div>
      )}

      {error && <div className="empty">Couldn&apos;t reach the trends API. Try a rescan.</div>}
      {loading && !data && <div className="empty">Mining the conversation…</div>}

      <div className="card-grid">
        {data?.items.map((t) => {
          const niche = t.suggestedNicheId ? nicheById(t.suggestedNicheId) : undefined;
          const saved = savedTitles.has(t.phrase);
          return (
            <section key={t.phrase} className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.phrase}</div>
                <span className={`pill ${t.velocityPct >= 25 ? "high" : t.velocityPct >= 0 ? "medium" : "low"}`}>
                  {fmtPct(t.velocityPct)} velocity
                </span>
              </div>
              <div className="sub-cell" style={{ margin: "4px 0 10px" }}>
                {fmtInt(t.mentions)} mentions · {fmtCompact(t.totalUpvotes)} upvotes ·{" "}
                {t.subreddits.map((s) => `r/${s}`).join(", ")}
              </div>

              {t.samples.map((s) => (
                <div key={s.url + s.title} style={{ margin: "6px 0", fontSize: 12.5 }}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                  <span className="muted">
                    {" "}
                    — r/{s.subreddit}, {fmtCompact(s.score)} points
                  </span>
                </div>
              ))}

              <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                <button
                  className="btn small"
                  disabled={saved}
                  onClick={() =>
                    addIdea({
                      title: t.phrase,
                      source: `Trend Radar (${data.source === "reddit-live" ? "live" : "snapshot"})`,
                      notes: `${t.mentions} mentions, ${fmtPct(t.velocityPct)} velocity across ${t.subreddits.map((s) => `r/${s}`).join(", ")}.`,
                      nicheId: t.suggestedNicheId,
                    })
                  }
                >
                  {saved ? "✓ In vault" : "+ Save idea"}
                </button>
                {niche && (
                  <Link className="btn small ghost" href={`/keywords?niche=${niche.id}`}>
                    {niche.name} · opp {niche.scores.opportunity}/10
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
