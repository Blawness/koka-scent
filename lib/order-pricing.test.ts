import { describe, expect, it } from "vitest";
import { priceLineItems } from "./order-pricing";
import type { ProductWithVariants } from "@/types";

const base = {
  category: "unisex" as const,
  images: [],
  notesTop: "",
  notesMiddle: "",
  notesBase: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const products: ProductWithVariants[] = [
  {
    ...base,
    id: "p1",
    slug: "p1",
    name: "Aroma Satu",
    price: 100000,
    stock: 10,
    isActive: true,
    variants: [
      { id: "v1", productId: "p1", label: "10ml", priceOverride: 60000, stock: 5 },
      { id: "v2", productId: "p1", label: "50ml", priceOverride: null, stock: 5 },
    ],
  },
  {
    ...base,
    id: "p2",
    slug: "p2",
    name: "Aroma Nonaktif",
    price: 200000,
    stock: 0,
    isActive: false,
    variants: [],
  },
];

describe("priceLineItems", () => {
  it("uses the product price for a non-variant line", () => {
    const { items, subtotal } = priceLineItems(
      [{ productId: "p1", variantId: null, quantity: 2 }],
      products,
    );
    expect(items[0].priceAtPurchase).toBe(100000);
    expect(subtotal).toBe(200000);
  });

  it("uses the variant override when present", () => {
    const { items, subtotal } = priceLineItems(
      [{ productId: "p1", variantId: "v1", quantity: 3 }],
      products,
    );
    expect(items[0].priceAtPurchase).toBe(60000);
    expect(subtotal).toBe(180000);
  });

  it("falls back to product price when the variant has no override", () => {
    const { items } = priceLineItems(
      [{ productId: "p1", variantId: "v2", quantity: 1 }],
      products,
    );
    expect(items[0].priceAtPurchase).toBe(100000);
  });

  it("ignores a client-supplied price entirely", () => {
    // Extra fields on the input must not influence the resolved price.
    const { items } = priceLineItems(
      [
        {
          productId: "p1",
          variantId: null,
          quantity: 1,
          priceAtPurchase: 1,
        } as never,
      ],
      products,
    );
    expect(items[0].priceAtPurchase).toBe(100000);
  });

  it("rejects an unknown product", () => {
    expect(() =>
      priceLineItems([{ productId: "nope", variantId: null, quantity: 1 }], products),
    ).toThrow(/tidak ditemukan/);
  });

  it("rejects an inactive product", () => {
    expect(() =>
      priceLineItems([{ productId: "p2", variantId: null, quantity: 1 }], products),
    ).toThrow(/tidak tersedia/);
  });

  it("rejects an unknown variant", () => {
    expect(() =>
      priceLineItems([{ productId: "p1", variantId: "bogus", quantity: 1 }], products),
    ).toThrow(/Varian tidak ditemukan/);
  });
});
