// Supabase wiring. The site degrades gracefully when the env
// vars are absent (e.g. local preview before a project is
// provisioned): forms fall back to a mailto handoff and the
// catalog serves from lib/products.ts.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) client = createClient(url!, anonKey!);
  return client;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  source: string;
}

export interface OrderRequestPayload {
  product_slug: string;
  product_name: string;
  sku: string;
  options: Record<string, string>;
  quantity: number;
  name: string;
  email: string;
  notes?: string;
}

/** Resolve to `fallback` if the promise hasn't settled in `ms` —
 *  keeps forms from hanging on stalled connections. */
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const SUBMIT_TIMEOUT_MS = 8000;

/** Insert into a table; returns true on success, false on any
 *  failure — unconfigured client, RLS/permission error, a hard
 *  network throw, or a stalled connection — so callers can always
 *  fall back to mailto. */
async function tryInsert(table: string, payload: object): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const attempt = (async () => {
    const { error } = await sb.from(table).insert(payload);
    return !error;
  })().catch(() => false);
  return withTimeout(attempt, SUBMIT_TIMEOUT_MS, false);
}

export async function submitLead(payload: LeadPayload): Promise<boolean> {
  return tryInsert("leads", payload);
}

export async function submitOrderRequest(
  payload: OrderRequestPayload
): Promise<boolean> {
  return tryInsert("order_requests", payload);
}

export interface DesignerReferralPayload {
  name: string;
  email: string;
  location: string;
  notes?: string;
  context: Record<string, unknown>;
  context_summary: string;
}

export async function submitDesignerReferral(
  payload: DesignerReferralPayload
): Promise<boolean> {
  return tryInsert("designer_referrals", payload);
}

export interface DesignerApplicationPayload {
  name: string;
  studio: string;
  email: string;
  location: string;
  specialties: string[];
  portfolio_url?: string;
  message?: string;
}

export async function submitDesignerApplication(
  payload: DesignerApplicationPayload
): Promise<boolean> {
  return tryInsert("designer_applications", payload);
}
