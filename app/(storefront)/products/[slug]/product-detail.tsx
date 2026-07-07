"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/use-products";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { SectionHeading } from "@/components/storefront/section-heading";
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
      <section className="grid gap-10 lg:grid-cols-12">
        <Skeleton className="aspect-square w-full rounded-3xl lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
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
    <section className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <ProductGallery images={product.images} name={product.name} />
      </div>

      <div className="space-y-6 lg:col-span-5">
        <div className="relative space-y-2">
          <span
            aria-hidden
            className="display-number absolute -top-6 right-0 text-7xl text-muted-foreground/15 sm:-top-8 sm:text-8xl"
          >
            No
          </span>
          <SectionHeading eyebrow={CATEGORY_LABELS[product.category]} title={product.name} titleAs="h1" />
        </div>

        <div className="flex items-center gap-2">
          <p className="font-heading text-2xl text-terracotta">
            {formatIDR(displayPrice)}
          </p>
          {outOfStock && <Badge variant="secondary">Stok Habis</Badge>}
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
