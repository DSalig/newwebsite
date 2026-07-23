"use client";

// PDP purchase panel: one-time vs subscribe & save toggle, quantity,
// add-to-cart, and the mobile sticky buy bar (2026 pattern: never
// make a thumb travel for the primary action).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function BuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [subscribe, setSubscribe] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = subscribe ? product.subscribePrice : product.price;
  const inStock = product.stock > 0;

  function handleAdd(goToCart: boolean) {
    add(product.slug, qty, subscribe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    if (goToCart) router.push("/cart");
  }

  return (
    <>
      <div className="card" style={{ padding: "1.2rem" }}>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          <label
            className="pill"
            style={{ justifyContent: "space-between", padding: "0.7rem 1rem", cursor: "pointer", borderColor: !subscribe ? "var(--ink)" : undefined }}
          >
            <span>
              <input
                type="radio"
                name="purchase-type"
                checked={!subscribe}
                onChange={() => setSubscribe(false)}
                style={{ marginRight: "0.5rem" }}
              />
              One-time purchase
            </span>
            <strong>{formatPrice(product.price)}</strong>
          </label>
          <label
            className="pill"
            style={{ justifyContent: "space-between", padding: "0.7rem 1rem", cursor: "pointer", borderColor: subscribe ? "var(--ink)" : undefined }}
          >
            <span>
              <input
                type="radio"
                name="purchase-type"
                checked={subscribe}
                onChange={() => setSubscribe(true)}
                style={{ marginRight: "0.5rem" }}
              />
              Subscribe &amp; save 15% <span className="badge green">every 60 days</span>
            </span>
            <strong>{formatPrice(product.subscribePrice)}</strong>
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", alignItems: "center" }}>
          <input
            type="number"
            min={1}
            max={20}
            value={qty}
            aria-label="Quantity"
            onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            style={{ width: "4.5rem" }}
          />
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!inStock}
            onClick={() => handleAdd(false)}
          >
            {!inStock ? "Out of stock" : added ? "Added ✓" : `Add to cart — ${formatPrice(price * qty)}`}
          </button>
        </div>
        {subscribe && (
          <p className="small muted" style={{ marginTop: "0.7rem" }}>
            Ships every 60 days. Pause, skip, or cancel anytime from your order emails — no login maze.
          </p>
        )}
        {product.stock > 0 && product.stock <= product.reorderPoint && (
          <p className="small" style={{ marginTop: "0.7rem", color: "var(--copper)" }}>
            Low stock — {product.stock} left in this batch.
          </p>
        )}
      </div>

      {/* mobile sticky buy bar */}
      <div className="sticky-buy">
        <div>
          <strong>{product.shortName}</strong>
          <span className="muted" style={{ marginLeft: "0.5rem" }}>{formatPrice(price)}</span>
        </div>
        <button className="btn btn-copper" disabled={!inStock} onClick={() => handleAdd(true)}>
          {inStock ? (added ? "Added ✓" : "Add to cart") : "Out of stock"}
        </button>
      </div>
    </>
  );
}
