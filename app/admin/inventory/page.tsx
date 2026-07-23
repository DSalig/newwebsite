import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminInventory() {
  const snap = await getAdminSnapshot();
  const stockValue = snap.inventory.reduce((s, r) => s + r.stock * r.price, 0);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="display">Inventory</h1>
        <p className="muted">
          {snap.inventory.length} SKUs · retail stock value {formatPrice(stockValue)}
          {snap.demo && " · demo data"}
        </p>
      </div>

      <div className="table-scroll" style={{ marginTop: "1.5rem" }}>
        <table className="data">
          <thead>
            <tr>
              <th>SKU</th><th>Product</th><th>Active lot</th>
              <th>Stock</th><th>Reorder at</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {snap.inventory.map((r) => {
              const low = r.stock <= r.reorder_point;
              const warn = !low && r.stock <= r.reorder_point * 1.5;
              return (
                <tr key={r.sku}>
                  <td className="mono">{r.sku}</td>
                  <td>{r.name}</td>
                  <td className="mono">{r.lot}</td>
                  <td style={{ fontWeight: low ? 700 : 400, color: low ? "var(--copper)" : undefined }}>{r.stock}</td>
                  <td>{r.reorder_point}</td>
                  <td>
                    {low ? <span className="badge">Reorder now</span>
                      : warn ? <span className="badge blue">Watch</span>
                      : <span className="badge green">OK</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>How stock moves.</strong> The Stripe webhook decrements stock per paid order
        and writes an <code className="mono">inventory_movements</code> audit row (type{" "}
        <code className="mono">sale</code>). Receive new batches by inserting a{" "}
        <code className="mono">batches</code> row + a <code className="mono">receive</code>{" "}
        movement — the COA link on the storefront batch lookup comes from that row. Counts,
        shrinkage, and returns use movement types <code className="mono">adjust</code> /{" "}
        <code className="mono">return</code>, so the ledger always explains the number above.
      </div>
    </>
  );
}
