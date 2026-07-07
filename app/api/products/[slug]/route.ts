import { NextResponse } from "next/server";
import { dummyProducts } from "@/lib/dummy-data";

// GET /api/products/[slug] — public. Single product detail.
// STUB: returns dummy data. TODO: query Supabase.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}
