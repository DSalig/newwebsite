import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import ScorePill from "@/components/ScorePill";
import StatTile from "@/components/StatTile";
import { NICHES } from "@/lib/niches";
import { PRODUCTS } from "@/lib/catalog";
import { KEYWORDS } from "@/lib/keywords";
import { fmtCompact, fmtMoney, fmtPct } from "@/lib/format";

export default function Dashboard() {
  const topNiches = [...NICHES].sort((a, b) => b.scores.opportunity - a.scores.opportunity).slice(0, 6);
  const risers = [...NICHES].sort((a, b) => b.volumeTrendPct - a.volumeTrendPct).slice(0, 5);
  const totalRevenue = PRODUCTS.reduce((s, p) => s + p.estMonthlyRevenue, 0);

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>
          The lay of the land across {NICHES.length} tracked niches, {PRODUCTS.length} catalogued
          products, and {KEYWORDS.length} keywords. Start with the highest-opportunity niches, then
          check <Link href="/trends">Trend Radar</Link> for what the internet is talking itself into
          buying this week.
        </p>
      </div>

      <div className="tile-row">
        <StatTile label="Niches scored" value={String(NICHES.length)} sub="across 8 categories" />
        <StatTile
          label="High-opportunity niches"
          value={String(NICHES.filter((n) => n.scores.opportunity >= 7).length)}
          sub="score 7/10 or better"
        />
        <StatTile
          label="Catalogued market revenue"
          value={`$${fmtCompact(totalRevenue)}/mo`}
          sub={`across ${PRODUCTS.length} products`}
        />
        <StatTile
          label="Fastest-rising niche"
          value={fmtPct(risers[0].volumeTrendPct)}
          sub={risers[0].name}
        />
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Top opportunities</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Niche</th>
                <th className="num">Volume</th>
                <th>12-mo trend</th>
                <th>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {topNiches.map((n) => (
                <tr key={n.id}>
                  <td>
                    <span className="title-cell">{n.name}</span>
                    <span className="sub-cell">{n.category}</span>
                  </td>
                  <td className="num">{fmtCompact(n.searchVolume)}</td>
                  <td>
                    <Sparkline values={n.volumeSeries} label={`${n.name}: ${fmtPct(n.volumeTrendPct)} over 12 months`} />
                  </td>
                  <td>
                    <ScorePill score={n.scores.opportunity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt" style={{ marginBottom: 0 }}>
            <Link href="/niches">All {NICHES.length} niches →</Link>
          </p>
        </section>

        <section className="panel">
          <h2>Momentum — fastest-growing search demand</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Niche</th>
                <th className="num">12-mo change</th>
                <th className="num">Avg price</th>
                <th className="num">Avg reviews</th>
              </tr>
            </thead>
            <tbody>
              {risers.map((n) => (
                <tr key={n.id}>
                  <td>
                    <span className="title-cell">{n.name}</span>
                    <span className="sub-cell">{n.seasonality}</span>
                  </td>
                  <td className={`num ${n.volumeTrendPct >= 0 ? "delta-up" : "delta-down"}`}>
                    {fmtPct(n.volumeTrendPct)}
                  </td>
                  <td className="num">{fmtMoney(n.avgPrice)}</td>
                  <td className="num">{fmtCompact(n.avgReviews)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt" style={{ marginBottom: 0 }}>
            <Link href="/trends">What&apos;s driving it? Check Trend Radar →</Link>
          </p>
        </section>
      </div>
    </>
  );
}
