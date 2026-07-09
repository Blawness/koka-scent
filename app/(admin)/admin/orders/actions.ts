"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { updateOrderStatus } from "@/db/repo";

const statusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "failed",
  "expired",
]);

export type OrderActionResult = { ok?: true; error?: string };

export async function updateOrderStatusAction(
  id: string,
  status: unknown,
): Promise<OrderActionResult> {
  await requireAdmin();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Status tidak valid" };

  try {
    // The repo rejects illegal transitions — hiding options in the UI is a
    // convenience; this is the control.
    await updateOrderStatus(id, parsed.data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui status" };
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}
