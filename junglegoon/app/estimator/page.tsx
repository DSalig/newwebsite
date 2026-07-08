"use client";

import { useMemo, useState } from "react";
import StatTile from "@/components/StatTile";
import { CATEGORIES, Category, curveSamples, estimateMonthlySales } from "@/lib/estimator";
import { fmtInt, fmtMoney } from "@/lib/format";

const W = 640;
const H = 300;
const PAD = { top: 16, right: 20, bottom: 34, left: 56 };

export default function EstimatorPage() {
  const [category, setCategory] = useState<Category>("Home & Kitchen");
  const [bsrInput, setBsrInput] = useState("2500");
  const [price, setPrice] = useState("24.99");
  const [hover, setHover] = useState<{ x: number; bsr: number; sales: number } | null>(null);

  const bsr = Math.max(1, parseInt(bsrInput, 10) || 0);
  const sales = estimateMonthlySales(category, bsr);
  const priceNum = parseFloat(price) || 0;

  const samples = useMemo(() => curveSamples(category), [category]);
  const maxSales = samples[0].sales;

  // log-x (BSR 1..200k), log-y (sales) — a power law is a straight line here,
  // but readers think in the raw numbers, so the ticks stay in units.
  const xOf = (b: number) => PAD.left + (Math.log10(b) / Math.log10(200000)) * (W - PAD.left - PAD.right);
  const yOf = (s: number) =>
    PAD.top + (1 - Math.log10(Math.max(1, s)) / Math.log10(Math.max(10, maxSales))) * (H - PAD.top - PAD.bottom);

  const path = samples
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.bsr).toFixed(1)},${yOf(p.sales).toFixed(1)}`)
    .join(" ");

  const xTicks = [1, 10, 100, 1000, 10000, 100000];
  const yTicks = [1, 10, 100, 1000, 10000].filter((t) => t <= maxSales);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    if (px < PAD.left || px > W - PAD.right) return setHover(null);
    const b = Math.round(Math.pow(10, ((px - PAD.left) / (W - PAD.left - PAD.right)) * Math.log10(200000)));
    setHover({ x: px, bsr: b, sales: estimateMonthlySales(category, b) });
  };

  return (
    <>
      <div className="page-head">
        <h1>Sales Estimator</h1>
        <p>
          BSR → estimated monthly units, per category, on a fitted power-law curve. Treat it as a
          relative instrument — great for comparing two listings, dangerous as gospel.
        </p>
      </div>

      <div className="controls">
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="input"
          style={{ width: 140 }}
          placeholder="BSR"
          inputMode="numeric"
          value={bsrInput}
          onChange={(e) => setBsrInput(e.target.value)}
        />
        <input
          className="input"
          style={{ width: 140 }}
          placeholder="Price $"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="tile-row">
        <StatTile label="Est. monthly sales" value={`${fmtInt(sales)} units`} sub={`BSR ${fmtInt(bsr)} in ${category}`} />
        <StatTile label="Est. monthly revenue" value={fmtMoney(sales * priceNum)} sub={`at ${fmtMoney(priceNum, 2)} ASP`} />
        <StatTile label="Est. daily sales" value={`${fmtInt(Math.round(sales / 30.4))} units`} sub="30.4-day month" />
      </div>

      <section className="panel">
        <h2>
          {category} — BSR vs. estimated monthly sales <span className="muted">(log–log)</span>
        </h2>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", maxWidth: 760, display: "block" }}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={`Estimated monthly sales by BSR for ${category}`}
        >
          {/* gridlines + ticks */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={xOf(t)} x2={xOf(t)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--grid)" />
              <text x={xOf(t)} y={H - PAD.bottom + 16} fill="var(--muted)" fontSize="10.5" textAnchor="middle">
                {t >= 1000 ? `${t / 1000}k` : t}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={PAD.left} x2={W - PAD.right} y1={yOf(t)} y2={yOf(t)} stroke="var(--grid)" />
              <text x={PAD.left - 8} y={yOf(t) + 3.5} fill="var(--muted)" fontSize="10.5" textAnchor="end">
                {t >= 1000 ? `${t / 1000}k` : t}
              </text>
            </g>
          ))}
          <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--baseline)" />
          <text x={(W + PAD.left - PAD.right) / 2} y={H - 4} fill="var(--muted)" fontSize="11" textAnchor="middle">
            Best Sellers Rank
          </text>
          <text x={14} y={10} fill="var(--muted)" fontSize="11">
            units/mo
          </text>

          {/* the curve */}
          <path d={path} fill="none" stroke="var(--series-1)" strokeWidth="2" />

          {/* your listing */}
          {bsr >= 1 && bsr <= 200000 && (
            <g>
              <circle cx={xOf(bsr)} cy={yOf(sales)} r="5" fill="var(--series-3)" stroke="var(--surface)" strokeWidth="2" />
              <text x={Math.min(xOf(bsr) + 9, W - 130)} y={yOf(sales) - 8} fill="var(--ink-2)" fontSize="11.5" fontWeight="600">
                your listing · {fmtInt(sales)}/mo
              </text>
            </g>
          )}

          {/* crosshair + tooltip */}
          {hover && (
            <g pointerEvents="none">
              <line x1={hover.x} x2={hover.x} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--baseline)" strokeDasharray="3 3" />
              <circle cx={hover.x} cy={yOf(hover.sales)} r="4" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />
              <g transform={`translate(${Math.min(hover.x + 10, W - 168)}, ${PAD.top + 6})`}>
                <rect width="158" height="40" rx="6" fill="var(--surface-2)" stroke="var(--baseline)" />
                <text x="10" y="17" fill="var(--ink)" fontSize="11.5" fontWeight="600">
                  BSR {fmtInt(hover.bsr)}
                </text>
                <text x="10" y="31" fill="var(--ink-2)" fontSize="11.5">
                  ≈ {fmtInt(hover.sales)} units/mo
                </text>
              </g>
            </g>
          )}
        </svg>
      </section>
    </>
  );
}
