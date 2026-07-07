# Known Issues — Storefront Demo v1

From the final whole-branch review (2026-07-07). No Critical items. Important
items resolved or accepted below; Minors deferred.

## Resolved
- **Empty-cart redirect race** (`app/(storefront)/checkout/page.tsx`) — could
  bounce the user to `/cart` instead of the confirmation page after a successful
  order. Fixed with a `placed` flag gating the empty-cart guard.

## Accepted for demo (fix before launch)
- **Enumerable order lookup / IDOR** (`app/api/orders/[orderNumber]/route.ts`) —
  sequential order numbers + optional phone gate expose customer PII. Documented
  in-code. Fix: require `phone`, or use an opaque order token.

## Deferred minors
1. **Admin `products` reads `db/seed-data` directly**, bypassing `db/repo.ts`
   (violates the single-gateway constraint). Out-of-scope stub; route through a
   repo function when the admin phase lands.
2. **`createOrder` order-number generation is racy** (DB path): count→compute→
   insert is non-atomic; concurrent same-day orders can collide on the unique
   constraint. Harden with a DB sequence or retry-on-unique-violation.
3. **Server trusts client-supplied prices/totals** (`app/api/orders/route.ts`) —
   `priceAtPurchase`/`subtotal`/`total` persisted as sent. MUST recompute
   server-side from product data once real payment lands.
4. **`priceOverride ?? product.price`** treats a legitimate `0` override as a
   valid free price. Intentional given current data; revisit if 0-IDR is never
   valid.
