import type { Metadata } from "next";

export const metadata: Metadata = { title: "Katalog" };

// Product listing — placeholder. TODO: fetch from /api/products, add category
// filter + search (Feature 1) once designs are final.
export default function ProductsPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Katalog</h1>
      <p className="text-muted-foreground">
        Placeholder — daftar produk, filter kategori (Unisex / Wanita / Pria /
        Diffuser), dan pencarian akan tampil di sini.
      </p>
    </section>
  );
}
