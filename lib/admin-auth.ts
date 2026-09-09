// Cookie check for admin WRITE endpoints (/api/admin/*). The
// middleware only gates /admin pages; API mutations verify here.
// Writes are refused entirely until ADMIN_PASSWORD is set — demo
// mode is read-only by design.

import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = createHash("sha256")
    .update(`pepthea-admin:${password}`)
    .digest("hex");
  return req.cookies.get("pt_admin")?.value === expected;
}

export const ADMIN_WRITE_DENIED =
  "Admin writes require ADMIN_PASSWORD to be set and a signed-in staff session.";
