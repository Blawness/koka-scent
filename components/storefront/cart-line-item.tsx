"use client";

import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { useCartStore, type CartItem } from "@/stores/cart-store";

export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 border-b border-border/70 py-5 last:border-b-0">
      <Link
        href={`/products/${item.slug}`}
        className="plinth relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="font-heading text-lg leading-snug text-foreground hover:text-primary"
            >
              {item.name}
            </Link>
            {item.variantLabel && (
              <p className="text-xs text-muted-foreground">
                {item.variantLabel}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
            aria-label="Hapus dari keranjang"
            onClick={() => removeItem(item.productId, item.variantId)}
          >
            <Trash2Icon />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border-transparent"
              aria-label="Kurangi jumlah"
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.variantId,
                  item.quantity - 1,
                )
              }
            >
              <MinusIcon className="size-3.5" />
            </Button>
            <span className="w-6 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border-transparent"
              aria-label="Tambah jumlah"
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.variantId,
                  item.quantity + 1,
                )
              }
            >
              <PlusIcon className="size-3.5" />
            </Button>
          </div>
          <p className="text-sm font-medium text-terracotta">
            {formatIDR(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
