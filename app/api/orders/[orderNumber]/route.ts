import { NextResponse, type NextRequest } from "next/server";
import { getOrderByNumber } from "@/db/repo";

// GET /api/orders/[orderNumber] — public (order number + phone lookup).
// Customer order status lookup, optionally gated by matching phone number.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const phone = req.nextUrl.searchParams.get("phone") ?? undefined;

  const order = await getOrderByNumber(orderNumber, phone);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}
