// Procedural product art: a deterministic SVG "studio shot" per
// product (vessel silhouette by category, brand-palette gradient
// keyed off product.hue) so the catalog ships looking consistent
// before photography exists. Replace with real photos per SKU by
// dropping files in public/products/<slug>.jpg — this component
// stays as the fallback.

import type { Product } from "@/lib/products";

function vessel(category: Product["category"]): React.ReactNode {
  switch (category) {
    case "Serums":
      // dropper bottle
      return (
        <>
          <rect x="82" y="70" width="36" height="10" rx="3" fill="#2b2b28" />
          <rect x="90" y="80" width="20" height="18" rx="4" fill="#2b2b28" opacity="0.85" />
          <rect x="70" y="96" width="60" height="84" rx="12" fill="url(#body)" />
          <rect x="79" y="118" width="42" height="40" rx="4" fill="#fffdf9" opacity="0.92" />
        </>
      );
    case "Moisturizers":
      // jar
      return (
        <>
          <rect x="62" y="86" width="76" height="20" rx="6" fill="#2b2b28" />
          <rect x="58" y="106" width="84" height="70" rx="14" fill="url(#body)" />
          <rect x="70" y="126" width="60" height="32" rx="4" fill="#fffdf9" opacity="0.92" />
        </>
      );
    case "Eye & Lip":
      // small tube
      return (
        <>
          <rect x="88" y="66" width="24" height="14" rx="4" fill="#2b2b28" />
          <rect x="80" y="80" width="40" height="98" rx="10" fill="url(#body)" />
          <rect x="87" y="106" width="26" height="44" rx="4" fill="#fffdf9" opacity="0.92" />
        </>
      );
    case "Hair & Body":
      // pump bottle
      return (
        <>
          <rect x="94" y="58" width="30" height="8" rx="3" fill="#2b2b28" />
          <rect x="94" y="64" width="12" height="16" rx="3" fill="#2b2b28" />
          <rect x="86" y="78" width="28" height="12" rx="3" fill="#2b2b28" opacity="0.85" />
          <rect x="72" y="90" width="56" height="90" rx="12" fill="url(#body)" />
          <rect x="80" y="112" width="40" height="42" rx="4" fill="#fffdf9" opacity="0.92" />
        </>
      );
    case "Ingestibles":
      // canister
      return (
        <>
          <rect x="56" y="74" width="88" height="18" rx="8" fill="#2b2b28" />
          <rect x="54" y="92" width="92" height="86" rx="12" fill="url(#body)" />
          <rect x="66" y="112" width="68" height="42" rx="4" fill="#fffdf9" opacity="0.92" />
        </>
      );
    case "Bundles":
      // trio of vessels
      return (
        <>
          <rect x="38" y="100" width="40" height="78" rx="9" fill="url(#body)" opacity="0.85" />
          <rect x="86" y="82" width="34" height="96" rx="9" fill="url(#body)" />
          <rect x="92" y="70" width="22" height="12" rx="3" fill="#2b2b28" />
          <rect x="128" y="110" width="38" height="68" rx="9" fill="url(#body)" opacity="0.7" />
        </>
      );
  }
}

export default function ProductVisual({ product }: { product: Product }) {
  const h = product.hue;
  return (
    <div className="product-visual" aria-hidden="true">
      <svg viewBox="0 0 200 200" role="img" aria-label={product.shortName}>
        <defs>
          <linearGradient id={`bg-${product.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h}, 32%, 92%)`} />
            <stop offset="100%" stopColor={`hsl(${h}, 26%, 82%)`} />
          </linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h}, 38%, 58%)`} />
            <stop offset="100%" stopColor={`hsl(${h}, 42%, 40%)`} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#bg-${product.slug})`} />
        {/* soft shadow ellipse */}
        <ellipse cx="100" cy="182" rx="58" ry="8" fill="rgba(28,36,32,0.12)" />
        {vessel(product.category)}
        {/* peptide-bond motif */}
        <g stroke={`hsl(${h}, 30%, 34%)`} strokeWidth="1.4" opacity="0.5">
          <line x1="18" y1="30" x2="34" y2="22" />
          <line x1="34" y1="22" x2="50" y2="30" />
          <circle cx="18" cy="30" r="3" fill={`hsl(${h}, 30%, 34%)`} />
          <circle cx="34" cy="22" r="3" fill={`hsl(${h}, 30%, 34%)`} />
          <circle cx="50" cy="30" r="3" fill={`hsl(${h}, 30%, 34%)`} />
        </g>
      </svg>
    </div>
  );
}
