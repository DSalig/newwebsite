"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import ScorePill from "@/components/ScorePill";
import { NICHES } from "@/lib/niches";
import { CATEGORIES } from "@/lib/estimator";
import { fmtCompact, fmtMoney, fmtPct } from "@/lib/format";
import { useIdeas } from "@/lib/store";

type SortMode = "opportunity" | "demand" | "trend" | "competition";

export default function NicheFinder() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortMode>("opportunity");
  const { ideas, addIdea } = useIdeas();

  const rows = useMemo(() => {
    const filtered = NICHES.filter((n) => category === "all" || n.category === category);
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "demand":
          return b.scores.demand - a.scores.demand;
        case "trend":
          return b.volumeTrendPct - a.volumeTrendPct;
        case "competition":
          return a.scores.competition - b.scores.competition;
        default:
          return b.scores.opportunity - a.scores.opportunity;
      }
    });
  }, [category, sort]);

  const savedNicheIds = new Set(ideas.map((i) => i.nicheId).filter(Boolean));

  return (
    <>
      <div className="page-head">
        <h1>Niche Finder</h1>
        <p>
          Demand vs. competition across every tracked niche. High demand you can&apos;t crack is a
          spectator sport — the opportunity score weights demand by how contestable the top of the
          market actually is.
        </p>
      </div>

      <div className="controls">
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="opportunity">Sort: opportunity</option>
          <option value="demand">Sort: demand</option>
          <option value="trend">Sort: 12-mo trend</option>
          <option value="competition">Sort: easiest competition</option>
        </select>
      </div>

      <div className="card-grid">
        {rows.map((n) => (
          <section key={n.id} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{n.name}</div>
                <div className="sub-cell">
                  {n.category} · {n.seasonality}
                </div>
              </div>
              <ScorePill score={n.scores.opportunity} />
            </div>

            <div style={{ display: "flex", gap: 18, margin: "12px 0", alignItems: "flex-end" }}>
              <div>
                <div className="sub-cell">Search volume</div>
                <div style={{ fontWeight: 700, fontSize: 18 }} className="mono-num">
                  {fmtCompact(n.searchVolume)}
                  <span className={n.volumeTrendPct >= 0 ? "delta-up" : "delta-down"} style={{ fontSize: 12, marginLeft: 6 }}>
                    {fmtPct(n.volumeTrendPct)}
                  </span>
                </div>
              </div>
              <Sparkline values={n.volumeSeries} width={120} height={32} label={`12-month search volume, ${fmtPct(n.volumeTrendPct)}`} />
            </div>

            <table className="data" style={{ fontSize: 12.5 }}>
              <tbody>
                <tr>
                  <td>Demand</td>
                  <td className="num">{n.scores.demand}/100</td>
                  <td>Competition</td>
                  <td className="num">{n.scores.competition}/100</td>
                </tr>
                <tr>
                  <td>Avg price</td>
                  <td className="num">{fmtMoney(n.avgPrice)}</td>
                  <td>Avg reviews</td>
                  <td className="num">{fmtCompact(n.avgReviews)}</td>
                </tr>
                <tr>
                  <td>Top brand share</td>
                  <td className="num">{Math.round(n.topBrandShare * 100)}%</td>
                  <td>Entrenched</td>
                  <td className="num">{n.entrenchedSellers}/10</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Link className="btn small ghost" href={`/keywords?niche=${n.id}`}>
                Keywords
              </Link>
              <Link className="btn small ghost" href={`/products?q=${encodeURIComponent(n.name)}`}>
                Products
              </Link>
              <button
                className="btn small"
                disabled={savedNicheIds.has(n.id)}
                onClick={() =>
                  addIdea({
                    title: n.name,
                    source: "Niche Finder",
                    notes: `Opportunity ${n.scores.opportunity}/10 — demand ${n.scores.demand}, competition ${n.scores.competition}. Volume ${fmtCompact(n.searchVolume)}/mo (${fmtPct(n.volumeTrendPct)} 12-mo).`,
                    nicheId: n.id,
                  })
                }
              >
                {savedNicheIds.has(n.id) ? "✓ In vault" : "+ Save idea"}
              </button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
