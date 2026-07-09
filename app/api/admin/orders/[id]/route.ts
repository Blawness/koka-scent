import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { updateOrderStatus } from "@/db/repo";

const bodySchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "completed",
    "cancelled",
    "failed",
    "expired",
  ]),
});

// PUT /api/admin/orders/[id] — update order status. Illegal transitions are
// rejected at the repo layer (400), not just hidden in the UI.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  try {
    await updateOrderStatus(id, parsed.data.status);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 400 },
    );
  }
  return NextResponse.json({ data: { id, status: parsed.data.status } });
}
