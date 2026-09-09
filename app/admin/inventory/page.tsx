import { getAdminSnapshot } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import InventoryClient from "./InventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventory() {
  const snap = await getAdminSnapshot();
  const stockValue = snap.inventory.reduce((s, r) => s + r.stock * r.price, 0);
  const writable = Boolean(process.env.ADMIN_PASSWORD && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="display">Inventory</h1>
        <p className="muted">
          {snap.inventory.length} SKUs · retail stock value {formatPrice(stockValue)}
          {snap.demo && " · demo data"}
        </p>
      </div>
      {!writable && (
        <div className="notice" style={{ marginTop: "1rem" }}>
          <strong>Read-only.</strong> Editing switches on when Supabase
          (<code className="mono">SUPABASE_SERVICE_ROLE_KEY</code>) and{" "}
          <code className="mono">ADMIN_PASSWORD</code> are configured — the forms below are
          previews until then.
        </div>
      )}
      <InventoryClient rows={snap.inventory} writable={writable} />
      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>How stock moves.</strong> Paid orders decrement automatically via the Stripe
        webhook (movement type <code className="mono">sale</code>). Corrections made here write{" "}
        <code className="mono">adjust</code> movements; received batches write{" "}
        <code className="mono">receive</code> movements — the ledger always explains the number.
        Product copy, actives, and new products still live in <code className="mono">lib/products.ts</code>{" "}
        (see docs/TEMPLATE.md for why).
      </div>
    </>
  );
}
