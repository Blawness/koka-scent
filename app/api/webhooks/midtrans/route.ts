import { NextResponse } from "next/server";
import {
  verifyMidtransSignature,
  type MidtransNotification,
} from "@/lib/midtrans";

// POST /api/webhooks/midtrans — signature-verified. Midtrans payment
// notification updates Order.status. STUB: verification always fails until the
// provider is confirmed and lib/midtrans is implemented (Sections 3, 10).
export async function POST(req: Request) {
  const notification = (await req
    .json()
    .catch(() => null)) as MidtransNotification | null;

  if (!notification) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: implement real signature verification in lib/midtrans.
  if (!verifyMidtransSignature(notification)) {
    return NextResponse.json(
      { error: "Signature verification not implemented" },
      { status: 501 },
    );
  }

  // TODO: map transaction_status → Order.status and update Supabase.
  return NextResponse.json({ received: true });
}
