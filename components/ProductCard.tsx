import Link from "next/link";
import ProductArt from "./ProductArt";
import { formatPrice, getCategory, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.category);
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-art">
        <ProductArt
          kind={product.art}
          palette={product.palette}
          seed={product.slug}
          size={210}
        />
      </div>
      <div className="product-body">
        <span className="mono-note">{cat?.short.toUpperCase()} · {product.sku}</span>
        <h3>{product.name}</h3>
        <p style={{ color: "var(--text-dim)", fontSize: 14.5 }}>{product.blurb}</p>
        <div className="product-meta">
          <span className="price">
            {formatPrice(product.price)}
            <small>{product.priceNote}</small>
          </span>
          <span className="mono-note">
            {product.leadTimeWeeks[0]}–{product.leadTimeWeeks[1]} wks
          </span>
        </div>
      </div>
    </Link>
  );
}
