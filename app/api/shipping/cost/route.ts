import { NextResponse } from "next/server";
import { getShippingRates, ShippingError } from "@/lib/shipping";

// POST /api/shipping/cost — public. Calculate shipping cost for destination +
// cart weight via Biteship (PRD Section 4 "Shipping Cost", Feature 2).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    destinationCity = "",
    destinationPostalCode = "",
    weightGrams = 0,
  } = body ?? {};

  if (!/^\d{5}$/.test(destinationPostalCode)) {
    return NextResponse.json(
      { error: "Kode pos harus 5 digit." },
      { status: 400 },
    );
  }
  if (typeof weightGrams !== "number" || weightGrams <= 0) {
    return NextResponse.json(
      { error: "Berat paket harus lebih dari 0 gram." },
      { status: 400 },
    );
  }

  try {
    const rates = await getShippingRates({
      destinationCity,
      destinationPostalCode,
      weightGrams,
    });
    return NextResponse.json({ data: rates });
  } catch (err) {
    if (err instanceof ShippingError) {
      const status = err.kind === "missing_config" ? 500 : 502;
      return NextResponse.json({ error: err.message }, { status });
    }
    console.error("shipping cost failed", err);
    return NextResponse.json(
      { error: "Gagal menghitung ongkir. Coba lagi." },
      { status: 500 },
    );
  }
}
