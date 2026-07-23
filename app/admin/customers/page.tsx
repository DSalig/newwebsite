import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

// Lightweight CRM: one row per customer with computed lifetime
// value and segment. Segments are derived, not stored — so they
// are always current.

function segment(c: { orders_count: number; lifetime_value: number; has_subscription: boolean }): string {
  if (c.has_subscription) return "Subscriber";
  if (c.lifetime_value >= 15000) return "VIP";
  if (c.orders_count > 1) return "Repeat";
  return "New";
}

export default async function AdminCustomers() {
  const snap = await getAdminSnapshot();
  const customers = [...snap.customers].sort((a, b) => b.lifetime_value - a.lifetime_value);
  const subs = customers.filter((c) => c.has_subscription).length;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="display">Customers</h1>
        <p className="muted">
          {customers.length} customers · {subs} on subscription
          {snap.demo && " · demo data"}
        </p>
      </div>

      <div className="table-scroll" style={{ marginTop: "1.5rem" }}>
        <table className="data">
          <thead>
            <tr>
              <th>Customer</th><th>Segment</th><th>Orders</th>
              <th>Lifetime value</th><th>First order</th><th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const seg = segment(c);
              return (
                <tr key={c.email}>
                  <td>
                    {c.name || "—"}
                    <br />
                    <span className="small muted">{c.email}</span>
                  </td>
                  <td>
                    <span className={`badge ${seg === "VIP" ? "" : seg === "Subscriber" ? "green" : "blue"}`}>{seg}</span>
                  </td>
                  <td>{c.orders_count}</td>
                  <td>{formatPrice(c.lifetime_value)}</td>
                  <td>{c.first_order_at ? new Date(c.first_order_at).toLocaleDateString("en-US") : "—"}</td>
                  <td>{c.last_order_at ? new Date(c.last_order_at).toLocaleDateString("en-US") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>CRM data flow.</strong> Customers are upserted automatically from paid orders;
        quiz emails, newsletter signups, and contact-form leads land in their own tables
        (<code className="mono">quiz_sessions</code>, <code className="mono">newsletter_subscribers</code>,{" "}
        <code className="mono">leads</code>) ready for your email tool. Free-text notes per
        customer live in <code className="mono">crm_notes</code>. Suggested plays: winback
        email at 75 days since last order; VIP early access to new batches; subscribers get
        batch-COA notifications automatically.
      </div>
    </>
  );
}
