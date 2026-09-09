// Staff write: operational product fields (price, subscribe price,
// reorder point, shop visibility). Copy/actives stay in
// lib/products.ts by design — see docs/TEMPLATE.md.

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
    price?: number;
    subscribe_price?: number;
    reorder_point?: number;
    active?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.slug) {
    return NextResponse.json({ error: "slug is required." }, { status: 400 });
  }

  const patch: Record<string, number | boolean> = {};
  if (Number.isInteger(body.price) && body.price! >= 0) patch.price = body.price!;
  if (Number.isInteger(body.subscribe_price) && body.subscribe_price! >= 0)
    patch.subscribe_price = body.subscribe_price!;
  if (Number.isInteger(body.reorder_point) && body.reorder_point! >= 0)
    patch.reorder_point = body.reorder_point!;
  if (typeof body.active === "boolean") patch.active = body.active;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { error } = await sb.from("products").update(patch).eq("slug", body.slug);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
