"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, type CategorySlug } from "@/lib/products";

export default function CatalogClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const active = (params.get("cat") as CategorySlug | null) ?? null;
  const shown = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;
  const activeCat = CATEGORIES.find((c) => c.slug === active);

  const setCat = (slug: string | null) => {
    router.replace(slug ? `${pathname}?cat=${slug}` : pathname, { scroll: false });
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 480, height: 480, background: "rgba(255,180,84,0.1)", top: -200, left: "30%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">The collection · {PRODUCTS.length} pieces</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18 }}>
              Made to order, <span className="italic-accent">never warehoused.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 20 }}>
              Every piece is fulfilled by our manufacturing partners when you
              order — which means every piece can be customized. Finishes,
              sizes, glass, color temperature, controls: make it yours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="filter-row" role="tablist" aria-label="Product categories">
            <button
              className="filter-btn"
              data-active={active === null}
              onClick={() => setCat(null)}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                className="filter-btn"
                data-active={active === c.slug}
                onClick={() => setCat(c.slug)}
              >
                {c.short}
              </button>
            ))}
          </div>

          {activeCat && (
            <p className="lede" style={{ marginBottom: 34, fontSize: 16 }}>
              {activeCat.description}
            </p>
          )}

          <div className="grid-3">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          <p className="mono-note" style={{ marginTop: 40, textAlign: "center" }}>
            DON&apos;T SEE IT? EVERYTHING HERE STARTED AS A CUSTOM REQUEST —{" "}
            <a href="/contact?interest=custom" style={{ color: "var(--candela)" }}>
              COMMISSION YOUR OWN
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
