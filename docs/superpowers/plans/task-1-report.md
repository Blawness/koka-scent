# Task 1 Report — Data layer (Drizzle + Neon + seed fallback + repo)

Branch: `storefront-demo-v1`
Commit: `d8d76b6` — "Add Drizzle/Neon data layer with DB-optional seed fallback (Task 1)"

## Files created

- `db/schema.ts` — Drizzle schema: `product_category` / `order_status` pg enums,
  `products`, `product_variants`, `orders`, `order_items` tables (mirrors the
  retired `supabase/migrations/0001_init.sql`), plus `relations()` wiring so
  Drizzle's relational query API (`db.query.products.findMany({ with: { variants: true } })`)
  works.
- `db/client.ts` — exports `db: Database | null`. Built from
  `drizzle-orm/neon-http` + `@neondatabase/serverless`'s `neon()`. `null` when
  `process.env.DATABASE_URL` is unset.
- `db/seed-data.ts` — `seedProducts: ProductWithVariants[]`, 13 SKUs:
  - Categories: wanita (3), pria (4), unisex (3), diffuser (3).
  - Stock edge cases: `rempah-nusantara` stock 0 (out of stock);
    `yuzu-embun` stock 3 and `vanila-kelapa` stock 4 (low stock, <5).
  - 0–2 variants per product (mix of no-variant, single-variant, two-variant SKUs).
  - All reference `/products/placeholder.svg`.
- `db/repo.ts` — the single fallback-decision module:
  - `listActiveProducts(category?)`, `getProductBySlug(slug)`,
    `createOrder(input)`, `getOrderByNumber(orderNumber, phone?)`.
  - Each checks `db` from `db/client.ts`; if present, queries Drizzle and maps
    rows (Date → ISO string) to the `types/index.ts` domain shapes; if absent,
    operates on `seedProducts` (products) and a module-level `memoryOrders`
    array (orders — resets on server restart, as intended for the demo path).
  - Order numbers: `KS-YYYYMMDD-NNNN`, sequence computed per day — via a
    `count(*) ... where order_number like 'KS-YYYYMMDD-%'` query in the DB
    path, and via `Array.filter(...).length` in the in-memory path.
  - `createOrder` returns `{ orderNumber, status: "pending" }` per the plan;
    `getOrderByNumber` returns the full `OrderWithItems` (needed by Task 4's
    confirmation page).
- `db/seed.ts` — idempotent seed script: upserts each seed product on
  `slug` conflict, then wholesale-replaces its variants (delete + reinsert —
  simplest idempotent strategy for a small static seed set). Exits 1 with a
  clear message if `DATABASE_URL` is unset (no point re-implementing the
  fallback here).
- `drizzle.config.ts` — points at `db/schema.ts`, `dialect: "postgresql"`,
  reads `DATABASE_URL`.
- `public/products/placeholder.svg` — single reusable placeholder image
  (simple bottle illustration on cream background), referenced by all seed SKUs.
- `docs/superpowers/plans/task-1-report.md` — this report.

## Files deleted

- `lib/supabase.ts`
- `supabase/migrations/0001_init.sql` (and the now-empty `supabase/` dir)

Confirmed no other file imported `@/lib/supabase` or `@supabase/supabase-js`
before deleting. Also removed the now-unused `@supabase/supabase-js` dependency
from `package.json` (`pnpm remove @supabase/supabase-js`).

## Dependencies

