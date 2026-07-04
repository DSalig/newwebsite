// ────────────────────────────────────────────────────────────
// Lumenwright initial inventory.
// AI-generated catalog seeded across six categories. Every
// piece is made-to-order: our manufacturing partners fulfill
// on order, so no warehouse inventory is carried. Custom
// options are available on every SKU.
// This file is the single source of truth for the storefront;
// supabase/seed.sql mirrors it for the hosted database.
// ────────────────────────────────────────────────────────────

export type ArtKind =
  | "chandelier"
  | "pendant"
  | "sconce"
  | "vintage"
  | "retrofit"
  | "vela";

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  art: ArtKind;
  /** two hues used by the procedural product art */
  palette: [string, string];
  price: number;
  priceNote: string;
  blurb: string;
  description: string;
  specs: Record<string, string>;
  options: ProductOption[];
  leadTimeWeeks: [number, number];
}

export type CategorySlug =
  | "custom-chandeliers"
  | "pendants"
  | "sconces-wall"
  | "vintage-restored"
  | "retrofit-kits"
  | "vela-series";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "custom-chandeliers",
    name: "Custom Chandeliers",
    short: "Chandeliers",
    description:
      "Statement pieces designed to order — from grand entry fixtures to intimate dining installations, each engineered around your ceiling height, sightlines, and dimming system.",
  },
  {
    slug: "pendants",
    name: "Pendants & Suspension",
    short: "Pendants",
    description:
      "Sculptural single and multi-drop pendants for kitchens, bars, stairwells, and hospitality spaces. Field-adjustable drops and canopy configurations.",
  },
  {
    slug: "sconces-wall",
    name: "Sconces & Wall Lights",
    short: "Sconces",
    description:
      "Architectural wall luminaires — plaster, brass, and glass forms that graze, wash, or frame. ADA-compliant profiles available across the line.",
  },
  {
    slug: "vintage-restored",
    name: "Vintage & Restored",
    short: "Vintage",
    description:
      "One-of-a-kind antique fixtures rescued, rewired to modern code, and relamped with warm-dim LED. Provenance documented on every piece.",
  },
  {
    slug: "retrofit-kits",
    name: "LED Retrofit Systems",
    short: "Retrofit",
    description:
      "Engineered conversion kits that bring incandescent and fluorescent infrastructure to modern LED — flicker-free drivers, warm-dim, and controls included.",
  },
  {
    slug: "vela-series",
    name: "Vela Series — Proprietary LED",
    short: "Vela Series",
    description:
      "Our proprietary architectural LED line, born from an unmet need inside our own projects and validated across our portfolio. Spec-grade output, designer-grade finish.",
  },
];

