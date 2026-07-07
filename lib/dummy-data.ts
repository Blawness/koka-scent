import type { OrderWithItems, ProductWithVariants } from "@/types";

/**
 * Dummy fixtures for scaffolded API stubs. Replace with real Supabase queries
 * once the schema is applied. Placeholder image paths only.
 */

export const dummyProducts: ProductWithVariants[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "sakura-mist",
    name: "Sakura Mist",
    category: "wanita",
    price: 189000,
    images: ["/placeholder-product.jpg"],
    notesTop: "Pink Pepper, Bergamot",
    notesMiddle: "Cherry Blossom, Jasmine",
    notesBase: "White Musk, Cedarwood",
    stock: 24,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    variants: [
      {
        id: "10000000-0000-0000-0000-000000000001",
        productId: "00000000-0000-0000-0000-000000000001",
        label: "10ml",
        priceOverride: 89000,
        stock: 40,
      },
      {
        id: "10000000-0000-0000-0000-000000000002",
        productId: "00000000-0000-0000-0000-000000000001",
        label: "50ml",
        priceOverride: null,
        stock: 24,
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "yuzu-ginger",
    name: "Yuzu Ginger",
    category: "unisex",
    price: 199000,
    images: ["/placeholder-product.jpg"],
    notesTop: "Yuzu, Ginger",
    notesMiddle: "Green Tea, Neroli",
    notesBase: "Vetiver, Amber",
    stock: 3,
    isActive: true,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    variants: [],
  },
];

export const dummyOrders: OrderWithItems[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    orderNumber: "KS-20260707-0001",
    customerName: "Sample Customer",
    customerPhone: "6281234567890",
    shippingAddress: "Jl. Contoh No. 1",
    shippingCity: "Jakarta Selatan",
    shippingPostalCode: "12140",
    shippingCost: 18000,
    subtotal: 189000,
    total: 207000,
    status: "pending",
    midtransOrderId: null,
    createdAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
    items: [
      {
        id: "30000000-0000-0000-0000-000000000001",
        orderId: "20000000-0000-0000-0000-000000000001",
        productId: "00000000-0000-0000-0000-000000000001",
        variantId: "10000000-0000-0000-0000-000000000002",
        quantity: 1,
        priceAtPurchase: 189000,
      },
    ],
  },
];

/** Generate a human-readable order number, e.g. KS-20260707-0042. */
export function generateOrderNumber(seq = 1): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  return `KS-${ymd}-${String(seq).padStart(4, "0")}`;
}
