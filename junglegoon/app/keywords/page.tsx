"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sparkline from "@/components/Sparkline";
import { KEYWORDS } from "@/lib/keywords";
import { NICHES } from "@/lib/niches";
import { fmtCompact, fmtInt, fmtMoney, fmtPct } from "@/lib/format";

function difficultyPill(d: number) {
  const cls = d >= 65 ? "low" : d >= 40 ? "medium" : "high"; // hard = red-ish, easy = green
  const label = d >= 65 ? "Hard" : d >= 40 ? "Moderate" : "Easy";
  return (
    <span className={`pill ${cls}`}>
      {d} · {label}
    </span>
  );
}

function KeywordScout() {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState(params.get("niche") ?? "all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return KEYWORDS.filter((k) => {
      if (niche !== "all" && k.nicheId !== niche) return false;
      if (needle && !k.phrase.includes(needle)) return false;
      return true;
    });
  }, [q, niche]);

  return (
    <>
      <div className="page-head">
        <h1>Keyword Scout</h1>
        <p>
          Search volume, trajectory, and how crowded the shelf already is. PPC bid is the suggested
          exact-match starting bid — a proxy for how expensive attention in the niche has become.
        </p>
      </div>

      <div className="controls">
        <input
          className="input"
          style={{ width: 260 }}
          placeholder="Filter keywords…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
          <option value="all">All niches</option>
          {NICHES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
        <span className="muted">{fmtInt(rows.length)} keywords</span>
      </div>

      <div className="table-wrap" style={{ maxHeight: "72vh", overflowY: "auto" }}>
        <table className="data">
          <thead>
            <tr>
              <th>Keyword</th>
              <th className="num">Volume/mo</th>
              <th>12-mo trend</th>
              <th className="num">Change</th>
              <th className="num">Competing products</th>
              <th className="num">PPC bid</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={`${k.nicheId}:${k.phrase}`}>
                <td>
                  <span className="title-cell">{k.phrase}</span>
                  <span className="sub-cell">{k.nicheName}</span>
                </td>
                <td className="num">{fmtCompact(k.volume)}</td>
                <td>
                  <Sparkline values={k.volumeSeries} width={80} height={22} label={`12-month volume, ${fmtPct(k.trendPct)}`} />
                </td>
                <td className={`num ${k.trendPct >= 0 ? "delta-up" : "delta-down"}`}>{fmtPct(k.trendPct)}</td>
                <td className="num">{fmtInt(k.competingProducts)}</td>
                <td className="num">{fmtMoney(k.ppcBid, 2)}</td>
                <td>{difficultyPill(k.difficulty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function KeywordScoutPage() {
  return (
    <Suspense>
      <KeywordScout />
    </Suspense>
  );
}
