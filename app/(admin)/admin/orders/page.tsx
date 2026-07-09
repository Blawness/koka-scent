import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateID, formatIDR } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-status";
import { mockOrders } from "@/lib/mock/admin-data";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Pesanan" };

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: STATUS_LABEL.pending },
  { value: "paid", label: STATUS_LABEL.paid },
  { value: "processing", label: STATUS_LABEL.processing },
  { value: "shipped", label: STATUS_LABEL.shipped },
  { value: "completed", label: STATUS_LABEL.completed },
  { value: "cancelled", label: STATUS_LABEL.cancelled },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = FILTERS.some((f) => f.value === status) ? status : "all";

  const orders =
    active === "all"
      ? mockOrders
      : mockOrders.filter((o) => o.status === active);

  return (
    <section className="space-y-6">
      <h1 className="font-heading text-3xl">Pesanan</h1>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            asChild
            size="sm"
            variant={active === f.value ? "default" : "outline"}
          >
            <Link
              href={
                f.value === "all"
                  ? "/admin/orders"
                  : `/admin/orders?status=${f.value}`
              }
            >
              {f.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Pesanan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Tidak ada pesanan dengan status ini.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-foreground">
                    {o.orderNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateID(o.createdAt)}
                  </TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="text-right">
                    {formatIDR(o.total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/orders/${o.id}`}>Detail</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
