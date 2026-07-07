# Storefront Redesign v2 ("Editorial Warm") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the storefront into an editorial, asymmetric, whitespace-heavy perfume boutique in the Koka Scent warm palette (adapting the `references/` polysense screenshot), and add a new landing homepage — with zero changes to data/cart/order logic.

**Architecture:** Pure presentational rewrite. Shared visual foundations (tokens, utilities, global shell) land first; then each screen is restyled in place, consuming those foundations. Data flow (`db/repo.ts`, `/api/*`, Zustand cart, TanStack Query, order/`placed` flow) is untouched. New homepage is a Server Component reading `db/repo.ts`.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui, Playfair Display (`font-heading`), lucide-react.

## Global Constraints

- **UI primitives from shadcn/ui only** (`components/ui/*`). Compose in `components/storefront/*`. Never hand-roll a base primitive; use `Button`/`Card`/`Badge`/`Input`/`Skeleton` etc. Pills = shadcn `Button`/`Badge` + `rounded-full`.
- **Tailwind v4 + existing brand tokens** in `app/globals.css`. Allowed edits: `--radius`, new utility classes (shadow, display numeral), broader use of `sage`/`terracotta`. **Do NOT change token hues.** Light theme only — do not touch or rely on `.dark` block behavior.
- **No logic changes:** `db/repo.ts`, all `app/api/*`, `stores/cart-store.ts`, `hooks/*`, the checkout `placed`/redirect flow, and order lookup stay byte-for-byte behaviorally identical. This is restyle-only. If a rewrite would change a fetch/handler/store call, stop and keep the original call.
- **Copy in Bahasa Indonesia.** Money = integer IDR via `formatIDR` from `lib/format.ts`.
- **Mobile-first, usable at 375px.** Every asymmetric desktop composition must collapse to a clean vertical stack on mobile.
- **Product images = styled placeholders.** Use existing `product.images[0] ?? "/products/placeholder.svg"`; give images an editorial "plinth" treatment (soft-shadow rounded frame, subtle gradient backdrop) so the layout reads well before real photography.
- **Verify each task:** `pnpm exec tsc --noEmit` (clean), `pnpm lint` (no new errors; 3 pre-existing warnings in `lib/midtrans.ts`, `lib/shipping.ts` are acceptable), `pnpm build` (clean), plus a manual visual check at 375px and desktop.

---

## File Structure

**Modified (restyle in place):**
- `app/globals.css` — tokens + new utilities (Task 1)
- `app/(storefront)/layout.tsx` — global shell (Task 1)
- `app/(storefront)/page.tsx` — new homepage (Task 2)
- `app/(storefront)/products/page.tsx` — catalog (Task 3)
- `app/(storefront)/products/[slug]/product-detail.tsx` — PDP client (Task 4)
- `components/storefront/{product-card,product-grid,category-filter,search-bar}.tsx` (Task 3)
- `components/storefront/{product-gallery,variant-selector,notes-card,add-to-cart-button}.tsx` (Task 4)
- `components/storefront/{cart-line-item,cart-summary,checkout-form,shipping-cost-box,order-summary,order-confirmation}.tsx` (Task 5)
- `app/(storefront)/cart/page.tsx`, `checkout/page.tsx` (structure kept — restyle wrappers only), `checkout/confirmation/page.tsx` (Task 5)

**Created:**
- `components/storefront/hero.tsx`, `category-index.tsx`, `featured-product.tsx` (Task 2)
- `components/storefront/section-heading.tsx` — shared editorial heading + display numeral (Task 1)

---

## Task 1: Design foundations — tokens, utilities, shared heading, global shell

**Files:**
- Modify: `app/globals.css`
- Create: `components/storefront/section-heading.tsx`
- Modify: `app/(storefront)/layout.tsx`

**Interfaces:**
- Produces: CSS utility classes `.shadow-soft`, `.plinth` (image backdrop), and the component `SectionHeading` — consumed by Tasks 2–5.
  - `SectionHeading({ index?: string, eyebrow?: string, title: string, className?: string })` — renders an oversized Playfair display numeral (`index`, e.g. `"01"` / `"No 07"`) beside/above a serif `title` with an optional uppercase `eyebrow`.

- [ ] **Step 1: Add utilities to `app/globals.css`**

Enlarge base radius and append utilities after the `@layer base { … }` block at the end of the file:

