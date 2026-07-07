import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/lib/format";

export function CartSummary({
  subtotal,
  shippingCost,
  children,
}: {
  subtotal: number;
  shippingCost?: number;
  children?: React.ReactNode;
}) {
  const total = subtotal + (shippingCost ?? 0);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h2 className="font-heading text-lg text-foreground">Ringkasan</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums text-foreground">
            {formatIDR(subtotal)}
          </span>
        </div>
        {shippingCost !== undefined && (
          <div className="flex justify-between text-muted-foreground">
            <span>Ongkos Kirim</span>
            <span className="tabular-nums text-foreground">
              {shippingCost > 0 ? formatIDR(shippingCost) : "—"}
            </span>
          </div>
        )}
      </div>
      <Separator />
      <div className="flex justify-between font-medium text-foreground">
        <span>Total</span>
        <span className="tabular-nums">{formatIDR(total)}</span>
      </div>
      {children}
    </div>
  );
}
