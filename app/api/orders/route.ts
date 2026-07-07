import { NextResponse } from "next/server";
import { createSnapTransaction } from "@/lib/midtrans";
import { generateOrderNumber } from "@/lib/dummy-data";

// POST /api/orders — public. Create order (status `pending`), return Midtrans
// Snap token. STUB: does not persist; payment provider not finalised
// (Section 10). TODO: insert Order + OrderItems into Supabase, real Snap token.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const orderNumber = generateOrderNumber(1);
  const total = Number(body?.total ?? 0);

  // TODO: persist order (status "pending") before returning the payment token.
  const snap = await createSnapTransaction({
    orderId: orderNumber,
    grossAmount: total,
    customerName: body?.customerName ?? "",
    customerPhone: body?.customerPhone ?? "",
  });

  return NextResponse.json(
    {
      data: {
        orderNumber,
        status: "pending",
        snapToken: snap.token,
        redirectUrl: snap.redirectUrl,
      },
    },
    { status: 201 },
  );
}
