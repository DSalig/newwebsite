// Public pricing/availability feed for the client cart: keeps
// client-side totals consistent with the server-merged catalog
// when staff edit prices in the console. Falls back to nothing —
// the client already bundles the file catalog.

import { NextResponse } from "next/server";
import { getMergedProducts } from "@/lib/catalog";

export async function GET() {
  const products = await getMergedProducts(false);
  const map: Record<
    string,
    { price: number; subscribePrice: number; stock: number; active: boolean }
  > = {};
  for (const p of products) {
    map[p.slug] = {
      price: p.price,
      subscribePrice: p.subscribePrice,
      stock: p.stock,
      active: (p as { _active?: boolean })._active !== false,
    };
  }
  return NextResponse.json(map, {
    headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
