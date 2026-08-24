# Relaunch playbook — using this codebase as a template

This repository is deliberately split into a reusable **engine** and
a swappable **brand layer**, so the next venture launches by
re-skinning, not rebuilding.

## The two layers

**Engine (keep, works for any DTC product line):**

```
lib/cart.tsx            cart + live pricing from /api/catalog
lib/catalog.ts          file-catalog ⊕ DB-override merge
lib/supabase.ts         clients + graceful form fallbacks
lib/auth.tsx            customer accounts (Supabase Auth)
lib/admin-auth.ts       staff-console write gate
lib/admin-data.ts       console data layer (live or demo)
middleware.ts           /admin auth
app/api/checkout        Stripe Checkout (payment + subscription modes)
app/api/stripe-webhook  order recording, inventory, CRM, subscriptions
app/api/catalog         public pricing feed
app/api/admin/*         product / stock / batch / order writes
app/admin/*             staff console (KPIs, orders, inventory, CRM)
app/account/*           customer account area
app/cart, app/checkout  purchase flow
supabase/schema.sql     inventory + CRM + billing schema, RLS, RPC
scripts/generate-seed.ts seed generator (npm run seed)
components/Reveal.tsx, Newsletter.tsx
```

**Brand layer (replace per site):**

```
lib/site.ts             name, domain, inboxes, disclaimers, nav
lib/products.ts         the catalog: products, copy, categories,
                        concerns, shipping thresholds
app/globals.css         :root design tokens + component vocabulary
app/page.tsx            home narrative
app/about, app/science, app/quality, app/quiz
                        category-specific storytelling pages
components/ProductVisual.tsx  procedural art (or real photos)
components/Header/Footer      nav + compliance footer
app/legal/[doc]         starter legal copy
docs/PROJECT-DEFINITION.md, docs/DESIGN-LANGUAGE.md
                        rewrite for the new brand; keep the format
```

## Relaunch procedure (a new site in ~an afternoon)

1. **New repo from this one.** On GitHub: Settings → check
   "Template repository" on the template repo, then "Use this
   template" for each new venture (or `git clone` + new remote).
2. **Rename the brand.** `lib/site.ts` (identity, inboxes,
   disclaimers), `package.json` name/description, `CLAUDE.md` header.
3. **Swap the catalog.** Rewrite `lib/products.ts` for the new
   product line. Keep the `Product` interface — everything downstream
   (shop, PDP, cart, checkout, seed, admin console) reads it. Adjust
   `Category`/`Concern` unions to the new taxonomy; the shop filters
   follow automatically. Run `npm run seed`.
4. **Re-skin.** Change only the `:root` tokens in `globals.css`
   (colors, radii, fonts + the Google Fonts link in `app/layout.tsx`)
   for a different feel with zero component edits; go deeper by
   restyling the class vocabulary. Update `ProductVisual` art and the
   favicon SVG in `layout.tsx`.
5. **Rewrite the narrative pages** (home, about, and whatever
   replaces science/quality/quiz for the category) and
   `docs/PROJECT-DEFINITION.md` / `DESIGN-LANGUAGE.md` so AI sessions
   stay on-brand.
6. **Compliance pass.** `site.fdaDisclaimer`/`complianceNote` and
   CLAUDE.md rule 1 are peptide-specific — replace them with the new
   category's rules (or delete if unregulated). Update `/legal/*`.
7. **Provision backend.** New Supabase project → `schema.sql` +
   `seed.sql`; new Stripe account → keys + webhook; set
   `ADMIN_PASSWORD`. All optional — the site fully works before any
   of it.
8. **Verify.** `npm run build`, smoke the routes, walk the
   test-mode checklist in `docs/PAYMENTS.md`.

## Rules that keep the template reusable

- Engine code must never import brand copy directly — brand facts
  flow through `lib/site.ts` and `lib/products.ts` only.
- No hex values or font names outside `globals.css` + `layout.tsx`.
- Schema changes are additive and category-agnostic (a "batch/COA"
  is generic lot tracking — any consumable brand can use or ignore it).
- Every feature keeps its zero-config fallback, so a fresh clone
  demos end-to-end before any accounts exist.

## Division of labor for live data

Copy, actives, imagery, and *new* products live in `lib/products.ts`
(code — versioned, reviewable, feeds SEO/static pages). Price,
subscribe price, stock, reorder point, and shop visibility are
editable live in the staff console once Supabase is connected
(`lib/catalog.ts` merges them everywhere, including checkout).
This split is deliberate: prose changes deserve review; operational
changes deserve immediacy.
