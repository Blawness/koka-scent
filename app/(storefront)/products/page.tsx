"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import {
  CategoryFilter,
  type CategoryOption,
} from "@/components/storefront/category-filter";
import { SearchBar } from "@/components/storefront/search-bar";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/product-grid";

// Product listing — Feature 1. Fetches active products once, then filters by
// category and searches by name entirely client-side.
export default function ProductsPage() {
  const { data: products, isLoading, isError } = useProducts();
  const [category, setCategory] = useState<CategoryOption>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!products) return [];
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch =
        query.length === 0 || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl text-foreground">Katalog</h1>
        <p className="text-muted-foreground">
          Parfum terinspirasi Jepang — temukan aroma yang cocok untukmu.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {isLoading && <ProductGridSkeleton />}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          Gagal memuat produk. Silakan muat ulang halaman.
        </p>
      )}

      {!isLoading && !isError && <ProductGrid products={filtered} />}
    </section>
  );
}
