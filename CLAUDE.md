# Pepthea — agent configuration

This file is the agent layer the project builds against: read it
before generating any code or copy so output stays consistent
between sessions. The deeper references live in `docs/`:

- `docs/PROJECT-DEFINITION.md` — what Pepthea is, who it serves, positioning
- `docs/DESIGN-LANGUAGE.md` — tokens, type, spacing, motion, interaction states
- `docs/CONVENTIONS.md` — file structure, naming, prompting method
- `docs/PAYMENTS.md` — processor rationale and billing configuration
- `docs/TEMPLATE.md` — engine vs. brand layer; how to relaunch this
  codebase as a new site with a different UI

## Commands

```bash
npm run dev      # local dev server
npm run build    # must pass before any commit
npm run seed     # regenerate supabase/seed.sql after catalog edits
```

## Hard rules (non-negotiable)

1. **Claims discipline.** Pepthea sells cosmetic and dietary peptides
   only. Cosmetic copy describes *appearance* ("the look of
   firmness"), never physiology or disease. Ingestibles carry the FDA
   disclaimer (`site.fdaDisclaimer`) wherever they render. Never add
   injectable or research-use-only products, copy, or comparisons.
2. **No fabricated social proof.** No invented reviews, counts,
   testimonials, or press. Trust is carried by transparency features
   (disclosed doses, batch COAs), not manufactured signals.
3. **Prices are never trusted from the client.** Base prices live in
   `lib/products.ts` (cents); once Supabase is connected the staff
   console owns the operational fields (price, subscribe price,
   stock, visibility, reorder point) and `lib/catalog.ts` merges
   them into every server read — including `/api/checkout`, which
   always re-resolves prices server-side. Copy, actives, and new
   products stay in `lib/products.ts` (see docs/TEMPLATE.md).
4. **Graceful degradation.** Every feature must work with zero env
   vars: Supabase absent → mailto/demo fallbacks; Stripe absent →
   order-request capture; ADMIN_PASSWORD absent → labeled demo console.
5. **Design tokens only.** No hex values or ad-hoc fonts in
   components — use the CSS custom properties in `app/globals.css`
   and the class vocabulary documented in `docs/DESIGN-LANGUAGE.md`.
6. **Accessibility floor.** Every interactive element: visible focus,
   accessible name, correct element (button vs link). Motion respects
   `prefers-reduced-motion`. Forms use `.field` + real `<label>`s.

## Where things live

Catalog `lib/products.ts` · brand/compliance copy `lib/site.ts` ·
cart `lib/cart.tsx` · auth `lib/auth.tsx` · anon Supabase client +
form fallbacks `lib/supabase.ts` · staff-console data `lib/admin-data.ts`
(server-only) · schema + RLS `supabase/schema.sql` · storefront pages
`app/<route>/page.tsx` (server) with `<Name>Client.tsx` for
interactivity · staff console `app/admin/*` behind `middleware.ts`.
