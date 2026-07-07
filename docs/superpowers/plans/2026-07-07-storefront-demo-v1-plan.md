# Implementation Plan — Storefront Demo v1

Executes `docs/superpowers/specs/2026-07-07-storefront-demo-v1-design.md`.
Mode: subagent-driven, token-frugal (4 implementer tasks + final review).

## Global Constraints (bind every task)

- **Stack:** Next.js 16 App Router, TypeScript **strict**, Tailwind v4, pnpm.
  All UI primitives from **shadcn/ui** (`components/ui/*`) — never hand-roll base
  components. New composite components go in `components/storefront/`.
- **DB:** Neon Postgres via **Drizzle ORM** + `@neondatabase/serverless`.
  Schema in `db/schema.ts`. **DATABASE_URL-optional:** if `process.env.DATABASE_URL`
  is unset, the data-access layer falls back to the in-repo seed data
  (`db/seed-data.ts`) so the app runs with zero external setup. Every read/write
  goes through `db/repo.ts` which encapsulates this fallback — Route Handlers
  never touch Drizzle or seed data directly.
- **Money:** integer IDR, no decimals. Format for display via `lib/format.ts` (`formatIDR`).
- **Cart:** existing `stores/cart-store.ts` (Zustand + localStorage). Do not fork it.
- **Styling:** first-pass brand look using existing tokens in `app/globals.css`
  (cream/charcoal/sage/terracotta, Playfair serif headings via `font-heading`).
  Mobile-first, must be usable at 375px. Draft v1 — tasteful but not final.
- **Out of scope (leave stubbed):** real payment, admin, auth, image upload,
  email, real shipping API. `/api/admin/*`, `/api/webhooks/midtrans`,
  `/api/shipping/cost` stay as-is (shipping keeps dummy rates).
- **Language:** UI copy in Bahasa Indonesia.
- **Verify each task:** `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` clean.
- Retire `lib/supabase.ts` and `supabase/` (replaced by `db/`).

## Data shape

Product, ProductVariant, Order, OrderItem per spec §5 / PRD §5. Seed = 13
realistic placeholder SKUs across categories (unisex/wanita/pria/diffuser), each
with notes top/middle/base, 0–2 variants, stock (include ≥1 out-of-stock and
≥1 low-stock), and a placeholder image path under `/public/products/`.

---

## Task 1 — Data layer (Drizzle + Neon + seed fallback + repo)

**Files:** `db/schema.ts`, `db/client.ts`, `db/repo.ts`, `db/seed-data.ts`,
`db/seed.ts` (script), `drizzle.config.ts`; delete `lib/supabase.ts`,
`supabase/`; update `.env.example` (swap Supabase vars for `DATABASE_URL`,
keep others); add placeholder product images to `public/products/`.

- Drizzle schema for all four models + enums (`product_category`, `order_status`).
- `db/client.ts`: create Drizzle client from `DATABASE_URL` (neon-http driver),
  or `null` if unset.
- `db/seed-data.ts`: the 13 SKUs (typed as domain models from `types/`), plus a
  couple of sample orders is NOT needed — orders start empty.
- `db/repo.ts`: `listActiveProducts()`, `getProductBySlug(slug)`,
  `createOrder(input)` (returns orderNumber, status pending),
  `getOrderByNumber(orderNumber, phone?)`. Each: use Drizzle when client exists,
  else operate on in-memory seed data (orders held in a module-level array for
  the no-DB demo path). Order number format `KS-YYYYMMDD-NNNN`.
- `db/seed.ts`: idempotent upsert of seed-data into Neon (runs only with DATABASE_URL).
  Add `pnpm db:seed` and `pnpm db:generate`/`db:migrate` scripts.

**Done when:** typecheck/lint/build clean; `db/repo` compiles and returns seed
data with DATABASE_URL unset.

## Task 2 — Wire API routes to repo

**Files:** `app/api/products/route.ts`, `app/api/products/[slug]/route.ts`,
`app/api/orders/route.ts`, `app/api/orders/[orderNumber]/route.ts`; delete
`lib/dummy-data.ts` (replaced by `db/seed-data.ts` + repo).

- `GET /api/products` → `repo.listActiveProducts()`, optional `?category=` filter.
- `GET /api/products/[slug]` → `repo.getProductBySlug`, 404 if missing.
- `POST /api/orders` → validate body with zod (name, phone, address, city,
  postal, items[], shippingCost, subtotal, total), `repo.createOrder`, return
  `{ orderNumber, status: "pending" }`. **No payment call.**
- `GET /api/orders/[orderNumber]` → `repo.getOrderByNumber`, optional `?phone=` gate, 404 if missing.

**Done when:** endpoints return real repo data; typecheck/lint/build clean.

## Task 3 — Catalog + PDP (browse & add to cart)

**Files:** `components/storefront/{product-card,product-grid,category-filter,search-bar,product-gallery,variant-selector,notes-card,add-to-cart-button}.tsx`;
`hooks/use-products.ts` (TanStack Query); rewrite
`app/(storefront)/products/page.tsx` and `app/(storefront)/products/[slug]/page.tsx`.

- Catalog: fetch active products once, **client-side** category filter + text
  search. Grid of `ProductCard` (image, name, category, price, out-of-stock badge).
- PDP: `ProductGallery` (main + thumbs), price (variant-aware), `VariantSelector`,
  `NotesCard` (Top/Middle/Base visual card), `AddToCartButton` (disabled when
  stock 0 or selected variant stock 0) → `useCartStore.addItem` + sonner toast.
- Brand styling per Global Constraints. Empty/loading states via shadcn `Skeleton`.

**Done when:** catalog filters/searches; PDP adds to cart; typecheck/lint/build clean.

## Task 4 — Cart + Checkout + Confirmation

**Files:** `components/storefront/{cart-line-item,cart-summary,checkout-form,shipping-cost-box,order-summary,order-confirmation}.tsx`;
rewrite `app/(storefront)/cart/page.tsx`, `app/(storefront)/checkout/page.tsx`;
add `app/(storefront)/checkout/confirmation/page.tsx`; header cart count.

- Cart: list `CartLineItem` from store (qty +/- , remove), `CartSummary`
  (subtotal), empty-state, link to checkout.
- Checkout: `CheckoutForm` (react-hook-form + zod: name, phone, address, city,
  postal), `ShippingCostBox` (calls `/api/shipping/cost`, dummy rate select),
  `OrderSummary`. Submit → `POST /api/orders` → redirect
  `/checkout/confirmation?order=<orderNumber>` → clear cart.
- Confirmation: read `?order=`, fetch `/api/orders/[orderNumber]`, show order
  number + summary + WhatsApp click-to-chat link. Clearly a demo (no real payment).
- Header shows live cart item count.

**Done when:** full flow browse→cart→checkout→confirmation works with cart
persisting on reload; typecheck/lint/build clean.

---

## Final review

Broad whole-branch review (capable model) against these constraints + spec, then
`superpowers:finishing-a-development-branch`.
