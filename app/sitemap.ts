import type { MetadataRoute } from "next";
import { listActiveProducts } from "@/db/repo";
import { SITE_URL } from "@/lib/seo";

// Re-crawled rather than frozen at build time: products are edited from the
// admin panel, so lastModified must reflect the DB, not the last deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listActiveProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // `/products?category=…` is intentionally absent: the catalog filters
  // client-side, so every category URL serves byte-identical HTML. Listing them
  // would offer Google a set of duplicate pages with no canonical to resolve
  // them. Add them once the catalog renders its filter on the server.
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
