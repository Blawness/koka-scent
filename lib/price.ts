import type { ProductWithVariants } from "@/types";

/**
 * Effective price of every purchasable option for a product.
 *
 * `product.price` is the *base* price, which a variant may override — for
 * Sakura Senja the base is the 50ml at Rp 289.000 while the 10ml overrides it
 * down to Rp 99.000. Reading `product.price` as "the price" therefore overstates
 * anything shown as "mulai dari", and misstates structured data.
 */
export function variantPrices(product: ProductWithVariants): number[] {
  return product.variants.length > 0
    ? product.variants.map((v) => v.priceOverride ?? product.price)
    : [product.price];
}

/** Cheapest purchasable price — the correct figure behind "Mulai …". */
export function lowestPrice(product: ProductWithVariants): number {
  return Math.min(...variantPrices(product));
}

/** Dearest purchasable price. */
export function highestPrice(product: ProductWithVariants): number {
  return Math.max(...variantPrices(product));
}
