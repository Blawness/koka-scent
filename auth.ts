// Full NextAuth (Auth.js v5) instance — used by Server Components, Server
// Actions, and the route handler. JWT sessions (no DB session table), one
// Credentials provider authenticating against the admin_users table.

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { getAdminByEmail } from "./db/repo";
import { verifyPassword } from "./lib/auth/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const admin = await getAdminByEmail(email.toLowerCase().trim());
        if (!admin) return null;

        const ok = await verifyPassword(password, admin.passwordHash);
        if (!ok) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
});
