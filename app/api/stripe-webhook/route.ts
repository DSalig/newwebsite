// Stripe webhook: on checkout.session.completed, records the order
// + line items in Supabase, decrements inventory (with movement
// audit rows), and upserts the customer for the CRM — all via the
// `record_order` RPC defined in supabase/schema.sql.
//
// Signature verification implements Stripe's documented scheme
// (HMAC-SHA256 over "<timestamp>.<payload>") with Node's crypto,
// so no SDK is needed.

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  // Reject events older than 5 minutes (replay protection).
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const payload = await req.text();
  const sigHeader = req.headers.get("stripe-signature") ?? "";
  if (!verifySignature(payload, sigHeader, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload);
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

  // Line items aren't embedded in the event — fetch them.
  let lineItems: { description: string; quantity: number; amount_total: number; price?: { product?: string } }[] = [];
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items?limit=100&expand[]=data.price.product`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    const data = await res.json();
    lineItems = data.data ?? [];
  } catch (err) {
    console.error("Failed to fetch line items:", err);
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    // Payment succeeded but the DB isn't wired: acknowledge (so
    // Stripe stops retrying a hopeless call) and log loudly.
    console.error("ORDER NOT RECORDED (no Supabase):", session.id);
    return NextResponse.json({ received: true, recorded: false });
  }

  const items = lineItems.map((li) => {
    const product = li.price?.product as unknown as
      | { metadata?: { slug?: string; sku?: string; subscribe?: string } }
      | undefined;
    return {
      slug: product?.metadata?.slug ?? "unknown",
      sku: product?.metadata?.sku ?? "unknown",
      name: li.description,
      qty: li.quantity ?? 1,
      total: li.amount_total ?? 0,
      subscribe: product?.metadata?.subscribe === "true",
    };
  });

  const { error } = await sb.rpc("record_order", {
    p_stripe_session_id: session.id,
    p_email: session.customer_details?.email ?? session.customer_email ?? "unknown",
    p_name: session.customer_details?.name ?? "",
    p_amount_total: session.amount_total ?? 0,
    p_amount_shipping: session.total_details?.amount_shipping ?? 0,
    p_currency: session.currency ?? "usd",
    p_shipping_address: session.customer_details?.address ?? {},
    p_items: items,
  });
  if (error) {
    console.error("record_order failed:", error.message);
    // 500 → Stripe retries with backoff; record_order is idempotent
    // on stripe_session_id so retries are safe.
    return NextResponse.json({ error: "Recording failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
