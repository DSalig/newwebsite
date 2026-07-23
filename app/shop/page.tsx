import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Peptide Skincare & Collagen",
  description:
    "Clinically-dosed peptide serums, moisturizers, and collagen peptides. Every batch third-party tested with published COAs.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
