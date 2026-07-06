// AI space analysis endpoint.
// With ANTHROPIC_API_KEY set, the uploaded photo is read by
// Claude vision against our catalog and lighting-design rules.
// Without it, a deterministic demo analyzer produces a
// representative plan so the studio works in any environment.
// (A Supabase Edge Function equivalent ships in
// supabase/functions/analyze-space for teams who prefer to keep
// AI calls inside Supabase.)

import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export const maxDuration = 60;

interface Layer {
  layer: string;
  recommendation: string;
  productSlugs: string[];
}

export interface Analysis {
  source: "ai" | "demo";
  spaceRead: string;
  naturalLight: string;
  mood: string;
  layers: Layer[];
  cct: string;
  controls: string;
  nextStep: string;
}

const CATALOG_BRIEF = PRODUCTS.map(
  (p) => `- ${p.slug} | ${p.name} | ${p.category} | ${p.blurb}`
).join("\n");

const VALID_SLUGS = new Set(PRODUCTS.map((p) => p.slug));

const DEMO_PLANS: Record<string, Omit<Analysis, "source">> = {
  "living-room": {
    spaceRead:
      "Living room with a standard-height ceiling and a mixed seating arrangement. The room currently relies on a single central source, which flattens the space after dark.",
    naturalLight: "Moderate daylight; evenings depend entirely on electric light.",
    mood: "Warm, layered, and calm — light that lowers with the evening.",
    layers: [
      {
        layer: "Ambient",
        recommendation:
          "Replace the central fixture with a Meridian Ring sized to the seating area, dimmed on a warm-dim curve so the room settles as the night goes on.",
        productSlugs: ["meridian-ring-grand"],
      },
      {
        layer: "Task",
        recommendation:
          "Two Vela Punto mini downlights over reading corners, and a Gallery Picture Light on the main art wall.",
        productSlugs: ["vela-punto-mini", "library-picture-luxe"],
      },
      {
        layer: "Accent",
        recommendation:
          "Eclipse plaster sconces flanking the sofa wall, painted to match, so the walls glow without visible fixtures.",
        productSlugs: ["halo-plaster-eclipse"],
      },
    ],
    cct: "2200–2700K warm-dim throughout; nothing cooler after sunset.",
    controls: "Single scene keypad — Evening / Entertain / Away — via the Legacy Dimmer Bridge, no rewiring.",
    nextStep: "A designer reviews this plan against your photo and confirms sizing on a free 20-minute call.",
  },
  kitchen: {
    spaceRead:
      "Kitchen with an island or peninsula work zone. Task light on the counters matters most; overheads alone will cast shadows exactly where you work.",
    naturalLight: "Typically good by day, harsh contrast at night.",
    mood: "Crisp where you cut, warm where you gather.",
    layers: [
      {
        layer: "Ambient",
        recommendation: "Vela Punto minis on a 2700K grid, spaced off the cabinet faces to avoid scallops.",
        productSlugs: ["vela-punto-mini"],
      },
      {
        layer: "Task",
        recommendation:
          "Ember Globe pendants staggered over the island — glass sized to your counter length — plus Vela Linea under-cabinet channel for shadow-free prep.",
        productSlugs: ["ember-globe-pendant", "vela-linea-channel"],
      },
      {
        layer: "Accent",
        recommendation: "Alcove Glow toe-kick lighting for a floating effect and a built-in night path.",
        productSlugs: ["alcove-step-glow"],
      },
    ],
    cct: "2700K living zones, 3000K at prep surfaces.",
    controls: "Two zones — work and gather — with the night path on an astronomical clock.",
    nextStep: "Send counter dimensions with your photo and we confirm pendant sizing before quoting.",
  },
  bedroom: {
    spaceRead:
      "Bedroom where the ceiling fixture likely does too much work. Bedrooms want low, warm, indirect light and true darkness on demand.",
    naturalLight: "Varies; blackout evenings assumed.",
    mood: "Candlelight-calm, with zero glare from the pillow.",
    layers: [
      {
        layer: "Ambient",
        recommendation: "Oku paper lantern for a soft volumetric glow instead of a bright ceiling point.",
        productSlugs: ["lantern-oku-paper"],
      },
      {
        layer: "Task",
        recommendation: "Ribbon Wave sconces at each bedside, down-channel only, dimming to 0.5% for reading.",
        productSlugs: ["ribbon-brass-wave"],
      },
      {
        layer: "Accent",
        recommendation: "Alcove Glow as a motion-activated night path to the bath, at 2400K so it never fully wakes you.",
        productSlugs: ["alcove-step-glow"],
      },
    ],
    cct: "1800–2400K after dusk; warm-dim everywhere.",
    controls: "Bedside master-off, plus a circadian curve via the Scena engine if you want light that tracks sunset.",
    nextStep: "A designer confirms sconce mounting heights against your headboard from the photo.",
  },
  "dining-room": {
    spaceRead:
      "Dining room organized around the table. The fixture over the table is the room's jewelry — it should hold attention and flatter faces.",
    naturalLight: "Secondary; this room performs at night.",
    mood: "Intimate, a little theatrical, dimmed deep for long dinners.",
    layers: [
      {
        layer: "Ambient",
        recommendation:
          "Helios Linear cut to two-thirds of your table length, or the Candela Tiered Crystal for a formal room.",
        productSlugs: ["helios-linear-72", "candela-tiered-crystal"],
      },
      {
        layer: "Task",
        recommendation: "The table fixture handles it — target 300 lux at the surface, dimmable to 5%.",
        productSlugs: [],
      },
      {
        layer: "Accent",
        recommendation: "Gallery picture lights on art, Eclipse sconces on the buffet wall.",
        productSlugs: ["library-picture-luxe", "halo-plaster-eclipse"],
      },
    ],
    cct: "2400K at the table — the most flattering temperature for faces and food.",
    controls: "One dimmer, programmed: Dinner / Candlelight / Clean-up.",
    nextStep: "Share table dimensions and we size the fixture and drop exactly.",
  },
  office: {
    spaceRead:
      "Workspace or commercial office. Vertical illuminance and glare control drive comfort here more than raw brightness.",
    naturalLight: "Assumed mixed; daylight harvesting recommended.",
    mood: "Alert by day, wind-down capable by evening.",
    layers: [
      {
        layer: "Ambient",
        recommendation:
          "If you have fluorescent troffers, the TrofferRelight kit converts them in place — better light, 62% less energy, rebate-eligible.",
        productSlugs: ["troffer-relight-2x4"],
      },
      {
        layer: "Task",
        recommendation: "Vela Linea over desks and work walls for even, shadow-free task planes.",
        productSlugs: ["vela-linea-channel"],
      },
      {
        layer: "Accent",
        recommendation: "Stiletto vertical drops in the entry or stair void to give the space a signature.",
        productSlugs: ["stiletto-vertical-drop"],
      },
    ],
    cct: "3500K work hours, warming to 2700K after 5pm on a circadian schedule.",
    controls: "Scena engine with occupancy and daylight sensors — and we file the utility rebates.",
    nextStep: "For 20+ fixtures, book the free site audit; the turnkey program covers disposal through rebates.",
  },
  restaurant: {
    spaceRead:
      "Hospitality space. Light levels will make or break the room: bright enough to read a menu, dim enough that every table feels private.",
    naturalLight: "Transitional — the room must shift from lunch to late service.",
    mood: "Layered pools of warm light over tables; the room recedes, guests glow.",
    layers: [
      {
        layer: "Ambient",
        recommendation: "Branchwork Noir or a nested Meridian Ring as the room's centerpiece, dimmed low.",
        productSlugs: ["branchwork-antler-noir", "meridian-ring-grand"],
      },
      {
        layer: "Task",
        recommendation: "Foundry Dome pendants at the bar; Vela Punto pinspots at 2400K over each table.",
        productSlugs: ["foundry-dome-16", "vela-punto-mini"],
      },
      {
        layer: "Accent",
        recommendation: "Modern Gaslight Torches at the entry and Vela Arco cove to lift the ceiling at close.",
        productSlugs: ["gaslight-torch-modern", "vela-arco-uplight"],
      },
    ],
    cct: "2200–2400K front of house; 3500K back of house.",
    controls: "Scena scenes on an astronomical clock: Lunch / Golden hour / Dinner / Close.",
    nextStep: "We photometrically model one bay of your dining room free with any consultation.",
  },
  retail: {
    spaceRead:
      "Retail floor. Merchandise needs punch (high CRI, tight optics) while circulation stays comfortable — contrast sells.",
    naturalLight: "Storefront glazing assumed; window displays must beat daylight.",
    mood: "Product-first drama with an inviting threshold.",
    layers: [
      {
        layer: "Ambient",
        recommendation: "Even 3000K base layer at circulation paths — Vela Punto on wide beams.",
        productSlugs: ["vela-punto-mini"],
      },
      {
        layer: "Task",
        recommendation: "TrackRelight heads on your existing track, re-aimed seasonally with swappable optics.",
        productSlugs: ["track-relight-heads"],
      },
      {
        layer: "Accent",
        recommendation: "Vela Firma grazing the façade so the store reads from across the street.",
        productSlugs: ["vela-firma-exterior"],
      },
    ],
    cct: "3000K floor, 3500K feature walls, 90+ CRI throughout.",
    controls: "Open / Trading / Window-only after close — automated, with rebate-eligible hardware.",
    nextStep: "Bring your track type (H/J/L) and we confirm head compatibility instantly.",
  },
  other: {
    spaceRead:
      "A space with its own rules — which is our favorite kind. The plan below is a starting framework; the photo review will make it specific.",
    naturalLight: "To be read from your photo during design review.",
    mood: "Warm, layered, glare-free.",
    layers: [
      {
        layer: "Ambient",
        recommendation: "A dimmable central layer sized to the room — ring, linear, or lantern form.",
        productSlugs: ["meridian-ring-grand", "lantern-oku-paper"],
      },
      {
        layer: "Task",
        recommendation: "Focused light exactly where hands and eyes work.",
        productSlugs: ["vela-punto-mini", "vela-linea-channel"],
      },
      {
        layer: "Accent",
        recommendation: "One signature move — a restored vintage piece or a grazed texture wall.",
        productSlugs: ["1962-sputnik-starburst", "vela-arco-uplight"],
      },
    ],
    cct: "2700K default, warm-dim where budget allows.",
    controls: "Simple scenes over app-only control — switches guests can understand.",
    nextStep: "A designer reviews your photo and returns a specific plan within one business day.",
  },
};

