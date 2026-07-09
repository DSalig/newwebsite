"use client";

// Product imagery with graceful upgrade path: if a real photo
// exists at /products/<slug>.jpg it renders; otherwise the
// procedural SVG art shows. Drop correctly-named images into
// public/products/ and they appear with zero code changes.
// (Prompt pack for generating photos: business/midjourney-prompts.md)

import { useState } from "react";
import ProductArt from "./ProductArt";
import type { ArtKind } from "@/lib/products";

interface Props {
  slug: string;
  kind: ArtKind;
  palette: [string, string];
  size?: number;
  alt: string;
}

export default function ProductVisual({ slug, kind, palette, size = 260, alt }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (photoFailed) {
    return <ProductArt kind={kind} palette={palette} seed={slug} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/products/${slug}.jpg`}
      alt={alt}
      onError={() => setPhotoFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      loading="lazy"
    />
  );
}
