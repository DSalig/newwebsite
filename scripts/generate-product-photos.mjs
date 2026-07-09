// Batch-generates all 30 product photos through the
// generate-product-image Supabase edge function (FLUX 1.1 Pro via
// Replicate) and saves them to public/products/<slug>.jpg.
//
// Prereqs:
//   1. Edge function deployed:  supabase functions deploy generate-product-image
//   2. Secret set in Supabase dashboard: REPLICATE_API_TOKEN
//   3. .env.local has NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// Run:  node scripts/generate-product-photos.mjs [--only slug1,slug2] [--force]
//
// Cost: ~$0.04/image on FLUX 1.1 Pro → ≈$1.20 for the full catalog.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// load env from .env.local
for (const line of readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
  const m = /^([A-Z_]+)=(.+)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !ANON) throw new Error("Supabase env missing — fill .env.local first");

// pull prompts out of the generated prompt pack (single source of truth)
const pack = readFileSync(path.join(root, "business/midjourney-prompts.md"), "utf8");
const entries = [...pack.matchAll(/### `([a-z0-9-]+)\.jpg`[^\n]*\n\n```\n([\s\S]*?)\n```/g)]
  .map(([, slug, prompt]) => ({
    slug,
    // strip Midjourney-only parameters for FLUX
    prompt: prompt.replace(/\s*--\S+(\s+[\w.]+)?/g, "").trim(),
  }));

const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1].split(",")
  : null;
const force = process.argv.includes("--force");

const outDir = path.join(root, "public/products");
mkdirSync(outDir, { recursive: true });

let done = 0, skipped = 0, failed = [];
for (const { slug, prompt } of entries) {
  if (only && !only.includes(slug)) continue;
  const out = path.join(outDir, `${slug}.jpg`);
  if (existsSync(out) && !force) { skipped++; continue; }

  process.stdout.write(`${slug} … `);
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-product-image`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: ANON,
        authorization: `Bearer ${ANON}`,
      },
      body: JSON.stringify({ prompt }),
    });
    const json = await res.json();
    if (!res.ok || !json.url) throw new Error(json.error || `HTTP ${res.status}`);
    const img = await fetch(json.url);
    if (!img.ok) throw new Error(`download ${img.status}`);
    writeFileSync(out, Buffer.from(await img.arrayBuffer()));
    done++;
    console.log("✓");
  } catch (e) {
    failed.push(slug);
    console.log(`✗ ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 800)); // be polite to the API
}

console.log(`\ngenerated ${done}, skipped ${skipped} (existing), failed ${failed.length}`);
if (failed.length) console.log("retry failures with: --only " + failed.join(","));
