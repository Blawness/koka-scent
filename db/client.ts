// Neon + Drizzle client. `db` is `null` when DATABASE_URL is unset so the app
// can run with zero external setup — db/repo.ts falls back to seed data.
// Never import this directly outside db/repo.ts.

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

const databaseUrl = process.env.DATABASE_URL;

export const db: Database | null = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : null;
