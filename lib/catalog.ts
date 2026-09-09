// Merged catalog: the file catalog (lib/products.ts) is the base —
// copy, actives, evidence, art — while Supabase, once configured,
// owns the OPERATIONAL fields staff edit in the console: price,
// subscribe price, visibility (active), reorder point, and live
// stock. Server code (pages, checkout) merges the two here; without
// Supabase (or on any failure/stall) the file catalog serves alone,
// so zero-config preview never breaks.

import { products as fileProducts, type Product } from "@/lib/products";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

export interface OverrideRow {
  slug: string;
  price: number;
  subscribe_price: number;
  reorder_point: number;
  active: boolean;
  stock?: number;
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function fetchOverrides(): Promise<OverrideRow[] | null> {
  // Service client also embeds live stock (inventory has no public
  // read policy); anon client still gets the price/active fields.
  const admin = getSupabaseAdmin();
  const sb = admin ?? getSupabase();
  if (!sb) return null;
  const attempt = (async () => {
    const cols: string = admin
      ? "slug, price, subscribe_price, reorder_point, active, inventory(stock)"
      : "slug, price, subscribe_price, reorder_point, active";
    // Cast: the dynamic column list defeats supabase-js's literal
    // query parser; rows are validated field-by-field below anyway.
    const { data, error } = (await sb.from("products").select(cols)) as {
      data: Record<string, unknown>[] | null;
      error: unknown;
    };
    if (error || !data) return null;
    return data.map((r: Record<string, unknown>) => ({
      slug: String(r.slug),
      price: Number(r.price),
      subscribe_price: Number(r.subscribe_price),
      reorder_point: Number(r.reorder_point ?? 0),
      active: Boolean(r.active),
      stock: Array.isArray(r.inventory)
        ? Number((r.inventory[0] as { stock?: number } | undefined)?.stock ?? 0)
        : undefined,
    }));
  })().catch(() => null);
  return withTimeout(attempt, 3000, null);
}

/** File catalog with DB operational fields merged in. `activeOnly`
 *  drops products hidden from the shop by staff. */
export async function getMergedProducts(activeOnly = false): Promise<Product[]> {
  const overrides = await fetchOverrides();
  if (!overrides) return fileProducts;
  const bySlug = new Map(overrides.map((o) => [o.slug, o]));
  const merged = fileProducts.map((p) => {
    const o = bySlug.get(p.slug);
    if (!o) return p;
    return {
      ...p,
      price: o.price,
      subscribePrice: o.subscribe_price,
      reorderPoint: o.reorder_point,
      stock: o.stock ?? p.stock,
      // stash visibility without widening the Product type
      featured: p.featured && o.active,
      _active: o.active,
    } as Product & { _active?: boolean };
  });
  return activeOnly
    ? merged.filter((p) => (p as Product & { _active?: boolean })._active !== false)
    : merged;
}

export async function getMergedProduct(slug: string): Promise<Product | undefined> {
  const all = await getMergedProducts(false);
  return all.find((p) => p.slug === slug);
}
