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
import { requireAdmin } from "@/lib/dal";
import { listOrders } from "@/db/repo";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Pesanan" };

const PAGE_SIZE = 20;

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: STATUS_LABEL.pending },
  { value: "paid", label: STATUS_LABEL.paid },
  { value: "processing", label: STATUS_LABEL.processing },
  { value: "shipped", label: STATUS_LABEL.shipped },
  { value: "completed", label: STATUS_LABEL.completed },
  { value: "cancelled", label: STATUS_LABEL.cancelled },
];

function pageHref(status: string, page: number): string {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdmin();
  const { status, page: pageParam } = await searchParams;
  const active = FILTERS.some((f) => f.value === status) ? status! : "all";
  const page = Math.max(1, Number(pageParam) || 1);

  const { orders, total } = await listOrders({
    status: active === "all" ? undefined : (active as OrderStatus),
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
            <Link href={pageHref(f.value, 1)}>{f.label}</Link>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Halaman {page} dari {totalPages} · {total} pesanan
          </span>
          <div className="flex gap-1.5">
            <Button
              asChild={page > 1}
              size="sm"
              variant="outline"
              disabled={page <= 1}
            >
              {page > 1 ? (
                <Link href={pageHref(active, page - 1)}>Sebelumnya</Link>
              ) : (
                <span>Sebelumnya</span>
              )}
            </Button>
            <Button
              asChild={page < totalPages}
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
            >
              {page < totalPages ? (
                <Link href={pageHref(active, page + 1)}>Berikutnya</Link>
              ) : (
                <span>Berikutnya</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
