# Known Issues — Storefront Demo v1

From the final whole-branch review (2026-07-07). Updated 2026-07-09 during the
admin functional phase + order-hardening pass.

## Resolved
- **Empty-cart redirect race** (`app/(storefront)/checkout/page.tsx`) — could
  bounce the user to `/cart` instead of the confirmation page after a successful
  order. Fixed with a `placed` flag gating the empty-cart guard.
- **Enumerable order lookup / IDOR** (`app/api/orders/[orderNumber]/route.ts`) —
  *Resolved 2026-07-09.* Lookup now requires a credential: the opaque per-order
  `access_token` from the confirmation link, or a matching `phone`. Without one,
  the endpoint returns 404, so the sequential order number can't enumerate PII.
- **Admin `products` reads `db/seed-data` directly** (deferred minor #1) —
  *Resolved 2026-07-09.* All admin reads/writes go through `db/repo.ts`; no admin
  handler imports `db/seed-data`.
- **`createOrder` order-number race** (deferred minor #2) — *Resolved
  2026-07-09.* The DB insert retries on the unique-constraint collision
  (`23505`), bumping the suffix, so concurrent same-day orders no longer fail.
- **Server trusts client-supplied prices/totals** (deferred minor #3) —
  *Resolved 2026-07-09.* `POST /api/orders` no longer accepts price/subtotal/
  total. Prices are resolved server-side from product data via
  `lib/order-pricing.ts` (`priceLineItems`), which also rejects unknown/inactive
  products and unknown variants (400).

## Deferred minors
1. **`priceOverride ?? product.price`** treats a legitimate `0` override as a
   valid free price. Now server-controlled (a client can't inject it), so no
   longer a security concern; revisit only if 0-IDR is never a valid variant
   price.
2. **Shipping cost is still client-supplied** (`POST /api/orders` accepts
   `shippingCost`). The rate comes from the `/api/shipping/cost` stub; validate
   it server-side against the real rate table when the shipping provider lands.
