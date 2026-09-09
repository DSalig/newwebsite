# Pepthea — payments: processor review & billing configuration

## Category context (read first)

Peptide products are a **category-sensitive vertical** for payment
processors. Underwriting keys on: prescription status, product
framing (cosmetic/dietary vs. therapeutic), claims language, and
labeling. Stripe's published restricted-business guidance permits
certain peptide products **subject to conditions** — non-prescription
status, no false/misleading claims, cosmetic/supplement framing — and
may require pre-approval review. Pepthea's strict cosmetic + dietary
scope and appearance-only claims (CLAUDE.md rule 1) exist partly to
pass exactly this review. Approval and continued approval always rest
with the processor; keep claims discipline tight and this stays a
low-drama category entry.

## Processor comparison (July 2026)

| Processor | Std. card fee | Subscriptions | Category fit | Notes |
| --- | --- | --- | --- | --- |
| **Stripe** (recommended) | 2.9% + 30¢ | native (Billing) | Conditional — cosmetic/dietary OK with clean claims; pre-approval possible | Best API, Checkout + Customer Portal, already integrated |
| Shopify Payments | 2.9% + 30¢ (+plan) | via apps | Same conditional posture; supplements generally OK | Only if migrating the whole stack to Shopify |
| PayPal/Braintree | ~2.99% + 49¢ | yes | Supplements allowed w/ pre-approval; higher dispute friction | Worth adding later as wallet option only |
| Authorize.net + MID | ~2.9% + gateway fees | yes | Depends on acquiring bank | The "supplement-friendly MID" route; more paperwork |
| High-risk specialists (e.g. supplement MIDs) | 3.5–6% + reserves | yes | Built for the category | Fallback if Stripe declines; expect rolling reserve |

**Recommendation:** launch on **Stripe**. Fees are competitive,
subscription support is native, and the compliant product scope is
designed to satisfy its conditions. Before submitting: legal pages
live, disclaimers rendering, claims audit done, support email + clear
refund policy visible (all already on the site). If Stripe declines
despite that, fall back to a supplement-specialist MID and budget for
+1–3% fees and a rolling reserve.

## How the integration works (implemented)

- `/api/checkout` builds a Checkout Session via Stripe's REST API.
  Prices are resolved server-side from `lib/products.ts` — the client
  sends only `{slug, qty, subscribe}`.
- Carts with **no** subscription lines → `mode=payment` with a
  shipping option (free ≥ $50, else $5.95).
- Carts with **any** subscription line → `mode=subscription`:
  subscribe lines become recurring prices (every 60 days at the −15%
  price), one-time lines ride along, and shipping (when owed) is
  added as a one-time line item because subscription mode doesn't
  support shipping options.
- `/api/stripe-webhook` (`checkout.session.completed`, signature
  verified, replay-protected, idempotent): records the order + items,
  decrements inventory with audit rows, upserts the CRM customer, and
  stores the Stripe subscription id in `subscriptions`.
- No Stripe keys present → checkout degrades to order-request capture
  (`order_requests`), so preview environments never break.

## Billing descriptor, receipts, refunds (Stripe dashboard config)

- **Statement descriptor:** `PEPTHEA` (shortened: `PEPTHEA`), so
  cardholders recognize the charge — the #1 chargeback preventer.
- **Receipts:** enable automatic email receipts for successful
  payments; set support email `support@pepthea.com` and the site URL
  on the public business profile.
- **Refunds:** policy is 60-day satisfaction (see
  `/legal/shipping-returns`). Issue refunds from Stripe (they flow to
  the original payment method); then set the order row's status to
  `refunded` so the console ledger and CRM LTV stay truthful.
- **Subscriptions:** enable the no-code **Customer Portal** (pause,
  skip, cancel, card update) and link it from order emails — this is
  the "no login maze" promise on the PDP.
- **Disputes:** ship tracking numbers into Stripe metadata when
  fulfilling; category disputes are usually won on delivery proof +
  clear descriptor + visible refund policy.

## Test-mode verification checklist

1. Test keys in `.env.local`; `stripe listen --forward-to
   localhost:3000/api/stripe-webhook` for the webhook secret.
2. Card `4242 4242 4242 4242` — one-time cart → order row, inventory
   decrement + `sale` movement, customer upsert.
3. Mixed cart with a subscription line → session in subscription
   mode, `subscriptions` row with `stripe_subscription_id`.
4. Replay the webhook event (stripe CLI `--replay`) → no duplicate
   order (idempotency).
5. Refund in dashboard → set status `refunded` → console ledger and
   LTV update.
