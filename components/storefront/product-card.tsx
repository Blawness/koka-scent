import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/format";
import { highestPrice, lowestPrice } from "@/lib/price";
import type { ProductWithVariants } from "@/types";

export const CATEGORY_LABELS: Record<ProductWithVariants["category"], string> = {
  unisex: "Unisex",
  wanita: "Wanita",
  pria: "Pria",
  diffuser: "Diffuser",
};

function priceRange(product: ProductWithVariants) {
  const min = lowestPrice(product);
  const max = highestPrice(product);
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
      <Card className="h-full overflow-hidden rounded-2xl border-border/70 py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft">
        <div className="plinth relative aspect-square w-full overflow-hidden">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {outOfStock && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 rounded-full bg-background/90"
            >
              Stok Habis
            </Badge>
          )}
        </div>
        <CardContent className="space-y-1 px-4 py-4">
          <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h3 className="font-heading text-base leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-terracotta">
            {priceRange(product)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