```css
/* Editorial Warm — v2 utilities */
@utility shadow-soft {
  box-shadow: 0 24px 48px -24px oklch(0.27 0.008 62 / 0.28),
    0 8px 24px -16px oklch(0.27 0.008 62 / 0.18);
}

/* Editorial image "plinth": rounded frame on a soft warm gradient backdrop */
@utility plinth {
  background-image: radial-gradient(
    120% 100% at 50% 0%,
    var(--secondary) 0%,
    var(--muted) 100%
  );
}

/* Oversized serif display numeral used as a graphic element */
@utility display-number {
  font-family: var(--font-heading);
  font-weight: 500;
  line-height: 0.8;
  letter-spacing: -0.02em;
}
```

Change the radius token in the `:root` block from `--radius: 0.5rem;` to:

```css
  --radius: 0.85rem;
```

- [ ] **Step 2: Create `components/storefront/section-heading.tsx`**

```tsx
import { cn } from "@/lib/utils";

/**
 * Editorial section heading — oversized Playfair display numeral beside a serif
 * title, with an optional uppercase eyebrow. Shared across storefront screens.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-4", className)}>
      {index && (
        <span className="display-number text-5xl text-terracotta sm:text-6xl">
          {index}
        </span>
      )}
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Restyle the global shell `app/(storefront)/layout.tsx`**

Keep the `CartNavLink` import and usage (cart-count logic unchanged). Replace the header/footer with a pill nav + pill footer bar. Full file:

```tsx
import Link from "next/link";
import { CartNavLink } from "@/components/storefront/cart-nav-link";

