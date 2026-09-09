"use client";

// Orders table with inline status transitions. Each change saves
// immediately; failures roll the select back and surface the error.

import { useState } from "react";
import type { AdminOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";

const STATUSES = ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"];

function StatusCell({ order, writable }: { order: AdminOrder; writable: boolean }) {
  const [status, setStatus] = useState(order.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function change(next: string) {
    const prev = status;
    setStatus(next);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: order.id, status: next }),
      });
      if (!res.ok) {
        const data = await res.json();
        setStatus(prev);
        setError(data.error || "Save failed.");
      }
    } catch {
      setStatus(prev);
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  if (!writable) {
    return (
      <span className={`badge ${["paid", "shipped", "delivered"].includes(status) ? "green" : status === "refunded" ? "" : "blue"}`}>
        {status}
      </span>
    );
  }
  return (
    <>
      <select
        value={status}
        disabled={busy}
        aria-label={`Status of order ${order.id.slice(0, 8)}`}
        onChange={(e) => change(e.target.value)}
        style={{ width: "auto", padding: "0.35rem 0.6rem", fontSize: "0.85rem" }}
      >
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      {error && <p className="field-error">{error}</p>}
    </>
  );
}

export default function OrdersClient({ orders, writable }: { orders: AdminOrder[]; writable: boolean }) {
  return (
    <div className="table-scroll" style={{ marginTop: "1.5rem" }}>
      <table className="data">
        <thead>
          <tr>
            <th>Order</th><th>Date</th><th>Customer</th><th>Items</th>
            <th>Total</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
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
              <td><StatusCell order={o} writable={writable} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
