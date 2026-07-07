"use client";

import { toast } from "sonner";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { ProductVariant, ProductWithVariants } from "@/types";

export function AddToCartButton({
  product,
  selectedVariant,
}: {
  product: ProductWithVariants;
  selectedVariant: ProductVariant | null;
}) {
  const addItem = useCartStore((state) => state.addItem);

  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const missingRequiredVariant = product.variants.length > 0 && !selectedVariant;
  const disabled = stock <= 0 || missingRequiredVariant;

  const handleAdd = () => {
    if (disabled) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      slug: product.slug,
      name: product.name,
      variantLabel: selectedVariant?.label ?? null,
      price: selectedVariant?.priceOverride ?? product.price,
      image: product.images[0] ?? "/products/placeholder.svg",
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <Button
      type="button"
      size="lg"
      className="w-full rounded-full bg-terracotta text-terracotta-foreground hover:bg-terracotta/90"
      disabled={disabled}
      onClick={handleAdd}
    >
      <ShoppingBagIcon data-icon="inline-start" />
      {stock <= 0
        ? "Stok Habis"
        : missingRequiredVariant
          ? "Pilih Ukuran"
          : "Tambah ke Keranjang"}
    </Button>
  );
}
