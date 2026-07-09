// Generates business/midjourney-prompts.md from lib/products.ts —
// one consistent-style prompt per SKU for Midjourney (or Flux/
// gpt-image; drop the -- parameters for non-Midjourney tools).
//   node --experimental-strip-types scripts/generate-image-prompts.ts

import { writeFileSync } from "node:fs";
import { PRODUCTS, CATEGORIES, type Product } from "../lib/products.ts";

// One style system so all 30 images read as one catalog.
const STYLE =
  "editorial product photography, warm charcoal-brown studio backdrop (deep #14110c tones), " +
  "single fixture as hero subject, fixture illuminated and glowing warm 2200K amber light, " +
  "soft rim lighting, subtle reflection on dark polished floor, generous negative space, " +
  "photographed on medium format camera, f/8, hyperdetailed materials, no people, no text";

const PARAMS = "--ar 4:5 --style raw --v 6.1";

function subject(p: Product): string {
  switch (p.art) {
    case "chandelier":
      return `${p.blurb.replace(/\.$/, "")}, suspended from above, full fixture in frame`;
    case "pendant":
      return `${p.blurb.replace(/\.$/, "")}, hanging pendant centered, cord visible`;
    case "sconce":
      return `${p.blurb.replace(/\.$/, "")}, mounted on a textured dark plaster wall, light grazing the wall`;
    case "vintage":
      return `${p.blurb.replace(/\.$/, "")}, antique fixture with visible patina and craftsmanship, museum-lit`;
    case "retrofit":
      return `${p.blurb.replace(/\.$/, "")}, clean technical product shot, device angled three-quarter view`;
    default: // vela
      return `${p.blurb.replace(/\.$/, "")}, architectural detail photograph, light integrated into modern interior surface`;
  }
}

let md = `# Product Image Prompt Pack

Generated from \`lib/products.ts\` — regenerate with
\`node --experimental-strip-types scripts/generate-image-prompts.ts\`

## How to use

1. Paste each prompt into Midjourney (or Flux/gpt-image — drop the \`--\` parameters).
2. Pick the best of the 4 variants; upscale.
3. Crop/export at 4:5 (portrait), JPG, ≤300 KB ideally (use squoosh.app).
4. Name the file **exactly** as shown (\`<slug>.jpg\`) and drop it into \`public/products/\`
   — on GitHub: open the \`public/products\` folder → "Add file" → "Upload files".
5. Push/upload = the photo replaces the placeholder art automatically. No code changes.

**Consistency tips:** generate all images in one session; if the first result nails
the mood, use its seed (\`--seed N\`) for the rest; re-roll any image whose backdrop
drifts away from the dark warm-charcoal look.

---
`;

for (const cat of CATEGORIES) {
  md += `\n## ${cat.name}\n`;
  for (const p of PRODUCTS.filter((x) => x.category === cat.slug)) {
    md += `\n### \`${p.slug}.jpg\` — ${p.name}\n\n`;
    md += "```\n" + `${subject(p)}, ${STYLE} ${PARAMS}` + "\n```\n";
  }
}

writeFileSync(new URL("../business/midjourney-prompts.md", import.meta.url), md);
console.log(`Wrote business/midjourney-prompts.md — ${PRODUCTS.length} prompts`);
