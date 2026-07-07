import { listActiveProducts } from "@/db/repo";
import { Hero } from "@/components/storefront/hero";
import { CategoryIndex } from "@/components/storefront/category-index";
import { FeaturedProduct } from "@/components/storefront/featured-product";

export default async function HomePage() {
  const products = await listActiveProducts();
  const hero = products[0];
  const featured = products[1] ?? products[0];

  return (
    <div className="space-y-16">
      {hero ? (
        <Hero product={hero} />
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          Katalog sedang disiapkan.
        </p>
      )}
      <CategoryIndex />
      {featured && <FeaturedProduct product={featured} />}
    </div>
  );
}
