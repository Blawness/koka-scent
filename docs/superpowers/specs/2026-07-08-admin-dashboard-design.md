# Admin Dashboard (Feature 4) — Design

**Date:** 2026-07-08
**Status:** Approved, ready for implementation plan
**Base:** `b8ac587` (master, storefront redesign v2 merged)
**Scope:** PRD Feature 4 in full (PRD-koka-scent.md:95-99)

## 1. Context

The storefront (PRD Features 1 & 2) is complete and merged. This phase builds the
admin area. Payment (Feature 3) and real shipping rates are explicitly deferred —
both are blocked on vendor decisions the client has not made.

Feature 5 (Scent Finder Quiz) is a separate sub-project with its own spec. It
shares no data, auth, or routes with this one.

### What actually exists today

The admin area is scaffolding, not implementation:

- `app/(admin)/admin/{page,products/page,orders/page}.tsx` — three placeholders,
  17 lines each.
- `components/admin/` — empty.
- `app/(admin)/layout.tsx` — sidebar shell, no auth.
- `app/api/admin/products/route.ts` — `GET` reads `db/seed-data` directly,
  `POST` echoes its input.
- `app/api/admin/orders/route.ts` — `GET` returns a hardcoded empty array.
- `app/api/admin/{products,orders}/[id]/route.ts` — `PUT` echoes, writes nothing.
- All four routes define their own `requireAdmin()` that returns `true`.
- `db/repo.ts` exposes four functions, none for admin.

So "frontend first" is not achievable in isolation here: the UI is the thinnest
layer. Auth and the data layer must land with it.

### Decisions taken (with the client, 2026-07-08)

| Question | Decision |
|---|---|
| Payment provider | Deferred — not this phase |
| Shipping rates API | Deferred — not this phase |
| Auth library | Neon Auth (Better Auth), **not** NextAuth |
| Login method | Email + password |
| First admin account | One-shot seed script |
| Image storage | UploadThing (supersedes PRD:136 Supabase Storage) |
| Architecture | Hybrid: DAL + Server Actions, thin REST retained |
| Admin scope | All of PRD:95-99 |
| Revenue counts | `paid`, `processing`, `shipped`, `completed` |
| Week window | Calendar week from Monday, `Asia/Jakarta` |
| Testing | Vitest for pure logic + Playwright smoke |

### PRD deviations, and why

1. **Auth: Supabase Auth → Neon Auth.** The repo migrated to Neon + Drizzle;
   no Supabase client exists. Neon Auth stores users and sessions in the Neon
   database already in use, and branches with the data. Verified against
   `neon.com/docs/auth/overview.md`: it is powered by Better Auth 1.4.18, *not*
   NextAuth — the client asked for NextAuth initially and accepted this trade
   once the difference was made explicit.

2. **File storage: Supabase Storage → UploadThing.** Same reason; adding Supabase
   for storage alone would mean two vendors for one product.

3. **API style.** PRD:133 specifies "REST via Next.js Route Handlers". Retained,
   but thinned: browser traffic goes through Server Components and Server
   Actions; `/api/admin/*` survives for future non-browser consumers, calling the
   same DAL.

## 2. Architecture

### Three layers, strict responsibilities

```
proxy.ts       Optimistic redirect only. Reads the session cookie. No DB.
               matcher: ['/admin/:path*']
               MUST exempt /admin/login — see below.

lib/dal.ts     The single authorization gate.
               verifySession()  — React cache()'d, one call per render pass
               requireAdmin()   — returns AdminUser, or redirects to /admin/login

pages,         Call requireAdmin() from the DAL. Thin.
server actions,
route handlers
```

**The proxy must exempt `/admin/login`.** A matcher of `/admin/:path*` catches the
login page itself: an anonymous visitor is redirected to `/admin/login`, which the
proxy intercepts and redirects again — an infinite loop. Either narrow the matcher
or early-return for that pathname.

**Auth checks do not live in `app/(admin)/layout.tsx`.** This is the obvious
place and it is wrong: `next/dist/docs/01-app/02-guides/authentication.md:1350`
notes that layouts do not re-render on client-side navigation, so the session
would go unchecked when moving between `/admin` and `/admin/orders`. The layout
renders the shell and the signed-in user's name; the gate is in the DAL, invoked
per page.

**`proxy.ts` is not a gate either.** `next/dist/docs/01-app/01-getting-started/16-proxy.md:29`
states Proxy "is not intended for ... full session management or authorization".
It exists so anonymous visitors bounce to `/admin/login` without rendering a
page. If it is bypassed, the DAL still holds.

Note for implementers: Next.js 16 renamed `middleware.ts` to `proxy.ts`. The
convention is a `proxy.ts` at the project root.

