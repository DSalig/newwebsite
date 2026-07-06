"use client";

// Interactive retrofit ROI estimator. Deliberately conservative
// defaults; the turnkey program replaces this with a metered
// financial analysis during the site audit.

import { useMemo, useState } from "react";

const FIXTURE_TYPES = {
  fluorescent: { label: "Fluorescent troffers (T8/T12)", oldWatts: 96, newWatts: 34, kitCost: 96 },
  hid: { label: "HID high bays (metal halide)", oldWatts: 455, newWatts: 150, kitCost: 189 },
  incandescent: { label: "Incandescent / halogen", oldWatts: 75, newWatts: 15, kitCost: 74 },
} as const;

type FixtureKey = keyof typeof FIXTURE_TYPES;

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function RoiCalculator() {
  const [type, setType] = useState<FixtureKey>("fluorescent");
  const [count, setCount] = useState(120);
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(0.14);

  const r = useMemo(() => {
    const t = FIXTURE_TYPES[type];
    const kwhSavedPerYear = ((t.oldWatts - t.newWatts) * count * hours * 365) / 1000;
    const annualSavings = kwhSavedPerYear * rate;
    const installCost = count * (t.kitCost + 38); // kit + labor per fixture
    const estRebate = Math.min(installCost * 0.25, kwhSavedPerYear * 0.05);
    const netCost = installCost - estRebate;
    const paybackMonths = annualSavings > 0 ? (netCost / annualSavings) * 12 : 0;
    const fiveYear = annualSavings * 5 - netCost;
    const co2Tons = (kwhSavedPerYear * 0.000389).toFixed(1); // US grid avg
    return { kwhSavedPerYear, annualSavings, installCost, estRebate, netCost, paybackMonths, fiveYear, co2Tons };
  }, [type, count, hours, rate]);

  return (
    <div className="card" style={{ padding: "clamp(26px, 4vw, 44px)" }}>
      <div className="grid-2" style={{ gap: 44, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 26 }}>
          <p className="mono-note">ESTIMATE YOUR CONVERSION</p>

          <div className="field">
            <label htmlFor="roi-type">Existing lighting</label>
            <select id="roi-type" value={type} onChange={(e) => setType(e.target.value as FixtureKey)}>
              {Object.entries(FIXTURE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="roi-count">Fixture count — {count}</label>
            <input
              id="roi-count"
              type="range"
              min={10}
              max={1000}
              step={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="roi-hours">Operating hours / day — {hours} h</label>
            <input
              id="roi-hours"
              type="range"
              min={4}
              max={24}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="roi-rate">Electric rate — ${rate.toFixed(2)} / kWh</label>
            <input
              id="roi-rate"
              type="range"
              min={0.08}
              max={0.35}
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 0 }}>
          <p className="mono-note" style={{ marginBottom: 16 }}>PROJECTED RESULTS</p>
          <div className="analysis-line">
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>Annual savings</dt>
            <dd style={{ fontFamily: "var(--display)", fontSize: 30, color: "var(--candela-hot)" }}>{fmt(r.annualSavings)}</dd>
          </div>
          <div className="analysis-line">
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>Payback</dt>
            <dd style={{ color: "var(--text)" }}>
              ≈ {r.paybackMonths < 1 ? "under a month" : `${Math.round(r.paybackMonths)} months`}
            </dd>
          </div>
          <div className="analysis-line">
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>Turnkey cost</dt>
            <dd>{fmt(r.installCost)} before rebates</dd>
          </div>
          <div className="analysis-line">
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>Est. rebates</dt>
            <dd style={{ color: "var(--verdigris)" }}>− {fmt(r.estRebate)} (we identify &amp; file)</dd>
          </div>
          <div className="analysis-line">
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>5-yr net gain</dt>
            <dd style={{ fontFamily: "var(--display)", fontSize: 24, color: r.fiveYear >= 0 ? "var(--verdigris)" : "var(--ember)" }}>
              {fmt(r.fiveYear)}
            </dd>
          </div>
          <div className="analysis-line" style={{ borderBottom: 0 }}>
            <dt style={{ fontFamily: "var(--mono)", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--candela)" }}>CO₂ avoided</dt>
            <dd>{r.co2Tons} tons / year · {Math.round(r.kwhSavedPerYear).toLocaleString()} kWh saved</dd>
          </div>
          <p className="mono-note" style={{ marginTop: 18 }}>
            PLANNING ESTIMATE ONLY — YOUR TURNKEY PROPOSAL INCLUDES A METERED FINANCIAL ANALYSIS
          </p>
        </div>
      </div>
    </div>
  );
}
