import type { Metadata } from "next";
import { Suspense } from "react";
import { getMergedProducts } from "@/lib/catalog";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Peptide Skincare & Collagen",
  description:
    "Clinically-dosed peptide serums, moisturizers, and collagen peptides. Every batch third-party tested with published COAs.",
};

// ISR so console price/visibility edits reach the shop within a
// minute without a redeploy.
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getMergedProducts(true);
  return (
    <Suspense>
      <ShopClient products={products} />
    </Suspense>
  );
}
