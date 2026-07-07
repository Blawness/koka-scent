import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/lib/format";
import type { CartItem } from "@/stores/cart-store";

// Order review inside checkout — cart line items (read-only) + totals +
// submit button. Distinct from CartSummary (which is used on /cart and only
// shows the subtotal figure).
export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  submitting,
  submitDisabled,
}: {
  items: CartItem[];
  subtotal: number;
  shippingCost: number | null;
  submitting: boolean;
  submitDisabled: boolean;
}) {
  const total = subtotal + (shippingCost ?? 0);

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-heading text-xl text-foreground">Pesanan Anda</h2>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId ?? "base"}`}
            className="flex items-center gap-3 text-sm"
          >
            <div className="plinth relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.variantLabel ? `${item.variantLabel} · ` : ""}
                {item.quantity} x {formatIDR(item.price)}
              </p>
            </div>
            <p className="shrink-0 tabular-nums text-foreground">
              {formatIDR(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums text-foreground">
            {formatIDR(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Ongkos Kirim</span>
          <span className="tabular-nums text-foreground">
            {shippingCost !== null ? formatIDR(shippingCost) : "—"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-heading text-lg text-foreground">
        <span>Total</span>
        <span className="tabular-nums text-terracotta">
          {formatIDR(total)}
        </span>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={submitDisabled || submitting}
      >
        {submitting ? "Memproses…" : "Bayar"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Demo — belum ada pembayaran nyata yang diproses.
      </p>
    </div>
  );
}
