// Server-side data layer for the staff console. Reads from
// Supabase with the service role when configured; otherwise serves
// deterministic demo data derived from the catalog so every
// dashboard is reviewable with zero configuration.

// NOTE: server components / route handlers only — this module
// reads SUPABASE_SERVICE_ROLE_KEY and must never ship to clients.
import { getSupabaseAdmin } from "@/lib/supabase";
import { products } from "@/lib/products";

export interface AdminOrder {
  id: string;
  email: string;
  name: string;
  amount_total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number; subscribe?: boolean }[];
}

export interface AdminCustomer {
  email: string;
  name: string;
  orders_count: number;
  lifetime_value: number;
  first_order_at: string;
  last_order_at: string;
  has_subscription: boolean;
  notes?: string;
}

export interface InventoryRow {
  sku: string;
  slug: string;
  name: string;
  lot: string;
  stock: number;
  reorder_point: number;
  price: number;
}

export interface AdminSnapshot {
  demo: boolean;
  revenue30d: number;
  orders30d: number;
  aov: number;
  lowStockCount: number;
  orders: AdminOrder[];
  customers: AdminCustomer[];
  inventory: InventoryRow[];
}

const DEMO_ORDERS: AdminOrder[] = [
  {
    id: "demo-1042",
    email: "maria@example.com",
    name: "Maria K.",
    amount_total: 12900,
    status: "shipped",
    created_at: "2026-07-21T14:03:00Z",
    items: [{ name: "The Complete Routine", qty: 1 }],
  },
  {
    id: "demo-1041",
    email: "dev@example.com",
    name: "Devon A.",
    amount_total: 9860,
    status: "paid",
    created_at: "2026-07-21T09:44:00Z",
    items: [
      { name: "Copper Renewal Serum", qty: 1 },
      { name: "Peptide Barrier Cream", qty: 1, subscribe: true },
    ],
  },
  {
    id: "demo-1040",
    email: "sam@example.com",
    name: "Sam R.",
    amount_total: 3900,
    status: "delivered",
    created_at: "2026-07-19T18:12:00Z",
    items: [{ name: "Collagen Peptides", qty: 1, subscribe: true }],
  },
];

function demoSnapshot(): AdminSnapshot {
  const inventory: InventoryRow[] = products.map((p) => ({
    sku: p.sku,
    slug: p.slug,
    name: p.shortName,
    lot: p.batch.lot,
    stock: p.stock,
    reorder_point: p.reorderPoint,
    price: p.price,
  }));
  const customers: AdminCustomer[] = DEMO_ORDERS.map((o) => ({
    email: o.email,
    name: o.name,
    orders_count: 1,
    lifetime_value: o.amount_total,
    first_order_at: o.created_at,
    last_order_at: o.created_at,
    has_subscription: o.items.some((i) => i.subscribe),
  }));
  const revenue = DEMO_ORDERS.reduce((s, o) => s + o.amount_total, 0);
  return {
    demo: true,
    revenue30d: revenue,
    orders30d: DEMO_ORDERS.length,
    aov: Math.round(revenue / DEMO_ORDERS.length),
    lowStockCount: inventory.filter((r) => r.stock <= r.reorder_point).length,
    orders: DEMO_ORDERS,
    customers,
    inventory,
  };
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const sb = getSupabaseAdmin();
  if (!sb) return demoSnapshot();

  try {
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const [ordersRes, customersRes, invRes] = await Promise.all([
      sb
        .from("orders")
        .select("id, email, name, amount_total, status, created_at, order_items(product_name, qty, is_subscription)")
        .order("created_at", { ascending: false })
        .limit(100),
      sb.from("customer_overview").select("*").limit(500),
      sb
        .from("products")
        .select("sku, slug, name, price, reorder_point, inventory(stock), batches(lot)")
        .limit(200),
    ]);

    if (ordersRes.error || customersRes.error || invRes.error) {
      console.error(
        "admin snapshot query error:",
        ordersRes.error?.message,
        customersRes.error?.message,
        invRes.error?.message
      );
      return demoSnapshot();
    }

    const orders: AdminOrder[] = (ordersRes.data ?? []).map((o) => ({
      id: o.id,
      email: o.email,
      name: o.name ?? "",
      amount_total: o.amount_total,
      status: o.status,
      created_at: o.created_at,
      items: (o.order_items ?? []).map((i: { product_name: string; qty: number; is_subscription: boolean }) => ({
        name: i.product_name,
        qty: i.qty,
        subscribe: i.is_subscription,
      })),
    }));

    const recent = orders.filter((o) => o.created_at >= since && o.status !== "refunded");
    const revenue30d = recent.reduce((s, o) => s + o.amount_total, 0);

    const inventory: InventoryRow[] = (invRes.data ?? []).map((p) => ({
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      lot: (p.batches?.[0] as { lot?: string } | undefined)?.lot ?? "—",
      stock: (p.inventory?.[0] as { stock?: number } | undefined)?.stock ?? 0,
      reorder_point: p.reorder_point ?? 0,
      price: p.price,
    }));

    const customers: AdminCustomer[] = (customersRes.data ?? []).map(
      (c: Record<string, unknown>) => ({
        email: String(c.email ?? ""),
        name: String(c.name ?? ""),
        orders_count: Number(c.orders_count ?? 0),
        lifetime_value: Number(c.lifetime_value ?? 0),
        first_order_at: String(c.first_order_at ?? ""),
        last_order_at: String(c.last_order_at ?? ""),
        has_subscription: Boolean(c.has_subscription),
        notes: c.notes ? String(c.notes) : undefined,
      })
    );

    return {
      demo: false,
      revenue30d,
      orders30d: recent.length,
      aov: recent.length ? Math.round(revenue30d / recent.length) : 0,
      lowStockCount: inventory.filter((r) => r.stock <= r.reorder_point).length,
      orders,
      customers,
      inventory,
    };
  } catch (err) {
    console.error("admin snapshot failed:", err);
    return demoSnapshot();
  }
}
