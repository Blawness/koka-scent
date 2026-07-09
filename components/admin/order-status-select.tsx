"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/app/(admin)/admin/orders/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";
import { nextStatuses, STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

/**
 * Order status control — offers only legal forward transitions (+ cancel) via
 * `nextStatuses()`. Mock phase: applying only updates local state and toasts.
 */
export function OrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [pending, setPending] = useState<OrderStatus | "">("");
  const [saving, startTransition] = useTransition();

  const options = nextStatuses(status);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status saat ini:</span>
        <StatusBadge status={status} />
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Status ini final — tidak ada perubahan lebih lanjut.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={pending}
            onValueChange={(v) => setPending(v as OrderStatus)}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Ubah status ke…" />
            </SelectTrigger>
            <SelectContent>
              {options.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!pending || saving}
            onClick={() => {
              if (!pending) return;
              const target = pending;
              startTransition(async () => {
                const res = await updateOrderStatusAction(orderId, target);
                if (res.error) {
                  toast.error(res.error);
                  return;
                }
                setStatus(target);
                setPending("");
                toast.success(`Status diubah ke "${STATUS_LABEL[target]}"`);
              });
            }}
          >
            {saving ? "Menyimpan…" : "Perbarui"}
          </Button>
        </div>
      )}
    </div>
  );
}
