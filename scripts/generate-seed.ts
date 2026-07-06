// Regenerates supabase/seed.sql from lib/products.ts so the
// hosted catalog always mirrors the storefront data.
//   node --experimental-strip-types scripts/generate-seed.ts

import { writeFileSync } from "node:fs";
import { CATEGORIES, PRODUCTS } from "../lib/products.ts";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const j = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

let sql = `-- Generated from lib/products.ts — do not edit by hand.
-- Regenerate: node --experimental-strip-types scripts/generate-seed.ts

`;

sql += "insert into categories (slug, name, short, description) values\n";
sql += CATEGORIES.map(
  (c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.short)}, ${q(c.description)})`
).join(",\n");
sql += "\non conflict (slug) do update set name = excluded.name, short = excluded.short, description = excluded.description;\n\n";

sql += "insert into products (slug, sku, name, category, art, palette, price, price_note, blurb, description, specs, options, lead_time_weeks) values\n";
sql += PRODUCTS.map((p) =>
  [
    "  (",
    [
      q(p.slug),
      q(p.sku),
      q(p.name),
      q(p.category),
      q(p.art),
      j(p.palette),
      String(p.price),
      q(p.priceNote),
      q(p.blurb),
      q(p.description),
      j(p.specs),
      j(p.options),
      `int4range(${p.leadTimeWeeks[0]}, ${p.leadTimeWeeks[1]}, '[]')`,
    ].join(", "),
    ")",
  ].join("")
).join(",\n");
sql += `
on conflict (slug) do update set
  sku = excluded.sku, name = excluded.name, category = excluded.category,
  art = excluded.art, palette = excluded.palette, price = excluded.price,
  price_note = excluded.price_note, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs,
  options = excluded.options, lead_time_weeks = excluded.lead_time_weeks;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`Wrote supabase/seed.sql — ${CATEGORIES.length} categories, ${PRODUCTS.length} products`);
