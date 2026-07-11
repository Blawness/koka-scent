import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { requirePermission } from "@/lib/dal";

export const metadata: Metadata = { title: "Tambah Produk" };

export default async function NewProductPage() {
  await requirePermission("products:write");
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Kembali ke Produk
        </Link>
        <h1 className="font-heading text-3xl">Tambah Produk</h1>
      </div>
      <ProductForm />
    </section>
  );
}
