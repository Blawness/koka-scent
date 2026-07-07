# PRD: Koka Scent — E-Commerce Web App

**Version:** 1.0
**Date:** 2026-07-07
**Author:** Vorca Studio (for client: Koka Scent / Nabila)
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
Koka Scent is an established Japan-inspired perfumery brand (8 years on Shopee, 13 SKUs, 4.9★/4,000+ reviews, 1.6k+ IG followers) currently selling only through Shopee. This project builds a standalone e-commerce web app so Koka Scent can take orders and receive payment directly on their own domain — full product catalog, cart, checkout with integrated local payment methods, and an admin dashboard for the Koka Scent team to manage products and orders without developer involvement.

### 1.2 Goals
- Customers can browse the full catalog, add to cart, and complete checkout with payment fully inside the website (no redirect to Shopee/marketplace).
- Koka Scent's team can manage products, stock, and incoming orders themselves via an admin dashboard.
- The site visually extends Koka Scent's existing brand language (warm neutral palette, editorial minimalist, ingredient/notes storytelling) rather than introducing a new identity — see Section 11.

### 1.3 Non-Goals (Out of Scope for v1)
- Multi-vendor marketplace features.
- Native mobile app (mobile web only, responsive).
- Subscription / recurring billing.
- Loyalty points, referral, or rewards system.
- Multi-language / i18n (Bahasa Indonesia only for v1).
- Live chat widget (WhatsApp click-to-chat link is sufficient for v1).
- International shipping (domestic Indonesia only for v1).

---

## 2. Users & Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `Customer` | Site visitor / buyer, guest checkout (no account required for v1) | Browse products, add to cart, checkout, pay, view order confirmation via order ID + email/WA lookup |
| `Admin` | Koka Scent team (Nabila + staff) | Manage products (CRUD, stock), view/update order status, view basic sales summary |

---

## 3. Core Features (MVP)

### Feature 1: Product Catalog & Detail Page

**Description:**
Public storefront listing all products, filterable by category (Parfum Unisex, Parfum Wanita, Parfum Pria, Diffuser/Humidifier/Oil). Each product detail page (PDP) shows gallery images, price, size/variant selector (if applicable, e.g. 10ml vs 50ml), and a "Notes" section (Top / Middle / Base) reusing Koka Scent's existing IG storytelling format.

**Acceptance Criteria:**
- [ ] `/products` lists all active products with category filter and search
- [ ] `/products/[slug]` shows gallery, price, variant selector, stock status, and Top/Middle/Base notes block
- [ ] Out-of-stock products show a disabled "Add to Cart" state, not hidden
- [ ] All product images lazy-load and are served via Supabase Storage (or Cloudinary if image transform/CDN needed)

**Out of Scope:**
Product reviews/ratings system, related-products recommendation engine, wishlist.

---

### Feature 2: Cart & Checkout

**Description:**
Client-side cart (persisted in `localStorage` + Zustand store) that survives page reload. Checkout collects name, phone/WA, shipping address, and calculates shipping cost via courier API before payment.

**Acceptance Criteria:**
- [ ] Cart supports add/remove/update quantity, shows running subtotal
- [ ] Checkout form validates required fields (name, phone, address, city, postal code)
- [ ] Shipping cost is calculated dynamically based on destination + weight (via RajaOngkir or Biteship API) before payment is triggered
- [ ] Order is created in `Order` table with status `pending` before payment redirect/popup

**Out of Scope:**
Multiple shipping addresses per account, saved addresses (no accounts in v1), split shipments.

---

### Feature 3: Payment Integration

**Description:**
Payment fully inside the website using **Midtrans Snap** (recommended — see Section 10 Open Questions for Xendit as alternative). Supports QRIS, bank transfer/VA, e-wallet (GoPay/OVO/ShopeePay), and credit card. Payment status updates the order via Midtrans webhook (server-to-server notification), not just client-side redirect, to avoid missed payments.

