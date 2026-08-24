"use client";

// Editable inventory: per-row price/reorder/visibility edits, stock
// corrections (audited), and a receive-batch form. Each row saves
// independently so a slow network never blocks the whole table.

import { useState } from "react";
import type { InventoryRow } from "@/lib/admin-data";

const dollars = (cents: number) => (cents / 100).toFixed(2);
const cents = (s: string) => Math.round(Number(s) * 100);

async function post(path: string, body: object): Promise<string | null> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return res.ok ? null : data.error || "Save failed.";
  } catch {
    return "Network error — try again.";
  }
}

function Row({ initial, writable }: { initial: InventoryRow; writable: boolean }) {
  const [row, setRow] = useState({
    price: dollars(initial.price),
    subscribe_price: dollars(initial.subscribe_price),
    stock: String(initial.stock),
    reorder_point: String(initial.reorder_point),
    active: initial.active,
    note: "",
  });
  const [state, setState] = useState<"idle" | "busy" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const stockNum = Number(row.stock);
  const reorderNum = Number(row.reorder_point);
  const low = stockNum <= reorderNum;

  async function save() {
    setState("busy");
    setError("");
    const productErr = await post("/api/admin/product", {
      slug: initial.slug,
      price: cents(row.price),
      subscribe_price: cents(row.subscribe_price),
      reorder_point: reorderNum,
      active: row.active,
    });
    const stockErr =
      stockNum !== initial.stock
        ? await post("/api/admin/stock", {
            slug: initial.slug,
            stock: stockNum,
            note: row.note || `console edit (${initial.stock} → ${stockNum})`,
          })
        : null;
    const err = productErr ?? stockErr;
    if (err) {
      setState("error");
      setError(err);
    } else {
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <tr style={{ opacity: row.active ? 1 : 0.55 }}>
      <td className="mono">{initial.sku}</td>
      <td>
        {initial.name}
        <br />
        <span className="small muted mono">{initial.lot}</span>
      </td>
      <td>
        <input
          type="number" min={0} step="0.01" value={row.price} disabled={!writable}
          aria-label={`Price of ${initial.name} in dollars`}
          onChange={(e) => setRow({ ...row, price: e.target.value })}
          style={{ width: "5.5rem" }}
        />
      </td>
      <td>
        <input
          type="number" min={0} step="0.01" value={row.subscribe_price} disabled={!writable}
          aria-label={`Subscription price of ${initial.name} in dollars`}
          onChange={(e) => setRow({ ...row, subscribe_price: e.target.value })}
          style={{ width: "5.5rem" }}
        />
      </td>
      <td>
        <input
          type="number" min={0} value={row.stock} disabled={!writable}
          aria-label={`Stock of ${initial.name}`}
          onChange={(e) => setRow({ ...row, stock: e.target.value })}
          style={{ width: "4.5rem", fontWeight: low ? 700 : 400, color: low ? "var(--copper)" : undefined }}
        />
      </td>
      <td>
        <input
          type="number" min={0} value={row.reorder_point} disabled={!writable}
          aria-label={`Reorder point of ${initial.name}`}
          onChange={(e) => setRow({ ...row, reorder_point: e.target.value })}
          style={{ width: "4rem" }}
        />
      </td>
      <td>
        <label className="small" style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center", cursor: writable ? "pointer" : "default" }}>
          <input
            type="checkbox" checked={row.active} disabled={!writable}
            onChange={(e) => setRow({ ...row, active: e.target.checked })}
          />
          in shop
        </label>
      </td>
      <td>
        <button
          className={`btn btn-ghost ${state === "busy" ? "loading" : ""}`}
          style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
          disabled={!writable || state === "busy"}
          onClick={save}
        >
          {state === "busy" && <span className="spinner" aria-hidden="true" />}
          {state === "saved" ? "Saved ✓" : "Save"}
        </button>
        {state === "error" && <p className="field-error">{error}</p>}
      </td>
    </tr>
  );
}

function ReceiveBatch({ rows, writable }: { rows: InventoryRow[]; writable: boolean }) {
  const [form, setForm] = useState({
    slug: rows[0]?.slug ?? "",
    lot: "",
    qty: "",
    manufactured_on: "",
    best_by: "",
  });
  const [state, setState] = useState<"idle" | "busy">("idle");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setMsg(null);
    const err = await post("/api/admin/batch", {
      slug: form.slug,
      lot: form.lot,
      qty: Number(form.qty),
      manufactured_on: form.manufactured_on,
      best_by: form.best_by,
    });
    setMsg(
      err
        ? { ok: false, text: err }
        : { ok: true, text: `Lot ${form.lot.toUpperCase()} received — stock updated. Reload to see new totals. Drop the COA PDF at public/coa/${form.lot.toUpperCase()}.pdf.` }
    );
    if (!err) setForm({ ...form, lot: "", qty: "" });
    setState("idle");
  }

  return (
    <form className="card" onSubmit={submit} style={{ marginTop: "1.5rem" }}>
      <h3 className="display">Receive a batch</h3>
      <p className="small muted" style={{ margin: "0.4rem 0 1rem" }}>
        Logs the lot, adds its units to stock, and writes the receive movement in one step.
      </p>
      <div className="grid cols-3" style={{ gap: "0.8rem" }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="rb-product">Product</label>
          <select id="rb-product" value={form.slug} disabled={!writable}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}>
            {rows.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="rb-lot">Lot number</label>
          <input id="rb-lot" type="text" required placeholder="PT26-CRS-002" value={form.lot}
            disabled={!writable} onChange={(e) => setForm({ ...form, lot: e.target.value })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="rb-qty">Units received</label>
          <input id="rb-qty" type="number" required min={1} value={form.qty}
            disabled={!writable} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="rb-mfg">Manufactured (YYYY-MM)</label>
          <input id="rb-mfg" type="text" placeholder="2026-08" value={form.manufactured_on}
            disabled={!writable} onChange={(e) => setForm({ ...form, manufactured_on: e.target.value })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="rb-exp">Best by (YYYY-MM)</label>
          <input id="rb-exp" type="text" placeholder="2028-08" value={form.best_by}
            disabled={!writable} onChange={(e) => setForm({ ...form, best_by: e.target.value })} />
        </div>
        <div style={{ display: "flex", alignItems: "end" }}>
          <button className={`btn btn-primary ${state === "busy" ? "loading" : ""}`} disabled={!writable || state === "busy"}>
            {state === "busy" && <span className="spinner" aria-hidden="true" />}
            Receive
          </button>
        </div>
      </div>
      {msg && (
        <p className={msg.ok ? "small" : "field-error"} role="status" style={{ marginTop: "0.8rem", fontWeight: msg.ok ? 600 : undefined }}>
          {msg.text}
        </p>
      )}
    </form>
  );
}

export default function InventoryClient({ rows, writable }: { rows: InventoryRow[]; writable: boolean }) {
  return (
    <>
      <div className="table-scroll" style={{ marginTop: "1.5rem" }}>
        <table className="data">
          <thead>
            <tr>
              <th>SKU</th><th>Product · lot</th><th>Price $</th><th>Sub $</th>
              <th>Stock</th><th>Reorder at</th><th>Visibility</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => <Row key={r.sku} initial={r} writable={writable} />)}
          </tbody>
        </table>
      </div>
      <ReceiveBatch rows={rows} writable={writable} />
    </>
  );
}
