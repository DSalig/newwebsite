import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import ProductVisual from "@/components/ProductVisual";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <ProductVisual product={product} />
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
          <strong>{product.shortName}</strong>
          <span>{formatPrice(product.price)}</span>
        </div>
        <p className="small muted">{product.tagline}</p>
        <p className="mono muted" style={{ marginTop: "0.3rem" }}>
          {product.size}
          {product.ingestible && " · supplement*"}
        </p>
      </div>
    </Link>
  );
}
