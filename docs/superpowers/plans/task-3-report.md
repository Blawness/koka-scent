# Task 3 Report — Catalog + PDP

**Commit:** 6d75f23

## What was built

- `hooks/use-products.ts` — `useProducts()` and `useProduct(slug)` TanStack Query
  hooks against `/api/products` and `/api/products/[slug]`.
- `components/storefront/`:
  - `product-card.tsx` (+ exported `CATEGORY_LABELS`), `product-grid.tsx`
    (with `ProductGridSkeleton`), `category-filter.tsx`, `search-bar.tsx`
  - `product-gallery.tsx`, `variant-selector.tsx`, `notes-card.tsx`,
    `add-to-cart-button.tsx`
- `app/(storefront)/products/page.tsx` — client component: fetches all active
  products once, filters by category + case-insensitive name search entirely
  client-side.
- `app/(storefront)/products/[slug]/page.tsx` — thin async server wrapper
  (resolves the slug param, renders `<ProductDetail key={slug} slug={slug} />`)
  + new `product-detail.tsx` client component (gallery, variant-aware price,
  variant selector, notes card, add-to-cart, loading/error states).

Variant selection uses a derived-state pattern (`useMemo` default + optional
user override, reset via `key={slug}` remount) rather than a `setState`-in-effect,
to satisfy the `react-hooks/set-state-in-effect` lint rule.

Add-to-cart calls `useCartStore().addItem` with the exact `CartItem` shape
(no changes to `stores/cart-store.ts`) and shows a `sonner` success toast.
Button disables when the effective stock (variant stock if one is selected,
else product stock) is 0, or when the product has variants but none is
selected/in-stock.

## Verification

- `pnpm exec tsc --noEmit` — clean.
- `pnpm lint` — clean (2 pre-existing unrelated warnings in `lib/midtrans.ts`
  / `lib/shipping.ts`, untouched by this task).
- `pnpm build` — succeeds; `/products` static, `/products/[slug]` dynamic as
  expected.
- Did not run a dev server per instructions; behavior reviewed by code
  reading only (no live browser check).

## Concerns / follow-ups for later tasks

- All 13 seed products share one placeholder image
  (`/products/placeholder.svg`), so the gallery's multi-thumbnail path is
  implemented but not exercised by current data.
- No debounce on the search input — fine at 13 products, revisit if catalog
  grows.
- Cart header count (Task 4) not yet wired.
