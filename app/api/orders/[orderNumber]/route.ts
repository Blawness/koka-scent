import { NextResponse, type NextRequest } from "next/server";
import { dummyOrders } from "@/lib/dummy-data";

// GET /api/orders/[orderNumber] — public (order number + phone lookup).
// Customer order status lookup. STUB: returns dummy data. TODO: Supabase query
// gated by matching phone number.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const phone = req.nextUrl.searchParams.get("phone");

  const order = dummyOrders.find((o) => o.orderNumber === orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // TODO: enforce phone match against the stored order.
  if (phone && order.customerPhone !== phone) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}
