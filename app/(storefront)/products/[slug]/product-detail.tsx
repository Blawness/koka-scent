"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { SectionHeading } from "@/components/storefront/section-heading";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { NotesCard } from "@/components/storefront/notes-card";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { formatIDR } from "@/lib/format";
import type { ProductVariant, ProductWithVariants } from "@/types";

export function ProductDetail({ product }: { product: ProductWithVariants }) {
  // User's explicit variant pick. When null, falls back to the first
  // in-stock variant (derived, not effect-driven — `key={slug}` on this
  // component in the page resets this on product change).
  const [variantOverride, setVariantOverride] = useState<ProductVariant | null>(
    null,
  );

  const defaultVariant = useMemo(
    () =>
      product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null,
    [product],
  );

  const selectedVariant = variantOverride ?? defaultVariant;

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
          <SectionHeading
            eyebrow={CATEGORY_LABELS[product.category]}
            title={product.name}
            titleAs="h1"
          />
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
