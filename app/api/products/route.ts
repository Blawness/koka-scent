import { NextResponse, type NextRequest } from "next/server";
import { dummyProducts } from "@/lib/dummy-data";
import type { ProductCategory } from "@/types";

// GET /api/products — public. List active products, filter by category.
// STUB: returns dummy data. TODO: query Supabase.
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") as
    | ProductCategory
    | null;

  let products = dummyProducts.filter((p) => p.isActive);
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  return NextResponse.json({ data: products });
}
