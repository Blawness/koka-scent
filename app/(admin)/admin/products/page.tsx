import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Produk" };

// Admin product management — placeholder. TODO: CRUD, stock, images, variants,
// notes (Feature 4).
export default function AdminProductsPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Produk</h1>
      <p className="text-muted-foreground">
        Placeholder — tabel produk, tambah/edit/nonaktifkan, dan kelola stok akan
        tampil di sini.
      </p>
    </section>
  );
}
