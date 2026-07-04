import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import OrderPanel from "./OrderPanel";
import { PRODUCTS, getProduct, getCategory, productsByCategory } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.blurb };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cat = getCategory(product.category)!;
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <section className="section-tight" style={{ paddingTop: 48 }}>
        <div className="container">
          <p className="mono-note" style={{ marginBottom: 26 }}>
            <Link href="/products" style={{ color: "var(--text-dim)" }}>COLLECTION</Link>
            {" / "}
            <Link href={`/products?cat=${cat.slug}`} style={{ color: "var(--text-dim)" }}>
              {cat.name.toUpperCase()}
            </Link>
            {" / "}
            <span style={{ color: "var(--candela)" }}>{product.sku}</span>
          </p>

          <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
            {/* art */}
            <div>
              <div
                className="product-art"
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line)",
                  aspectRatio: "1 / 0.95",
                }}
              >
                <ProductArt
                  kind={product.art}
                  palette={product.palette}
                  seed={product.slug}
                  size={380}
                />
              </div>
              <div style={{ marginTop: 26 }}>
                <h2 className="h-md" style={{ marginBottom: 14 }}>Specifications</h2>
                <table className="table-simple">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* details + order */}
            <div>
              <h1 className="h-lg">{product.name}</h1>
              <p style={{ color: "var(--text-dim)", margin: "18px 0 26px" }}>{product.description}</p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
                <span className="chip-quiet chip">Made to order</span>
                <span className="chip-quiet chip">
                  Ships in {product.leadTimeWeeks[0]}–{product.leadTimeWeeks[1]} weeks
                </span>
                <span className="chip">Custom options available</span>
              </div>

              <OrderPanel product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <h2 className="h-md" style={{ marginBottom: 26 }}>More from {cat.name}</h2>
            <div className="grid-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
