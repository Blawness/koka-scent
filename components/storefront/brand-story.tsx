import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/storefront/section-heading";

const STATS = [
  { value: "8", label: "Aroma dalam koleksi" },
  { value: "8 jam", label: "Ketahanan rata-rata" },
  { value: "2019", label: "Tahun kami mulai" },
];

// TODO(copy): placeholder brand narrative — ganti dengan cerita asli sebelum live.
export function BrandStory() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <div className="relative order-2 lg:order-1">
        <div className="plinth shadow-soft relative aspect-[5/4] w-full overflow-hidden rounded-3xl">
          <Image
            src="/products/brand-story.jpg"
            alt="Deretan botol parfum kaca dengan tutup kristal di bawah cahaya hangat"
            fill
            sizes="(max-width: 1024px) 90vw, 520px"
            className="object-cover"
          />
        </div>
        <span className="display-number pointer-events-none absolute -bottom-6 -left-3 text-7xl text-terracotta/70 sm:text-8xl">
          Est
        </span>
      </div>

      <div className="order-1 space-y-6 lg:order-2">
        <SectionHeading eyebrow="Tentang Kami" title="Cerita Koka Scent" />
        <div className="space-y-4 text-base text-muted-foreground">
          <p>
            Koka Scent lahir dari satu kebiasaan sederhana: berhenti sejenak,
            menarik napas, dan membiarkan aroma menandai satu momen agar ia tidak
            hilang begitu saja.
          </p>
          <p>
            Kami mengambil disiplin peracikan Jepang — sabar, presisi, tidak
            berlebihan — lalu menerjemahkannya lewat bahan yang tumbuh di sekitar
            kami. Sakura bertemu cendana. Yuzu bertemu melati.
          </p>
          <p>
            Setiap botol diracik dalam batch kecil, diuji berminggu-minggu di
            kulit sungguhan, dan baru dirilis ketika aromanya terasa jujur.
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
          <Link href="/products">Jelajahi Koleksi</Link>
        </Button>
      </div>
    </section>
  );
}
