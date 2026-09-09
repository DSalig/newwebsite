// Pepthea business identity — single source of truth for name,
// contact points, and compliance copy. Update before going live.
//
// Naming note: "Pepthea" was chosen for category recognition
// (the "pept-" root customers already search for) + a warm,
// wellness-coded suffix (Thea, Greek titaness of light).
// pepthea.com was verified available at time of build.

export const site = {
  name: "Pepthea",
  domain: "pepthea.com",
  tagline: "Peptide skincare & wellness, proven by the batch.",
  description:
    "Clinically-dosed peptide skincare and collagen wellness. Every batch third-party tested, every concentration on the label. No hype, no gray-market — cosmetic and dietary peptides only.",
  email: {
    hello: "hello@pepthea.com",
    support: "support@pepthea.com",
    wholesale: "wholesale@pepthea.com",
  },
  instagram: "https://instagram.com/pepthea",
  tiktok: "https://tiktok.com/@pepthea",
  // Displayed wherever ingestible products appear (FTC/FDA
  // requirement for dietary supplements).
  fdaDisclaimer:
    "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
  // Displayed in the footer & quality page. Pepthea deliberately
  // sells cosmetic (topical) and dietary (ingestible) peptides
  // only — no injectable or \"research use only\" compounds.
  complianceNote:
    "Pepthea sells cosmetic and dietary peptide products only. We do not sell injectable, compounded, or research-use-only peptides.",
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/quiz", label: "Routine Builder" },
  { href: "/science", label: "The Science" },
  { href: "/quality", label: "Testing & COAs" },
  { href: "/about", label: "About" },
] as const;

export const announcement =
  "Free U.S. shipping over $50 · Every batch third-party tested";
