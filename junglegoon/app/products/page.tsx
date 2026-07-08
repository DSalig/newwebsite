"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sparkline from "@/components/Sparkline";
import TrackButton from "@/components/TrackButton";
import { PRODUCTS, Product } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/estimator";
import { fmtCompact, fmtInt, fmtMoney } from "@/lib/format";

type SortKey = "estMonthlyRevenue" | "estMonthlySales" | "price" | "bsr" | "reviews" | "rating" | "lqs";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "bsr", label: "BSR" },
  { key: "estMonthlySales", label: "Est. sales/mo" },
  { key: "estMonthlyRevenue", label: "Est. revenue/mo" },
  { key: "reviews", label: "Reviews" },
  { key: "rating", label: "Rating" },
  { key: "lqs", label: "LQS" },
];

function ProductDatabase() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("all");
  const [maxReviews, setMaxReviews] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("estMonthlyRevenue");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const maxR = parseInt(maxReviews, 10);
    const minRev = parseInt(minRevenue, 10);
    const filtered = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (Number.isFinite(maxR) && p.reviews > maxR) return false;
      if (Number.isFinite(minRev) && p.estMonthlyRevenue < minRev) return false;
      if (needle && !`${p.title} ${p.brand} ${p.nicheName} ${p.asin}`.toLowerCase().includes(needle)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const d = (a[sortKey] as number) - (b[sortKey] as number);
      return asc ? d : -d;
    });
  }, [q, category, maxReviews, minRevenue, sortKey, asc]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(key === "bsr"); // lower BSR first feels natural
    }
  };

  const arrow = (key: SortKey) => (key === sortKey ? (asc ? " ↑" : " ↓") : "");

  return (
    <>
      <div className="page-head">
        <h1>Product Database</h1>
        <p>
          Filter the catalogue the way you&apos;d filter JungleScout&apos;s database: cap the review
          count to find weak incumbents, floor the revenue to make sure the demand is real.
        </p>
      </div>

      <div className="controls">
        <input
          className="input"
          style={{ width: 260 }}
          placeholder="Search title, brand, niche, ASIN…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="input"
          style={{ width: 140 }}
          placeholder="Max reviews"
          inputMode="numeric"
          value={maxReviews}
          onChange={(e) => setMaxReviews(e.target.value)}
        />
        <input
          className="input"
          style={{ width: 160 }}
          placeholder="Min revenue $/mo"
          inputMode="numeric"
          value={minRevenue}
          onChange={(e) => setMinRevenue(e.target.value)}
        />
        <span className="muted">
          {fmtInt(rows.length)} of {fmtInt(PRODUCTS.length)} products
        </span>
      </div>

      <div className="table-wrap" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <table className="data">
          <thead>
            <tr>
              <th>Product</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="num sortable" onClick={() => onSort(c.key)}>
                  {c.label}
                  {arrow(c.key)}
                </th>
              ))}
              <th>12-mo sales</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p: Product) => (
              <tr key={p.asin}>
                <td>
                  <span className="title-cell" title={p.title}>
                    {p.title}
                  </span>
                  <span className="sub-cell">
                    {p.asin} · {p.nicheName} · {p.sellerType}
                  </span>
                </td>
                <td className="num">{fmtMoney(p.price, 2)}</td>
                <td className="num">{fmtInt(p.bsr)}</td>
                <td className="num">{fmtInt(p.estMonthlySales)}</td>
                <td className="num">{fmtMoney(p.estMonthlyRevenue)}</td>
                <td className="num">{fmtCompact(p.reviews)}</td>
                <td className="num">{p.rating.toFixed(1)}★</td>
                <td className="num">{p.lqs}/10</td>
                <td>
                  <Sparkline
                    values={p.salesSeries}
                    width={80}
                    height={22}
                    label={`Trailing 12 months, currently ~${fmtInt(p.estMonthlySales)} units/mo`}
                  />
                </td>
                <td>
                  <TrackButton asin={p.asin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ProductDatabasePage() {
  return (
    <Suspense>
      <ProductDatabase />
    </Suspense>
  );
}
