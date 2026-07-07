# Task 2 Report — Wire API routes to repo

**Status:** done.
**Commit:** `171cd60` — "Wire storefront API routes to db/repo.ts, retire lib/dummy-data.ts"

## What changed

- `app/api/products/route.ts` — `GET` now calls `listActiveProducts(category?)`;
  `?category=` validated against the known `ProductCategory` values (invalid/missing
  → no filter).
- `app/api/products/[slug]/route.ts` — `GET` calls `getProductBySlug`, 404 with
  `{ error }` if missing.
- `app/api/orders/route.ts` — `POST` validates the body with a zod schema
  (`name, phone, address, city, postal, items[], shippingCost, subtotal, total`),
  400 with `{ error: zodError.flatten() }` on failure, otherwise calls
  `createOrder` and returns `{ data: { orderNumber, status: "pending" } }` at
  HTTP 201. No Midtrans/payment call (the old `createSnapTransaction` call was
  removed from this route).
- `app/api/orders/[orderNumber]/route.ts` — `GET` calls
  `getOrderByNumber(orderNumber, phone?)`, 404 if missing/phone mismatch.
- `lib/dummy-data.ts` deleted.

### Admin routes (out of scope, but had to keep compiling)

`app/api/admin/products/route.ts` and `app/api/admin/orders/route.ts` also
imported `lib/dummy-data.ts`. Since the plan says leave `/api/admin/*`
untouched but also mandates deleting `dummy-data.ts`, these two were given the
minimal fix needed to keep the build green, without adding new admin
functionality:
- Admin products `GET` now reads `seedProducts` from `db/seed-data.ts`
  directly (repo.ts's `listActiveProducts` only returns active products, but
  admin needs all of them, and repo.ts currently has no "list all" query).
- Admin orders `GET` now returns a static empty array (repo.ts has no
  order-listing query yet) — same stub-like behavior as before, just without
  the deleted fixture file.

Both are marked with `TODO`/STUB comments explaining the gap for whoever picks
up admin work later.

## Verify

- `pnpm exec tsc --noEmit` — clean.
- `pnpm lint` — clean (2 pre-existing unrelated warnings in
  `lib/midtrans.ts` / `lib/shipping.ts`, not touched by this task).
- `pnpm build` — clean; all 4 routes present in the route manifest.
- Manual runtime check: `POST /api/orders` with an empty body correctly
  returns HTTP 400 with per-field zod errors.
- Manual runtime check on `GET /api/products` etc. hit a live Neon
  `DATABASE_URL` configured in `.env` for this environment, which failed with
  a Postgres "relation does not exist" error — the schema/migrations from
  Task 1 have not actually been applied to that Neon database. This is an
  infra/provisioning gap in `db/schema.ts`'s live deployment, not a bug in the
  routes: `db/repo.ts` correctly branches to the Drizzle path whenever
  `DATABASE_URL` is set, and the route code delegates to it as specified. Left
  as-is since running migrations against the live DB is outside this task's
  scope.

## Concerns

- The Neon DB behind `DATABASE_URL` in `.env` needs `pnpm db:migrate` (and
  optionally `pnpm db:seed`) run against it before `/api/products` etc. will
  work end-to-end in this environment; otherwise every request will 500.
  Someone should confirm whether that's expected to happen before Task 3/4
  manual testing, or whether `DATABASE_URL` should be unset for local demo
  work (which exercises the seed-data fallback path instead).
- Admin routes' data source has diverged slightly (products: all seed data
  instead of a hardcoded 2-item fixture; orders: now always empty instead of
  1 hardcoded sample order). Flagged with TODOs; a future task should give
  admin its own repo-backed queries.
