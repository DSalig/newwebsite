"use client";

// Product configurator + order request. Orders are captured as
// requests (Supabase `order_requests`) because every piece is
// made-to-order and manufacturer-fulfilled — our team confirms
// options, final pricing, and lead time before payment, which
// runs through the Shopify/Stripe checkout layer when connected.

import { useState } from "react";
import { submitOrderRequest } from "@/lib/supabase";
import { formatPrice, type Product } from "@/lib/products";
import { ORDERS_EMAIL } from "@/lib/site";
import DesignerConcierge from "@/components/DesignerConcierge";

export default function OrderPanel({ product }: { product: Product }) {
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");
  const [showConcierge, setShowConcierge] = useState(false);

  const pick = (group: string, value: string) =>
    setSelections((s) => ({ ...s, [group]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const ok = await submitOrderRequest({
      product_slug: product.slug,
      product_name: product.name,
      sku: product.sku,
      options: selections,
      quantity,
      name,
      email,
      notes,
    });
    if (ok) {
      setState("done");
    } else {
      // Supabase not configured or unreachable — hand off to email
      const body = [
        `Order request: ${product.name} (${product.sku})`,
        `Quantity: ${quantity}`,
        ...Object.entries(selections).map(([k, v]) => `${k}: ${v}`),
        `Notes: ${notes}`,
        `From: ${name} <${email}>`,
      ].join("\n");
      window.location.href = `mailto:${ORDERS_EMAIL}?subject=${encodeURIComponent(
        `Order request — ${product.name}`
      )}&body=${encodeURIComponent(body)}`;
      setState("fallback");
    }
  }

  if (state === "done") {
    return (
      <div className="notice">
        <strong>Request received.</strong> A designer will confirm your
        configuration, final pricing, and lead time within one business day.
        Your piece goes to our manufacturing partner the moment you approve.
      </div>
    );
  }

  return (
    <div>
      {product.options.map((opt) => (
        <div className="option-group" key={opt.name}>
          <span className="mono-note">{opt.name.toUpperCase()}</span>
          <div className="option-pills" role="group" aria-label={opt.name}>
            {opt.values.map((v) => (
              <button
                key={v}
                type="button"
                className="option-pill"
                data-selected={selections[opt.name] === v}
                onClick={() => pick(opt.name, v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="option-group">
        <span className="mono-note">QUANTITY</span>
        <div className="option-pills">
          {[1, 2, 3, 5, 10].map((q) => (
            <button
              key={q}
              type="button"
              className="option-pill"
              data-selected={quantity === q}
              onClick={() => setQuantity(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderTop: "1px solid var(--line)",
          paddingTop: 20,
          marginTop: 8,
          marginBottom: 20,
        }}
      >
        <span className="price" style={{ fontSize: 28 }}>
          {formatPrice(product.price * quantity)}
          <small>{product.priceNote}</small>
        </span>
        <span className="mono-note">MANUFACTURER-FULFILLED</span>
      </div>

      {!showForm ? (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
            Start order
          </button>
          <a href={`/contact?interest=custom&product=${product.slug}`} className="btn btn-ghost btn-lg">
            Ask a designer
          </a>
        </div>
      ) : (
        <form onSubmit={submit} className="form-grid" style={{ marginTop: 6 }}>
          <div className="field">
            <label htmlFor="op-name">Name</label>
            <input id="op-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="op-email">Email</label>
            <input id="op-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field field-full">
            <label htmlFor="op-notes">Notes — dimensions, dimmers, site details (optional)</label>
            <textarea id="op-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="field-full" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Submit order request"}
            </button>
            <span className="mono-note">NO PAYMENT TAKEN — WE CONFIRM CONFIG &amp; LEAD TIME FIRST</span>
          </div>
        </form>
      )}

      {state === "fallback" && (
        <p className="notice notice-warn" style={{ marginTop: 16 }}>
          Our order desk is momentarily offline — we opened your email client
          with the request pre-filled instead.
        </p>
      )}

      {/* human interjection: fixture decided → offer a full-service designer */}
      <div style={{ marginTop: 28, borderTop: "1px solid var(--line)", paddingTop: 22 }}>
        {!showConcierge ? (
          <button
            type="button"
            className="option-pill"
            onClick={() => setShowConcierge(true)}
            style={{ fontSize: 14 }}
          >
            ✦ Prefer full-service? Get matched with a local designer →
          </button>
        ) : (
          <DesignerConcierge
            compact
            context={{
              kind: "product-order",
              productSlug: product.slug,
              productName: product.name,
              options: selections,
            }}
            heading="Make it a full project"
            sub="A vetted local designer from our network can take this piece from configuration through installation — sizing, dimming, permits, the lot. Your selected options travel with the introduction."
          />
        )}
      </div>
    </div>
  );
}
