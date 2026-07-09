import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="space-y-4 py-16 text-center">
      <h1 className="font-heading text-2xl text-foreground">
        Produk tidak ditemukan
      </h1>
      <p className="text-muted-foreground">
        Produk yang kamu cari mungkin sudah tidak tersedia.
      </p>
      <Link href="/products" className="text-sm text-primary underline">
        Kembali ke katalog
      </Link>
    </section>
  );
}
