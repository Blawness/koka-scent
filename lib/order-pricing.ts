// Server-authoritative order pricing. The client sends only what it is choosing
// (product, variant, quantity) — never the price. Prices are resolved here from
// trusted product data, closing the "server trusts client-supplied prices" hole.

import type { ProductWithVariants } from "@/types";

export type LineItemInput = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export type PricedLineItem = LineItemInput & {
  priceAtPurchase: number;
};

/**
 * Resolve each line item's unit price from `products`, rejecting unknown or
 * inactive products and unknown variants. Returns priced items + the subtotal.
 * Throws on any invalid line — the caller turns that into a 400.
 */
export function priceLineItems(
  items: LineItemInput[],
  products: ProductWithVariants[],
): { items: PricedLineItem[]; subtotal: number } {
  const byId = new Map(products.map((p) => [p.id, p]));

  const priced = items.map((it) => {
    const product = byId.get(it.productId);
    if (!product) {
      throw new Error(`Produk tidak ditemukan: ${it.productId}`);
    }
    if (!product.isActive) {
      throw new Error(`Produk tidak tersedia: ${product.name}`);
    }

    let unitPrice = product.price;
    if (it.variantId) {
      const variant = product.variants.find((v) => v.id === it.variantId);
      if (!variant) {
        throw new Error(`Varian tidak ditemukan untuk ${product.name}`);
      }
      unitPrice = variant.priceOverride ?? product.price;
    }

    return { ...it, priceAtPurchase: unitPrice };
  });

  const subtotal = priced.reduce(
    (sum, it) => sum + it.priceAtPurchase * it.quantity,
    0,
  );
  return { items: priced, subtotal };
}
