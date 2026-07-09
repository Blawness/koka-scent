import type { Metadata } from "next";
import Link from "next/link";
import { listActiveProducts } from "@/db/repo";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { Hero } from "@/components/storefront/hero";
import { ValueProps } from "@/components/storefront/value-props";
import { CategoryIndex } from "@/components/storefront/category-index";
import { FeaturedProduct } from "@/components/storefront/featured-product";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeading } from "@/components/storefront/section-heading";
import { ScentAnatomy } from "@/components/storefront/scent-anatomy";
import { BrandStory } from "@/components/storefront/brand-story";
import { Testimonials } from "@/components/storefront/testimonials";
import { FaqSection, FAQ_ITEMS } from "@/components/storefront/faq-section";
import { ClosingCta } from "@/components/storefront/closing-cta";
import {
  faqJsonLd,
  organizationJsonLd,
  productListJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Koka Scent — Parfum Terinspirasi Jepang" },
  description:
    "Eau de parfum dan diffuser terinspirasi Jepang, diracik dalam batch kecil. Notes autentik, tahan 8+ jam, dikirim ke seluruh Indonesia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Koka Scent",
    title: "Koka Scent — Parfum Terinspirasi Jepang",
    description:
      "Eau de parfum dan diffuser terinspirasi Jepang, diracik dalam batch kecil. Notes autentik, tahan 8+ jam.",
    url: "/",
  },
};

export default async function HomePage() {
  const products = await listActiveProducts();
  const hero = products[0];
  const featured = products[1] ?? products[0];
  const bestSellers = products.slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-24">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      {bestSellers.length > 0 && (
        <JsonLd data={productListJsonLd(bestSellers)} />
      )}
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />

      {hero ? (
        <Hero product={hero} />
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          Katalog sedang disiapkan.
        </p>
      )}

      <ValueProps />

      {bestSellers.length > 0 && (
        <section className="space-y-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Paling Dicari" title="Best Seller" />
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/products">Lihat Semua</Link>
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <ProductGrid products={bestSellers} />
          </Reveal>
        </section>
      )}

      <CategoryIndex />
      <ScentAnatomy />
      {featured && (
        <Reveal>
          <FeaturedProduct product={featured} />
        </Reveal>
      )}
      <Reveal>
        <BrandStory />
      </Reveal>
      <Testimonials />
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <ClosingCta />
      </Reveal>
    </div>
  );
}
