import { NextResponse } from "next/server";
import { getShippingRates } from "@/lib/shipping";

// POST /api/shipping/cost — public. Calculate shipping cost for destination +
// cart weight. STUB: returns dummy rates via lib/shipping (Feature 2).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    destinationCity = "",
    destinationPostalCode = "",
    weightGrams = 0,
  } = body ?? {};

  const rates = await getShippingRates({
    destinationCity,
    destinationPostalCode,
    weightGrams,
  });

  return NextResponse.json({ data: rates });
}
