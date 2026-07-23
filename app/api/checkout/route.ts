// Checkout: builds a Stripe Checkout Session via the REST API
// (no SDK dependency). Prices are always resolved server-side from
// the catalog — the client only sends { slug, qty, subscribe }.
// Without STRIPE_SECRET_KEY the route answers { fallback: true }
// and the cart captures an order request instead.

import { NextRequest, NextResponse } from "next/server";
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  getProduct,
} from "@/lib/products";
import { site } from "@/lib/site";

interface CheckoutBody {
  items?: { slug: string; qty: number; subscribe: boolean }[];
  email?: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = (body.items ?? []).filter(
    (i) => getProduct(i.slug) && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 20
  );
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ fallback: true });
  }

  const origin = req.nextUrl.origin;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/cart`);
  if (body.email) params.set("customer_email", body.email);
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  params.set("metadata[source]", "pepthea-web");
  params.set("payment_intent_data[metadata][source]", "pepthea-web");

  let subtotal = 0;
  items.forEach((item, i) => {
    const p = getProduct(item.slug)!;
    const unit = item.subscribe ? p.subscribePrice : p.price;
    subtotal += unit * item.qty;
    params.set(`line_items[${i}][quantity]`, String(item.qty));
    params.set(`line_items[${i}][price_data][currency]`, "usd");
    params.set(`line_items[${i}][price_data][unit_amount]`, String(unit));
    params.set(
      `line_items[${i}][price_data][product_data][name]`,
      p.shortName + (item.subscribe ? " (Subscribe & Save)" : "")
    );
    params.set(`line_items[${i}][price_data][product_data][metadata][slug]`, p.slug);
    params.set(`line_items[${i}][price_data][product_data][metadata][sku]`, p.sku);
    params.set(
      `line_items[${i}][price_data][product_data][metadata][subscribe]`,
      item.subscribe ? "true" : "false"
    );
  });

  // NOTE: recurring billing for subscribe-&-save lines is handled
  // operationally at launch (the first order is charged here at the
  // discounted price; the Stripe subscription is created from the
  // admin console / webhook flow). Moving to mode=subscription with
  // Stripe Prices is the documented upgrade path in the README.

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING;
  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shipping));
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
  params.set(
    "shipping_options[0][shipping_rate_data][display_name]",
    shipping === 0 ? "Free U.S. shipping" : "Standard U.S. shipping"
  );

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const session = await res.json();
    if (!res.ok || !session.url) {
      console.error("Stripe checkout error:", session?.error?.message);
      return NextResponse.json(
        { error: "Payment provider error — please try again shortly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe unreachable:", err);
    return NextResponse.json(
      { error: `Checkout is temporarily unavailable. Email ${site.email.support} and we'll sort you out.` },
      { status: 502 }
    );
  }
}
