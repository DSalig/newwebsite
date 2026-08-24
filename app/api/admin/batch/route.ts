// Staff write: receive a new production lot — inserts the batch
// (lot, dates, COA path), increments stock, and writes a 'receive'
// movement referencing the lot. Mirrors the seed's launch pattern.

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_WRITE_DENIED, isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: ADMIN_WRITE_DENIED }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase is not configured — connect it to enable live edits." },
      { status: 501 }
    );
  }

  let body: {
    slug?: string;
    lot?: string;
    qty?: number;
    manufactured_on?: string;
    best_by?: string;
    coa_url?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const lot = body.lot?.trim().toUpperCase();
  if (!body.slug || !lot || !Number.isInteger(body.qty) || body.qty! <= 0) {
    return NextResponse.json(
      { error: "slug, lot, and a positive integer qty are required." },
      { status: 400 }
    );
  }

  const { data: product, error: pErr } = await sb
    .from("products")
    .select("id, inventory(stock)")
    .eq("slug", body.slug)
    .maybeSingle();
  if (pErr || !product) {
    return NextResponse.json({ error: pErr?.message ?? "Product not found." }, { status: 404 });
  }

  const { data: batch, error: bErr } = await sb
    .from("batches")
    .insert({
      product_id: product.id,
      lot,
      manufactured_on: body.manufactured_on?.slice(0, 20) ?? "",
      best_by: body.best_by?.slice(0, 20) ?? "",
      coa_url: body.coa_url?.slice(0, 300) ?? `/coa/${lot}.pdf`,
      received_qty: body.qty,
    })
    .select("id")
    .single();
  if (bErr) {
    const dupe = bErr.message.includes("duplicate");
    return NextResponse.json(
      { error: dupe ? `Lot ${lot} already exists.` : bErr.message },
      { status: dupe ? 409 : 500 }
    );
  }

  const current = Number(
    (product.inventory?.[0] as { stock?: number } | undefined)?.stock ?? 0
  );
  const { error: iErr } = await sb
    .from("inventory")
    .upsert(
      { product_id: product.id, stock: current + body.qty!, updated_at: new Date().toISOString() },
      { onConflict: "product_id" }
    );
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });

  const { error: mErr } = await sb.from("inventory_movements").insert({
    product_id: product.id,
    batch_id: batch.id,
    type: "receive",
    qty: body.qty,
    reference: `lot ${lot}`,
  });
  if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, stock: current + body.qty! });
}
