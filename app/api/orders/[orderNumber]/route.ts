import { NextResponse, type NextRequest } from "next/server";
import { getOrderByNumber } from "@/db/repo";

// GET /api/orders/[orderNumber] — public (order number + phone lookup).
// Customer order status lookup, optionally gated by matching phone number.
//
// DEMO LIMITATION (accepted for v1): order numbers are sequential/guessable
// (KS-YYYYMMDD-NNNN) and `phone` is optional, so orders are enumerable — an
// IDOR exposing customer PII. Fine for the demo (test data only). TODO before
// launch: require `phone`, OR use an opaque non-sequential order token in the
// confirmation URL and lookups.
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
