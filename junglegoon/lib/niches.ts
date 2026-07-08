import { Category } from "./estimator";
import { computeNicheScores, NicheScores } from "./scoring";
import { makeRng, makeSeries } from "./rand";

export type Niche = {
  id: string;
  name: string;
  category: Category;
  seeds: string[]; // seed keywords, also drive keyword generation
  productNouns: string[]; // drive product title generation
  searchVolume: number;
  volumeTrendPct: number; // 12-month change
  volumeSeries: number[]; // 12 monthly points
  avgPrice: number;
  avgReviews: number;
  topBrandShare: number;
  entrenchedSellers: number;
  seasonality: "Stable" | "Summer peak" | "Winter peak" | "Q4 gift spike";
  scores: NicheScores;
};

type NicheDef = {
  id: string;
  name: string;
  category: Category;
  seeds: string[];
  productNouns: string[];
  seasonality: Niche["seasonality"];
  // rough dials, 0-1, that shape the generated stats
  heat: number; // how trendy / growing
  moat: number; // how entrenched the competition is
  volume: number; // how big the search demand is
  price: number; // typical ASP, in dollars
};

const DEFS: NicheDef[] = [
  { id: "cold-brew", name: "Cold Brew Coffee Gear", category: "Home & Kitchen", seeds: ["cold brew coffee maker", "cold brew filter", "coffee concentrate bottle"], productNouns: ["Cold Brew Maker", "Cold Brew Filter Kit", "Coffee Concentrate Dispenser", "Brew Pitcher"], seasonality: "Summer peak", heat: 0.55, moat: 0.65, volume: 0.7, price: 27 },
  { id: "sourdough", name: "Sourdough Baking Tools", category: "Home & Kitchen", seeds: ["sourdough starter jar", "banneton proofing basket", "bread lame"], productNouns: ["Starter Jar Kit", "Proofing Basket Set", "Bread Lame", "Dough Scraper Set"], seasonality: "Winter peak", heat: 0.7, moat: 0.45, volume: 0.6, price: 24 },
  { id: "cast-iron", name: "Cast Iron Accessories", category: "Home & Kitchen", seeds: ["cast iron scrubber", "cast iron handle cover", "chainmail scrubber"], productNouns: ["Chainmail Scrubber", "Handle Cover Set", "Seasoning Oil Kit", "Skillet Organizer"], seasonality: "Q4 gift spike", heat: 0.5, moat: 0.5, volume: 0.55, price: 18 },
  { id: "compost", name: "Countertop Compost Bins", category: "Home & Kitchen", seeds: ["kitchen compost bin", "compost bin filter", "countertop compost pail"], productNouns: ["Compost Bin", "Charcoal Filter Pack", "Compost Pail Liner"], seasonality: "Stable", heat: 0.6, moat: 0.55, volume: 0.5, price: 29 },
  { id: "packing", name: "Travel Packing Systems", category: "Home & Kitchen", seeds: ["compression packing cubes", "toiletry bag hanging", "shoe bags travel"], productNouns: ["Compression Packing Cubes", "Hanging Toiletry Kit", "Shoe Bag Set", "Cable Pouch"], seasonality: "Summer peak", heat: 0.65, moat: 0.75, volume: 0.85, price: 26 },
  { id: "dog-enrichment", name: "Dog Enrichment Toys", category: "Pet Supplies", seeds: ["dog lick mat", "snuffle mat", "dog puzzle toy"], productNouns: ["Lick Mat 2-Pack", "Snuffle Mat", "Puzzle Feeder", "Treat Dispensing Ball"], seasonality: "Stable", heat: 0.8, moat: 0.6, volume: 0.75, price: 17 },
  { id: "cat-wall", name: "Cat Wall Furniture", category: "Pet Supplies", seeds: ["cat wall shelves", "cat climbing wall", "floating cat perch"], productNouns: ["Wall Shelf Set", "Climbing Step Set", "Floating Perch", "Wall Scratcher"], seasonality: "Stable", heat: 0.7, moat: 0.4, volume: 0.45, price: 46 },
  { id: "raw-feeding", name: "Raw Feeding Accessories", category: "Pet Supplies", seeds: ["raw dog food scale", "meat grinder pet", "freezer portion containers"], productNouns: ["Portion Container Set", "Feeding Scale", "Prep Mat Kit"], seasonality: "Stable", heat: 0.55, moat: 0.3, volume: 0.3, price: 32 },
  { id: "mobility", name: "Mobility & Recovery Tools", category: "Sports & Outdoors", seeds: ["massage gun attachment", "foam roller", "calf stretcher"], productNouns: ["Foam Roller", "Calf Stretcher Board", "Massage Ball Set", "Back Cracker"], seasonality: "Stable", heat: 0.6, moat: 0.8, volume: 0.8, price: 31 },
  { id: "pickleball", name: "Pickleball Accessories", category: "Sports & Outdoors", seeds: ["pickleball paddle grip", "pickleball bag", "paddle cover"], productNouns: ["Paddle Grip Tape", "Court Bag", "Paddle Cover 2-Pack", "Ball Holder"], seasonality: "Summer peak", heat: 0.9, moat: 0.5, volume: 0.7, price: 22 },
  { id: "cold-plunge", name: "Cold Plunge Accessories", category: "Sports & Outdoors", seeds: ["cold plunge tub", "ice bath thermometer", "plunge tub cover"], productNouns: ["Plunge Tub", "Water Thermometer", "Insulated Tub Cover", "Chiller Filter Pack"], seasonality: "Winter peak", heat: 0.85, moat: 0.45, volume: 0.55, price: 89 },
  { id: "emergency", name: "Emergency Prep Kits", category: "Sports & Outdoors", seeds: ["emergency kit car", "go bag", "water storage containers"], productNouns: ["Roadside Kit", "Go Bag Loadout", "Water Brick Set", "Crank Radio"], seasonality: "Stable", heat: 0.6, moat: 0.7, volume: 0.65, price: 54 },
  { id: "montessori", name: "Montessori Toddler Furniture", category: "Baby", seeds: ["montessori tower", "toddler learning tower", "montessori shelf"], productNouns: ["Learning Tower", "Toy Shelf", "Wobble Board", "Floor Bed Rail"], seasonality: "Q4 gift spike", heat: 0.65, moat: 0.55, volume: 0.6, price: 78 },
  { id: "baby-sleep", name: "Baby Sleep & Sound", category: "Baby", seeds: ["white noise machine baby", "portable sound machine", "red night light"], productNouns: ["Sound Machine", "Portable Hush Puck", "Red Night Light", "Crib Sensor Pad"], seasonality: "Stable", heat: 0.6, moat: 0.85, volume: 0.75, price: 33 },
  { id: "scalp-care", name: "Scalp Care & Hair Oiling", category: "Beauty & Personal Care", seeds: ["scalp massager", "hair oil applicator", "rosemary oil hair"], productNouns: ["Scalp Massager", "Oil Applicator Bottle", "Scalp Brush Set", "Heat Cap"], seasonality: "Stable", heat: 0.85, moat: 0.6, volume: 0.85, price: 15 },
  { id: "face-tools", name: "Facial Massage Tools", category: "Beauty & Personal Care", seeds: ["gua sha set", "face roller", "ice roller face"], productNouns: ["Gua Sha Set", "Ice Roller", "Face Sculpting Kit"], seasonality: "Q4 gift spike", heat: 0.5, moat: 0.75, volume: 0.7, price: 14 },
  { id: "desk-ergo", name: "Desk Ergonomics", category: "Office Products", seeds: ["foot rest under desk", "monitor riser", "keyboard wrist rest"], productNouns: ["Foot Rest", "Monitor Riser", "Wrist Rest Set", "Lap Desk"], seasonality: "Stable", heat: 0.55, moat: 0.7, volume: 0.7, price: 28 },
  { id: "cable-mgmt", name: "Cable Management", category: "Office Products", seeds: ["cable management tray", "cord organizer desk", "cable sleeve"], productNouns: ["Under-Desk Tray", "Cord Organizer Kit", "Cable Sleeve 4-Pack", "Magnetic Cable Clips"], seasonality: "Stable", heat: 0.6, moat: 0.55, volume: 0.6, price: 19 },
  { id: "focus-tools", name: "Focus & Time-Blocking Tools", category: "Office Products", seeds: ["visual timer", "pomodoro timer cube", "fidget desk toy"], productNouns: ["Visual Timer", "Timer Cube", "Desk Fidget Set", "Task Card Deck"], seasonality: "Stable", heat: 0.75, moat: 0.5, volume: 0.55, price: 21 },
  { id: "mushroom", name: "Mushroom Growing Kits", category: "Patio, Lawn & Garden", seeds: ["mushroom grow kit", "mushroom growing bag", "monotub kit"], productNouns: ["Oyster Grow Kit", "All-in-One Grow Bag", "Monotub Kit", "Humidity Dome"], seasonality: "Winter peak", heat: 0.8, moat: 0.35, volume: 0.5, price: 34 },
  { id: "native-garden", name: "Native Plant Gardening", category: "Patio, Lawn & Garden", seeds: ["native wildflower seeds", "seed starting trays", "plant labels metal"], productNouns: ["Wildflower Seed Mix", "Seed Starting Kit", "Metal Plant Labels"], seasonality: "Summer peak", heat: 0.7, moat: 0.3, volume: 0.45, price: 20 },
  { id: "bird-tech", name: "Bird Feeding Tech", category: "Patio, Lawn & Garden", seeds: ["smart bird feeder camera", "squirrel proof feeder", "hummingbird feeder"], productNouns: ["Camera Feeder", "Squirrel-Proof Feeder", "Window Feeder", "Nectar Station"], seasonality: "Summer peak", heat: 0.9, moat: 0.5, volume: 0.75, price: 62 },
  { id: "board-game", name: "Board Game Accessories", category: "Toys & Games", seeds: ["board game organizer", "card sleeves", "dice tray"], productNouns: ["Game Organizer Insert", "Premium Card Sleeves", "Folding Dice Tray", "Token Trays"], seasonality: "Q4 gift spike", heat: 0.6, moat: 0.45, volume: 0.55, price: 23 },
  { id: "mini-paint", name: "Miniature Painting Supplies", category: "Toys & Games", seeds: ["miniature paint set", "hobby holder", "dry palette"], productNouns: ["Detail Brush Set", "Painting Handle", "Wet Palette", "Paint Rack"], seasonality: "Stable", heat: 0.65, moat: 0.4, volume: 0.4, price: 27 },
];

