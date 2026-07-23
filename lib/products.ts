// The Pepthea catalog — single source of truth for the storefront.
// Mirrored into Supabase by supabase/seed.sql; the site renders from
// this file so it works with zero configuration.
//
// Copy discipline: every product is a cosmetic (topical) or dietary
// supplement (ingestible). Claims describe appearance, feel, and
// ingredient function — never disease treatment. Ingestibles carry
// the FDA disclaimer wherever they render.

export type Category =
  | "Serums"
  | "Moisturizers"
  | "Eye & Lip"
  | "Hair & Body"
  | "Ingestibles"
  | "Bundles";

export type Concern =
  | "Fine lines"
  | "Firmness"
  | "Barrier repair"
  | "Hydration"
  | "Brightening"
  | "Hair density"
  | "Joint & skin support";

export interface Active {
  name: string;
  inci: string;
  pct: string;
  role: string;
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  category: Category;
  concerns: Concern[];
  price: number; // cents
  subscribePrice: number; // cents, ~15% off
  size: string;
  ingestible: boolean;
  tagline: string;
  description: string;
  actives: Active[];
  howToUse: string[];
  evidence: string; // honest summary of ingredient-level research
  pairsWith: string[]; // slugs
  // Launch batch shown on the PDP + /quality lookup. Real COA PDFs
  // replace coaPath once lab reports are in hand.
  batch: { lot: string; mfg: string; exp: string; coaPath: string };
  stock: number; // seed stock level, mirrored to Supabase inventory
  reorderPoint: number;
  featured?: boolean;
  hue: number; // drives procedural product art
}

const p = (dollars: number) => Math.round(dollars * 100);
const sub = (dollars: number) => Math.round(dollars * 100 * 0.85);

