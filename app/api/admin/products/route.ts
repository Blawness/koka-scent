import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { productInputSchema } from "@/lib/validation/product";
import { createProduct, listAllProducts } from "@/db/repo";

// GET /api/admin/products — list all products (incl. inactive).
export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: await listAllProducts() });
}

// POST /api/admin/products — create product.
export async function POST(req: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const id = await createProduct(parsed.data);
  return NextResponse.json({ data: { id } }, { status: 201 });
}