**Acceptance Criteria:**
- [ ] Midtrans Snap popup/redirect triggered after checkout form submission
- [ ] `POST /api/webhooks/midtrans` verifies signature and updates `Order.status` (`pending` → `paid` / `failed` / `expired`)
- [ ] Customer sees a confirmation page with order ID after successful payment
- [ ] Failed/expired payments allow retry without re-entering shipping info

**Out of Scope:**
Installment/cicilan options, partial refunds automation (manual refund via Midtrans dashboard is acceptable for v1), saved payment methods.

---

### Feature 4: Admin Dashboard — Products & Orders

**Description:**
Password-protected `/admin` area for the Koka Scent team to manage the product catalog (add/edit/deactivate products, update stock) and process orders (view order details, update fulfillment status, see basic daily/weekly sales totals).

**Acceptance Criteria:**
- [ ] `/admin` requires authentication (Supabase Auth, single `admin` role — no granular permission tiers needed for v1)
- [ ] Admin can create/edit/deactivate a product, including images, price, variants, and notes (top/middle/base)
- [ ] Admin can view a paginated/filterable order list and change status (`pending` → `paid` → `processing` → `shipped` → `completed`, or `cancelled`)
- [ ] Admin dashboard shows a simple summary: orders today/this week, revenue this week, low-stock alert (< 5 units)

**Out of Scope:**
Multi-admin role permissions, audit log, bulk CSV import/export (nice-to-have for v2), automated invoicing/PDF generation.

---

### Feature 5 (Nice-to-have, not MVP-blocking): Scent Finder Quiz

**Description:**
A short interactive quiz ("what's your zodiac/personality scent?") that recommends 1–2 products, matching Koka Scent's existing IG content style. Feeds directly into product detail pages as a CTA.

**Acceptance Criteria:**
- [ ] 3–5 question quiz with a results screen linking to recommended product(s)

**Out of Scope:**
Personalization/ML-based recommendations, saving quiz results per user.

---

## 4. Tech Stack

> Following Vorca Studio's default stack, adapted for Indonesian e-commerce payment needs.

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | Node.js 20 | |
| **Framework** | Next.js 16 (App Router) | |
| **Language** | TypeScript 5 (strict mode) | |
| **Database** | PostgreSQL via Supabase | |
| **ORM** | Supabase JS client (or Drizzle if type-safe query builder preferred) | |
| **Auth** | Supabase Auth | Admin-only login; customers checkout as guests |
| **Styling** | Tailwind CSS v4 + **shadcn/ui** (required — all UI primitives and components must use shadcn/ui, styled to brand palette per Section 11) | |
| **State Management** | Zustand (cart) + TanStack Query (server data) | |
| **API Style** | REST via Next.js Route Handlers | |
| **Payments** | Midtrans Snap (recommended) | Alternative: Xendit — confirm before locking in, see Open Questions |
| **Shipping Cost** | RajaOngkir API or Biteship | Confirm which courier accounts Koka Scent already uses |
| **File Storage** | Supabase Storage | Product images |
| **Email/Notifications** | Resend (order confirmation email) + WhatsApp click-to-chat link | |
| **Deployment** | Vercel | |
| **Package Manager** | pnpm | |

---

## 5. Data Models

```typescript
// Product
type Product = {
  id: string;            // UUID
  slug: string;
  name: string;
  category: "unisex" | "wanita" | "pria" | "diffuser";
  price: number;          // in IDR, smallest unit (no decimals)
  images: string[];       // Supabase Storage URLs
  notesTop: string;
  notesMiddle: string;
  notesBase: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ProductVariant (e.g. 10ml / 50ml)
type ProductVariant = {
  id: string;
  productId: string;      // FK → Product
  label: string;          // "10ml", "50ml"
  priceOverride: number | null;
  stock: number;
};

// Order
type Order = {
  id: string;
  orderNumber: string;    // human-readable, e.g. KS-20260707-0001
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled" | "failed" | "expired";
  midtransOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// OrderItem
type OrderItem = {
  id: string;
  orderId: string;        // FK → Order
  productId: string;       // FK → Product
  variantId: string | null;
  quantity: number;
  priceAtPurchase: number;
};
```

