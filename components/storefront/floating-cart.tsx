"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartLineItem } from "@/components/storefront/cart-line-item";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatIDR } from "@/lib/format";

export function FloatingCart() {
  const mounted = useHydrated();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const totalItems = useCartStore((state) => state.totalItems());

  const count = mounted ? totalItems : 0;
  const isEmpty = items.length === 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open cart"
          className="fixed right-4 bottom-4 z-40 h-14 w-14 rounded-full bg-terracotta text-white shadow-lg shadow-terracotta/30 transition-transform hover:scale-105 hover:bg-terracotta/90 sm:right-6 sm:bottom-6"
        >
          <ShoppingBag className="size-6" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-semibold text-background tabular-nums">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/products">Browse Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            {items.map((item) => (
              <CartLineItem
                key={`${item.productId}-${item.variantId}`}
                item={item}
              />
            ))}
          </div>
        )}

        {!isEmpty && (
          <SheetFooter>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-heading text-base text-foreground">
                {formatIDR(subtotal)}
              </span>
            </div>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/cart">View Cart</Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-full bg-terracotta text-white hover:bg-terracotta/90"
            >
              <Link href="/checkout">Checkout</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
