import { describe, expect, it } from "vitest";
import { highestPrice, lowestPrice, variantPrices } from "./price";
import type { ProductVariant, ProductWithVariants } from "@/types";

function variant(overrides: Partial<ProductVariant>): ProductVariant {
  return {
    id: "v1",
    productId: "p1",
    label: "10ml",
    priceOverride: null,
    stock: 5,
    ...overrides,
  };
}

function product(
  overrides: Partial<ProductWithVariants> = {},
): ProductWithVariants {
  return {
    id: "p1",
    slug: "sakura-senja",
    name: "Sakura Senja",
    category: "wanita",
    price: 289_000,
    images: [],
    notesTop: "Pink Pepper",
    notesMiddle: "Cherry Blossom",
    notesBase: "White Musk",
    stock: 10,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    variants: [],
    ...overrides,
  };
}

describe("variantPrices", () => {
  it("falls back to the base price when there are no variants", () => {
    expect(variantPrices(product())).toEqual([289_000]);
  });

  it("uses a variant's override when present", () => {
    const p = product({
      variants: [
        variant({ id: "v1", label: "10ml", priceOverride: 99_000 }),
        variant({ id: "v2", label: "50ml", priceOverride: null }),
      ],
    });
    expect(variantPrices(p)).toEqual([99_000, 289_000]);
  });
});

describe("lowestPrice", () => {
  it("returns the cheapest variant, not the base price", () => {
    const p = product({
      variants: [
        variant({ id: "v1", label: "10ml", priceOverride: 99_000 }),
        variant({ id: "v2", label: "50ml", priceOverride: null }),
      ],
    });
    // Regression: the base price (289_000) is the 50ml, not the entry price.
    expect(lowestPrice(p)).toBe(99_000);
  });

  it("equals the base price when no variant overrides it", () => {
    const p = product({ variants: [variant({ priceOverride: null })] });
    expect(lowestPrice(p)).toBe(289_000);
  });

  it("counts out-of-stock variants — they are still listed prices", () => {
    const p = product({
      variants: [
        variant({ id: "v1", priceOverride: 99_000, stock: 0 }),
        variant({ id: "v2", priceOverride: 289_000, stock: 3 }),
      ],
    });
    expect(lowestPrice(p)).toBe(99_000);
  });
});

describe("highestPrice", () => {
  it("returns the dearest variant", () => {
    const p = product({
      variants: [
        variant({ id: "v1", priceOverride: 99_000 }),
        variant({ id: "v2", priceOverride: 450_000 }),
      ],
    });
    expect(highestPrice(p)).toBe(450_000);
  });

  it("matches lowestPrice for a single-price product", () => {
    const p = product();
    expect(highestPrice(p)).toBe(lowestPrice(p));
  });
});
