"use client";

// Single-page cart + checkout (2026 pattern: no multi-step funnel).
// Payment path: POST /api/checkout → Stripe Checkout when the
// server has keys; otherwise the order is captured as an
// order_request (Supabase → mailto fallback) and a human follows
// up with a payment link — no sale is ever silently dropped.

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import {
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  getProduct,
} from "@/lib/products";
import { site } from "@/lib/site";
import { submitOrderRequest } from "@/lib/supabase";
import ProductVisual from "@/components/ProductVisual";

export default function CartClient() {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "captured" | "error">("idle");
  const [message, setMessage] = useState("");

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (cart.lines.length === 0) return;
    setState("busy");
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cart.lines, email, name }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      if (data.fallback) {
        // Stripe not configured — capture the order instead.
        const items = cart.lines.map((l) => {
          const p = getProduct(l.slug)!;
          return {
            slug: l.slug,
            name: p.shortName,
            qty: l.qty,
            subscribe: l.subscribe,
            unit_price: l.subscribe ? p.subscribePrice : p.price,
          };
        });
        const ok = await submitOrderRequest({
          email,
          name,
          items,
          subtotal: cart.subtotal,
          source: "cart-fallback",
        });
        if (ok) {
          cart.clear();
          setState("captured");
        } else {
          const body = encodeURIComponent(
            `Order request from ${name} <${email}>\n\n` +
              items.map((i) => `${i.qty} × ${i.name}${i.subscribe ? " (subscription)" : ""}`).join("\n") +
              `\n\nSubtotal: ${formatPrice(cart.subtotal)}`
          );
          window.location.href = `mailto:${site.email.support}?subject=${encodeURIComponent("Order request")}&body=${body}`;
          setState("captured");
        }
        return;
      }
      setState("error");
      setMessage(data.error || "Checkout is unavailable right now — please try again.");
    } catch {
      setState("error");
      setMessage("Checkout is unavailable right now — please try again.");
    }
  }

  if (state === "captured") {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: "40rem" }}>
          <h1 className="display">Order received. 🎉</h1>
          <p className="lede" style={{ margin: "1rem 0" }}>
            Online payment isn&apos;t live yet, so we&apos;ve logged your order and will email
            you a secure payment link within one business day. Nothing ships (and nothing is
            charged) until you approve it.
          </p>
          <Link href="/shop" className="btn btn-primary">Keep browsing</Link>
        </div>
      </section>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1 className="display">Your cart is empty.</h1>
          <p className="muted" style={{ margin: "1rem 0 2rem" }}>
            The Routine Builder is the fastest way to fill it well.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
            <Link href="/shop" className="btn btn-primary">Shop all</Link>
            <Link href="/quiz" className="btn btn-ghost">Build my routine</Link>
          </div>
        </div>
      </section>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="display">Cart</h1>
        <div className="grid cols-2" style={{ gap: "2.5rem", marginTop: "2rem", alignItems: "start" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            {cart.lines.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              const unit = l.subscribe ? p.subscribePrice : p.price;
              return (
                <div key={`${l.slug}-${l.subscribe}`} className="card" style={{ display: "flex", gap: "1rem", padding: "1rem", alignItems: "center" }}>
                  <div style={{ width: "84px", flexShrink: 0 }}>
                    <ProductVisual product={p} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                      <Link href={`/products/${p.slug}`}><strong>{p.shortName}</strong></Link>
                      <strong>{formatPrice(unit * l.qty)}</strong>
                    </div>
                    <p className="small muted">
                      {formatPrice(unit)} each
                      {l.subscribe && <span className="badge green" style={{ marginLeft: "0.5rem" }}>subscription −15%</span>}
                    </p>
                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem", alignItems: "center" }}>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={l.qty}
                        aria-label={`Quantity of ${p.shortName}`}
                        onChange={(e) => cart.setQty(l.slug, l.subscribe, Number(e.target.value) || 0)}
                        style={{ width: "4.2rem" }}
                      />
                      <button className="small" style={{ background: "none", border: 0, color: "var(--ink-faint)", textDecoration: "underline" }} onClick={() => cart.remove(l.slug, l.subscribe)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form className="card" onSubmit={checkout}>
            <h3 className="display">Summary</h3>
            {remaining > 0 ? (
              <>
                <p className="small muted" style={{ margin: "0.8rem 0 0.4rem" }}>
                  {formatPrice(remaining)} away from free U.S. shipping
                </p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }} />
                </div>
              </>
            ) : (
              <p className="small" style={{ margin: "0.8rem 0", color: "var(--evergreen)", fontWeight: 600 }}>
                ✓ Free U.S. shipping unlocked
              </p>
            )}
            <div style={{ display: "grid", gap: "0.4rem", margin: "1.2rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Subtotal</span><span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Shipping</span>
                <span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span>
              </div>
              <hr className="hr" style={{ margin: "0.5rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
                <span>Total</span><span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="co-name">Name</label>
              <input id="co-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="co-email">Email</label>
              <input id="co-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <button className="btn btn-copper btn-block" disabled={state === "busy"}>
              {state === "busy" ? "One moment…" : "Checkout securely"}
            </button>
            {state === "error" && (
              <p className="small" style={{ color: "var(--copper)", marginTop: "0.7rem" }}>{message}</p>
            )}
            {cart.hasIngestible && (
              <p className="small muted" style={{ marginTop: "0.9rem" }}>*{site.fdaDisclaimer}</p>
            )}
            <p className="small muted" style={{ marginTop: "0.5rem" }}>
              Payments processed by Stripe. We never see or store card numbers.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
