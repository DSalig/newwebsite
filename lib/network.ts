// Designer network types + helpers.
// The network launches concierge-first: referrals are matched by
// hand, and the public directory renders whatever real designers
// exist in the Supabase `designers` table — no fabricated
// profiles, no size claims.

import { getSupabase } from "./supabase";

export interface Designer {
  slug: string;
  name: string;
  studio: string;
  metros: string[];
  specialties: string[];
  bio: string;
  credentials: string | null;
  website: string | null;
}

/** Where a referral originated + what the visitor had already decided. */
export type ReferralContext =
  | {
      kind: "studio-plan";
      roomType: string;
      productSlugs: string[];
      source: "ai" | "demo";
    }
  | {
      kind: "product-order";
      productSlug: string;
      productName: string;
      options: Record<string, string>;
    }
  | { kind: "retrofit" }
  | { kind: "general" };

export const SPECIALTIES = [
  "Custom installations",
  "Vintage & restoration",
  "Chandelier repair",
  "LED retrofit / commercial",
  "Residential design",
  "Hospitality design",
] as const;

export function describeContext(ctx: ReferralContext): string {
  switch (ctx.kind) {
    case "studio-plan":
      return `AI studio plan — ${ctx.roomType}; pieces: ${ctx.productSlugs.join(", ") || "n/a"}`;
    case "product-order":
      return `Product — ${ctx.productName} (${ctx.productSlug}); options: ${Object.entries(ctx.options)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`;
    case "retrofit":
      return "Turnkey LED retrofit project";
    default:
      return "General project";
  }
}

/** Live directory — returns [] when Supabase is unconfigured or empty,
 *  which the UI renders as an honest "founding network forming" state. */
export async function fetchActiveDesigners(): Promise<Designer[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const attempt = (async () => {
    const { data, error } = await sb
      .from("designers")
      .select("slug, name, studio, metros, specialties, bio, credentials, website")
      .eq("active", true)
      .order("name");
    if (error || !data) return [];
    return data as Designer[];
  })().catch(() => [] as Designer[]);
  // stalled or failed → honest empty state, never a hung page
  return Promise.race([
    attempt,
    new Promise<Designer[]>((resolve) => setTimeout(() => resolve([]), 8000)),
  ]);
}
