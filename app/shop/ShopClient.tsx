"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  categories,
  concerns,
  products,
  type Category,
  type Concern,
} from "@/lib/products";
import { site } from "@/lib/site";

export default function ShopClient() {
  const params = useSearchParams();
  const initialCat = params.get("cat") as Category | null;
  const [cat, setCat] = useState<Category | "All">(
    initialCat && categories.includes(initialCat) ? initialCat : "All"
  );
  const [concern, setConcern] = useState<Concern | "All">("All");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (concern === "All" || p.concerns.includes(concern))
      ),
    [cat, concern]
  );

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">The catalog</p>
          <h1 className="display">Shop</h1>
          <p className="lede" style={{ marginTop: "0.8rem" }}>
            Every concentration disclosed, every batch tested. Filter by what your skin needs.
          </p>
        </Reveal>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "2rem 0 0.8rem" }}>
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              className={`pill ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {(["All", ...concerns] as const).map((c) => (
            <button
              key={c}
              className={`pill ${concern === c ? "active" : ""}`}
              onClick={() => setConcern(c)}
              style={{ fontSize: "0.75rem" }}
            >
              {c === "All" ? "Every concern" : c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="muted">Nothing matches that combination — try widening a filter.</p>
        ) : (
          <div className="grid cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="small muted" style={{ marginTop: "1.5rem" }}>*{site.fdaDisclaimer}</p>
      </div>
    </section>
  );
}
