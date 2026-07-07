"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/use-products";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { NotesCard } from "@/components/storefront/notes-card";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { formatIDR } from "@/lib/format";
import type { ProductVariant } from "@/types";

export function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useProduct(slug);
  // User's explicit variant pick. When null, falls back to the first
  // in-stock variant (derived, not effect-driven — `key={slug}` on this
  // component in the page resets this on product change).
  const [variantOverride, setVariantOverride] = useState<ProductVariant | null>(
    null,
  );

  const defaultVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null;
  }, [product]);

  const selectedVariant = variantOverride ?? defaultVariant;

  if (isLoading) {
    return (
      <section className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="space-y-4 py-16 text-center">
        <h1 className="font-heading text-2xl text-foreground">
          Produk tidak ditemukan
        </h1>
        <p className="text-muted-foreground">
          Produk yang kamu cari mungkin sudah tidak tersedia.
        </p>
        <Link href="/products" className="text-sm text-primary underline">
          Kembali ke katalog
        </Link>
      </section>
    );
  }

  const displayPrice = selectedVariant?.priceOverride ?? product.price;
  const outOfStock =
    (selectedVariant ? selectedVariant.stock : product.stock) <= 0;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <ProductGallery images={product.images} name={product.name} />

      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="font-heading text-3xl text-foreground">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-xl font-medium text-foreground">
              {formatIDR(displayPrice)}
            </p>
            {outOfStock && <Badge variant="secondary">Stok Habis</Badge>}
          </div>
        </div>

        <Separator />

        <VariantSelector
          variants={product.variants}
          selected={selectedVariant}
          onSelect={setVariantOverride}
        />

        <AddToCartButton product={product} selectedVariant={selectedVariant} />

        <NotesCard
          notesTop={product.notesTop}
          notesMiddle={product.notesMiddle}
          notesBase={product.notesBase}
        />
      </div>
    </section>
  );
}