function buildNiche(def: NicheDef): Niche {
  const rng = makeRng(`niche:${def.id}`);
  const searchVolume = Math.round((15000 + def.volume * 420000) * (0.85 + rng.next() * 0.3));
  const volumeTrendPct = Math.round((def.heat - 0.45) * 90 + rng.gaussish() * 8);
  const avgPrice = Math.round(def.price * (0.9 + rng.next() * 0.2) * 100) / 100;
  const avgReviews = Math.round((150 + def.moat * 5200) * (0.8 + rng.next() * 0.4));
  const topBrandShare = Math.round((0.08 + def.moat * 0.42) * 100) / 100;
  const entrenchedSellers = Math.min(10, Math.round(def.moat * 9 + rng.next() * 2));
  const estTopSellerSales = Math.round((250 + def.volume * 3800) * (0.8 + rng.next() * 0.4));

  return {
    id: def.id,
    name: def.name,
    category: def.category,
    seeds: def.seeds,
    productNouns: def.productNouns,
    searchVolume,
    volumeTrendPct,
    volumeSeries: makeSeries(rng, 12, searchVolume, volumeTrendPct),
    avgPrice,
    avgReviews,
    topBrandShare,
    entrenchedSellers,
    seasonality: def.seasonality,
    scores: computeNicheScores({
      searchVolume,
      estTopSellerSales,
      avgReviews,
      topBrandShare,
      entrenchedSellers,
    }),
  };
}

export const NICHES: Niche[] = DEFS.map(buildNiche);

export function nicheById(id: string): Niche | undefined {
  return NICHES.find((n) => n.id === id);
}
