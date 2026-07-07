// Product detail page (PDP) — placeholder. TODO: gallery, variant selector,
// stock status, and Top/Middle/Base notes card (Feature 1, Section 11).
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Produk: {slug}</h1>
      <p className="text-muted-foreground">
        Placeholder PDP — galeri, harga, pilihan varian (10ml / 50ml), status
        stok, dan notes (Top / Middle / Base) akan tampil di sini.
      </p>
    </section>
  );
}
