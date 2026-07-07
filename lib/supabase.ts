import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients — PRD Section 4 (Database / Auth / Storage).
 *
 * - `supabase` (anon): safe for the browser and public reads (RLS-guarded).
 * - `createServiceRoleClient()`: server-only, bypasses RLS. NEVER import this
 *   into a client component — it uses the secret service-role key.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Non-fatal during scaffolding; real values come from .env (see .env.example).
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
);

/**
 * Server-only client using the service-role key. Use inside Route Handlers /
 * server code for privileged writes (orders, webhooks, admin mutations).
 */
export function createServiceRoleClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[supabase] SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL are required for the service-role client.",
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
