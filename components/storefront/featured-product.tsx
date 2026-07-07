import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import type { ProductWithVariants } from "@/types";

export function FeaturedProduct({ product }: { product: ProductWithVariants }) {
  return (
    <section className="grid items-center gap-8 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:grid-cols-2">
      <div className="relative order-2 lg:order-1">
        <div className="shadow-soft relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-card/20">
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 70vw, 320px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="order-1 space-y-4 lg:order-2">
        <span className="text-xs tracking-[0.2em] uppercase opacity-80">
          Pilihan · {CATEGORY_LABELS[product.category]}
        </span>
        <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
          {product.name}
        </h2>
        <p className="max-w-sm text-sm opacity-90">
          Top: {product.notesTop} · Middle: {product.notesMiddle}
        </p>
        <p className="font-heading text-2xl">{formatIDR(product.price)}</p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="rounded-full"
        >
          <Link href={`/products/${product.slug}`}>Lihat Detail</Link>
        </Button>
      </div>
    </section>
  );
}
