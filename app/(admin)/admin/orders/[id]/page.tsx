import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimeID, formatIDR } from "@/lib/format";
import {
  getMockOrderById,
  getMockProductById,
} from "@/lib/mock/admin-data";

export const metadata: Metadata = { title: "Detail Pesanan" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getMockOrderById(id);
  if (!order) notFound();

  return (
    <section className="max-w-4xl space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/orders"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Kembali ke Pesanan
        </Link>
        <h1 className="font-heading text-3xl">{order.orderNumber}</h1>
        <p className="text-sm text-muted-foreground">
          Dibuat {formatDateTimeID(order.createdAt)}
        </p>
      </div>

      <Card>
        <CardContent className="py-2">
          <OrderStatusSelect initialStatus={order.status} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-1 text-sm">
            <p className="font-heading text-base">Pelanggan</p>
            <p>{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 text-sm">
            <p className="font-heading text-base">Alamat Pengiriman</p>
            <p>{order.shippingAddress}</p>
            <p className="text-muted-foreground">
              {order.shippingCity} {order.shippingPostalCode}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl">Item</h2>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((it) => {
                const product = getMockProductById(it.productId);
                return (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium text-foreground">
                      {product?.name ?? it.productId}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(it.priceAtPurchase)}
                    </TableCell>
                    <TableCell className="text-right">{it.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatIDR(it.priceAtPurchase * it.quantity)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatIDR(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ongkos Kirim</span>
          <span>{formatIDR(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 font-medium">
          <span>Total</span>
          <span className="text-terracotta">{formatIDR(order.total)}</span>
        </div>
      </div>
    </section>
  );
}
