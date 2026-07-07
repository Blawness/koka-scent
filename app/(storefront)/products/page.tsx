"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import {
  CategoryFilter,
  OPTIONS,
  type CategoryOption,
} from "@/components/storefront/category-filter";
import { SearchBar } from "@/components/storefront/search-bar";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/product-grid";
import { SectionHeading } from "@/components/storefront/section-heading";

// Product listing — Feature 1. Fetches active products once, then filters by
// category and searches by name entirely client-side.
function ProductsPageContent() {
  const { data: products, isLoading, isError } = useProducts();
  const categoryParam = useSearchParams().get("category");
  const [category, setCategory] = useState<CategoryOption>(() =>
    OPTIONS.includes(categoryParam as CategoryOption)
      ? (categoryParam as CategoryOption)
      : "all",
  );
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
      <SectionHeading eyebrow="Koleksi" title="Semua Produk" index="No 07" />

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}
