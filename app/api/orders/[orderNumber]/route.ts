import { NextResponse, type NextRequest } from "next/server";
import { getOrderByNumber } from "@/db/repo";

// GET /api/orders/[orderNumber] — public, but credential-gated. Requires either
// the opaque `token` from the confirmation link or a matching `phone`. Without
// one, returns 404 — so the sequential order number alone can't enumerate
// customer PII (closes the prior IDOR).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const token = req.nextUrl.searchParams.get("token") ?? undefined;
  const phone = req.nextUrl.searchParams.get("phone") ?? undefined;

  const order = await getOrderByNumber(orderNumber, { token, phone });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}