This replaces the four copy-pasted `requireAdmin()` stubs with one import. The
authorization check binds to the *data*, not to the *route*, so it holds whether
a caller arrives via Server Component or REST — and a fifth route cannot forget
it. (`authentication.md:1356`: "prevents developers forgetting to check the user
is authorized to access the data.")

### New dependencies

`@neondatabase/auth`, `uploadthing@^7.7`, `@uploadthing/react@^7.3`

Compatibility verified: `@uploadthing/react` peers are `react ^19` (repo: 19.2.4)
and `next: '*'`; `uploadthing` peers `tailwindcss ^4` (repo: ^4).

**Risk:** UploadThing's docs do not yet name Next.js 16. `NextSSRPlugin` is the
likely breakage point. It is optional — it only removes an upload-button loading
state — so drop it if it fails. Verify at implementation time.

### New environment variables

- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET` (≥ 32 characters)
- `UPLOADTHING_TOKEN`

### Manual prerequisite (not code)

Neon Auth must be enabled on the Neon project — via the Neon Console or the MCP
`provision_neon_auth` tool. The implementer cannot do this from the repo.

### Auth flow

- `lib/auth/server.ts` — `createNeonAuth({ baseUrl, cookies: { secret } })`
- `app/api/auth/[...path]/route.ts` — `export const { GET, POST } = auth.handler()`
- `/admin/login` — email + password via `auth.signIn.email()` in a Server Action.
- **No signup page exists.** The first admin is created by `db/seed-admin.ts`,
  run once: it creates the user and calls `setRole({ role: 'admin' })`.
- Neon Auth manages its own tables. We never query them through Drizzle — only
  through `auth.getSession()`. **`db/schema.ts` gains no auth tables.**

### Where the login page lives

`/admin/login` must **not** render the admin sidebar. Placing it inside the
existing `(admin)` route group would make it inherit `app/(admin)/layout.tsx`.

Put it in its own route group with a bare layout:

```
app/(auth)/admin/login/page.tsx     ← bare layout, no sidebar
app/(admin)/layout.tsx              ← sidebar shell
app/(admin)/admin/page.tsx          ← /admin
app/(admin)/admin/products/…
app/(admin)/admin/orders/…
```

Route groups do not affect the URL, and only `(auth)` declares `/admin/login`, so
there is no route conflict.

## 3. Data layer

Every admin read and write goes through `db/repo.ts`. This closes deferred minor
\#1 in `docs/superpowers/known-issues.md` (admin routes importing `db/seed-data`,
bypassing the single-gateway constraint).

`db/repo.ts` grows from 4 functions to 12:

| Function | Purpose |
|---|---|
| `listAllProducts()` | product table, including inactive |
| `getProductById(id)` | edit form |
| `createProduct(input)` | create, with variants |
| `updateProduct(id, input)` | update, with variants |
| `setProductActive(id, isActive)` | deactivate — never delete (PRD:97) |
| `listOrders({ status?, limit, offset })` | order table, server-paginated |
| `getOrderById(id)` | order detail |
| `updateOrderStatus(id, status)` | status change, transition-validated |
| `getDashboardSummary()` | the four tiles |

(The existing four — `listActiveProducts`, `getProductBySlug`, `createOrder`,
`getOrderByNumber` — are unchanged.)

### Order status transitions

`lib/order-status.ts` exports a pure `canTransition(from, to): boolean`. Pure so
it is unit-testable without a database.

Per PRD:98, the happy path is `pending → paid → processing → shipped → completed`.

- Terminal states: `completed`, `cancelled`, `failed`, `expired`. Nothing leaves
  them.
- `cancelled` is reachable from any non-terminal state.
- `failed` and `expired` are reserved for the payment webhook, never set by an
  admin, and are not offered in the admin UI dropdown. Because payment is
  deferred, no code path reaches them this phase — `canTransition()` must still
  model them so the webhook can be wired up later without touching this logic.

`updateOrderStatus()` rejects illegal transitions **at the repo layer**, not only
by hiding options in the UI. Hiding them is a convenience; rejecting them is the
control.

### Time windows

`lib/date-window.ts` is the single source of truth for date boundaries, fixed to
`Asia/Jakarta`. It exports the day and calendar-week (Monday-start) boundaries.

It is consumed by **both** `getDashboardSummary()` **and** `orderNumberPrefix()`.

This corrects an existing latent bug: `db/repo.ts:92-97` builds the `KS-YYYYMMDD-`
prefix from `date.getFullYear()`/`getMonth()`/`getDate()` — server-local time,
which is UTC on Vercel. An order placed at 06:00 WIB Wednesday is numbered
Tuesday. Left alone, the dashboard's Jakarta-based "this week" and the order
numbers' UTC-based day would disagree on the same screen. Fixing it is a targeted
improvement to code this phase already touches.

### Dashboard summary semantics

- **Orders today** — orders created within the current Jakarta day.
- **Orders this week** — orders created since Monday 00:00 Jakarta.
- **Revenue this week** — sum of `total` for orders created since Monday 00:00
  Jakarta whose status is `paid`, `processing`, `shipped`, or `completed`.
  `pending` is excluded: the money has not arrived.
- **Low stock** — active products with `stock < 5` (PRD:99).

### The retained REST surface

The four existing `/api/admin/*` stubs are rewritten, not deleted. Each drops its
local `requireAdmin()` in favour of importing the DAL's, and delegates to
`db/repo.ts`. No handler touches `db/seed-data`.

| Route | Method | Delegates to |
|---|---|---|
| `/api/admin/products` | `GET` | `listAllProducts()` |
| `/api/admin/products` | `POST` | `createProduct()` |
| `/api/admin/products/[id]` | `PUT` | `updateProduct()` — also carries `isActive`, so deactivation needs no separate route |
| `/api/admin/orders` | `GET` | `listOrders()` |
| `/api/admin/orders/[id]` | `PUT` | `updateOrderStatus()` |

Browser traffic does not use these — the screens use Server Components and Server
Actions. They exist for future non-browser consumers and are validated by the same
Zod schemas.

### No-database path

`db/repo.ts:1-8` currently falls back to in-repo seed data and an in-memory order
array when `DATABASE_URL` is unset. **This fallback is not extended to admin.**
Writing products into an array that vanishes on restart is a trap, not a feature.
Admin repo functions throw an explicit error when `DATABASE_URL` is absent.

## 4. Screens

Visual language follows the existing storefront: `SectionHeading`, the
`--color-terracotta` / `--color-sage` tokens, `font-heading` serif.

`components/storefront/section-heading.tsx` moves to `components/shared/` — it is
no longer storefront-specific. Its `titleAs` prop (added in redesign v2 Task 4)
is retained.

The admin is deliberately **not** styled as editorially as the storefront. It is
a daily tool; information density and scan speed beat beauty.

| Route | Contents |
|---|---|
| `/admin/login` | Single card: email, password, Server Action. No signup link. |
| `/admin` | Four summary tiles, then a low-stock table when non-empty. Server Component; `requireAdmin()` on the first line. |
| `/admin/products` | Table: thumbnail, name, category, price, stock, active. Actions: Edit, Activate/Deactivate toggle. "Tambah Produk" button. |
| `/admin/products/new`, `/admin/products/[id]` | One shared form component. Fields: name, slug (auto-derived from name, overridable), category, price, stock, notes top/middle/base, `isActive`, images (UploadThing, multiple, reorderable), and variants (dynamic rows: label / priceOverride / stock). |
| `/admin/orders` | Table: order number, date, customer, total, status badge. Status filter via `?status=`. Server-paginated. |
| `/admin/orders/[id]` | Detail, line items, shipping address, and a status dropdown offering **only legal transitions** per `canTransition()` — not all eight statuses. |

## 5. Error handling and validation

One Zod schema per entity under `lib/validation/`, used **twice**: client-side via
`react-hook-form` + `@hookform/resolvers` (both already installed), and again
inside the Server Action.

The server never trusts the client. This is the direct lesson of deferred minor
\#3 in `known-issues.md`, where `/api/orders` persists client-supplied prices and
totals as sent.

- Server Actions return `{ error: string }` rather than throwing.
- Toasts use `sonner`, already used by the storefront.
- Successful mutations call `revalidatePath()`.

## 6. Testing

The repo has no test runner today: no `test` script, no vitest, no jest.

- **Vitest** for pure logic — `canTransition()` (~30 state combinations, cheap to
  cover in unit tests, expensive through a browser) and `lib/date-window.ts`
  (timezone boundaries, which are exactly the thing that silently rots).
- **Playwright** for one smoke path: login → edit a product → change an order
  status. This matches how storefront redesign Task 5 was verified.

## 7. Out of scope

Explicitly not in this phase, per PRD:101-102 and the deferrals above:

- Multi-admin role permissions, audit log, bulk CSV import/export
- Automated invoicing / PDF generation
- Payment integration (Feature 3) and the Midtrans webhook
- Real shipping-rate API (`/api/shipping/cost` keeps returning stub rates)
- Scent Finder Quiz (Feature 5) — separate sub-project
- Password reset flow. No email provider is configured this phase; a forgotten
  admin password is recovered by re-running `db/seed-admin.ts`.

## 8. Known issues this phase resolves

- Deferred minor #1 — admin reading `db/seed-data` directly, bypassing `repo.ts`.
- The `orderNumberPrefix()` UTC/WIB day-boundary bug (previously unrecorded).

## 9. Known issues this phase does *not* resolve

Carried forward in `docs/superpowers/known-issues.md`:

- Enumerable order lookup / IDOR on `/api/orders/[orderNumber]`.
- `createOrder` order-number generation is racy (count → compute → insert).
- Server trusts client-supplied prices on `/api/orders` — must be fixed when real
  payment lands.
- `priceOverride ?? product.price` treats a legitimate `0` as a valid free price.
