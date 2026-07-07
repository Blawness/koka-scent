# Task 4 Report — Cart + Checkout + Confirmation

Commit: `78d68f7` — "Add cart, checkout, and order confirmation (Task 4)"

## What was built

- `components/storefront/cart-line-item.tsx`, `cart-summary.tsx` — cart list
  row (image, qty +/-, remove) and subtotal/total card, reused by `/cart`.
- Rewrote `app/(storefront)/cart/page.tsx` — lists `CartLineItem`s, empty
  state with link to `/products`, `CartSummary` + link to `/checkout`.
  Guarded with a hydration flag so the persisted (localStorage) Zustand cart
  doesn't cause a hydration mismatch.
- `components/ui/form.tsx` — shadcn's `form.tsx` primitive was missing from
  the repo and `shadcn add` couldn't be run non-interactively in this
  environment, so it was hand-written to match the standard shadcn API
  (Form/FormField/FormItem/FormLabel/FormControl/FormMessage), verified
  against the installed `radix-ui` package's `Slot.Root` export.
- `components/storefront/checkout-form.tsx` — react-hook-form + zod schema
  (name, phone, address, city, postal — all required, phone/postal pattern-
  validated) rendered with shadcn `Form*` + `Input`.
- `components/storefront/shipping-cost-box.tsx` — POSTs to
  `/api/shipping/cost` once city+postal look valid, lets the shopper pick one
  of the dummy rates.
- `components/storefront/order-summary.tsx` — read-only cart review + totals
  + submit button, disabled until a shipping rate is picked.
- Rewrote `app/(storefront)/checkout/page.tsx` — owns the react-hook-form
  instance and `selectedRate` state, guards empty cart (redirects to
  `/cart`), on submit POSTs to `/api/orders`, `clear()`s the cart, and
  redirects to `/checkout/confirmation?order=<orderNumber>`; toasts on error.
- `components/storefront/order-confirmation.tsx` +
  `app/(storefront)/checkout/confirmation/page.tsx` — reads `?order=`,
  fetches `GET /api/orders/[orderNumber]`, shows order number/status/totals/
  address, an explicit "this is a demo, no real payment" notice, and a
  WhatsApp click-to-chat link (`wa.me/6281234567890`, placeholder number).
- `components/storefront/cart-nav-link.tsx` + `app/(storefront)/layout.tsx` —
  live cart item count in the header (client component, hydration-guarded).
- `hooks/use-hydrated.ts` — shared hydration-guard hook using
  `useSyncExternalStore` (getServerSnapshot `false`, getSnapshot `true`)
  instead of the classic `useState(false) + useEffect(() => setMounted(true))`
  pattern, used everywhere a persisted-store value needs to wait for the
  client.

## Notable issue and fix (not app-code related)

`pnpm exec tsc --noEmit` initially failed on `zodResolver(checkoutFormSchema)`
with a version-mismatch type error inside `@hookform/resolvers/zod`. Root
cause: `@modelcontextprotocol/sdk` (a transitive dependency of the `shadcn`
CLI package) pins `zod@3.25.76`, and pnpm's peer-resolution hoisting was
promoting that older zod into the shared `node_modules/.pnpm/node_modules`
folder, shadowing the project's `zod@4.4.3` specifically for
`@hookform/resolvers`'s internal peer resolution (confirmed by inspecting the
resolved `_zod.version` literal type on both sides). Fixed with a `pnpm`
`overrides` entry pinning `zod` to `^4.4.3` project-wide
(`package.json` + `pnpm install`); `@modelcontextprotocol/sdk` itself accepts
`^4.0` so this is safe.

Also hit and fixed several `react-hooks/set-state-in-effect` lint errors
(this project's eslint config enables React Compiler's stricter hook rules,
which flag any synchronous `setState` call in an effect body, as opposed to
one deferred inside an async callback). Fixed by: using `useHydrated()`
instead of manual mounted-flag effects, and restructuring
`shipping-cost-box.tsx` / `order-confirmation.tsx` so state is only set
inside `fetch().then()/.catch()` callbacks, never synchronously at the top
of the effect.

## Verification

- `pnpm exec tsc --noEmit` — clean.
- `pnpm lint` — clean (0 errors; 3 pre-existing warnings in
  `lib/midtrans.ts` / `lib/shipping.ts`, untouched by this task, plus one
  informational React Compiler "compilation skipped" warning on the checkout
  page caused by react-hook-form's `watch()`, which is expected/benign).
- `pnpm build` — clean; `/cart`, `/checkout`, `/checkout/confirmation`
  compile as static/dynamic routes as expected.
- Did not start a dev server (not required by task instructions); flow was
  verified by reading through the wiring (cart store API, `/api/orders`
  zod schema, `/api/orders/[orderNumber]` response shape) rather than
  live-clicking through the browser.

## Files touched

- `app/(storefront)/cart/page.tsx` (rewritten)
- `app/(storefront)/checkout/page.tsx` (rewritten)
- `app/(storefront)/checkout/confirmation/page.tsx` (new)
- `app/(storefront)/layout.tsx` (header cart link)
- `components/storefront/cart-line-item.tsx` (new)
- `components/storefront/cart-summary.tsx` (new)
- `components/storefront/cart-nav-link.tsx` (new)
- `components/storefront/checkout-form.tsx` (new)
- `components/storefront/shipping-cost-box.tsx` (new)
- `components/storefront/order-summary.tsx` (new)
- `components/storefront/order-confirmation.tsx` (new)
- `components/ui/form.tsx` (new — shadcn primitive, hand-written)
- `hooks/use-hydrated.ts` (new)
- `package.json`, `pnpm-lock.yaml` (zod override)

## Concerns / follow-ups for final review

- `ShippingCostBox` does not auto-clear a previously selected rate if the
  shopper edits the address after picking one; submit is still guarded (a
  rate must be selected), so this is a minor UX nit, not a correctness bug.
- Order confirmation shows quantities/totals but not per-product names/
  images, since `OrderItem` (as returned by `GET /api/orders/[orderNumber]`)
  only carries `productId`/`variantId`/`quantity`/`priceAtPurchase`, not
  denormalized product name/image. Acceptable for a draft-v1 demo per Global
  Constraints; would need a repo-level join to show product names on the
  confirmation page.
- The `pnpm.overrides.zod` fix affects the whole project, not just this
  feature — flagging it explicitly for the final broad review since it
  touches `package.json`/lockfile outside the Task 4 file list.
