import { NextResponse, type NextRequest } from "next/server";
import { listActiveProducts } from "@/db/repo";
import type { ProductCategory } from "@/types";

const VALID_CATEGORIES: ProductCategory[] = [
  "unisex",
  "wanita",
  "pria",
  "diffuser",
];

function isProductCategory(value: string | null): value is ProductCategory {
  return VALID_CATEGORIES.includes(value as ProductCategory);
}

// GET /api/products — public. List active products, filter by category.
export async function GET(req: NextRequest) {
  const categoryParam = req.nextUrl.searchParams.get("category");
  const category = isProductCategory(categoryParam) ? categoryParam : undefined;

  const products = await listActiveProducts(category);

  return NextResponse.json({ data: products });
}
