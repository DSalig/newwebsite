# Lumenwright — The Light Atelier

A turnkey creative lighting business website: custom-designed lighting
installations, vintage lighting rehabilitation, rare chandelier repair, and
turnkey LED retrofit programs — with an AI Lighting Studio that turns a photo
of any space into a personalized, three-layer lighting plan.

Built with **Next.js 15 + TypeScript**, **Supabase** (catalog, leads, order
requests, AI consultations), and **Claude vision** for the photo-to-plan
studio. Designed on 2026 UX patterns: a dark, light-native aesthetic,
expressive serif display type, bento layouts, grain, scroll reveals, and an
AI-native core feature.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Brand story, services bento, AI callout, featured products, retrofit strip |
| `/services` | Custom installations · vintage rehabilitation · rare chandelier repair · modernization |
| `/retrofit` | The turnkey LED conversion program + interactive ROI calculator |
| `/studio` | **AI Lighting Studio** — upload a photo, get a personalized lighting plan |
| `/products` | 30-piece made-to-order catalog across 6 categories, filterable |
| `/products/[slug]` | Product detail: procedural SVG art, specs, custom options, order request |
| `/about` | The vertically integrated platform story + Vela Series + growth avenues |
| `/trade` | Architects, designers, developers, contractors |
| `/contact` | Consultation booking (interest presets via `?interest=`) |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

The site is fully functional with **zero configuration**: the catalog serves
from `lib/products.ts`, the AI studio runs in demo mode (deterministic plans
by room type), and forms fall back to a pre-filled `mailto:` handoff.

## Wiring up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor (tables + RLS + storage bucket).
3. Run `supabase/seed.sql` to load the catalog (regenerate anytime with
   `node --experimental-strip-types scripts/generate-seed.ts`).
4. Copy `.env.example` → `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Leads land in `leads`, product configurations in `order_requests`
(status flow: `new → confirmed → sent_to_manufacturer → fulfilled` — matching
the made-to-order, manufacturer-fulfilled model), and studio sessions in
`ai_consultations`.

## Enabling real AI photo analysis

Set `ANTHROPIC_API_KEY` in `.env.local` and the `/api/analyze` route reads
uploaded photos with Claude vision, grounded in the product catalog, and
returns the same JSON shape the demo mode produces — so the UI is identical
either way and degrades gracefully on any failure.

Prefer to keep AI calls inside Supabase (e.g. static hosting)? Deploy the
included edge function instead:

```bash
supabase functions deploy analyze-space
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## Commerce: where Shopify fits

Every piece is **made to order** — manufacturing partners fulfill on order —
so the storefront intentionally captures *order requests* (configuration +
contact) rather than taking payment blind. A designer confirms options, final
pricing, and lead time first. When you're ready to take payment:

- **Shopify**: create products mirroring `lib/products.ts` SKUs, then swap the
  `OrderPanel` submit for a Shopify Storefront API `cartCreate` (env slots are
  stubbed in `.env.example`), or embed Buy Buttons per SKU.
- **Stripe**: a `checkout.sessions.create` call in a new API route works with
  the same payload `OrderPanel` already builds.

The `order_requests.status` column is designed to track fulfillment either way.

## Project structure

```
app/                 pages (App Router) + /api/analyze
components/          Header, Footer, ProductArt (procedural SVG), ProductCard,
                     Reveal (scroll animation), RoiCalculator
lib/products.ts      the catalog — single source of truth
lib/supabase.ts      client + graceful fallbacks
supabase/            schema.sql, seed.sql, analyze-space edge function
scripts/             seed generator
legacy/              pre-rebuild drafts kept for reference
```

## Notes

- Product imagery is procedurally generated SVG (deterministic per SKU), so
  the catalog ships looking consistent before photography exists — replace
  `ProductArt` with real photos per product as they're shot.
- The ROI calculator uses conservative published equipment/labor figures;
  the turnkey program replaces it with a metered financial analysis.
- All AI plans are labeled as drafts and positioned for human designer review.
