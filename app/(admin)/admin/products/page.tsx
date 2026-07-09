import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductTable } from "@/components/admin/product-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/dal";
import { listAllProducts } from "@/db/repo";

export const metadata: Metadata = { title: "Produk" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await listAllProducts();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl">Produk</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus /> Tambah Produk
          </Link>
        </Button>
      </div>
      <div className="rounded-lg border border-border">
        <ProductTable products={products} />
      </div>
    </section>
  );
}