/**
 * Storefront shell (public) — Editorial Warm v2. Pill nav header + pill footer
 * bar over a full-width cream canvas (no outer frame). Logic unchanged.
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-heading text-xl tracking-wide text-foreground"
          >
            Koka Scent
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 text-sm shadow-soft">
            <Link
              href="/"
              className="rounded-full px-4 py-1.5 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="rounded-full px-4 py-1.5 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Katalog
            </Link>
            <div className="rounded-full px-2">
              <CartNavLink />
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="mt-8 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Katalog
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Koleksi
            </Link>
            <Link
              href="/"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Tentang
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Koka Scent — Parfum terinspirasi Jepang.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: typecheck clean, no new lint errors, build succeeds.
Then `pnpm dev` and eyeball `/` (shell only) at 375px and desktop: sticky pill header, footer pill bar, cream canvas.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/storefront/section-heading.tsx "app/(storefront)/layout.tsx"
git commit -m "feat(storefront): editorial-warm foundations — tokens, utilities, shell"
```

---

## Task 2: Landing homepage `/`

**Files:**
- Create: `components/storefront/hero.tsx`, `components/storefront/category-index.tsx`, `components/storefront/featured-product.tsx`
- Modify: `app/(storefront)/page.tsx`
- Test: manual visual + build

**Interfaces:**
- Consumes: `SectionHeading` (Task 1); `db/repo.ts` `listActiveProducts()` (existing — returns `ProductWithVariants[]`); `formatIDR` from `lib/format.ts`; `CATEGORY_LABELS` from `components/storefront/product-card.tsx`.
- Produces: the homepage. `Hero({ product }: { product: ProductWithVariants })`, `CategoryIndex()`, `FeaturedProduct({ product }: { product: ProductWithVariants })`.

- [ ] **Step 1: Create `components/storefront/hero.tsx`**

Editorial hero — big serif headline + CTA pill on the left, a floating product "plinth" card with an overlapping display numeral and a small floating notes/stat chip on the right. Must stack on mobile.

```tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import type { ProductWithVariants } from "@/types";

export function Hero({ product }: { product: ProductWithVariants }) {
  return (
    <section className="grid items-center gap-10 py-6 lg:grid-cols-2 lg:py-10">
      <div className="space-y-6">
        <span className="text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
          Parfum Terinspirasi Jepang
        </span>
        <h1 className="font-heading text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
          Wangi yang <em className="text-terracotta not-italic">membekas</em>,
          cerita yang menetap.
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Koleksi eau de parfum & diffuser dengan notes yang dirancang untuk
          menemani momen tenang harimu.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">Belanja Sekarang</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full"
          >
            <Link href="/products">Lihat Koleksi</Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="plinth shadow-soft relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 80vw, 400px"
            className="object-cover"
            priority
          />
        </div>
        <span className="display-number pointer-events-none absolute -top-4 -left-2 text-7xl text-terracotta/80 sm:text-8xl">
          No 01
        </span>
        <div className="shadow-soft absolute -bottom-4 left-2 rounded-2xl bg-card px-4 py-3 sm:left-6">
          <p className="font-heading text-lg text-foreground">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            Mulai {formatIDR(product.price)}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/storefront/category-index.tsx`**

Numbered category index (`01–04`) as pill links to the catalog with a `?category=` query.

```tsx
import Link from "next/link";
import { SectionHeading } from "@/components/storefront/section-heading";

const CATEGORIES: { index: string; slug: string; label: string }[] = [
  { index: "01", slug: "unisex", label: "Unisex" },
  { index: "02", slug: "wanita", label: "Wanita" },
  { index: "03", slug: "pria", label: "Pria" },
  { index: "04", slug: "diffuser", label: "Diffuser" },
];

export function CategoryIndex() {
  return (
    <section className="space-y-6">
      <SectionHeading eyebrow="Jelajahi" title="Kategori" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className="group flex items-baseline justify-between rounded-2xl border border-border bg-card px-5 py-6 transition-colors hover:bg-secondary"
          >
            <span className="font-heading text-xl text-foreground">
              {c.label}
            </span>
            <span className="display-number text-3xl text-muted-foreground transition-colors group-hover:text-terracotta">
              {c.index}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

Note: `/products` already reads category client-side; the query param is a
progressive enhancement. If `products/page.tsx` does not yet honor `?category=`,
Task 3 wires it (see Task 3, Step 2). Linking here is safe regardless.

- [ ] **Step 3: Create `components/storefront/featured-product.tsx`**

A single large asymmetric "featured" band (sage color block) with the product image plinth and a CTA. Reused shape informs the catalog featured item.

```tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import type { ProductWithVariants } from "@/types";

export function FeaturedProduct({ product }: { product: ProductWithVariants }) {
  return (
    <section className="grid items-center gap-8 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:grid-cols-2">
      <div className="relative order-2 lg:order-1">
        <div className="shadow-soft relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-card/20">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 70vw, 320px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="order-1 space-y-4 lg:order-2">
        <span className="text-xs tracking-[0.2em] uppercase opacity-80">
          Pilihan · {CATEGORY_LABELS[product.category]}
        </span>
        <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
          {product.name}
        </h2>
        <p className="max-w-sm text-sm opacity-90">{product.description}</p>
        <p className="font-heading text-2xl">{formatIDR(product.price)}</p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="rounded-full"
        >
          <Link href={`/products/${product.slug}`}>Lihat Detail</Link>
        </Button>
      </div>
    </section>
  );
}
```

Note: confirm `ProductWithVariants` has a `description: string` field before using it. If the field name differs (check `types/index.ts`), use the actual field or drop the `<p>`. Do not invent fields.

- [ ] **Step 4: Rewrite `app/(storefront)/page.tsx`**

Server Component. Fetch products via repo, pick a hero + featured. Handle the empty case.

```tsx
import { listActiveProducts } from "@/db/repo";
import { Hero } from "@/components/storefront/hero";
import { CategoryIndex } from "@/components/storefront/category-index";
import { FeaturedProduct } from "@/components/storefront/featured-product";

export default async function HomePage() {
  const products = await listActiveProducts();
  const hero = products[0];
  const featured = products[1] ?? products[0];

  return (
    <div className="space-y-16">
      {hero ? (
        <Hero product={hero} />
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          Katalog sedang disiapkan.
        </p>
      )}
      <CategoryIndex />
      {featured && <FeaturedProduct product={featured} />}
    </div>
  );
}
```

Note: verify the export name of the list function in `db/repo.ts` is `listActiveProducts` and its signature (`(category?) => Promise<ProductWithVariants[]>`). Use the real name.

- [ ] **Step 5: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: clean. Then `pnpm dev`, open `/`: hero with floating numeral + card, category index pills, sage featured band. Check 375px stacks cleanly (no horizontal scroll).

- [ ] **Step 6: Commit**

```bash
git add "app/(storefront)/page.tsx" components/storefront/hero.tsx components/storefront/category-index.tsx components/storefront/featured-product.tsx
git commit -m "feat(storefront): editorial landing homepage"
```

---

## Task 3: Catalog restyle

**Files:**
- Modify: `app/(storefront)/products/page.tsx`
- Modify: `components/storefront/product-card.tsx`
- Modify: `components/storefront/product-grid.tsx`
- Modify: `components/storefront/category-filter.tsx`
- Modify: `components/storefront/search-bar.tsx`
- Test: manual visual + build

**Interfaces:**
- Consumes: `SectionHeading` (Task 1), existing `useProducts` hook / client filter state (unchanged), `CATEGORY_LABELS`.
- Produces: restyled catalog. No exported-signature changes to `ProductCard`/`ProductGrid` props (`{ product }` / `{ products }`), so nothing downstream breaks.

- [ ] **Step 1: Restyle `product-card.tsx`**

Keep all logic (`priceRange`, `outOfStock`, `CATEGORY_LABELS`, props). Only change the returned markup: rounder card, `plinth` image backdrop, hover-lift, terracotta price. Replace the `return (...)` block's `Card` with:

```tsx
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden rounded-2xl border-border/70 py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft">
        <div className="plinth relative aspect-square w-full overflow-hidden">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {outOfStock && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 rounded-full bg-background/90"
            >
              Stok Habis
            </Badge>
          )}
        </div>
        <CardContent className="space-y-1 px-4 py-4">
          <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h3 className="font-heading text-base leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-terracotta">
            {priceRange(product)}
          </p>
        </CardContent>
      </Card>
    </Link>
```

Keep imports and the rest of the file as-is.

- [ ] **Step 2: Restyle catalog page `app/(storefront)/products/page.tsx`**

Preserve the existing client-side filter/search logic (`useMemo`, state, `useProducts`). Only change the page's presentational wrapper: an editorial header via `SectionHeading`, and put the filter/search into a rounded toolbar row. **Additionally**, read an initial category from the URL so `/products?category=unisex` (from the homepage) preselects the filter:

- Add near the top of the component (App Router client page):
  ```tsx
  import { useSearchParams } from "next/navigation";
  ```
  and initialize the category filter state from `useSearchParams().get("category")` when it is a valid category (guard with the existing category list/`isProductCategory` if available; otherwise default to "all"/null exactly as the current code does).

Wrap the existing grid/toolbar JSX with:

```tsx
      <SectionHeading eyebrow="Koleksi" title="Semua Produk" index="No 07" />
```

placed above the toolbar, and give the toolbar container `className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between"`. Do not change the filtering computation or the `ProductGrid`/`ProductGridSkeleton` usage.

Note: read the current file first and adapt these class/wrapper changes to its actual JSX — do not rewrite the logic.

- [ ] **Step 3: Restyle `category-filter.tsx` and `search-bar.tsx`**

- `category-filter.tsx`: render options as `rounded-full` pill buttons (shadcn `Button` `variant="outline"` when unselected, default/sage when selected). Keep the same props and the same `onChange`/selected-category contract.
- `search-bar.tsx`: give the shadcn `Input` a `rounded-full` class and a leading lucide `Search` icon. Keep the same value/onChange props.

Adapt to each file's current props — do not change their interfaces.

- [ ] **Step 4: `product-grid.tsx`**

No structural change required beyond spacing polish: keep the grid `grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4` and the empty-state copy. Optionally bump gap to `gap-5`. Skeleton stays. Leave props identical.

- [ ] **Step 5: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: clean. `pnpm dev` → `/products`: pill filters, rounded search, editorial cards with hover-lift; `/products?category=wanita` preselects Wanita; filtering + search still work; 375px two-column grid, no overflow.

- [ ] **Step 6: Commit**

```bash
git add "app/(storefront)/products/page.tsx" components/storefront/product-card.tsx components/storefront/product-grid.tsx components/storefront/category-filter.tsx components/storefront/search-bar.tsx
git commit -m "feat(storefront): editorial catalog restyle + URL category preselect"
```

---

## Task 4: PDP restyle (gallery rail, notes card, pill variants)

**Files:**
- Modify: `app/(storefront)/products/[slug]/product-detail.tsx`
- Modify: `components/storefront/product-gallery.tsx`
- Modify: `components/storefront/variant-selector.tsx`
- Modify: `components/storefront/notes-card.tsx`
- Modify: `components/storefront/add-to-cart-button.tsx`
- Test: manual visual + build

**Interfaces:**
- Consumes: `SectionHeading` (Task 1), existing product-detail data/state (variant selection, add-to-cart) — all logic unchanged.
- Produces: restyled PDP. No prop-signature changes to the four components.

- [ ] **Step 1: `product-gallery.tsx` — vertical thumbnail rail**

Keep the active-image state logic. Change layout so on desktop a **vertical thumbnail rail** sits to the right (or left) of a large `plinth` main image; on mobile thumbnails wrap in a horizontal row under the main image. Main image container: `plinth shadow-soft rounded-3xl overflow-hidden aspect-square`. Thumbnails: `rounded-xl` buttons, selected one `ring-2 ring-terracotta`. Keep the same props (image list + whatever selection state it owns).

- [ ] **Step 2: `notes-card.tsx` — colored Top/Middle/Base card**

Render the three note tiers as a single warm card: header eyebrow "Aroma", then three rows (Top / Middle / Base) each with a small display numeral or label chip and the note text. Use a `bg-secondary` or subtle sage-tinted card with `rounded-2xl`. Keep the same props (the notes object). Bahasa labels: "Top", "Middle", "Base" (or "Atas/Tengah/Dasar" — keep whatever the current component uses).

- [ ] **Step 3: `variant-selector.tsx` — pills**

Render variants as `rounded-full` pill buttons (selected = sage/default, unselected = outline, out-of-stock = disabled + `line-through`/muted). Keep selection state/props and the disabled-when-stock-0 logic exactly.

- [ ] **Step 4: `add-to-cart-button.tsx` — terracotta pill**

Keep the disabled logic (stock 0 / no variant) and the `addItem` + toast call. Restyle: full-width `rounded-full` shadcn `Button` with `className="bg-terracotta text-terracotta-foreground hover:bg-terracotta/90"` and a lucide `ShoppingBag` icon. Do not change the click handler.

- [ ] **Step 5: Restyle `product-detail.tsx` layout**

Two-column asymmetric layout: gallery left (~7/12), info column right (~5/12) on `lg`, stacked on mobile. Info column order: `SectionHeading` eyebrow=category label + a large serif product name (`font-heading text-4xl`), an oversized faint `display-number` "No" behind/above the title as a graphic accent, large terracotta price (variant-aware — keep existing price computation), `VariantSelector`, `AddToCartButton`, then `NotesCard`. Preserve every data/handler call; only move/reclass the JSX. Read the current file and adapt.

- [ ] **Step 6: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: clean. `pnpm dev` → open a product (e.g. `/products/sakura-senja`): thumbnail rail switches main image, pill variants select, out-of-stock variant disabled, add-to-cart shows toast and updates header count, notes card renders. Check `/products/rempah-nusantara` (out-of-stock) → add-to-cart disabled. 375px stacks cleanly.

- [ ] **Step 7: Commit**

```bash
git add "app/(storefront)/products/[slug]/product-detail.tsx" components/storefront/product-gallery.tsx components/storefront/variant-selector.tsx components/storefront/notes-card.tsx components/storefront/add-to-cart-button.tsx
git commit -m "feat(storefront): editorial PDP — thumbnail rail, notes card, pill variants"
```

---

## Task 5: Cart, Checkout & Confirmation restyle

**Files:**
- Modify: `components/storefront/cart-line-item.tsx`, `cart-summary.tsx`
- Modify: `app/(storefront)/cart/page.tsx`
- Modify: `components/storefront/checkout-form.tsx`, `shipping-cost-box.tsx`, `order-summary.tsx`
- Modify: `app/(storefront)/checkout/page.tsx` (wrapper/spacing only — keep `placed`/redirect logic verbatim)
- Modify: `components/storefront/order-confirmation.tsx`, `app/(storefront)/checkout/confirmation/page.tsx`
- Test: manual visual + build + end-to-end order

**Interfaces:**
- Consumes: `SectionHeading` (Task 1); all existing cart store selectors, the checkout form (`react-hook-form` + zod), and order fetch — unchanged.
- Produces: restyled cart/checkout/confirmation. No changes to `onSubmit`, `POST /api/orders` body, redirect, or `clear()` ordering.

- [ ] **Step 1: Cart — `cart-line-item.tsx` + `cart-summary.tsx` + `cart/page.tsx`**

- `cart-line-item.tsx`: card row — `plinth` thumbnail (rounded-xl), name (serif), qty stepper as `rounded-full` outline buttons, remove as ghost icon button. Keep qty +/- and remove handlers.
- `cart-summary.tsx`: floating sage card (`bg-primary text-primary-foreground rounded-3xl shadow-soft`) with subtotal (via `formatIDR`) and a `rounded-full` "Lanjut ke Checkout" button/link. Keep the subtotal selector and link target.
- `cart/page.tsx`: `SectionHeading eyebrow="Keranjang" title="Keranjang Belanja"`; two-column (items left, summary sticky right on `lg`), stacked on mobile. Restyle the empty-state (icon + "Keranjang masih kosong" + pill link to `/products`). Keep the hydration guard/logic.

- [ ] **Step 2: Checkout — form/shipping/summary + page wrapper**

- `checkout-form.tsx`: keep the `react-hook-form`/zod fields and `FormField` structure exactly; only restyle — group fields in a `rounded-2xl border bg-card p-6` card, `rounded-xl` inputs, section eyebrow "Data Pengiriman".
- `shipping-cost-box.tsx`: render rate options as selectable `rounded-2xl` cards/pills (selected = ring-terracotta). Keep the `/api/shipping/cost` call and `onSelect`/`selected` contract.
- `order-summary.tsx`: sticky sage/card summary with subtotal, shipping, total (`formatIDR`), and the submit button (keep `submitting`/`submitDisabled` props and the `type="submit"` inside the existing `<form>`). Button `rounded-full`, label "Bayar".
- `checkout/page.tsx`: **do not touch** the `placed` flag, `useEffect` redirect guard, `onSubmit`, or `clear()` ordering. Only adjust the outer `<section>`/grid classes and the `<h1>` → `SectionHeading` for visual consistency.

- [ ] **Step 3: Confirmation — `order-confirmation.tsx` + `confirmation/page.tsx`**

Keep the `?order=` read and `GET /api/orders/[orderNumber]` fetch. Restyle: a centered success card with a **giant `display-number` order number**, a lucide `CircleCheck` in terracotta, the order summary lines (`formatIDR`), a clear "Demo — belum ada pembayaran" note, and a `rounded-full` WhatsApp click-to-chat pill link (keep the existing wa.me link/logic). Keep loading/error states, only reclass them.

- [ ] **Step 4: Verify (end-to-end)**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: clean. Then `pnpm dev` and run the full flow against Neon (DATABASE_URL in `.env`):
1. `/products` → open product → pick variant → add to cart (toast, header count++).
2. `/cart` → adjust qty, see subtotal update, styled correctly.
3. `/checkout` → fill form, pick shipping rate, "Bayar".
4. Land on `/checkout/confirmation?order=KS-...` with giant order number; cart cleared; no bounce to `/cart`.
Confirm 375px + desktop both clean, no horizontal overflow anywhere.

- [ ] **Step 5: Commit**

```bash
git add components/storefront/cart-line-item.tsx components/storefront/cart-summary.tsx "app/(storefront)/cart/page.tsx" components/storefront/checkout-form.tsx components/storefront/shipping-cost-box.tsx components/storefront/order-summary.tsx "app/(storefront)/checkout/page.tsx" components/storefront/order-confirmation.tsx "app/(storefront)/checkout/confirmation/page.tsx"
git commit -m "feat(storefront): editorial cart, checkout & confirmation restyle"
```

---

## Final Review

After Task 5, run a broad whole-branch visual + code review against this plan and
the spec (Editorial Warm language applied, warm palette, no logic changes, 375px
usable, verify commands clean), then invoke
`superpowers:finishing-a-development-branch`.

---

## Self-Review (author)

- **Spec coverage:** §3 decisions → Task 1 (no-frame shell, tokens) + bold color via sage/terracotta blocks in Tasks 2/4/5; §4 motifs (display numerals `SectionHeading`, floating cards, pills, thumbnail rail, color blocking) → Tasks 1–5; §5 shell → Task 1; §6 all six screens → Tasks 1(shell)/2(home)/3(catalog)/4(PDP)/5(cart+checkout+confirmation); §7 constraints → Global Constraints; §8 risks (placeholder plinth, mobile stacks) → `.plinth` util + per-task 375px checks. Covered.
- **Placeholder scan:** No TBD/TODO. Where a component's current internals are adapted rather than fully re-listed, the plan states exact class recipes + the invariant contract to preserve and instructs reading the current file first — this is deliberate for restyle-in-place, not a content gap.
- **Type consistency:** `listActiveProducts`, `ProductWithVariants`, `CATEGORY_LABELS`, `formatIDR`, `SectionHeading({index?,eyebrow?,title,className?})` used consistently. Two guarded assumptions flagged inline to verify against real files before use: `ProductWithVariants.description` (Task 2 Step 3) and `?category=` handling / `isProductCategory` (Task 3 Step 2).
