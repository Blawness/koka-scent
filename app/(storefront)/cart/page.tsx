import type { Metadata } from "next";

export const metadata: Metadata = { title: "Keranjang" };

// Cart page — placeholder. TODO: render items from useCartStore, qty controls,
// running subtotal, link to checkout (Feature 2).
export default function CartPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Keranjang</h1>
      <p className="text-muted-foreground">
        Placeholder — item cart (dari Zustand store), ubah quantity, dan subtotal
        akan tampil di sini.
      </p>
    </section>
  );
}
