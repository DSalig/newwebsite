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

/** Insert a lead; returns true on success, false if Supabase is
 *  unavailable (caller should fall back to mailto). */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("leads").insert(payload);
  return !error;
}

export async function submitOrderRequest(
  payload: OrderRequestPayload
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("order_requests").insert(payload);
  return !error;
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
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("designer_referrals").insert(payload);
  return !error;
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
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("designer_applications").insert(payload);
  return !error;
}
