import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";

const CATEGORIES: { index: string; slug: string; label: string }[] = [
  { index: "01", slug: "unisex", label: "Unisex" },
  { index: "02", slug: "wanita", label: "Wanita" },
  { index: "03", slug: "pria", label: "Pria" },
  { index: "04", slug: "diffuser", label: "Diffuser" },
];

export function CategoryIndex() {
  return (
    <section className="space-y-6">
      <Reveal>
        <SectionHeading eyebrow="Jelajahi" title="Kategori" />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.slug} delay={i * 90}>
            <Link
              href={`/products?category=${c.slug}`}
              className="group flex items-baseline justify-between rounded-2xl border border-border bg-card px-5 py-6 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary hover:shadow-soft"
            >
              <span className="font-heading text-xl text-foreground">
                {c.label}
              </span>
              <span className="display-number text-3xl text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-terracotta">
                {c.index}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
