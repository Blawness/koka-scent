import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/storefront/section-heading";

const STATS = [
  { value: "8", label: "Aroma dalam koleksi" },
  { value: "8 jam", label: "Ketahanan rata-rata" },
  { value: "2019", label: "Tahun kami mulai" },
];

export function BrandStory() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <div className="relative order-2 lg:order-1">
        <div className="plinth shadow-soft relative aspect-[5/4] w-full overflow-hidden rounded-3xl">
          <Image
            src="/products/brand-story.webp"
            alt="Deretan botol parfum kaca dengan tutup kristal di bawah cahaya hangat"
            fill
            sizes="(max-width: 1024px) 90vw, 520px"
            className="object-cover"
          />
        </div>
        <span
          aria-hidden
          className="display-number pointer-events-none absolute -bottom-6 -left-3 text-7xl text-terracotta/70 sm:text-8xl"
          style={{ fontFamily: '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif' }}
        >
          ころ
        </span>
      </div>

      <div className="order-1 space-y-6 lg:order-2">
        <SectionHeading eyebrow="Tentang Kami" title="Cerita Koka Scent" />
        <div className="space-y-4 text-base text-muted-foreground">
          <p>
            KOKA is short for 「こころから」— kokoro kara. In Japanese, kokoro
            means heart, mind, spirit; kara means from. Put together, it
            translates simply as &ldquo;from heart.&rdquo;
          </p>
          <p>
            That&apos;s the whole idea behind the name. Every scent we make
            starts there — not as a tagline, but as the honest answer to why
            we do this: we put our heart into it.
          </p>
          <p>
            So when you wear KOKA, you&apos;re not just wearing a fragrance.
            You&apos;re wearing something someone genuinely cared about
            getting right — from heart, meant to be felt.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-4 border-t border-border pt-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="display-number block text-3xl text-foreground">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/products">Find Your Scent</Link>
        </Button>
      </div>
    </section>
  );
}
