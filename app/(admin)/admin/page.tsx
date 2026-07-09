import type { Metadata } from "next";
import Link from "next/link";
import { StatTile } from "@/components/admin/stat-tile";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIDR } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/order-status";
import { getMockDashboardSummary } from "@/lib/mock/admin-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const { ordersToday, ordersThisWeek, revenueThisWeek, lowStock } =
    getMockDashboardSummary();

  return (
    <section className="space-y-8">
      <h1 className="font-heading text-3xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Pesanan Hari Ini" value={String(ordersToday)} />
        <StatTile label="Pesanan Minggu Ini" value={String(ordersThisWeek)} />
        <StatTile
          label="Pendapatan Minggu Ini"
          value={formatIDR(revenueThisWeek)}
          hint="Status dibayar & seterusnya"
        />
        <StatTile
          label="Stok Menipis"
          value={String(lowStock.length)}
          hint="Produk dengan stok < 5"
        />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl">Stok Menipis</h2>
        {lowStock.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Semua produk memiliki stok yang cukup.
          </p>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {CATEGORY_LABEL[p.category]}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(p.price)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      {p.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/products/${p.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
