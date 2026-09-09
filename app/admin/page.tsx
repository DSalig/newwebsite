import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const snap = await getAdminSnapshot();

  const kpis: [string, string, string][] = [
    ["Revenue · 30d", formatPrice(snap.revenue30d), "/admin/orders"],
    ["Orders · 30d", String(snap.orders30d), "/admin/orders"],
    ["Avg. order value", formatPrice(snap.aov), "/admin/orders"],
    ["Low-stock SKUs", String(snap.lowStockCount), "/admin/inventory"],
  ];

  return (
    <>
      {snap.demo && (
        <div className="notice" style={{ marginBottom: "1.5rem" }}>
          <strong>Demo mode.</strong> Connect Supabase (and set <code className="mono">SUPABASE_SERVICE_ROLE_KEY</code> +{" "}
          <code className="mono">ADMIN_PASSWORD</code>) to see live data. These numbers are sample data.
        </div>
      )}
      <h1 className="display">Overview</h1>
      <div className="grid cols-4" style={{ margin: "1.5rem 0" }}>
        {kpis.map(([label, value, href]) => (
          <Link key={label} href={href} className="card">
            <p className="mono muted" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</p>
            <p className="stat-num" style={{ marginTop: "0.4rem" }}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid cols-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3 className="display">Latest orders</h3>
          <div className="table-scroll" style={{ marginTop: "0.8rem" }}>
            <table className="data">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {snap.orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="mono">{o.id.slice(0, 10)}</td>
                    <td>{o.email}</td>
                    <td>{formatPrice(o.amount_total)}</td>
                    <td><span className={`badge ${o.status === "paid" || o.status === "shipped" || o.status === "delivered" ? "green" : ""}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="display">Restock queue</h3>
          <div className="table-scroll" style={{ marginTop: "0.8rem" }}>
            <table className="data">
              <thead>
                <tr><th>SKU</th><th>Product</th><th>Stock</th><th>Reorder at</th></tr>
              </thead>
              <tbody>
                {snap.inventory
                  .filter((r) => r.stock <= r.reorder_point * 1.5)
                  .sort((a, b) => a.stock / (a.reorder_point || 1) - b.stock / (b.reorder_point || 1))
                  .slice(0, 6)
                  .map((r) => (
                    <tr key={r.sku}>
                      <td className="mono">{r.sku}</td>
                      <td>{r.name}</td>
                      <td style={{ color: r.stock <= r.reorder_point ? "var(--copper)" : undefined, fontWeight: r.stock <= r.reorder_point ? 700 : 400 }}>{r.stock}</td>
                      <td>{r.reorder_point}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {snap.inventory.every((r) => r.stock > r.reorder_point * 1.5) && (
            <p className="muted small" style={{ marginTop: "0.8rem" }}>Nothing near reorder point. 🎉</p>
          )}
        </div>
      </div>
    </>
  );
}
