import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

// Order lifecycle: pending → paid → shipped → delivered (or
// refunded). Status transitions happen in Supabase (or via Stripe
// dashboard refunds); this view is the billing ledger.

export default async function AdminOrders() {
  const snap = await getAdminSnapshot();
  const totalLedger = snap.orders
    .filter((o) => o.status !== "refunded")
    .reduce((s, o) => s + o.amount_total, 0);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="display">Orders &amp; Billing</h1>
        <p className="muted">
          {snap.orders.length} orders · ledger {formatPrice(totalLedger)}
          {snap.demo && " · demo data"}
        </p>
      </div>

      <div className="table-scroll" style={{ marginTop: "1.5rem" }}>
        <table className="data">
          <thead>
            <tr>
              <th>Order</th><th>Date</th><th>Customer</th><th>Items</th>
              <th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {snap.orders.map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id.slice(0, 12)}</td>
                <td>{new Date(o.created_at).toLocaleDateString("en-US")}</td>
                <td>
                  {o.name || "—"}
                  <br />
                  <span className="small muted">{o.email}</span>
                </td>
                <td style={{ whiteSpace: "normal", maxWidth: "22rem" }}>
                  {o.items.map((i) => `${i.qty} × ${i.name}${i.subscribe ? " ↻" : ""}`).join(", ")}
                </td>
                <td>{formatPrice(o.amount_total)}</td>
                <td>
                  <span className={`badge ${["paid", "shipped", "delivered"].includes(o.status) ? "green" : o.status === "refunded" ? "" : "blue"}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>Billing flow.</strong> Payments and refunds live in Stripe (source of truth
        for money); this table is the fulfillment ledger recorded by the webhook. Subscription
        renewals (↻ lines) are managed under Stripe → Subscriptions. Update order status in
        Supabase as you fulfill — <code className="mono">pending → paid → shipped → delivered</code>.
      </div>
    </>
  );
}
