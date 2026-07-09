// Next.js 16 renamed middleware.ts → proxy.ts, and requires an explicit
// function export (a destructured const from NextAuth is not statically
// detected). This delegates to NextAuth's edge-safe gate, which bounces
// anonymous visitors from /admin/* to /admin/login (and signed-in users away
// from the login page) via the `authorized` callback in auth.config.ts.
//
// Optimistic gate only — the real authorization check is lib/dal.ts
// requireAdmin(), invoked per page.

import NextAuth from "next-auth";
import type { NextRequest, NextFetchEvent } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // NextAuth's `auth` is callable with the middleware (request, event)
  // signature; its types don't expose that overload, so cast through.
  return (auth as unknown as (req: NextRequest, ev: NextFetchEvent) => unknown)(
    request,
    event,
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};
