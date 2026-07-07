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
    <div className="space-y-4 rounded-3xl bg-primary p-6 text-primary-foreground shadow-soft">
      <h2 className="font-heading text-xl">Ringkasan</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-primary-foreground/75">
          <span>Subtotal</span>
          <span className="tabular-nums text-primary-foreground">
            {formatIDR(subtotal)}
          </span>
        </div>
        {shippingCost !== undefined && (
          <div className="flex justify-between text-primary-foreground/75">
            <span>Ongkos Kirim</span>
            <span className="tabular-nums text-primary-foreground">
              {shippingCost > 0 ? formatIDR(shippingCost) : "—"}
            </span>
          </div>
        )}
      </div>
      <Separator className="bg-primary-foreground/20" />
      <div className="flex justify-between font-heading text-lg">
        <span>Total</span>
        <span className="tabular-nums">{formatIDR(total)}</span>
      </div>
      {children}
    </div>
  );
}
