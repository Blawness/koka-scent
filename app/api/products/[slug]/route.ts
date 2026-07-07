import { NextResponse } from "next/server";
import { getProductBySlug } from "@/db/repo";

// GET /api/products/[slug] — public. Single product detail.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}
