import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Pesanan" };

// Admin order management — placeholder. TODO: paginated/filterable list, update
// status (pending → paid → processing → shipped → completed / cancelled) —
// Feature 4.
export default function AdminOrdersPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Pesanan</h1>
      <p className="text-muted-foreground">
        Placeholder — daftar pesanan dengan filter dan update status akan tampil
        di sini.
      </p>
    </section>
  );
}
