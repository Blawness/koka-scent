# Koka Scent — E-Commerce Web App

Japan-inspired perfumery storefront + admin dashboard. Scaffolded against
[`PRD-koka-scent.md`](./PRD-koka-scent.md).

> **Status:** scaffold only. Pages are placeholder boilerplate, API routes
> return dummy data, and payment/shipping integrations are not wired yet
> (see PRD Section 10 open questions).

## Tech stack (PRD Section 4)

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui ·
Zustand (cart) · TanStack Query (server data) · Supabase (Postgres/Auth/Storage) ·
pnpm.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev                     # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Database

Apply the schema in `supabase/migrations/0001_init.sql` to your Supabase project
(via the Supabase SQL editor or CLI). Models: Product, ProductVariant, Order,
OrderItem (PRD Section 5).

## Structure (PRD Section 7)

```
app/
  (storefront)/   products/[slug], cart, checkout   # public store
  (admin)/admin/  products, orders                  # admin dashboard
  api/            products, orders, shipping, admin, webhooks/midtrans
components/  ui (shadcn), storefront, admin
lib/         supabase.ts, midtrans.ts (skeleton), shipping.ts, dummy-data.ts
stores/      cart-store.ts (Zustand + localStorage persist)
types/       data models
supabase/migrations/
```

## Not yet implemented (intentional)

- **Payments** — `lib/midtrans.ts` is a TODO skeleton; provider (Midtrans vs
  Xendit) pending client confirmation.
- **Shipping** — `lib/shipping.ts` returns dummy rates; RajaOngkir/Biteship TBD.
- **Auth** — `/api/admin/*` handlers stub `requireAdmin()` to `true`.
- **Final UI** — awaiting client visual reference; brand palette tokens
  (cream / charcoal / sage / terracotta) are set as defaults in `app/globals.css`.
