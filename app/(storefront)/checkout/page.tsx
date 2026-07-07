import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

// Checkout — placeholder. TODO: shipping form (name/phone/address/city/postal),
// dynamic shipping cost, create order, then Midtrans Snap (Features 2 & 3).
export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Checkout</h1>
      <p className="text-muted-foreground">
        Placeholder — form pengiriman, kalkulasi ongkir, dan pembayaran akan
        tampil di sini. Integrasi payment menunggu konfirmasi (Section 10).
      </p>
    </section>
  );
}
