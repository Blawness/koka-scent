# Design Spec — Storefront Demo v1

**Project:** Koka Scent E-Commerce Web App
**Phase:** Storefront Demo v1 (client-facing clickable demo)
**Date:** 2026-07-07
**Status:** Approved design → pending implementation plan
**References:** `PRD-koka-scent.md` (Sections 4, 5, 6, 7, 11)

---

## 1. Goal

Deliver a clickable storefront the client can review end-to-end to approve
**direction** (flow + first-pass brand look), before final design assets and
payment provider are locked in.

Success = client can, on a running deploy/dev server:
browse catalog → filter/search → open a product → pick a variant →
add to cart → adjust quantity → fill checkout → hit "Bayar" and land on an
order-confirmation page — using **real Koka Scent product data**.

## 2. Non-Goals (this phase)

Real payment (Midtrans/Xendit), admin dashboard, authentication, image
upload/storage management, order email, real shipping-cost API, final visual
design. All remain stubbed or deferred.

## 3. Key Decisions (deviations from PRD)

| Area | PRD | This phase | Rationale |
|------|-----|-----------|-----------|
| Database | Supabase Postgres | **Neon Postgres** | Client preference. Neon is Postgres-only. |
| Query layer | Supabase JS client (Drizzle optional) | **Drizzle ORM** + `@neondatabase/serverless` | Type-safe queries; scales to admin CRUD. PRD lists Drizzle as an approved option. |
| Auth | Supabase Auth | **Deferred → NextAuth/Auth.js** (credentials, single admin) when built | Storefront demo needs no auth. |
| Storage | Supabase Storage | **Deferred → Vercel Blob/Cloudinary** later. Demo images downloaded to `/public/products/`. | No Supabase; avoid hotlinking Shopee CDN (blocked). |
| Fidelity | "wait for design assets" | **First-pass brand look (draft v1)** using existing palette tokens | Demo needs to look branded to validate direction. |

**Retired from earlier scaffold:** `lib/supabase.ts`, `supabase/migrations/`.
Replaced by `db/` (Drizzle schema, client, seed) and `drizzle/` migrations.

## 4. Prerequisites (blocking implementation)

1. **`DATABASE_URL`** for a Neon project (existing, or a new one provisioned via
   the Neon integration).
2. **Shopee store URL and/or Instagram profile URL** for Koka Scent (scrape
   source for the 13 SKUs).

## 5. Data Model

Same shape as PRD Section 5 (Product, ProductVariant, Order, OrderItem),
re-expressed as Drizzle schema in `db/schema.ts`. Money = integer IDR (no
decimals). `category` and `order status` as Postgres enums. Drop Supabase RLS
(N/A on Neon; access is via server-side Drizzle only).

## 6. Data Sourcing (13 SKUs)

1. Fetch the provided Shopee/IG URL(s).
2. Parse what's readable into product records (name, category, price, notes
   top/middle/base, variants, stock, images).
3. Download product images to `/public/products/<slug>-<n>.jpg`.
4. **Fallback:** any field/image that can't be scraped → realistic placeholder,
   flagged in a `scrape-report.md` so the client can correct it.
5. `db/seed.ts` inserts the assembled records into Neon (idempotent upsert by
   slug).

> Note: Shopee/IG have strong anti-bot protection; partial scrape is expected.
> The fallback path guarantees the demo is fully populated regardless.

## 7. Architecture & Data Flow

```
Neon Postgres
   ↕ Drizzle ORM (server only)
Route Handlers (/api/products, /api/products/[slug], /api/orders, /api/shipping/cost)
   ↕ fetch
TanStack Query (client cache)  +  Zustand cart (localStorage)
   ↕
Storefront components (components/storefront/*) using shadcn/ui primitives
```

- **Catalog filter/search: client-side.** One fetch of active products
  (~13 rows), filter by category + text search in memory. Snappy, no query
  churn.
- **PDP:** server-fetch single product by slug (Route Handler → Drizzle).
- **Checkout "Bayar":** `POST /api/orders` creates a **real `pending` order** in
  Neon (Order + OrderItems), returns `orderNumber`. Client redirects to
  `/checkout/confirmation?order=<orderNumber>`. No payment call. Confirmation
  page reads the order via `GET /api/orders/[orderNumber]`.

## 8. Screens & Components

| Screen | Route | Components (`components/storefront/`) |
|--------|-------|----------------------------------------|
| Catalog | `/products` | `ProductGrid`, `ProductCard`, `CategoryFilter`, `SearchBar` |
| PDP | `/products/[slug]` | `ProductGallery`, `VariantSelector`, `NotesCard`, `AddToCartButton` |
| Cart | `/cart` | `CartLineItem`, `CartSummary`, empty-state |
| Checkout | `/checkout` | `CheckoutForm` (react-hook-form + zod), `ShippingCostBox` (dummy), `OrderSummary` |
| Confirmation | `/checkout/confirmation` | `OrderConfirmation` |

- Out-of-stock → disabled "Add to Cart" (not hidden) — PRD Feature 1.
- `NotesCard` renders Top / Middle / Base as a visual card — PRD Section 11.

## 9. Styling (first-pass brand look)

Use existing tokens in `app/globals.css` (cream base, charcoal text, sage
primary, terracotta accent, Playfair serif headings). All UI primitives from
shadcn/ui. Draft v1 — explicitly not final. Mobile-first, usable at 375px
(PRD Section 9).

## 10. API Changes

- `GET /api/products`, `GET /api/products/[slug]`, `GET /api/orders/[orderNumber]`,
  `POST /api/orders`: swap dummy data for Drizzle queries against Neon.
- `POST /api/shipping/cost`: keep dummy rates (unchanged).
- `POST /api/webhooks/midtrans`, `/api/admin/*`: untouched (out of scope).

## 11. Testing / Verification

- Seed runs and populates Neon (row counts match scraped set).
- Manual click-through of the full flow at 375px and desktop widths.
- `pnpm build`, `pnpm lint`, `pnpm exec tsc --noEmit` all clean.
- Order created via checkout is retrievable on the confirmation page and visible
  in the Neon DB with status `pending`.

## 12. Risks

- **Scrape failure** → mitigated by placeholder fallback + scrape report.
- **Neon connection not provided** → blocks seeding/running; demo can't use real
  data until `DATABASE_URL` is supplied.
- **Draft styling mistaken as final** → label demo clearly as draft v1.
