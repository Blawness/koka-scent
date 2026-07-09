import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cart, checkout and confirmation carry per-session state and order
      // numbers; admin and the API are not public surfaces.
      disallow: ["/admin", "/admin/", "/api/", "/cart", "/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
