import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

// Admin dashboard — placeholder. TODO: orders today/this week, revenue,
// low-stock alert (< 5 units) — Feature 4.
export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Dashboard</h1>
      <p className="text-muted-foreground">
        Placeholder — ringkasan pesanan, pendapatan, dan alert stok menipis akan
        tampil di sini.
      </p>
    </section>
  );
}
