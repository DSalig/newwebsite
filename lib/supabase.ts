// Supabase wiring. The site degrades gracefully when env vars are
// absent (e.g. local preview before a project is provisioned):
// checkout falls back to order-request capture → mailto, and the
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

// Server-only privileged client for the admin dashboard and the
// Stripe webhook (bypasses RLS). Never import from client code.
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
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
 *  failure so callers can always fall back to mailto. */
async function tryInsert(table: string, payload: object): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const attempt = (async () => {
    const { error } = await sb.from(table).insert(payload);
    return !error;
  })().catch(() => false);
  return withTimeout(attempt, SUBMIT_TIMEOUT_MS, false);
}

export interface OrderRequestPayload {
  email: string;
  name: string;
  items: { slug: string; name: string; qty: number; subscribe: boolean; unit_price: number }[];
  subtotal: number;
  notes?: string;
  source: string;
}

/** Captured when Stripe isn't configured yet — a human follows up
 *  with a payment link. Lands in `order_requests`. */
export async function submitOrderRequest(payload: OrderRequestPayload): Promise<boolean> {
  return tryInsert("order_requests", payload);
}

export interface LeadPayload {
  email: string;
  name?: string;
  topic: string;
  message?: string;
  source: string;
}

export async function submitLead(payload: LeadPayload): Promise<boolean> {
  return tryInsert("leads", payload);
}

export async function subscribeNewsletter(email: string, source: string): Promise<boolean> {
  return tryInsert("newsletter_subscribers", { email, source });
}

export interface QuizSessionPayload {
  answers: Record<string, string>;
  routine_slugs: string[];
  email?: string;
}

export async function submitQuizSession(payload: QuizSessionPayload): Promise<boolean> {
  return tryInsert("quiz_sessions", payload);
}
