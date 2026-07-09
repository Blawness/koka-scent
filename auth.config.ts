// Edge-safe NextAuth config: no database or Node-only imports here, so it can
// run inside proxy.ts. The Credentials provider (which needs the DB) lives in
// auth.ts, which spreads this config.

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Trust the deploy host for callback URLs. Vercel sets this automatically;
  // self-hosted / local production builds need it explicit.
  trustHost: true,
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    // Runs in the proxy for every matched request. Gates /admin/* and bounces
    // an already-signed-in user away from the login page.
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const isLogin = path === "/admin/login";
      const loggedIn = Boolean(auth?.user);

      if (isLogin) {
        if (loggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }
      // Every other /admin/* path requires a session.
      return loggedIn;
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
