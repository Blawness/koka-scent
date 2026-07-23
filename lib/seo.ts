import { highestPrice, lowestPrice, variantPrices } from "@/lib/price";
import { INSTAGRAM_URL, SHOPEE_URL, TOKOPEDIA_URL } from "@/lib/social";
import type { ProductWithVariants } from "@/types";

/**
 * Canonical site origin. `.env` ships NEXT_PUBLIC_SITE_URL as an empty string,
 * which `??` would happily pass through and blow up `new URL()` — so treat
 * blank as unset and fall back to localhost.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = configuredSiteUrl
  ? configuredSiteUrl.replace(/\/$/, "")
  : "http://localhost:3000";

export const SITE_NAME = "Koka Scent";

/** schema.org Organization — identity of the shop itself. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Koka Scent — parfum dan diffuser terinspirasi Jepang, diracik dan dikirim dari Indonesia.",
    sameAs: [INSTAGRAM_URL, SHOPEE_URL, TOKOPEDIA_URL],
  };
}

/** schema.org WebSite — enables the sitelinks search box in Google results. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** schema.org ItemList of products surfaced on the homepage. */
export function productListJsonLd(products: ProductWithVariants[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produk Pilihan Koka Scent",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${SITE_URL}/products/${product.slug}`,
        image: product.images[0]
          ? new URL(product.images[0], SITE_URL).toString()
          : undefined,
        offers: {
          "@type": "Offer",
          // Lowest variant price, matching the "mulai dari" figure on the card.
          price: lowestPrice(product),
          priceCurrency: "IDR",
          availability:
            product.stock > 0 ||
            product.variants.some((v) => v.stock > 0)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
}

/**
 * schema.org Product for a PDP. Uses AggregateOffer because a product spans
 * several variant sizes at different prices; low/high bracket the range the
 * variant selector actually offers, so the markup never disagrees with the
 * price a visitor sees after picking a size.
 *
 * Deliberately omits `review` / `aggregateRating` — we have no real customer
 * reviews yet, and inventing them risks a manual action.
 */
export function productJsonLd(product: ProductWithVariants) {
  const inStock =
    product.stock > 0 || product.variants.some((v) => v.stock > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `Eau de parfum ${product.name} — top notes ${product.notesTop}, middle notes ${product.notesMiddle}, base notes ${product.notesBase}.`,
    sku: product.slug,
    category: product.category,
    image: product.images.map((image) =>
      new URL(image, SITE_URL).toString(),
    ),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: lowestPrice(product),
      highPrice: highestPrice(product),
      offerCount: variantPrices(product).length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

/** schema.org BreadcrumbList — renders the crumb trail under the search result. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** schema.org FAQPage — the markup most likely to earn a rich snippet. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
