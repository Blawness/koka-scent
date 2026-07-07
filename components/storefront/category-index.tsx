import Link from "next/link";
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
      <SectionHeading eyebrow="Jelajahi" title="Kategori" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className="group flex items-baseline justify-between rounded-2xl border border-border bg-card px-5 py-6 transition-colors hover:bg-secondary"
          >
            <span className="font-heading text-xl text-foreground">
              {c.label}
            </span>
            <span className="display-number text-3xl text-muted-foreground transition-colors group-hover:text-terracotta">
              {c.index}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
