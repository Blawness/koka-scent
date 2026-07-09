import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/db/repo";
import { JsonLd } from "@/components/json-ld";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { lowestPrice } from "@/lib/price";
import { formatIDR } from "@/lib/format";
import { ProductDetail } from "./product-detail";

// Memoised so generateMetadata and the page body share one DB read.
const loadProduct = cache(getProductBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    return { title: "Produk tidak ditemukan" };
  }

  const description = `${product.name} — eau de parfum dengan top notes ${product.notesTop}, middle notes ${product.notesMiddle}, dan base notes ${product.notesBase}. Mulai ${formatIDR(lowestPrice(product))}.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "Koka Scent",
      title: `${product.name} · Koka Scent`,
      description,
      url: `/products/${product.slug}`,
      images: product.images.length > 0 ? product.images : undefined,
    },
  };
}

// Product detail page (PDP) — Feature 1. Fetched on the server so the product
// name, price and notes land in the initial HTML for crawlers; the client child
// only owns variant selection.
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) notFound();

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Katalog", path: "/products" },
          {
            name: CATEGORY_LABELS[product.category],
            path: `/products?category=${product.category}`,
          },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <ProductDetail key={product.slug} product={product} />
    </>
  );
}