---

## 6. API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | public | List active products, filter by category |
| `GET` | `/api/products/[slug]` | public | Get single product detail |
| `POST` | `/api/shipping/cost` | public | Calculate shipping cost given destination + cart weight |
| `POST` | `/api/orders` | public | Create order (status `pending`), returns Midtrans Snap token |
| `POST` | `/api/webhooks/midtrans` | signature-verified | Midtrans payment notification, updates order status |
| `GET` | `/api/orders/[orderNumber]` | public (order number + phone lookup) | Customer order status lookup |
| `GET` | `/api/admin/products` | admin required | List all products (incl. inactive) |
| `POST` | `/api/admin/products` | admin required | Create product |
| `PUT` | `/api/admin/products/[id]` | admin required | Update product |
| `GET` | `/api/admin/orders` | admin required | List/filter orders |
| `PUT` | `/api/admin/orders/[id]` | admin required | Update order status |

---

## 7. Project Structure

```
koka-scent-web/
├── app/
│   ├── (storefront)/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── products/
│   │       └── orders/
│   └── api/
│       ├── products/
│       ├── orders/
│       ├── shipping/
│       └── webhooks/midtrans/
├── components/
│   ├── ui/                 # shadcn/ui primitives (required — do not hand-roll base components)
│   ├── storefront/
│   └── admin/
├── lib/
│   ├── supabase.ts
│   ├── midtrans.ts
│   └── shipping.ts
├── hooks/
├── stores/
│   └── cart-store.ts
├── types/
└── supabase/
    └── migrations/
```

---

## 8. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Midtrans
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# Shipping (RajaOngkir or Biteship — confirm provider)
RAJAONGKIR_API_KEY=

# Email
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=
```

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Guest can complete checkout + payment | < 3 minutes, ≤ 4 steps | Manual QA / usability test |
| Payment status reflects correctly in admin dashboard | Within 30s of payment (via webhook) | QA against Midtrans sandbox |
| Admin can add a new product end-to-end | < 5 minutes, no developer help | Manual QA with Nabila's team |
| Mobile responsiveness | Fully usable on 375px width (most traffic is IG/Shopee mobile) | Manual device testing |

---

## 10. Open Questions

- [ ] Midtrans vs Xendit — final decision pending; Midtrans recommended as default (wider local adoption, well-documented Snap.js)
- [ ] Which courier(s) does Koka Scent currently ship with? (affects RajaOngkir/Biteship courier list config)
- [ ] Does Koka Scent want customer accounts/login in a future v2, or stay guest-checkout-only long term?
- [ ] Domain: will this replace vorcastudio-hosted subdomain, or does Koka Scent have/want their own domain?
- [ ] Scent Finder Quiz (Feature 5) — confirm if in scope for v1 launch or deferred to v1.1

---

## 11. Design & Brand Direction (Reference for UI implementation)

Koka Scent's existing brand identity (Shopee + Instagram) should be extended, not replaced:

- **Palette:** warm cream/off-white base (not pure white), soft beige, muted sage green or terracotta as accent, charcoal (not pure black) for text.
- **Typography:** elegant serif for headlines (echoing bottle labels), clean sans-serif for body copy; occasional Japanese script as a decorative accent only.
- **Photography:** lifestyle product shots on linen, stone, ferns, natural light — reuse existing IG assets where possible rather than commissioning new studio shots for v1.
- **Storytelling pattern:** every PDP should surface "Notes" (Top / Middle / Base) as a visual card, matching the brand's existing IG content format.
- **Visual references:** Le Labo, Snif, HMNS (Indonesian fragrance DTC) — editorial minimalism with warm neutrals, not clinical/cold minimalism.

---

*Generated by prd-generator skill — optimized for AI agentic coding tools.*
