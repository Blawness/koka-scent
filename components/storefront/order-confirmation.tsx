"use client";

import { useEffect, useState } from "react";
import { CircleCheck, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIDR } from "@/lib/format";
import type { OrderWithItems } from "@/types";

const WHATSAPP_NUMBER = "6281234567890"; // placeholder demo number

const STATUS_LABELS: Record<OrderWithItems["status"], string> = {
  pending: "Menunggu Konfirmasi",
  paid: "Sudah Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};

export function OrderConfirmation({
  orderNumber,
  token,
}: {
  orderNumber: string;
  token?: string | null;
}) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    fetch(`/api/orders/${orderNumber}${qs}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        const body = (await res.json()) as { data: OrderWithItems };
        if (cancelled) return;
        setOrder(body.data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [orderNumber, token]);

  if (status === "loading") {
    return (
      <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (status === "error" || !order) {
    return (
      <div className="space-y-2 rounded-3xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          Pesanan tidak ditemukan untuk nomor{" "}
          <span className="font-medium">{orderNumber}</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          Periksa kembali tautan konfirmasi Anda.
        </p>
      </div>
    );
  }

  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const waMessage = encodeURIComponent(
    `Halo Koka Scent, saya ingin menanyakan pesanan ${order.orderNumber}.`,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleCheck className="size-14 text-terracotta" strokeWidth={1.5} />
        <h1 className="font-heading text-2xl text-foreground">
          Pesanan Diterima
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Terima kasih, {order.customerName}. Pesanan Anda telah kami catat
          dengan status{" "}
          <span className="font-medium text-foreground">
            {STATUS_LABELS[order.status]}
          </span>
          .
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Nomor Pesanan
          </p>
          <p className="display-number py-2 text-2xl break-all text-terracotta sm:text-4xl lg:text-5xl">
            {order.orderNumber}
          </p>
        </div>

        <Separator className="my-6" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Jumlah Produk</dt>
            <dd className="text-foreground">{totalUnits} item</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums text-foreground">
              {formatIDR(order.subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Ongkos Kirim</dt>
            <dd className="tabular-nums text-foreground">
              {formatIDR(order.shippingCost)}
            </dd>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <dt className="text-foreground">Total</dt>
            <dd className="tabular-nums text-foreground">
              {formatIDR(order.total)}
            </dd>
          </div>
        </dl>

        <Separator className="my-6" />

        <dl className="space-y-1 text-sm text-muted-foreground">
          <div>
            <dt className="inline text-foreground">Dikirim ke: </dt>
            <dd className="inline">
              {order.shippingAddress}, {order.shippingCity}{" "}
              {order.shippingPostalCode}
            </dd>
          </div>
          <div>
            <dt className="inline text-foreground">Telepon: </dt>
            <dd className="inline">{order.customerPhone}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
        Demo — belum ada pembayaran nyata yang diproses. Tim kami akan
        menghubungi Anda untuk konfirmasi pembayaran dan pengiriman.
      </div>

      <Button asChild size="lg" className="w-full rounded-full">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircleIcon data-icon="inline-start" />
          Hubungi via WhatsApp
        </a>
      </Button>
    </div>
  );
}
