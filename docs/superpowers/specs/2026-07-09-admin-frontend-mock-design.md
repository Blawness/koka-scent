# Admin Frontend (visual-only, mock data) — Design

**Date:** 2026-07-09
**Status:** Approved by client, ready to build
**Base:** `febe682` (admin-phase-v1)
**Relation:** Builds the *presentation layer only* of
`2026-07-08-admin-dashboard-design.md`. Backend (Neon Auth, DAL/repo, UploadThing,
server actions, proxy gate, tests) is explicitly deferred to a later "make it
functional" phase.

## 1. Intent

The client asked for "front end lengkap, semua tampilan" — every admin screen
built, visible, and clickable — with **mock data**, no database, no auth, no
external vendors. All UI copy in **Bahasa Indonesia**.

This is deliberately the "Tampilan saja (mock data)" scope chosen on 2026-07-09.
Nothing here writes to a DB or calls a server action; interactivity is local
React state so the screens feel alive.

## 2. Mock data

`lib/mock/admin-data.ts` — single source for all screens, so data is coherent
across them (a product in the list is the same product in the form; an order in
the list opens as the same order in detail).

- **Products:** reuse `db/seed-data.ts`'s `seedProducts` (13 SKUs incl. low-stock
  ones: `yuzu-embun` 3, `vanila-kelapa` 4, `rempah-nusantara` 0).
- **Orders:** ~8 hand-written `OrderWithItems` across varied statuses and dates,
  referencing real product ids/prices.
- **Dashboard summary:** derived from the two arrays (orders today, orders this
  week, revenue this week over paid/processing/shipped/completed, low-stock < 5).

Types come from `@/types` (`ProductWithVariants`, `OrderWithItems`, etc.).

## 3. Pure helper (kept, it is presentation logic)

`lib/order-status.ts` — pure `canTransition(from, to)` and
`nextStatuses(from)`, plus Indonesian `STATUS_LABEL` and `CATEGORY_LABEL` maps.
Used to populate the order-detail status dropdown with **only legal transitions**.
No DB; safe to add now and reuse when the functional phase lands.

## 4. Screens

Sidebar shell (`app/(admin)/layout.tsx`) reused, extended with active-link
highlight, a dummy signed-in user, and a "Keluar" link to `/admin/login`.
Admin styling stays utilitarian per the parent spec — reuse tokens
(`--color-terracotta`/`--color-sage`, `font-heading`) but favour density.

| Route | Group | Contents |
|---|---|---|
| `/admin/login` | `(auth)` bare layout, no sidebar | Kartu login (email + password). Submit → `router.push('/admin')` (mock). |
| `/admin` | `(admin)` | 4 stat tiles + low-stock table. Server Component reading mock data. |
| `/admin/products` | `(admin)` | Table: thumbnail, nama, kategori, harga, stok, status. Edit link + Aktif/Nonaktif toggle (local state). "Tambah Produk". |
| `/admin/products/new`, `/admin/products/[id]` | `(admin)` | Shared `ProductForm` (client). Fields: nama, slug (auto from nama, overridable), kategori, harga, stok, notes top/middle/base, isActive, gambar (mock URL/placeholder adder, reorderable), varian (dynamic rows: label/priceOverride/stok). Submit shows a toast; no persistence. |
| `/admin/orders` | `(admin)` | Table: no. order, tanggal, customer, total, badge status. Status filter via `?status=` (links). |
| `/admin/orders/[id]` | `(admin)` | Detail: line items, alamat kirim, ringkasan biaya, dropdown status (legal transitions only, local state). |

## 5. Components (`components/admin/`)

`stat-tile`, `status-badge` (status → badge variant + ID label), `product-table`
(client, toggle), `product-form` (client), `image-list-editor` (mock adder),
`variant-rows` (dynamic), `order-status-select` (client). `SectionHeading` is
imported from its current storefront path (not moved — avoids churn in a
visual-only phase; the parent spec's move happens when it is actually shared).

## 6. Out of scope (this phase)

Real auth, DAL/repo admin functions, UploadThing, server actions, `proxy.ts`
gate, `revalidatePath`, Vitest/Playwright. All carried by the parent spec.
