import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: "outline",
  paid: "secondary",
  processing: "secondary",
  shipped: "default",
  completed: "default",
  cancelled: "destructive",
  failed: "destructive",
  expired: "destructive",
};

/** Order status rendered as an Indonesian-labelled badge. */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
