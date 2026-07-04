import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Shop the Collection — Made-to-Order Lighting",
  description:
    "Custom chandeliers, pendants, sconces, restored vintage fixtures, LED retrofit systems, and the proprietary Vela Series. Every piece manufacturer-fulfilled on order with custom options.",
};

export default function ProductsPage() {
  return (
    <Suspense>
      <CatalogClient />
    </Suspense>
  );
}
