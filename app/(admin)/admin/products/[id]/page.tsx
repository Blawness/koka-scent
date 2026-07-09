import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getMockProductById } from "@/lib/mock/admin-data";

export const metadata: Metadata = { title: "Edit Produk" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getMockProductById(id);
  if (!product) notFound();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Kembali ke Produk
        </Link>
        <h1 className="font-heading text-3xl">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </section>
  );
}
