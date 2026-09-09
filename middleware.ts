// Gate for the staff console. When ADMIN_PASSWORD is set, /admin
// requires the session cookie issued by /api/admin/login (a
// SHA-256 of the password + salt — no plaintext in the cookie).
// When it's unset, the console runs in open demo mode so the
// dashboards are reviewable before any configuration.

import { NextRequest, NextResponse } from "next/server";

async function expectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`pepthea-admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.next(); // demo mode

  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get("pt_admin")?.value;
  if (cookie && cookie === (await expectedToken(password))) {
    return NextResponse.next();
  }
  const login = req.nextUrl.clone();
  login.pathname = "/admin/login";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
