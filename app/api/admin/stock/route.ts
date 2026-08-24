// Staff write: stock corrections. Every change writes an
// inventory_movements audit row so the ledger keeps explaining the
// number ('adjust' for counts/shrinkage, 'return' for restocks).

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

  let body: { slug?: string; stock?: number; type?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.slug || !Number.isInteger(body.stock) || body.stock! < 0) {
    return NextResponse.json(
      { error: "slug and a non-negative integer stock are required." },
      { status: 400 }
    );
  }
  const type = body.type === "return" ? "return" : "adjust";

  const { data: product, error: pErr } = await sb
    .from("products")
    .select("id, inventory(stock)")
    .eq("slug", body.slug)
    .maybeSingle();
  if (pErr || !product) {
    return NextResponse.json({ error: pErr?.message ?? "Product not found." }, { status: 404 });
  }
  const current = Number(
    (product.inventory?.[0] as { stock?: number } | undefined)?.stock ?? 0
  );
  const delta = body.stock! - current;

  const { error: iErr } = await sb
    .from("inventory")
    .upsert(
      { product_id: product.id, stock: body.stock, updated_at: new Date().toISOString() },
      { onConflict: "product_id" }
    );
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });

  if (delta !== 0) {
    const { error: mErr } = await sb.from("inventory_movements").insert({
      product_id: product.id,
      type,
      qty: delta,
      reference: body.note?.slice(0, 200) || "console adjustment",
    });
    if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, previous: current, stock: body.stock });
}
