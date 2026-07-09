// Data Access Layer — the single authorization gate for admin screens.
// Pages, Server Actions, and route handlers call requireAdmin() rather than
// trusting the proxy. The check binds to the data path, not the route, so a new
// screen cannot forget it.

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** The signed-in admin for this render pass, or null. Cached per request. */
export const verifySession = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

/** Return the signed-in admin, or redirect to the login page. */
export async function requireAdmin() {
  const user = await verifySession();
  if (!user) redirect("/admin/login");
  return user;
}
