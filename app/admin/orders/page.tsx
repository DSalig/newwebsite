import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

// Order lifecycle: pending → paid → shipped → delivered (or
// refunded/cancelled). Money truth stays in Stripe; this is the
// fulfillment ledger.

export default async function AdminOrders() {
  const snap = await getAdminSnapshot();
  const totalLedger = snap.orders
    .filter((o) => o.status !== "refunded")
    .reduce((s, o) => s + o.amount_total, 0);
  const writable = Boolean(process.env.ADMIN_PASSWORD && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="display">Orders &amp; Billing</h1>
        <p className="muted">
          {snap.orders.length} orders · ledger {formatPrice(totalLedger)}
          {snap.demo && " · demo data"}
        </p>
      </div>
      {!writable && (
        <div className="notice" style={{ marginTop: "1rem" }}>
          <strong>Read-only.</strong> Status editing switches on when Supabase and{" "}
          <code className="mono">ADMIN_PASSWORD</code> are configured.
        </div>
      )}
      <OrdersClient orders={snap.orders} writable={writable} />
      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>Billing flow.</strong> Refunds are issued in Stripe first (money truth), then
        marked <code className="mono">refunded</code> here so the ledger and CRM lifetime value
        stay honest. Subscription renewals (↻ lines) are managed under Stripe → Subscriptions /
        the customer portal.
      </div>
    </>
  );
}
