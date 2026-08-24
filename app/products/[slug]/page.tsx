import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductVisual from "@/components/ProductVisual";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProduct, products } from "@/lib/products";
import { getMergedProduct, getMergedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import BuyPanel from "./BuyPanel";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// ISR so console price/stock edits reach product pages within a
// minute without a redeploy.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getMergedProduct(slug);
  if (!product) notFound();

  const merged = await getMergedProducts(true);
  const pairs = product.pairsWith
    .map((s) => merged.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <section className="section">
      <div className="wrap">
        <p className="mono muted" style={{ marginBottom: "1.5rem" }}>
          <Link href="/shop">Shop</Link> / {product.category} / {product.shortName}
        </p>

        <div className="grid cols-2" style={{ gap: "3rem", alignItems: "start" }}>
          <Reveal>
            <ProductVisual product={product} />
            <div className="notice" style={{ marginTop: "1rem" }}>
              <span className="mono">LOT {product.batch.lot}</span> · manufactured{" "}
              {product.batch.mfg} · best by {product.batch.exp} ·{" "}
              <Link href={`/quality?lot=${product.batch.lot}`} style={{ textDecoration: "underline" }}>
                view certificate of analysis
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="eyebrow">{product.category}</p>
            <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {product.name}
            </h1>
            <p className="lede" style={{ margin: "0.8rem 0 1.4rem" }}>{product.tagline}</p>
            <p style={{ color: "var(--ink-soft)", marginBottom: "1.4rem" }}>{product.description}</p>

            <BuyPanel product={product} />

            {product.ingestible && (
              <p className="small muted" style={{ marginTop: "1rem" }}>*{site.fdaDisclaimer}</p>
            )}

            <hr className="hr" />

            <h3 className="display">Actives, disclosed</h3>
            <div className="table-scroll" style={{ margin: "0.8rem 0 1.4rem" }}>
              <table className="data">
                <thead>
                  <tr><th>Active</th><th>INCI / amount</th><th>Dose</th><th>Function</th></tr>
                </thead>
                <tbody>
                  {product.actives.map((a) => (
                    <tr key={a.name}>
                      <td><strong>{a.name}</strong></td>
                      <td className="mono" style={{ whiteSpace: "normal" }}>{a.inci}</td>
                      <td>{a.pct}</td>
                      <td style={{ whiteSpace: "normal" }}>{a.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="display">How to use</h3>
            <ul style={{ margin: "0.8rem 0 1.4rem 1.2rem", color: "var(--ink-soft)" }}>
              {product.howToUse.map((step) => <li key={step}>{step}</li>)}
            </ul>

            <h3 className="display">What the evidence says</h3>
            <p style={{ margin: "0.8rem 0", color: "var(--ink-soft)" }}>{product.evidence}</p>
            <p className="small muted">
              More detail on <Link href="/science" style={{ textDecoration: "underline" }}>The Science</Link>.
            </p>
          </Reveal>
        </div>

        {pairs.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <Reveal>
              <h2 className="display">Pairs with</h2>
            </Reveal>
            <div className="grid cols-3" style={{ marginTop: "1.5rem" }}>
              {pairs.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}><ProductCard product={p} /></Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
