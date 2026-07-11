// One-shot creation of the first admin account. Run once:
//   pnpm db:seed-admin
// Credentials come from env (with demo defaults). Re-running updates the
// password — this doubles as the "forgot password" recovery path.

import { createAdminUser } from "./repo";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@kokascent.com")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";
  const name = process.env.ADMIN_NAME ?? "Admin Koka";
  // "admin" (full) or "staff" (no product writes). Create a staff account with:
  //   ADMIN_EMAIL=staf@kokascent.com ADMIN_ROLE=staff npm run db:seed-admin
  const role = process.env.ADMIN_ROLE === "staff" ? "staff" : "admin";

  const passwordHash = await hashPassword(password);
  await createAdminUser({ email, name, passwordHash, role });

  console.log(`[db:seed-admin] ${role} account ready: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[db:seed-admin] failed:", err);
  process.exit(1);
});
