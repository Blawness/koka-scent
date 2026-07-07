"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/storefront/cart-line-item";
import { CartSummary } from "@/components/storefront/cart-summary";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartStore } from "@/stores/cart-store";

// Cart page — items from useCartStore, qty controls, running subtotal, link
// to checkout (Feature 2). Guarded with useHydrated: the store is persisted
// to localStorage, so the server-rendered pass must match the pre-hydration
// client pass (empty) to avoid hydration mismatches.
export default function CartPage() {
  const mounted = useHydrated();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());

  if (!mounted) {
    return (
      <section className="space-y-4">
        <h1 className="font-heading text-3xl">Keranjang</h1>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <ShoppingBagIcon className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl">Keranjang kosong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Belum ada produk di keranjang Anda. Jelajahi katalog untuk menemukan
          aroma favorit Anda.
        </p>
        <Button asChild>
          <Link href="/products">Lihat Katalog</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="font-heading text-3xl">Keranjang</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card px-4 lg:col-span-2">
          {items.map((item) => (
            <CartLineItem
              key={`${item.productId}-${item.variantId ?? "base"}`}
              item={item}
            />
          ))}
        </div>

        <div className="space-y-4">
          <CartSummary subtotal={subtotal}>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Lanjut ke Checkout</Link>
            </Button>
          </CartSummary>
        </div>
      </div>
    </section>
  );
}
