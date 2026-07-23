// Issues the staff-console session cookie when the submitted
// password matches ADMIN_PASSWORD. The cookie stores a salted
// SHA-256 token (matching middleware.ts), httpOnly, 7 days.

import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function token(password: string): string {
  return createHash("sha256").update(`pepthea-admin:${password}`).digest("hex");
}

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: true, demo: true });
  }
  let password = "";
  try {
    ({ password = "" } = await req.json());
  } catch {
    /* fall through to mismatch */
  }
  const a = Buffer.from(String(password));
  const b = Buffer.from(expected);
  const match = a.length === b.length && timingSafeEqual(a, b);
  if (!match) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("pt_admin", token(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
