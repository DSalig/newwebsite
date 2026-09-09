// Staff write: order status transitions (fulfillment ledger).
// Money stays in Stripe — setting 'refunded' here records what was
// already refunded there.

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_WRITE_DENIED, isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const STATUSES = ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"];

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

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id || !body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: `id and a status in [${STATUSES.join(", ")}] are required.` },
      { status: 400 }
    );
  }

  const { error } = await sb.from("orders").update({ status: body.status }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
