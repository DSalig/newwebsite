"use client";

import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import TrackButton from "@/components/TrackButton";
import { PRODUCTS } from "@/lib/catalog";
import { fmtCompact, fmtInt, fmtMoney, fmtPct } from "@/lib/format";
import { useTracked } from "@/lib/store";

export default function TrackerPage() {
  const [tracked] = useTracked();
  const rows = PRODUCTS.filter((p) => tracked.includes(p.asin));

  return (
    <>
      <div className="page-head">
        <h1>Product Tracker</h1>
        <p>
          Your watchlist. Add products from the <Link href="/products">Product Database</Link> and
          keep an eye on their velocity before you commit to competing with them.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          Nothing tracked yet. Hit <strong>+ Track</strong> on any row in the{" "}
          <Link href="/products">Product Database</Link>.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">Price</th>
                <th className="num">BSR</th>
                <th className="num">Est. sales/mo</th>
                <th className="num">Est. revenue/mo</th>
                <th>12-mo sales</th>
                <th className="num">12-mo change</th>
                <th className="num">Reviews</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const first = p.salesSeries[0] || 1;
                const last = p.salesSeries[p.salesSeries.length - 1];
                const changePct = Math.round(((last - first) / first) * 100);
                return (
                  <tr key={p.asin}>
                    <td>
                      <span className="title-cell" title={p.title}>
                        {p.title}
                      </span>
                      <span className="sub-cell">
                        {p.asin} · {p.nicheName}
                      </span>
                    </td>
                    <td className="num">{fmtMoney(p.price, 2)}</td>
                    <td className="num">{fmtInt(p.bsr)}</td>
                    <td className="num">{fmtInt(p.estMonthlySales)}</td>
                    <td className="num">{fmtMoney(p.estMonthlyRevenue)}</td>
                    <td>
                      <Sparkline values={p.salesSeries} width={110} height={26} label={`Trailing 12 months of estimated unit sales`} />
                    </td>
                    <td className={`num ${changePct >= 0 ? "delta-up" : "delta-down"}`}>{fmtPct(changePct)}</td>
                    <td className="num">{fmtCompact(p.reviews)}</td>
                    <td>
                      <TrackButton asin={p.asin} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
