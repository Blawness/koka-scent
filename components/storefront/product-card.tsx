import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/format";
import type { ProductWithVariants } from "@/types";

export const CATEGORY_LABELS: Record<ProductWithVariants["category"], string> = {
  unisex: "Unisex",
  wanita: "Wanita",
  pria: "Pria",
  diffuser: "Diffuser",
};

function priceRange(product: ProductWithVariants) {
  const prices =
    product.variants.length > 0
      ? product.variants.map((v) => v.priceOverride ?? product.price)
      : [product.price];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? formatIDR(min)
    : `${formatIDR(min)} – ${formatIDR(max)}`;
}

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const outOfStock =
    product.stock <= 0 &&
    (product.variants.length === 0 ||
      product.variants.every((v) => v.stock <= 0));

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {outOfStock && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-background/90"
            >
              Stok Habis
            </Badge>
          )}
        </div>
        <CardContent className="space-y-1 px-4 pb-4">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h3 className="font-heading text-base leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-foreground">
            {priceRange(product)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
