# Pepthea — Peptide Skincare & Wellness

A complete peptide e-commerce platform: a 2026-trend storefront, an AI
routine builder, batch-level lab-report transparency, Stripe checkout,
and a Supabase backend covering **inventory management, CRM, and
billing** with a password-gated staff console at `/admin`.

Built with **Next.js 15 + TypeScript** and **Supabase**. Zero-config by
design: with no environment variables at all, the full site runs — the
catalog serves from `lib/products.ts`, checkout captures order requests
instead of payments, and the staff console shows demo data.

## The positioning decision (read this first)

Pepthea sells **cosmetic (topical) and dietary (ingestible) peptides
only** — peptide serums, moisturizers, and collagen supplements. It
deliberately does **not** sell injectable or "research use only"
peptides: that market is unapproved-drug territory where Stripe,
Shopify, and PayPal all prohibit processing, ad platforms ban
promotion, and FDA enforcement is active. The legal peptide
skincare/collagen category is one of the fastest-growing DTC segments
and uses the same brand equity — that is where the durable business is.
The site's copy discipline follows from this: appearance claims for
cosmetics, authorized claims + FDA disclaimer for supplements, evidence
graded honestly on every product page.

## The name

**Pepthea** (pepthea.com — verified available, ~$11/yr at time of
build). Keeps the "pept-" root customers search for, ends in a warm,
wellness-coded suffix, is pronounceable and trademark-screenable.
Alternates checked and available at build time: aminuva.com,
peptandco.com, peptivane.com.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero, trust marquee, transparency bento, bestsellers, routine-builder callout, honest-launch note |
| `/shop` | Filterable catalog (category × skin concern) |
| `/products/[slug]` | PDP: disclosed actives table, evidence summary, batch + COA link, subscribe & save, sticky mobile buy bar |
| `/quiz` | **AI Routine Builder** — 5 questions → sequenced AM/PM routine + layering warnings, add-all-to-cart |
| `/science` | Peptide education with honest evidence grades (incl. why we don't sell injectables) |
| `/quality` | Testing pipeline + **batch/COA lookup by lot number** |
| `/cart` | Single-page cart + checkout (Stripe or graceful order-request fallback) |
| `/account` | **Authenticated user area**: sign up / sign in / password reset / email verification (Supabase Auth), order & subscription history via RLS, settings |
| `/about`, `/contact` | Brand story; contact form with Supabase → mailto fallback |
| `/legal/*` | Terms, privacy, shipping & returns (starter copy — have counsel review) |
| `/admin` | **Staff console**: KPIs, orders & billing ledger, inventory with reorder flags, CRM with LTV/segments |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (everything works, demo mode)
```

## Wiring up the backend (Supabase)

1. Create a project at supabase.com.
2. SQL editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `.env.example` → `.env.local`, fill in the Supabase URL, anon
   key, and (server-side only) service role key.

Schema highlights:

- **Inventory**: `inventory` (current stock) + `inventory_movements`
  (append-only audit: receive/sale/return/adjust) + `batches` (lot,
  COA URL, dates) — every stock number is explained by its ledger.
- **CRM**: `customers` upserted from paid orders, `customer_overview`
  view computes orders count, lifetime value, and subscription flag;
  `crm_notes`, `leads`, `newsletter_subscribers`, `quiz_sessions`
  capture every top-of-funnel touchpoint.
- **Billing**: `orders` + `order_items` written by the Stripe webhook
  through the idempotent `record_order` RPC (replay-safe), plus
  `subscriptions` and `order_requests` (pre-Stripe fallback orders,
  status `new → invoiced → paid → fulfilled`).
- **RLS**: anon key can read the catalog and *insert only* into the
  capture tables; orders/inventory/CRM are service-role only — except
  that authenticated customers can read **their own** orders and
  subscriptions (matched on the verified JWT email), which powers
  `/account` with no extra API surface.

## Turning on payments (Stripe)

1. Set `STRIPE_SECRET_KEY` in `.env.local` — checkout immediately
   switches from order-capture to real Stripe Checkout (prices are
   resolved server-side from the catalog; the client never sends
   prices).
2. Register a webhook for `checkout.session.completed` at
   `https://<domain>/api/stripe-webhook` and set
   `STRIPE_WEBHOOK_SECRET`. The webhook verifies signatures (HMAC,
   replay-protected), records the order, decrements inventory with
   audit rows, and upserts the CRM customer.
3. Subscribe & Save is real recurring billing: any subscription line
   switches the session to `mode=subscription` (every 60 days at −15%,
   one-time items ride along, shipping folded into the first invoice),
   and the webhook mirrors the Stripe subscription into the
   `subscriptions` table for CRM + `/account`.

No Stripe SDK dependency — both routes use Stripe's REST API directly.
Processor rationale, billing descriptor/receipt/refund configuration,
and the test-mode verification checklist live in `docs/PAYMENTS.md`.

## Staff console

Set `ADMIN_PASSWORD` and `/admin` is gated by `middleware.ts` (salted
SHA-256 session cookie, httpOnly). Unset, it runs in labeled demo mode
so you can review the dashboards before configuring anything.

- **Overview** — 30-day revenue, orders, AOV, low-stock count, restock queue
- **Orders & Billing** — full ledger with line items and status flow
- **Inventory** — stock vs. reorder point per SKU with active lot
- **Customers (CRM)** — LTV-sorted with derived segments (VIP / Subscriber / Repeat / New)

## 2026 UX patterns implemented

Expressive serif display type + grain + warm "clinical wellness"
palette; bento feature grids; scroll reveals (reduced-motion safe);
AI-native quiz as a core journey; radical ingredient/COA transparency
as the trust engine (in place of fake reviews — the site explicitly
has none); subscribe & save with plain-language terms; single-page
checkout with free-shipping progress bar; sticky mobile add-to-cart;
SEO (per-page metadata, sitemap, robots with `/admin` disallowed).

## Project structure

```
app/                 storefront pages, /account area, /admin console, /api routes
components/          Header, Footer, ProductCard, ProductVisual (procedural
                     SVG art per SKU — swap for photos as they're shot),
                     Reveal, Newsletter
docs/                project definition, design language, conventions +
                     prompting method, payments direction (start at CLAUDE.md)
lib/site.ts          brand identity & compliance copy
lib/auth.tsx         Supabase Auth context (accounts, reset, verification)
lib/products.ts      the catalog — single source of truth
lib/cart.tsx         cart context (localStorage)
lib/supabase.ts      anon + service clients, graceful fallbacks
lib/admin-data.ts    staff-console data layer (live or demo)
middleware.ts        /admin auth gate
supabase/            schema.sql (tables, RLS, record_order RPC), seed.sql
scripts/             seed generator (npm run seed)
public/coa/          drop lab-report PDFs here, named <LOT>.pdf
```

## Before you launch (operational checklist)

- [ ] Buy `pepthea.com`; run a trademark search on "Pepthea" (USPTO TESS)
- [ ] Product liability insurance; FDA facility registration for the
      supplement line (via your co-packer); confirm co-packer cGMP certs
- [ ] Have counsel review `/legal/*` and all product claims
- [ ] Replace procedural SVG art with real product photography
- [ ] Commission real third-party COAs and drop PDFs in `public/coa/`
- [ ] Set `ADMIN_PASSWORD`, Stripe keys, and webhook secret in production
- [ ] Connect an email tool to `newsletter_subscribers` / `quiz_sessions`
      (Resend/Klaviyo) for the winback + routine emails