export const products: Product[] = [
  {
    slug: "copper-renewal-serum",
    sku: "PT-SER-001",
    name: "Copper Renewal Serum · GHK-Cu 2%",
    shortName: "Copper Renewal Serum",
    category: "Serums",
    concerns: ["Firmness", "Fine lines"],
    price: p(58),
    subscribePrice: sub(58),
    size: "30 ml",
    ingestible: false,
    tagline: "The blue serum. Copper tripeptide at a clinical 2%.",
    description:
      "GHK-Cu (copper tripeptide-1) is among the most-studied cosmetic peptides for the look of firmness and skin renewal. Ours is dosed at a true 2% in a minimal, fragrance-free base — the natural blue color is the copper complex itself, not a dye.",
    actives: [
      { name: "Copper Tripeptide-1", inci: "Copper Tripeptide-1", pct: "2%", role: "Visible firmness & renewal" },
      { name: "Panthenol", inci: "Panthenol", pct: "2%", role: "Soothing & hydration" },
      { name: "Low-weight HA", inci: "Sodium Hyaluronate", pct: "0.5%", role: "Plumping hydration" },
    ],
    howToUse: [
      "Apply 3–4 drops to clean, dry skin in the evening.",
      "Avoid layering with strong direct acids (pH < 3.5) in the same routine.",
      "Follow with moisturizer. Use SPF daily.",
    ],
    evidence:
      "GHK-Cu has decades of published cosmetic research on the appearance of aged skin, including split-face studies showing improved look of firmness and fine lines over 12 weeks. We link the primary literature on The Science page — and we don't extrapolate beyond it.",
    pairsWith: ["peptide-barrier-cream", "eye-revival-cream"],
    batch: { lot: "PT24-CRS-001", mfg: "2026-06", exp: "2027-12", coaPath: "/coa/PT24-CRS-001.pdf" },
    stock: 240,
    reorderPoint: 60,
    featured: true,
    hue: 205,
  },
  {
    slug: "smooth-signal-serum",
    sku: "PT-SER-002",
    name: "Smooth Signal Serum · Matrixyl 3000 + Argireline",
    shortName: "Smooth Signal Serum",
    category: "Serums",
    concerns: ["Fine lines", "Firmness"],
    price: p(52),
    subscribePrice: sub(52),
    size: "30 ml",
    ingestible: false,
    tagline: "Two signal peptides, dosed like the studies.",
    description:
      "Matrixyl 3000 (palmitoyl tri- & tetrapeptides) and Argireline (acetyl hexapeptide-8) are the two most-searched anti-wrinkle peptides for a reason: both have vendor-run but published split-face data at specific doses. We use those doses — 3% Matrixyl 3000, 10% Argireline solution — and say exactly that.",
    actives: [
      { name: "Matrixyl 3000", inci: "Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7", pct: "3%", role: "Look of fine lines" },
      { name: "Argireline", inci: "Acetyl Hexapeptide-8", pct: "10% (solution)", role: "Look of expression lines" },
      { name: "Niacinamide", inci: "Niacinamide", pct: "4%", role: "Tone & barrier support" },
    ],
    howToUse: [
      "Apply morning and/or evening to clean skin before moisturizer.",
      "Layers well with vitamin C, HA, and sunscreen.",
    ],
    evidence:
      "Both actives have manufacturer-sponsored clinical studies at the doses we use; independent replication is thinner, and we say so. Expect gradual softening of the look of lines over 8–12 weeks, not an injectable-like effect.",
    pairsWith: ["copper-renewal-serum", "peptide-gel-moisturizer"],
    batch: { lot: "PT24-SSS-001", mfg: "2026-06", exp: "2028-06", coaPath: "/coa/PT24-SSS-001.pdf" },
    stock: 260,
    reorderPoint: 60,
    featured: true,
    hue: 28,
  },
  {
    slug: "daily-peptide-complex",
    sku: "PT-SER-003",
    name: "Daily Peptide Complex · 10% Multi-Peptide",
    shortName: "Daily Peptide Complex",
    category: "Serums",
    concerns: ["Fine lines", "Hydration", "Brightening"],
    price: p(48),
    subscribePrice: sub(48),
    size: "30 ml",
    ingestible: false,
    tagline: "Your first peptide. Five actives, one gentle daily step.",
    description:
      "The entry point to the line: a 10% blend of five well-tolerated peptides in a hydrating base. Designed to be un-mess-up-able — no conflicts, no purge, no fragrance — for people adding peptides to a routine for the first time.",
    actives: [
      { name: "Multi-peptide blend", inci: "Acetyl Tetrapeptide-9, Palmitoyl Tripeptide-5, Hexapeptide-11, Oligopeptide-1, Copper Tripeptide-1", pct: "10% total", role: "Overall skin quality" },
      { name: "Beta-glucan", inci: "Beta-Glucan", pct: "1%", role: "Soothing hydration" },
    ],
    howToUse: ["Apply morning and evening to clean skin.", "Safe alongside every other product in the line."],
    evidence:
      "Each peptide in the blend has published cosmetic safety and efficacy data individually; the blend itself is our formulation. Positioned honestly as a well-tolerated daily multi, not a single-hero clinical.",
    pairsWith: ["peptide-barrier-cream", "collagen-peptides-powder"],
    batch: { lot: "PT24-DPC-001", mfg: "2026-07", exp: "2028-07", coaPath: "/coa/PT24-DPC-001.pdf" },
    stock: 320,
    reorderPoint: 80,
    featured: true,
    hue: 152,
  },
  {
    slug: "peptide-barrier-cream",
    sku: "PT-MOI-001",
    name: "Peptide Barrier Cream · Ceramides + Tripeptide",
    shortName: "Peptide Barrier Cream",
    category: "Moisturizers",
    concerns: ["Barrier repair", "Hydration"],
    price: p(44),
    subscribePrice: sub(44),
    size: "50 ml",
    ingestible: false,
    tagline: "The cream that closes the routine.",
    description:
      "A ceramide-dominant moisturizer with palmitoyl tripeptide-5, built to seal actives in and keep the barrier calm. Rich but not occlusive-greasy; fragrance-free and suitable for sensitive skin.",
    actives: [
      { name: "Ceramide complex", inci: "Ceramide NP, AP, EOP", pct: "3%", role: "Barrier lipids" },
      { name: "Palmitoyl Tripeptide-5", inci: "Palmitoyl Tripeptide-5", pct: "2%", role: "Look of firmness" },
      { name: "Squalane", inci: "Squalane", pct: "5%", role: "Emollient" },
    ],
    howToUse: ["Apply as the last skincare step, morning and evening.", "In the morning, follow with SPF."],
    evidence:
      "Ceramide moisturization is among the best-established claims in skincare; the peptide is a supporting player here and we position it that way.",
    pairsWith: ["copper-renewal-serum", "smooth-signal-serum"],
    batch: { lot: "PT24-PBC-001", mfg: "2026-06", exp: "2028-06", coaPath: "/coa/PT24-PBC-001.pdf" },
    stock: 300,
    reorderPoint: 70,
    hue: 40,
  },
  {
    slug: "peptide-gel-moisturizer",
    sku: "PT-MOI-002",
    name: "Peptide Gel Moisturizer · HA + Hexapeptide",
    shortName: "Peptide Gel Moisturizer",
    category: "Moisturizers",
    concerns: ["Hydration"],
    price: p(42),
    subscribePrice: sub(42),
    size: "50 ml",
    ingestible: false,
    tagline: "Weightless water-gel for oily and combination skin.",
    description:
      "A bouncy gel-cream with triple-weight hyaluronic acid and hexapeptide-11. Sinks in instantly, layers under makeup and SPF, and keeps combination skin hydrated without shine.",
    actives: [
      { name: "Triple-weight HA", inci: "Sodium Hyaluronate (3 MW)", pct: "1.5%", role: "Multi-depth hydration" },
      { name: "Hexapeptide-11", inci: "Hexapeptide-11", pct: "2%", role: "Skin feel & elasticity look" },
    ],
    howToUse: ["Apply to damp skin as the final step, or before a richer cream in dry climates."],
    evidence:
      "Hyaluronic hydration is well established; hexapeptide-11 has early published cosmetic data on skin elasticity appearance.",
    pairsWith: ["daily-peptide-complex", "smooth-signal-serum"],
    batch: { lot: "PT24-PGM-001", mfg: "2026-07", exp: "2028-07", coaPath: "/coa/PT24-PGM-001.pdf" },
    stock: 280,
    reorderPoint: 70,
    hue: 185,
  },
  {
    slug: "eye-revival-cream",
    sku: "PT-EYE-001",
    name: "Eye Revival Cream · Eyeseryl + Caffeine",
    shortName: "Eye Revival Cream",
    category: "Eye & Lip",
    concerns: ["Fine lines", "Brightening"],
    price: p(38),
    subscribePrice: sub(38),
    size: "15 ml",
    ingestible: false,
    tagline: "Puffiness and shadow, addressed at the studied dose.",
    description:
      "Eyeseryl (acetyl tetrapeptide-5) at the 2% dose used in its published studies on the look of under-eye puffiness, with caffeine and niacinamide for the appearance of dark circles.",
    actives: [
      { name: "Eyeseryl", inci: "Acetyl Tetrapeptide-5", pct: "2%", role: "Look of puffiness" },
      { name: "Caffeine", inci: "Caffeine", pct: "3%", role: "Look of dark circles" },
      { name: "Niacinamide", inci: "Niacinamide", pct: "2%", role: "Brightening" },
    ],
    howToUse: ["Pat a rice-grain amount around the orbital bone, morning and evening."],
    evidence:
      "Acetyl tetrapeptide-5 has small published trials at 2% showing reduced look of puffiness over 4–8 weeks.",
    pairsWith: ["copper-renewal-serum", "peptide-lip-treatment"],
    batch: { lot: "PT24-ERC-001", mfg: "2026-06", exp: "2028-06", coaPath: "/coa/PT24-ERC-001.pdf" },
    stock: 220,
    reorderPoint: 50,
    hue: 265,
  },
  {
    slug: "peptide-lip-treatment",
    sku: "PT-EYE-002",
    name: "Peptide Lip Treatment · Tripeptide + Shea",
    shortName: "Peptide Lip Treatment",
    category: "Eye & Lip",
    concerns: ["Hydration", "Fine lines"],
    price: p(24),
    subscribePrice: sub(24),
    size: "10 ml",
    ingestible: false,
    tagline: "A glassy, non-sticky lip peptide balm.",
    description:
      "Palmitoyl tripeptide-1 in a cushiony shea and jojoba base for the look of fuller, smoother lips. Glassy finish, no menthol tingle, no fragrance.",
    actives: [
      { name: "Palmitoyl Tripeptide-1", inci: "Palmitoyl Tripeptide-1", pct: "1%", role: "Look of lip fullness" },
      { name: "Shea butter", inci: "Butyrospermum Parkii Butter", pct: "10%", role: "Occlusive comfort" },
    ],
    howToUse: ["Apply as often as you like; excellent overnight."],
    evidence:
      "Peptide lip data is early-stage; this is first a superb balm, with the peptide as a bonus — priced accordingly.",
    pairsWith: ["eye-revival-cream"],
    batch: { lot: "PT24-PLT-001", mfg: "2026-07", exp: "2028-07", coaPath: "/coa/PT24-PLT-001.pdf" },
    stock: 400,
    reorderPoint: 100,
    hue: 350,
  },
  {
    slug: "hair-density-serum",
    sku: "PT-HAI-001",
    name: "Hair Density Serum · Capixyl + Redensyl",
    shortName: "Hair Density Serum",
    category: "Hair & Body",
    concerns: ["Hair density"],
    price: p(46),
    subscribePrice: sub(46),
    size: "60 ml",
    ingestible: false,
    tagline: "A leave-in scalp serum for the look of fuller hair.",
    description:
      "Capixyl (acetyl tetrapeptide-3 + red clover) at 5% and Redensyl at 3% — the doses their published cosmetic studies used — in a fast-drying, non-greasy leave-in scalp serum.",
    actives: [
      { name: "Capixyl", inci: "Acetyl Tetrapeptide-3, Trifolium Pratense Extract", pct: "5%", role: "Look of hair density" },
      { name: "Redensyl", inci: "Larix Europaea Wood Extract, Camellia Sinensis", pct: "3%", role: "Look of hair density" },
    ],
    howToUse: [
      "Apply dropper-fulls to the scalp once daily and massage in; do not rinse.",
      "Consistency over 3–6 months matters more than quantity.",
    ],
    evidence:
      "Both complexes have vendor-run cosmetic studies showing improved look of hair density vs. placebo over 3–4 months. This is a cosmetic product: if you suspect medical hair loss, see a dermatologist — minoxidil and finasteride are the treatments with drug-level evidence.",
    pairsWith: ["collagen-peptides-powder"],
    batch: { lot: "PT24-HDS-001", mfg: "2026-06", exp: "2028-06", coaPath: "/coa/PT24-HDS-001.pdf" },
    stock: 180,
    reorderPoint: 45,
    featured: true,
    hue: 95,
  },
  {
    slug: "firming-body-lotion",
    sku: "PT-HAI-002",
    name: "Firming Body Lotion · Tetrapeptide + Urea",
    shortName: "Firming Body Lotion",
    category: "Hair & Body",
    concerns: ["Firmness", "Hydration"],
    price: p(36),
    subscribePrice: sub(36),
    size: "200 ml",
    ingestible: false,
    tagline: "Face-grade peptides, body-sized bottle.",
    description:
      "Acetyl tetrapeptide-9 with 5% urea and niacinamide for crepey-looking skin on arms, neck, and décolletage. Fast-absorbing, fragrance-free.",
    actives: [
      { name: "Acetyl Tetrapeptide-9", inci: "Acetyl Tetrapeptide-9", pct: "2%", role: "Look of skin density" },
      { name: "Urea", inci: "Urea", pct: "5%", role: "Keratolytic hydration" },
      { name: "Niacinamide", inci: "Niacinamide", pct: "3%", role: "Tone" },
    ],
    howToUse: ["Massage into damp skin after showering, focusing on neck, arms, and chest."],
    evidence:
      "Urea at 5% is gold-standard for rough, dry body skin; the peptide targets the look of density with early published data.",
    pairsWith: ["collagen-peptides-powder"],
    batch: { lot: "PT24-FBL-001", mfg: "2026-07", exp: "2028-07", coaPath: "/coa/PT24-FBL-001.pdf" },
    stock: 210,
    reorderPoint: 50,
    hue: 20,
  },
  {
    slug: "collagen-peptides-powder",
    sku: "PT-ING-001",
    name: "Collagen Peptides · Type I & III, Unflavored",
    shortName: "Collagen Peptides",
    category: "Ingestibles",
    concerns: ["Joint & skin support", "Hair density"],
    price: p(39),
    subscribePrice: sub(39),
    size: "300 g · 30 servings",
    ingestible: true,
    tagline: "Hydrolyzed bovine collagen, 10 g per scoop, tested per lot.",
    description:
      "Grass-fed bovine collagen hydrolyzed to low-molecular-weight peptides for absorption. Unflavored, dissolves clear in hot or cold liquid. Every lot screened for heavy metals with the COA published.",
    actives: [
      { name: "Collagen peptides (Type I & III)", inci: "Hydrolyzed Collagen", pct: "10 g/serving", role: "Skin, hair, nail & joint support*" },
      { name: "Vitamin C", inci: "Ascorbic Acid", pct: "80 mg/serving", role: "Normal collagen formation*" },
    ],
    howToUse: ["Stir one scoop into coffee, smoothies, or water daily.", "Consistent daily use for 8–12 weeks is where studies show effects."],
    evidence:
      "Randomized trials of hydrolyzed collagen (2.5–10 g/day) report improvements in skin elasticity and hydration versus placebo. Vitamin C carries an authorized claim for normal collagen formation. *See FDA disclaimer.",
    pairsWith: ["daily-peptide-complex", "hair-density-serum"],
    batch: { lot: "PT24-CPP-001", mfg: "2026-06", exp: "2028-06", coaPath: "/coa/PT24-CPP-001.pdf" },
    stock: 350,
    reorderPoint: 90,
    featured: true,
    hue: 45,
  },
  {
    slug: "marine-collagen-sachets",
    sku: "PT-ING-002",
    name: "Marine Collagen Sachets · + Vitamin C & Zinc",
    shortName: "Marine Collagen Sachets",
    category: "Ingestibles",
    concerns: ["Joint & skin support"],
    price: p(49),
    subscribePrice: sub(49),
    size: "30 × 8 g sachets",
    ingestible: true,
    tagline: "Travel-ready marine collagen, citrus-flavored.",
    description:
      "Wild-caught marine collagen peptides in single-serve sachets with vitamin C and zinc. Pescatarian-friendly, light citrus taste from real fruit powder — no artificial sweeteners.",
    actives: [
      { name: "Marine collagen peptides", inci: "Hydrolyzed Fish Collagen", pct: "7 g/serving", role: "Skin & joint support*" },
      { name: "Vitamin C", inci: "Ascorbic Acid", pct: "120 mg/serving", role: "Normal collagen formation*" },
      { name: "Zinc", inci: "Zinc Citrate", pct: "5 mg/serving", role: "Skin, hair & nail maintenance*" },
    ],
    howToUse: ["Empty one sachet into 250 ml of water or juice daily."],
    evidence:
      "Marine collagen trials mirror bovine findings on skin elasticity and hydration. Contains fish. *See FDA disclaimer.",
    pairsWith: ["collagen-peptides-powder"],
    batch: { lot: "PT24-MCS-001", mfg: "2026-07", exp: "2028-01", coaPath: "/coa/PT24-MCS-001.pdf" },
    stock: 190,
    reorderPoint: 50,
    hue: 200,
  },
  {
    slug: "the-complete-routine",
    sku: "PT-BND-001",
    name: "The Complete Routine · 4-Piece Set",
    shortName: "The Complete Routine",
    category: "Bundles",
    concerns: ["Fine lines", "Firmness", "Hydration"],
    price: p(129),
    subscribePrice: sub(129),
    size: "4 full-size products",
    ingestible: false,
    tagline: "Serum, cream, eye, collagen — 20% under buying separately.",
    description:
      "The full morning-and-evening peptide routine: Daily Peptide Complex, Peptide Barrier Cream, Eye Revival Cream, and Collagen Peptides powder. Includes the ingestible, so the set carries the supplement disclaimer.",
    actives: [
      { name: "Daily Peptide Complex", inci: "30 ml", pct: "", role: "AM/PM serum" },
      { name: "Peptide Barrier Cream", inci: "50 ml", pct: "", role: "AM/PM moisturizer" },
      { name: "Eye Revival Cream", inci: "15 ml", pct: "", role: "AM/PM eye" },
      { name: "Collagen Peptides", inci: "300 g", pct: "", role: "Daily ingestible*" },
    ],
    howToUse: ["Follow the enclosed routine card: complex → eye → cream, plus one scoop of collagen daily."],
    evidence: "See each product's page for its ingredient-level evidence. *See FDA disclaimer.",
    pairsWith: ["copper-renewal-serum"],
    batch: { lot: "PT24-BND-001", mfg: "2026-07", exp: "2027-12", coaPath: "/coa/PT24-BND-001.pdf" },
    stock: 120,
    reorderPoint: 30,
    featured: true,
    hue: 152,
  },
];

export const categories: Category[] = [
  "Serums",
  "Moisturizers",
  "Eye & Lip",
  "Hair & Body",
  "Ingestibles",
  "Bundles",
];

export const concerns: Concern[] = [
  "Fine lines",
  "Firmness",
  "Barrier repair",
  "Hydration",
  "Brightening",
  "Hair density",
  "Joint & skin support",
];

export function getProduct(slug: string): Product | undefined {
  return products.find((x) => x.slug === slug);
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}

export const FREE_SHIPPING_THRESHOLD = 5000; // cents
export const FLAT_SHIPPING = 595; // cents
