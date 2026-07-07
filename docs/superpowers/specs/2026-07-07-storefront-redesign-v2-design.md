# Design Spec — Storefront Redesign v2 ("Editorial Warm")

**Project:** Koka Scent E-Commerce Web App
**Phase:** Storefront Redesign v2 — visual language from `references/Screenshot 2026-07-07 213047.png`
**Date:** 2026-07-07
**Status:** Approved design → pending implementation plan
**References:** `PRD-koka-scent.md` (§9 responsive, §11 brand), the `polysense` reference screenshot, existing Storefront Demo v1 spec/plan.

---

## 1. Goal

Re-skin the storefront so it reads like the reference: an editorial, asymmetric,
whitespace-heavy perfume boutique — while keeping the Koka Scent warm palette
(cream / charcoal / sage / terracotta, Playfair headings). Add a new landing
homepage in this language. This is a **pure restyle + one new page**: all data
flow, cart, and order logic from v1 stay intact.

Success = client sees a branded, distinctive storefront (new homepage + restyled
catalog/PDP/cart/checkout/confirmation) that visually matches the reference's
*language* in Koka Scent colors, still functional end-to-end at 375px and desktop.

## 2. Non-Goals

Real payment, admin, auth, image upload, order email, real shipping API — all
remain as in v1 (stubbed/deferred). No logic changes to cart store, repo, API
routes, or order flow. No final photography (styled placeholders only).

## 3. Key Decisions (from brainstorming)

| Question | Decision |
|----------|----------|
| Scope | **New landing homepage `/` + restyle all 4 existing screens** |
| Frame | **Borrow the language, NO black rounded outer frame.** Full-width cream canvas. |
| Color boldness | **Warm & bold** — sage/terracotta used as full color blocks (cards, sections, panels), not just tiny accents. Charcoal panels stand in for the reference's black. |
| Product images | **Styled placeholders** (existing `/public/products/` + gradient/shadow editorial treatment). Swap for real photos later. |

## 4. Visual Language (design tokens & motifs)

Adapted from the reference, recolored:

- **Canvas:** cream (`--background`), generous whitespace, asymmetric layouts.
- **Display numerals:** large Playfair numbers as graphic elements — product
  index (`No 07`), category index (`01 / 02 / 03 / 04`), order number on
  confirmation. New utility class(es) for oversized serif numerals.
- **Floating cards:** `rounded-2xl`/`rounded-3xl`, soft shadows, some overlapping
  / offset (stacked). Add a soft shadow utility if the token set lacks one.
- **Pills everywhere:** `rounded-full` nav items and buttons (shadcn `Button`
  variants + a `rounded-full` class; never hand-roll the primitive).
- **Color blocking (bold):** full sage panels and terracotta cards as section
  backgrounds; charcoal (warm, not pure black) panels echo the reference's black.
- **Thumbnail rail:** vertical thumbnail strip beside the PDP gallery.
- **Token tweaks:** may enlarge `--radius` and add a `shadow-soft` utility in
  `app/globals.css`. Palette raw tokens (cream/sage/terracotta/charcoal) unchanged
  in hue; only usage broadens. Keep light-theme focus (no dark mode work).

## 5. Global Shell (`app/(storefront)/layout.tsx`)

- **Header:** logo left (Playfair "Koka Scent"), centered pill nav
  (Beranda · Katalog · Cart-with-count via existing `CartNavLink`), a "Menu"
  affordance on mobile. Thin, sticky, cream. Pill styling.
- **Footer:** pill bar echoing the reference's bottom row — e.g. "Katalog",
  "Koleksi", "Tentang" as pills + small copyright. No new routes required; pills
  can link to `/products` / anchor / `/` as sensible.

## 6. Screens

| Screen | Route | Restyle notes (logic unchanged) |
|--------|-------|---------------------------------|
| **Beranda (NEW)** | `/` | Editorial hero: featured product floating card center, floating `NotesCard`, giant `No` numeral, category index `01–04` (Unisex/Wanita/Pria/Diffuser), small floating stat card ("300+ pelanggan"), CTA pill "Belanja Sekarang". **Server component**, fetches featured product(s) via `db/repo.ts` (`listActiveProducts`). |
| **Katalog** | `/products` | Asymmetric *featured* product up top, then editorial `ProductCard` grid (rounded, hover-lift). Category filter → numbered/pill index; search → pill input. Existing client-side filter/search preserved. |
| **PDP** | `/products/[slug]` | Left large gallery + **vertical thumbnail rail**; product name as large serif heading; `No` display numeral; `NotesCard` as colored Top/Middle/Base card; variants as **pill selector**; large price; terracotta add-to-cart pill. Same server-wrapper → client `ProductDetail`. |
| **Cart** | `/cart` | Editorial carded line items; `CartSummary` as floating sage card; pill actions. Empty-state restyled. |
| **Checkout** | `/checkout` | `CheckoutForm` in a card; `OrderSummary` sticky card; pill "Bayar". Redirect/`placed` logic from v1 kept verbatim. |
| **Confirmation** | `/checkout/confirmation` | **Giant display order number**, editorial summary card, WhatsApp pill link. Existing fetch logic kept. |

Components restyled in place under `components/storefront/*` (no renames unless a
split genuinely helps). New homepage may add a small number of components
(e.g. `hero`, `category-index`, `featured-product`) under `components/storefront/`.

## 7. Constraints (bind implementation)

- **shadcn/ui primitives only** (`components/ui/*`); compose in `components/storefront/*`.
- Tailwind v4 + existing brand tokens in `app/globals.css` (tweaks allowed:
  radius, shadow util, new utility classes — not hue changes).
- Playfair (`font-heading`) for headings/numerals; mobile-first, **usable at 375px**
  (asymmetric desktop layouts collapse to clean vertical stacks on mobile).
- Bahasa Indonesia copy; integer IDR via `lib/format.ts`.
- **No logic changes:** cart store, `db/repo.ts`, all `/api/*` routes, order flow,
  and the v1 known-issues posture are untouched.
- **Verify each task:** `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` clean,
  plus a manual 375px + desktop click-through.

## 8. Risks

- **Placeholder images look flat** in an image-forward layout → mitigate with
  gradient/shadow "product plinth" treatment and generous framing so layout
  reads well pre-photography.
- **Bold color blocking clashes with cream** → keep charcoal/cream dominant,
  sage/terracotta as deliberate blocks; tune in review.
- **Asymmetry breaking at 375px** → every asymmetric desktop composition has an
  explicit mobile stack; verified in the manual pass.