function demoAnalysis(roomType: string, goals: string): Analysis {
  const plan = DEMO_PLANS[roomType] ?? DEMO_PLANS.other;
  const withGoals = goals
    ? { ...plan, mood: `${plan.mood} Tuned toward your note: “${goals.slice(0, 140)}”.` }
    : plan;
  return { source: "demo", ...withGoals };
}

export async function POST(req: NextRequest) {
  let body: { image?: string; roomType?: string; goals?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const roomType = body.roomType || "other";
  const goals = body.goals || "";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key or no image → deterministic demo plan
  if (!apiKey || !body.image) {
    return NextResponse.json(demoAnalysis(roomType, goals));
  }

  try {
    const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(body.image);
    if (!match) return NextResponse.json(demoAnalysis(roomType, goals));
    const [, mediaType, data] = match;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data },
              },
              {
                type: "text",
                text: `You are the lighting designer at Lumenwright, a custom lighting atelier. Analyze this photo of a client's space (they describe it as: ${roomType}; their goals: ${goals || "not specified"}).

Recommend a three-layer lighting plan (ambient, task, accent) using ONLY products from this catalog (reference by slug):
${CATALOG_BRIEF}

Respond with ONLY valid JSON matching:
{"spaceRead": string, "naturalLight": string, "mood": string, "layers": [{"layer": "Ambient"|"Task"|"Accent", "recommendation": string, "productSlugs": string[]}], "cct": string, "controls": string, "nextStep": string}

Ground every observation in what is actually visible in the photo (ceiling height, windows, existing fixtures, finishes, furniture). Warm, specific, no fluff.`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const json = await res.json();
    const text: string = json.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in model response");
    const parsed = JSON.parse(jsonMatch[0]);

    // keep only slugs that exist in the catalog
    const layers: Layer[] = (parsed.layers ?? []).map((l: Layer) => ({
      layer: String(l.layer ?? ""),
      recommendation: String(l.recommendation ?? ""),
      productSlugs: (l.productSlugs ?? []).filter((s: string) => VALID_SLUGS.has(s)),
    }));

    const analysis: Analysis = {
      source: "ai",
      spaceRead: String(parsed.spaceRead ?? ""),
      naturalLight: String(parsed.naturalLight ?? ""),
      mood: String(parsed.mood ?? ""),
      layers,
      cct: String(parsed.cct ?? ""),
      controls: String(parsed.controls ?? ""),
      nextStep: String(parsed.nextStep ?? "A designer reviews every AI plan before your consultation."),
    };
    return NextResponse.json(analysis);
  } catch {
    // any AI failure degrades to the demo plan rather than an error
    return NextResponse.json(demoAnalysis(roomType, goals));
  }
}