export const PRODUCTS: Product[] = [
  // ── Custom Chandeliers ──────────────────────────────────
  {
    slug: "aurora-cascade-36",
    sku: "LW-CH-001",
    name: "Aurora Cascade 36",
    category: "custom-chandeliers",
    art: "chandelier",
    palette: ["#ffb454", "#e2622b"],
    price: 8400,
    priceNote: "from — final quote after design review",
    blurb:
      "A 36-point cascading chandelier of hand-blown amber globes on staggered brass stems, tuned to your stairwell or double-height entry.",
    description:
      "The Aurora Cascade is our signature entry statement: thirty-six hand-blown glass globes descend on individually cut brass stems, forming a falling constellation that we model in 3D around your exact ceiling height and sightlines before fabrication. Integrated 2200K–3000K warm-dim LED means the piece dims like candlelight without a single visible bulb. Each install includes structural blocking review, a custom canopy, and commissioning of the dimming curve on site.",
    specs: {
      "Points of light": "36 (scalable 18–72)",
      Output: "6,800 lm total, warm-dim 2200–3000K",
      Drop: "custom, 4–22 ft",
      Finish: "aged brass, blackened steel, or polished nickel",
      Control: "0–10V, DALI, Lutron, or Casambi wireless",
      Rating: "dry / damp",
    },
    options: [
      { name: "Globe glass", values: ["Amber", "Opal", "Smoke", "Clear seeded"] },
      { name: "Stem finish", values: ["Aged brass", "Blackened steel", "Polished nickel"] },
      { name: "Point count", values: ["18", "36", "54", "72"] },
      { name: "Control protocol", values: ["Phase / TRIAC", "0–10V", "DALI", "Casambi wireless"] },
    ],
    leadTimeWeeks: [8, 12],
  },
  {
    slug: "meridian-ring-grand",
    sku: "LW-CH-002",
    name: "Meridian Ring — Grand",
    category: "custom-chandeliers",
    art: "chandelier",
    palette: ["#ffd9a0", "#c9974d"],
    price: 5900,
    priceNote: "from — sized to order",
    blurb:
      "Concentric illuminated rings, 24″ to 96″ diameter, with uplight/downlight zones you can dim independently.",
    description:
      "Meridian is a family of concentric ring chandeliers machined from aluminum and wrapped in brass or bronze skins. Up and down light zones run on separate channels, so a dining room can hold bright task light on the table while the ceiling glows soft. Built to diameter in one-inch increments; we routinely nest two or three rings for larger rooms.",
    specs: {
      Diameter: "24–96″, 1″ increments",
      Output: "up to 12,000 lm (dual zone)",
      CRI: "≥ 95, R9 > 80",
      Finish: "brass, bronze, powder-coat RAL to order",
      Control: "dual-channel dimming, any protocol",
      Rating: "dry / damp",
    },
    options: [
      { name: "Diameter", values: ['24"', '36"', '48"', '72"', '96"'] },
      { name: "Ring count", values: ["Single", "Double nested", "Triple nested"] },
      { name: "Skin", values: ["Brushed brass", "Oil-rubbed bronze", "RAL powder-coat"] },
      { name: "Light zones", values: ["Down only", "Up + down dual channel"] },
    ],
    leadTimeWeeks: [6, 10],
  },
  {
    slug: "branchwork-antler-noir",
    sku: "LW-CH-003",
    name: "Branchwork Noir",
    category: "custom-chandeliers",
    art: "chandelier",
    palette: ["#b3a68c", "#6fae9b"],
    price: 7200,
    priceNote: "from",
    blurb:
      "Organic cast-bronze branch chandelier with frosted bud diffusers — a sculptural centerpiece for lodge, restaurant, or great-room ceilings.",
    description:
      "Branchwork Noir is cast in sections from sculpted bronze branches, then assembled and balanced for your room. Frosted glass buds carry high-CRI LED at 2400K. Because the piece is modular, we can shape it long and low over a table, or full and radial for a rotunda. A favorite of our hospitality clients.",
    specs: {
      Span: "36–120″ configurable",
      Output: "4,200–9,600 lm",
      "Color temp": "2400K fixed or warm-dim",
      Material: "cast bronze, frosted borosilicate",
      Control: "TRIAC / ELV / 0–10V",
      Rating: "dry / damp",
    },
    options: [
      { name: "Span", values: ['48"', '72"', '96"', '120"'] },
      { name: "Patina", values: ["Noir", "Verdigris", "Natural bronze"] },
      { name: "Layout", values: ["Radial", "Linear (table)", "Asymmetric"] },
    ],
    leadTimeWeeks: [10, 14],
  },
  {
    slug: "candela-tiered-crystal",
    sku: "LW-CH-004",
    name: "Candela Tiered Crystal",
    category: "custom-chandeliers",
    art: "chandelier",
    palette: ["#ffd9a0", "#ffb454"],
    price: 11800,
    priceNote: "from — three-tier base configuration",
    blurb:
      "A modern crystal tier chandelier with faceted K9 prisms and candle-glow LED tips — classic sparkle, contemporary geometry.",
    description:
      "Candela reinterprets the tiered crystal chandelier with clean geometry: machined rings carry rows of faceted K9 crystal prisms, and each 'candle' tip is a warm-dim LED that fades to ember at 1% brightness. Available in three-, five-, and seven-tier builds. All crystal is individually hung and field-replaceable.",
    specs: {
      Tiers: "3 / 5 / 7",
      Crystal: "faceted K9, optional Swarovski upgrade",
      Output: "5,500–16,000 lm",
      "Dim range": "0.5–100%, flicker-free",
      Control: "any protocol",
      Rating: "dry",
    },
    options: [
      { name: "Tiers", values: ["Three", "Five", "Seven"] },
      { name: "Crystal", values: ["K9 clear", "K9 champagne", "Swarovski upgrade"] },
      { name: "Frame", values: ["Polished nickel", "Champagne gold", "Matte black"] },
    ],
    leadTimeWeeks: [10, 16],
  },
  {
    slug: "helios-linear-72",
    sku: "LW-CH-005",
    name: "Helios Linear 72",
    category: "custom-chandeliers",
    art: "chandelier",
    palette: ["#e2622b", "#ffb454"],
    price: 4600,
    priceNote: "from",
    blurb:
      "A 72″ linear suspension of alternating opal cylinders and brass fins — the dining-table workhorse of the custom line.",
    description:
      "Helios Linear pairs opal glass cylinders with machined brass fins along an aircraft-cable suspension. Even, glare-free light for tables, kitchen islands, and conference rooms. Cut to length in the shop; specify your table and we handle proportions.",
    specs: {
      Length: '48–120", cut to order',
      Output: "up to 8,000 lm",
      CCT: "2700K / 3000K / warm-dim",
      Finish: "brass, black, or custom RAL",
      Control: "TRIAC / 0–10V / DALI",
      Rating: "dry / damp",
    },
    options: [
      { name: "Length", values: ['48"', '60"', '72"', '96"', '120"'] },
      { name: "Fin finish", values: ["Brushed brass", "Matte black", "Custom RAL"] },
      { name: "CCT", values: ["2700K", "3000K", "Warm-dim 1800–3000K"] },
    ],
    leadTimeWeeks: [5, 8],
  },

  // ── Pendants ────────────────────────────────────────────
  {
    slug: "ember-globe-pendant",
    sku: "LW-PD-101",
    name: "Ember Globe Pendant",
    category: "pendants",
    art: "pendant",
    palette: ["#ffb454", "#e2622b"],
    price: 640,
    priceNote: "each — multi-drop discounts apply",
    blurb:
      "Hand-blown amber globe on a fabric-wrapped cord, glowing like a held ember. Our most-specified kitchen pendant.",
    description:
      "The Ember Globe is a single hand-blown sphere in amber, smoke, or opal glass, suspended on color-matched fabric cord. The integral LED module is hidden in the neck, so the glass reads as pure light. Order singly or as staggered clusters of three, five, or seven with a shared canopy.",
    specs: {
      Diameter: '8" / 10" / 12"',
      Output: "800 lm per globe",
      CCT: "2400K fixed or warm-dim",
      Drop: "field-adjustable to 10 ft",
      Control: "TRIAC / ELV",
      Rating: "dry / damp",
    },
    options: [
      { name: "Glass", values: ["Amber", "Smoke", "Opal"] },
      { name: "Diameter", values: ['8"', '10"', '12"'] },
      { name: "Configuration", values: ["Single", "Cluster of 3", "Cluster of 5", "Cluster of 7"] },
    ],
    leadTimeWeeks: [3, 5],
  },
  {
    slug: "foundry-dome-16",
    sku: "LW-PD-102",
    name: "Foundry Dome 16",
    category: "pendants",
    art: "pendant",
    palette: ["#c9974d", "#b3a68c"],
    price: 780,
    priceNote: "each",
    blurb:
      "Spun-brass dome pendant with a white reflector interior — warm downlight with an industrial soul for islands and bars.",
    description:
      "Foundry Dome is spun from a single sheet of brass, with a matte white interior that throws a wide, even pool of task light. The look is factory heritage; the engine is a 95 CRI warm-dim COB. Specify raw brass and it will patina beautifully over years of service.",
    specs: {
      Diameter: '12" / 16" / 20"',
      Output: "1,400 lm",
      CRI: "≥ 95",
      Finish: "raw brass, lacquered brass, blackened",
      Control: "TRIAC / 0–10V",
      Rating: "dry / damp",
    },
    options: [
      { name: "Diameter", values: ['12"', '16"', '20"'] },
      { name: "Finish", values: ["Raw brass", "Lacquered brass", "Blackened steel"] },
      { name: "Cord", values: ["Black fabric", "Brass chain", "Rigid stem"] },
    ],
    leadTimeWeeks: [3, 5],
  },
  {
    slug: "stiletto-vertical-drop",
    sku: "LW-PD-103",
    name: "Stiletto Vertical Drop",
    category: "pendants",
    art: "pendant",
    palette: ["#ffd9a0", "#6fae9b"],
    price: 920,
    priceNote: "each — stairwell arrays quoted",
    blurb:
      "A 48″ blade of edge-lit glass that hangs like a shard of light. Built for stairwells and double-height voids.",
    description:
      "Stiletto is a vertical edge-lit optic: a slender 48-inch acrylic-glass blade that carries light down its full length with zero visible source. Hung in arrays at varying drops, it turns a stairwell into a field of falling light. Custom lengths to 96 inches.",
    specs: {
      Length: '36" / 48" / 72" / 96"',
      Output: "1,100 lm per blade",
      CCT: "2700K / 3500K / tunable white",
      Drop: "custom per blade, to 30 ft",
      Control: "0–10V / DALI / DMX for tunable",
      Rating: "dry",
    },
    options: [
      { name: "Length", values: ['36"', '48"', '72"', '96"'] },
      { name: "CCT", values: ["2700K", "3500K", "Tunable white"] },
      { name: "Array", values: ["Single", "Array of 5", "Array of 9", "Custom array"] },
    ],
    leadTimeWeeks: [4, 7],
  },
  {
    slug: "lantern-oku-paper",
    sku: "LW-PD-104",
    name: "Oku Paper Lantern",
    category: "pendants",
    art: "pendant",
    palette: ["#f4eddd", "#ffb454"],
    price: 540,
    priceNote: "each",
    blurb:
      "Washi-paper lantern pendant on a blackened steel ring — soft, cloud-like ambient light in three sculptural profiles.",
    description:
      "Oku wraps hand-pleated washi paper around a steel skeleton, diffusing its LED core into a soft volumetric glow. Three profiles — sphere, gourd, and column — mix well in staggered groups. Paper shades are replaceable and available in natural, ivory, and persimmon.",
    specs: {
      Profiles: "sphere / gourd / column",
      Output: "900 lm",
      CCT: "2700K",
      Material: "washi paper, blackened steel",
      Control: "TRIAC",
      Rating: "dry",
    },
    options: [
      { name: "Profile", values: ["Sphere", "Gourd", "Column"] },
      { name: "Paper", values: ["Natural", "Ivory", "Persimmon"] },
      { name: "Size", values: ["Small", "Medium", "Large"] },
    ],
    leadTimeWeeks: [3, 6],
  },
  {
    slug: "prisma-tri-cluster",
    sku: "LW-PD-105",
    name: "Prisma Tri-Cluster",
    category: "pendants",
    art: "pendant",
    palette: ["#6fae9b", "#ffd9a0"],
    price: 1450,
    priceNote: "per cluster of three",
    blurb:
      "Three faceted glass prisms on a shared canopy, each splitting its LED point into soft spectral edges.",
    description:
      "Prisma hangs three hand-cut glass polyhedra from a single machined canopy. Each prism holds a point-source LED whose light fractures along the facets, casting faint spectral edges on nearby surfaces at dusk. Equal parts fixture and kinetic art.",
    specs: {
      Cluster: "3 prisms, staggered drops",
      Output: "1,800 lm total",
      CCT: "3000K",
      Glass: "hand-cut low-iron crystal",
      Control: "ELV / 0–10V",
      Rating: "dry",
    },
    options: [
      { name: "Prism mix", values: ["Clear", "Clear + smoke", "Clear + champagne"] },
      { name: "Canopy", values: ["Matte black", "Brushed brass"] },
    ],
    leadTimeWeeks: [5, 8],
  },

  // ── Sconces & Wall ──────────────────────────────────────
  {
    slug: "halo-plaster-eclipse",
    sku: "LW-SC-201",
    name: "Eclipse Plaster Sconce",
    category: "sconces-wall",
    art: "sconce",
    palette: ["#f4eddd", "#c9974d"],
    price: 380,
    priceNote: "each — paintable",
    blurb:
      "A paintable plaster disc that floats off the wall on a hidden arm, backlit into a perfect eclipse of warm light.",
    description:
      "Eclipse is cast in fine plaster and ships ready to paint with your wall color, so the fixture disappears by day and blooms into a halo by night. The LED ring behind the disc is fully serviceable. ADA-compliant projection. Order in three diameters and compose walls of staggered eclipses.",
    specs: {
      Diameter: '9" / 13" / 18"',
      Projection: '3.6" (ADA)',
      Output: "650 lm",
      CCT: "2700K warm-dim",
      Finish: "paintable plaster",
      Rating: "dry / damp",
    },
    options: [
      { name: "Diameter", values: ['9"', '13"', '18"'] },
      { name: "Prime", values: ["White primer (paintable)", "Raw plaster"] },
    ],
    leadTimeWeeks: [3, 5],
  },
  {
    slug: "gaslight-torch-modern",
    sku: "LW-SC-202",
    name: "Modern Gaslight Torch",
    category: "sconces-wall",
    art: "sconce",
    palette: ["#ffb454", "#e2622b"],
    price: 560,
    priceNote: "each — interior & exterior rated",
    blurb:
      "The romance of a gas flame, rebuilt as flicker-free warm-dim LED in a solid brass torch body. Exterior rated.",
    description:
      "Our Modern Gaslight Torch honors the original gas lanterns we restore — solid brass body, beveled glass panes — but carries a 1800K–2700K warm-dim engine with an optional ember-flicker mode calibrated from real flame footage. Wet-rated for entries, facades, and courtyards.",
    specs: {
      Height: '18" / 24"',
      Output: "700 lm",
      CCT: "1800–2700K warm-dim + flicker mode",
      Material: "solid brass, beveled glass",
      Control: "TRIAC",
      Rating: "wet (IP65)",
    },
    options: [
      { name: "Height", values: ['18"', '24"'] },
      { name: "Finish", values: ["Aged brass", "Verdigris", "Blackened"] },
      { name: "Mode", values: ["Steady warm-dim", "Ember flicker"] },
    ],
    leadTimeWeeks: [4, 6],
  },
  {
    slug: "ribbon-brass-wave",
    sku: "LW-SC-203",
    name: "Ribbon Wave Sconce",
    category: "sconces-wall",
    art: "sconce",
    palette: ["#c9974d", "#ffd9a0"],
    price: 490,
    priceNote: "each",
    blurb:
      "A single ribbon of brushed brass folded into a wave, washing the wall above and below with grazing light.",
    description:
      "Ribbon Wave folds one continuous sheet of brass into a soft S-curve that conceals up- and down-firing LED channels. The grazing light picks up wall texture beautifully — plaster, limewash, and brick clients love it. Dual channels dim independently.",
    specs: {
      Width: '5" — height 14"',
      Output: "900 lm (dual channel)",
      CCT: "2700K",
      Finish: "brushed brass, blackened, nickel",
      Control: "dual TRIAC / 0–10V",
      Rating: "dry / damp",
    },
    options: [
      { name: "Finish", values: ["Brushed brass", "Blackened steel", "Polished nickel"] },
      { name: "Channels", values: ["Up + down", "Down only"] },
    ],
    leadTimeWeeks: [3, 5],
  },
  {
    slug: "library-picture-luxe",
    sku: "LW-SC-204",
    name: "Gallery Picture Light",
    category: "sconces-wall",
    art: "sconce",
    palette: ["#ffd9a0", "#b3a68c"],
    price: 420,
    priceNote: "each — hardwire or rechargeable",
    blurb:
      "Museum-grade picture light with 97 CRI and an anti-glare louver — hardwired or rechargeable for zero-wiring installs.",
    description:
      "Built for art: 97 CRI, R9 > 90, and a micro-louver that keeps glare off the glass and light on the canvas. The rechargeable version runs 40 hours per charge and mounts with a cleat — no electrician required — making it ideal for gallery walls in older homes.",
    specs: {
      Width: '12" / 18" / 30"',
      CRI: "97, R9 > 90",
      CCT: "2700K / 3000K switchable",
      Power: "hardwire or rechargeable (40 h)",
      Finish: "brass, bronze, nickel",
      Rating: "dry",
    },
    options: [
      { name: "Width", values: ['12"', '18"', '30"'] },
      { name: "Power", values: ["Hardwired", "Rechargeable"] },
      { name: "Finish", values: ["Brass", "Bronze", "Nickel"] },
    ],
    leadTimeWeeks: [2, 4],
  },
  {
    slug: "alcove-step-glow",
    sku: "LW-SC-205",
    name: "Alcove Step & Path Glow",
    category: "sconces-wall",
    art: "sconce",
    palette: ["#6fae9b", "#f4eddd"],
    price: 210,
    priceNote: "each — sold in runs",
    blurb:
      "Recessed step and corridor light with a shielded, zero-glare aperture. The quiet workhorse of hospitality corridors.",
    description:
      "Alcove Glow tucks into stud walls and stair stringers, throwing a low shielded wash across treads and floors. At 1% dim it becomes a night-path system. Specified by the run — we supply engraved circuiting diagrams with every order.",
    specs: {
      Aperture: '3.5" trimless or trimmed',
      Output: "180 lm shielded",
      CCT: "2400K / 2700K",
      Voltage: "24V class-2 runs",
      Control: "0–10V / DALI",
      Rating: "dry / damp / wet option",
    },
    options: [
      { name: "Trim", values: ["Trimless (mud-in)", "Trimmed"] },
      { name: "CCT", values: ["2400K", "2700K"] },
      { name: "Rating", values: ["Interior", "Wet-rated exterior"] },
    ],
    leadTimeWeeks: [2, 4],
  },

  // ── Vintage & Restored ──────────────────────────────────
  {
    slug: "1908-beaux-arts-basket",
    sku: "LW-VN-301",
    name: "c.1908 Beaux-Arts Crystal Basket",
    category: "vintage-restored",
    art: "vintage",
    palette: ["#ffd9a0", "#c9974d"],
    price: 9800,
    priceNote: "restored one-of-one",
    blurb:
      "A Beaux-Arts crystal basket chandelier rescued from a Chicago hotel lobby — fully rewired, relamped warm-dim, provenance documented.",
    description:
      "Recovered from a 1908 hotel renovation, this crystal basket chandelier arrived with a bent frame and half its strands missing. Our shop straightened and re-silvered the frame, re-strung the crystal with period-correct pinning, rewired to current code, and fitted candelabra LED at 2200K that dims to a true candle ember. Ships with its provenance dossier and a five-year service warranty.",
    specs: {
      Period: "c. 1908, Beaux-Arts",
      Size: '32" dia × 40" h',
      Restoration: "frame re-silvered, re-strung, rewired",
      Lamping: "LED candelabra, 2200K warm-dim",
      Documentation: "provenance dossier included",
      Warranty: "5-year service plan",
    },
    options: [
      { name: "Lamping", values: ["Warm-dim LED (recommended)", "Period incandescent"] },
      { name: "Canopy", values: ["Original restored", "Reproduction match"] },
    ],
    leadTimeWeeks: [2, 4],
  },
  {
    slug: "1935-deco-saucer",
    sku: "LW-VN-302",
    name: "c.1935 Art Deco Saucer Pendant",
    category: "vintage-restored",
    art: "vintage",
    palette: ["#6fae9b", "#ffd9a0"],
    price: 2900,
    priceNote: "restored one-of-one",
    blurb:
      "Stepped opaline glass saucer with nickel banding from a Detroit theater lobby, rewired and relamped for another century.",
    description:
      "A three-step opaline saucer with original nickel banding, pulled from a shuttered Detroit theater. We stabilized a hairline in the glass with conservation-grade resin (documented), replated the banding, and rebuilt the hanger with modern strain relief. Relamped with a high-CRI LED disc that lights the opaline perfectly evenly.",
    specs: {
      Period: "c. 1935, Art Deco",
      Size: '18" dia × 24" drop',
      Restoration: "glass conserved, banding replated",
      Lamping: "LED disc, 2700K, CRI 95",
      Documentation: "provenance + conservation notes",
      Warranty: "5-year service plan",
    },
    options: [
      { name: "Drop", values: ["Original 24\"", "Custom drop"] },
    ],
    leadTimeWeeks: [1, 3],
  },
  {
    slug: "1890-gas-electric-pair",
    sku: "LW-VN-303",
    name: "c.1890 Gas-Electric Sconce Pair",
    category: "vintage-restored",
    art: "vintage",
    palette: ["#ffb454", "#c9974d"],
    price: 3400,
    priceNote: "pair — restored one-of-one",
    blurb:
      "Transitional gas-electric sconces from the dawn of home electricity, converted to warm-dim LED with ember-flicker gas arms.",
    description:
      "This pair straddles two eras: the up-turned arms once burned gas while the down-turned arms held early carbon-filament bulbs. Our conversion keeps the story visible — the gas arms now carry calibrated ember-flicker LED, and the electric arms hold 2200K warm-dim candles. Museum-quality brass work throughout.",
    specs: {
      Period: "c. 1890, transitional gas-electric",
      Size: '14" w × 16" h each',
      Restoration: "full disassembly, brass restoration",
      Lamping: "flicker LED (gas arms) + warm-dim (electric)",
      Documentation: "provenance dossier",
      Warranty: "5-year service plan",
    },
    options: [
      { name: "Gas-arm mode", values: ["Ember flicker", "Steady 1800K"] },
      { name: "Finish", values: ["Conserved patina", "Polished + lacquered"] },
    ],
    leadTimeWeeks: [2, 4],
  },
  {
    slug: "1962-sputnik-starburst",
    sku: "LW-VN-304",
    name: "c.1962 Sputnik Starburst",
    category: "vintage-restored",
    art: "vintage",
    palette: ["#ffd9a0", "#e2622b"],
    price: 2200,
    priceNote: "restored one-of-one",
    blurb:
      "An 18-arm atomic-age starburst, rewired with dimmable LED globes that finally do justice to its silhouette.",
    description:
      "Mid-century Sputniks were always better sculptures than light fixtures — original lamping was harsh and hot. This 18-arm example gets fresh cloth-covered wiring, restored brass arms, and warm 2400K LED globes that dim smoothly to a starfield glow. The atomic silhouette, finally lit right.",
    specs: {
      Period: "c. 1962",
      Size: '30" dia',
      Restoration: "rewired, arms restored",
      Lamping: "18× G25 LED, 2400K dim-to-warm",
      Documentation: "provenance card",
      Warranty: "5-year service plan",
    },
    options: [
      { name: "Globe", values: ["Opal", "Amber", "Mixed"] },
    ],
    leadTimeWeeks: [1, 3],
  },
  {
    slug: "restoration-commission",
    sku: "LW-VN-000",
    name: "Your Fixture, Restored — Commission",
    category: "vintage-restored",
    art: "vintage",
    palette: ["#b3a68c", "#ffb454"],
    price: 850,
    priceNote: "assessments from — full quote after inspection",
    blurb:
      "Send us the chandelier in your attic. We assess, document, rewire to code, source period parts, and relamp with warm-dim LED.",
    description:
      "Our restoration commission service takes in family heirlooms, estate finds, and architectural salvage. Every commission begins with a documented assessment — condition, era, parts needed, safety review — followed by a fixed quote. We source period-correct crystal, blow replacement glass, replate finishes, and rewire everything to modern code with discreet LED conversion. White-glove crating both directions.",
    specs: {
      Intake: "photo assessment, then insured shipping",
      Scope: "structural, wiring, plating, glass, crystal",
      Lamping: "warm-dim LED or period lamping",
      Timeline: "typically 4–12 weeks",
      Documentation: "full restoration dossier",
      Warranty: "5-year service plan",
    },
    options: [
      { name: "Service level", values: ["Assessment only", "Standard restoration", "Museum conservation"] },
      { name: "Lamping", values: ["Warm-dim LED", "Period-correct", "Hybrid"] },
    ],
    leadTimeWeeks: [4, 12],
  },

  // ── Retrofit Kits ───────────────────────────────────────
  {
    slug: "troffer-relight-2x4",
    sku: "LW-RF-401",
    name: "TrofferRelight 2×4 Kit",
    category: "retrofit-kits",
    art: "retrofit",
    palette: ["#6fae9b", "#f4eddd"],
    price: 96,
    priceNote: "per fixture — volume pricing on projects",
    blurb:
      "Drop-in LED conversion for 2×4 fluorescent troffers: 15 minutes per fixture, ballast eliminated, 62% energy reduction.",
    description:
      "The workhorse of our commercial conversions. TrofferRelight replaces fluorescent tubes and ballast with a magnetic-mount LED panel and flicker-free driver — no fixture replacement, no ceiling work. Typical office sees 62% energy reduction with better light quality and zero ballast maintenance. DLC Premium listed, so it qualifies for utility rebates that we file on your behalf under the turnkey program.",
    specs: {
      "Fits": "standard 2×4 troffers (2×2 kit available)",
      Output: "4,000–5,000 lm selectable",
      CCT: "3500K / 4000K / 5000K selectable",
      Efficacy: "150 lm/W",
      Control: "0–10V standard; sensor-ready",
      Listings: "UL, DLC Premium (rebate-eligible)",
    },
    options: [
      { name: "Size", values: ["2×4", "2×2", "1×4"] },
      { name: "Output", values: ["4,000 lm", "5,000 lm"] },
      { name: "Sensor", values: ["None", "Occupancy + daylight"] },
    ],
    leadTimeWeeks: [1, 2],
  },
  {
    slug: "highbay-swap-ufo",
    sku: "LW-RF-402",
    name: "HighBay Swap UFO 150",
    category: "retrofit-kits",
    art: "retrofit",
    palette: ["#ffb454", "#6fae9b"],
    price: 189,
    priceNote: "per fixture — volume pricing on projects",
    blurb:
      "Hook-and-plug replacement for 400W metal-halide high bays. 150W draw, instant-on, motion-dimming standard.",
    description:
      "Warehouse and gym conversions in one lift-ride per fixture: the UFO 150 hangs from the existing hook and plugs into existing circuits. Replaces 400W metal halide at 150W with better uniformity, instant restrike, and integrated microwave motion dimming that drops to 20% when aisles are empty.",
    specs: {
      Replaces: "250–400W HID high bays",
      Output: "22,500 lm",
      Efficacy: "150 lm/W",
      CCT: "4000K / 5000K",
      Control: "integrated motion + daylight",
      Listings: "UL, DLC Premium (rebate-eligible)",
    },
    options: [
      { name: "Wattage", values: ["100W", "150W", "200W"] },
      { name: "CCT", values: ["4000K", "5000K"] },
      { name: "Optics", values: ["90° aisle", "120° open"] },
    ],
    leadTimeWeeks: [1, 2],
  },
  {
    slug: "candelabra-warm-dim",
    sku: "LW-RF-403",
    name: "Chandelier Warm-Dim Relamp Set",
    category: "retrofit-kits",
    art: "retrofit",
    palette: ["#ffd9a0", "#ffb454"],
    price: 24,
    priceNote: "per lamp — sets of 12+",
    blurb:
      "Candelabra LED lamps that dim from 2700K to 1800K ember — the only retrofit lamp we trust inside restored chandeliers.",
    description:
      "Most LED candle lamps ruin antique fixtures — wrong color, visible diodes, buzzy dimming. Ours were developed for our own restoration shop: a spiral filament in hand-tinted glass, 95 CRI, and a true warm-dim curve calibrated against gas flame. Flicker-free on the dimmers we specify, and we test compatibility with yours before shipping.",
    specs: {
      Base: "E12 candelabra / E26 adapter",
      Output: "350 lm each",
      CCT: "2700K → 1800K warm-dim",
      CRI: "95, R9 85",
      Life: "25,000 h",
      "Dimmer testing": "included with every order",
    },
    options: [
      { name: "Shape", values: ["Torpedo", "Flame tip", "Globe G16"] },
      { name: "Glass", values: ["Clear", "Amber tint", "Spun frost"] },
      { name: "Set", values: ["12", "24", "48"] },
    ],
    leadTimeWeeks: [1, 2],
  },
  {
    slug: "track-relight-heads",
    sku: "LW-RF-404",
    name: "TrackRelight Retail Heads",
    category: "retrofit-kits",
    art: "retrofit",
    palette: ["#e2622b", "#ffd9a0"],
    price: 74,
    priceNote: "per head — volume pricing",
    blurb:
      "LED track heads that click into existing halogen track systems — 90 CRI retail punch at a fifth of the wattage.",
    description:
      "Keep the track, swap the heads. TrackRelight heads fit H, J, and L track standards, replacing 75W halogen PAR30s with 15W high-CRI LED that keeps merchandise color true. Interchangeable optics let a shop re-aim from wall-wash to 15° accent without tools.",
    specs: {
      Compatibility: "H / J / L track",
      Output: "1,300 lm",
      CRI: "90+, R9 60+",
      CCT: "2700K / 3000K / 3500K",
      Optics: "15° / 24° / 38° / wall-wash, swappable",
      Listings: "UL, DLC (rebate-eligible)",
    },
    options: [
      { name: "Track standard", values: ["H", "J", "L"] },
      { name: "CCT", values: ["2700K", "3000K", "3500K"] },
      { name: "Optic", values: ["15°", "24°", "38°", "Wall-wash"] },
    ],
    leadTimeWeeks: [1, 2],
  },
  {
    slug: "dim-control-bridge",
    sku: "LW-RF-405",
    name: "Legacy Dimmer Bridge",
    category: "retrofit-kits",
    art: "retrofit",
    palette: ["#6fae9b", "#c9974d"],
    price: 145,
    priceNote: "per zone",
    blurb:
      "Makes century-old wiring speak modern dimming — a driver-side bridge that adds smooth 0.5% dimming and app control without rewiring walls.",
    description:
      "The hardest part of retrofitting older buildings is the wiring you can't touch. The Legacy Dimmer Bridge installs at the fixture or panel side and translates whatever the wall switch does into a clean digital dimming signal — then adds wireless scene control on top. Historic buildings get modern control with zero wall surgery.",
    specs: {
      Input: "existing switched or dimmed circuits",
      Output: "0.5–100% flicker-free dimming",
      Wireless: "Casambi / Bluetooth mesh, app scenes",
      Capacity: "150W LED per zone",
      Install: "fixture-side or panel-side",
      Listings: "UL",
    },
    options: [
      { name: "Mount", values: ["Fixture-side", "Panel-side"] },
      { name: "Control", values: ["App only", "App + wall scene keypad"] },
    ],
    leadTimeWeeks: [1, 3],
  },

  // ── Vela Series (proprietary) ───────────────────────────
  {
    slug: "vela-linea-channel",
    sku: "VELA-501",
    name: "Vela Linea Channel",
    category: "vela-series",
    art: "vela",
    palette: ["#ffd9a0", "#6fae9b"],
    price: 68,
    priceNote: "per ft, cut to order",
    blurb:
      "Our flagship plaster-in linear channel: a seamless line of dot-free light, born from a detail our own projects demanded.",
    description:
      "Vela Linea exists because no channel on the market gave us a truly seamless, dot-free line at warm color temperatures with a plaster-in edge we trusted. So we engineered our own. Cut to the millimeter, mitered corners welded light-tight, and driven by remote drivers we mount where they can be serviced. Validated across four years of our own installs before we offered it for spec.",
    specs: {
      Profile: 'plaster-in, 0.9" aperture',
      Output: "300–900 lm/ft",
      CCT: "2200K–4000K static or warm-dim",
      CRI: "≥ 95, R9 > 90",
      "Run length": "unlimited with remote drivers",
      Control: "0–10V / DALI / DMX",
    },
    options: [
      { name: "Output", values: ["300 lm/ft", "600 lm/ft", "900 lm/ft"] },
      { name: "CCT", values: ["2200K", "2700K", "3000K", "Warm-dim"] },
      { name: "Corner", values: ["Straight runs", "Mitered corners", "Radius curve"] },
    ],
    leadTimeWeeks: [3, 5],
  },
  {
    slug: "vela-punto-mini",
    sku: "VELA-502",
    name: "Vela Punto Mini Downlight",
    category: "vela-series",
    art: "vela",
    palette: ["#ffb454", "#f4eddd"],
    price: 118,
    priceNote: "each — project pricing available",
    blurb:
      "A 2″ trimless downlight with the deepest regress in its class — you see light, never the source.",
    description:
      "Punto was designed for our hospitality ceilings, where glare control is everything. A 2-inch aperture with 45° cutoff and a regressed optic means guests see pools of light on tables, never a bright hole in the ceiling. Mud-in trimless or flanged, wet-rated for showers and eaves.",
    specs: {
      Aperture: '2" trimless or flanged',
      Output: "800 lm",
      Cutoff: "45°, UGR < 10",
      CCT: "2700K / 3000K / warm-dim",
      CRI: "≥ 95",
      Rating: "IC, wet location option",
    },
    options: [
      { name: "Trim", values: ["Trimless mud-in", "Flanged"] },
      { name: "CCT", values: ["2700K", "3000K", "Warm-dim"] },
      { name: "Beam", values: ["25°", "40°", "60°"] },
    ],
    leadTimeWeeks: [2, 4],
  },
  {
    slug: "vela-arco-uplight",
    sku: "VELA-503",
    name: "Vela Arco Cove Uplight",
    category: "vela-series",
    art: "vela",
    palette: ["#c9974d", "#ffd9a0"],
    price: 54,
    priceNote: "per ft",
    blurb:
      "Asymmetric cove optic that throws light deep across a ceiling plane from a shallow 1.5″ pocket.",
    description:
      "Standard cove strips waste half their light inside the pocket. Arco's asymmetric lens pushes the beam out and across, evenly washing ceilings up to 16 feet deep from a pocket just 1.5 inches tall. The detail that makes our floating-ceiling installs look like they're lit from nowhere.",
    specs: {
      Pocket: '1.5" minimum height',
      Throw: "up to 16 ft even wash",
      Output: "450 lm/ft",
      CCT: "2400K–3500K, tunable option",
      CRI: "≥ 95",
      Control: "0–10V / DALI",
    },
    options: [
      { name: "CCT", values: ["2400K", "2700K", "3000K", "Tunable"] },
      { name: "Length", values: ["Cut to order"] },
    ],
    leadTimeWeeks: [2, 4],
  },
  {
    slug: "vela-firma-exterior",
    sku: "VELA-504",
    name: "Vela Firma Façade Grazer",
    category: "vela-series",
    art: "vela",
    palette: ["#6fae9b", "#ffb454"],
    price: 240,
    priceNote: "per 4-ft section",
    blurb:
      "Marine-grade façade grazer with interchangeable optics — the exterior workhorse of the Vela line.",
    description:
      "Firma grazes brick, stone, and board-formed concrete with tight optical control and a marine-grade housing we warranty for ten years outdoors. Snap-change optics (6°×6° to 60°×10°) let designers tune the graze on site. Powers our landmark façade work.",
    specs: {
      Section: "4 ft, linkable",
      Output: "1,100 lm/ft",
      Optics: "6×6° / 10×60° / 30×30° / 60×10°",
      CCT: "2700K / 3000K / RGBW option",
      Housing: "marine-grade aluminum, IP67",
      Warranty: "10-year exterior",
    },
    options: [
      { name: "Optic", values: ["6×6°", "10×60°", "30×30°", "60×10°"] },
      { name: "CCT", values: ["2700K", "3000K", "RGBW"] },
    ],
    leadTimeWeeks: [3, 6],
  },
  {
    slug: "vela-scena-controller",
    sku: "VELA-505",
    name: "Vela Scena Scene Engine",
    category: "vela-series",
    art: "vela",
    palette: ["#ffd9a0", "#e2622b"],
    price: 640,
    priceNote: "per zone controller",
    blurb:
      "The brain of a Vela installation: astronomical scheduling, circadian curves, and one-button scenes for up to 64 zones.",
    description:
      "Scena runs whole-building lighting scenes without a programmer on retainer. Astronomical clock, circadian warm-dim curves that track sunset, and scene keypads your staff actually understand. Commissioned by our team as part of every turnkey project; available separately for integrators.",
    specs: {
      Zones: "64 per engine, linkable",
      Protocols: "DALI-2, 0–10V, DMX, Casambi",
      Scenes: "astronomical + circadian scheduling",
      Interface: "keypads, app, BMS integration",
      Commissioning: "included on turnkey projects",
      Listings: "UL",
    },
    options: [
      { name: "Zones", values: ["16", "32", "64"] },
      { name: "Keypads", values: ["None", "2-scene", "6-scene engraved"] },
    ],
    leadTimeWeeks: [2, 4],
  },
];

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const productsByCategory = (slug: CategorySlug) =>
  PRODUCTS.filter((p) => p.category === slug);

export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
