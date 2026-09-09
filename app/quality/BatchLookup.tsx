"use client";

// Lot-number lookup against the catalog's launch batches. When
// real COA PDFs are uploaded to public/coa/, the "view" link goes
// live automatically (same path scheme).

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function BatchLookup() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("lot") ?? "");
  const [searched, setSearched] = useState(Boolean(params.get("lot")));

  const q = query.trim().toUpperCase();
  const match = q ? products.find((p) => p.batch.lot.toUpperCase() === q) : undefined;

  return (
    <div className="card" style={{ maxWidth: "40rem" }}>
      <form
        onSubmit={(e) => { e.preventDefault(); setSearched(true); }}
        style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="e.g. PT24-CRS-001"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          aria-label="Lot number"
          style={{ flex: "1 1 14rem", fontFamily: "var(--font-mono)" }}
        />
        <button className="btn btn-primary">Look up</button>
      </form>

      {searched && match && (
        <div style={{ marginTop: "1.2rem" }}>
          <hr className="hr" />
          <p><strong>{match.name}</strong></p>
          <div className="table-scroll" style={{ marginTop: "0.6rem" }}>
            <table className="data">
              <tbody>
                <tr><td className="mono">Lot</td><td>{match.batch.lot}</td></tr>
                <tr><td className="mono">Manufactured</td><td>{match.batch.mfg}</td></tr>
                <tr><td className="mono">Best by</td><td>{match.batch.exp}</td></tr>
                <tr>
                  <td className="mono">COA</td>
                  <td>
                    <a href={match.batch.coaPath} style={{ textDecoration: "underline" }}>
                      View certificate (PDF)
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: "0.8rem" }}>
            Questions about this report? Email{" "}
            <a href={`mailto:${site.email.support}`} style={{ textDecoration: "underline" }}>
              {site.email.support}
            </a>{" "}
            with the lot number.
          </p>
        </div>
      )}
      {searched && q && !match && (
        <p className="small" style={{ marginTop: "1rem", color: "var(--copper)" }}>
          No batch found for &quot;{q}&quot;. Double-check the lot number, or email{" "}
          <a href={`mailto:${site.email.support}`} style={{ textDecoration: "underline" }}>{site.email.support}</a>{" "}
          and we&apos;ll pull it for you.
        </p>
      )}
    </div>
  );
}