Added: `drizzle-orm`, `@neondatabase/serverless` (dependencies);
`drizzle-kit`, `tsx` (devDependencies — `tsx` is needed to run `db/seed.ts`
outside Next's runtime). Removed: `@supabase/supabase-js`.

## package.json scripts added

```
"db:generate": "drizzle-kit generate"
"db:migrate": "drizzle-kit migrate"
"db:seed": "tsx --env-file=.env.local db/seed.ts"
```

## `.env.example`

Left as-is per instructions — already uses `DATABASE_URL` with no Supabase vars.

## Key decisions

1. **Order numbering** uses a date-based `LIKE` prefix count rather than a DB
   sequence/identity column, so the same logic (count existing matching
   numbers, +1) works identically in both the Drizzle and in-memory paths —
   avoids divergent behavior between the two code paths.
2. **No DB transactions** in `createOrder`'s Drizzle path: `drizzle-orm`'s
   `neon-http` driver (HTTP-based, no persistent connection) does not support
   interactive multi-statement transactions. Order + order-items are inserted
   sequentially. Acceptable for this demo scope; flagged as a concern below.
3. **Variant reseed strategy**: `db:seed` deletes and reinserts a product's
   variants on every run rather than diffing — simplest correct idempotent
   behavior for a small static seed list; would need revisiting if variants
   ever need stable IDs referenced elsewhere (e.g. existing order_items FK).
4. Kept `lib/dummy-data.ts` untouched (Task 2 replaces its usage in the API
   routes) per instructions.
5. Domain mapping in `repo.ts` explicitly converts Drizzle `Date` fields to
   ISO strings to match `types/index.ts`'s `string` timestamp fields — this
   is the one place the two representations meet.

## Verification

### `pnpm exec tsc --noEmit`
No output — clean.

### `pnpm lint`
```
/home/blawness/projects/koka-scent/lib/midtrans.ts
  56:3  warning  '_notification' is defined but never used  @typescript-eslint/no-unused-vars

/home/blawness/projects/koka-scent/lib/shipping.ts
  27:3  warning  '_req' is defined but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)
```
Both warnings are pre-existing, in files untouched by this task (verified via
`git diff` scope) — 0 errors.

### `pnpm build`
```
✓ Compiled successfully in 4.0s
  Running TypeScript ...
  Finished TypeScript in 4.4s ...
✓ Generating static pages using 11 workers (16/16) in 432ms
```
All routes (including all `/api/*`) built successfully.

### Ad hoc sanity check (no DB, per superpowers:test-driven-development guidance
— no test framework added; script written to repo root, run via `pnpm exec tsx`,
then deleted before committing)

Verified with `DATABASE_URL` unset:
- `listActiveProducts()` → 13 products, all 4 categories present.
- Out-of-stock detection → `rempah-nusantara` (stock 0).
- Low-stock detection (<5) → `yuzu-embun` (3), `vanila-kelapa` (4).
- `listActiveProducts("diffuser")` → 3 products.
- `getProductBySlug("sakura-senja")` → found, 2 variants.
- `getProductBySlug("does-not-exist")` → `null`.
- `createOrder(...)` twice same day → `KS-20260707-0001`, then `-0002`
  (sequence increments correctly, including a zero-item order).
- `getOrderByNumber(orderNumber)` → full order with 1 item, status `pending`.
- `getOrderByNumber(orderNumber, wrongPhone)` → `null` (phone gate works).

No DB was available in this environment to exercise the Drizzle path or
`db:seed` against real Neon — that code was reviewed carefully for
correctness but not executed against a live database.

## Concerns

- **Drizzle/Neon path is untested against a live database** (no `DATABASE_URL`
  available in this sandbox). The in-memory fallback path is fully verified;
  the SQL-facing code (schema, query shapes, `onConflictDoUpdate`, the `LIKE`
  count query) should be sanity-checked against a real Neon instance before
  relying on it in production/demo-with-DB mode.
- `createOrder`'s Drizzle path is not transactional (see decision #2) — a
  crash between the `orders` insert and `order_items` insert would leave an
  order with no items. Low risk for this demo's scope but worth a follow-up
  note for anyone hardening this later (e.g. switch to the Neon
  pooled/websocket driver, which does support `db.transaction`).
- `db/migrations/` (drizzle-kit output dir) does not exist yet — `pnpm
  db:generate` needs to be run once a real Neon `DATABASE_URL` is available
  to produce the initial migration SQL. Not required for this task ("Done
  when" only requires typecheck/lint/build clean and repo returning seed
  data without `DATABASE_URL`), but it's the next step before `db:migrate`
  can be used.
