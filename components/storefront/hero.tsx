import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { lowestPrice } from "@/lib/price";
import type { ProductWithVariants } from "@/types";

/** Staggered entrance. Above the fold, so it animates on load rather than on scroll. */
const enter = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

export function Hero({ product }: { product: ProductWithVariants }) {
  return (
    <section className="grid items-center gap-10 py-6 lg:grid-cols-2 lg:py-10">
      <div className="space-y-6">
        <span
          style={enter(0)}
          className="animate-fade-up block text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase"
        >
          Parfum Terinspirasi Jepang
        </span>
        <h1
          style={enter(80)}
          className="animate-fade-up font-heading text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
        >
          Wangi yang <em className="text-terracotta not-italic">membekas</em>,
          cerita yang menetap.
        </h1>
        <p
          style={enter(160)}
          className="animate-fade-up max-w-md text-base text-muted-foreground"
        >
          Koleksi eau de parfum & diffuser dengan notes yang dirancang untuk
          menemani momen tenang harimu.
        </p>
        <div style={enter(240)} className="animate-fade-up flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">Belanja Sekarang</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full"
          >
            <Link href="/products">Lihat Koleksi</Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          style={enter(120)}
          className="plinth shadow-soft animate-plinth-rise relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl"
        >
          <Image
            src={product.images[0] ?? "/products/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 80vw, 400px"
            className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
            priority
          />
        </div>
        <span
          style={enter(400)}
          className="display-number animate-fade-in pointer-events-none absolute -top-4 -left-2 text-7xl text-terracotta/80 sm:text-8xl"
        >
          No 01
        </span>
        <div
          style={enter(480)}
          className="shadow-soft animate-fade-up absolute -bottom-4 left-2 rounded-2xl bg-card px-4 py-3 sm:left-6"
        >
          <p className="font-heading text-lg text-foreground">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            Mulai {formatIDR(lowestPrice(product))}
          </p>
        </div>
      </div>
    </section>
  );
}
