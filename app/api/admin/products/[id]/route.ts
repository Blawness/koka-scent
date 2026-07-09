import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { productInputSchema } from "@/lib/validation/product";
import { updateProduct } from "@/db/repo";

// PUT /api/admin/products/[id] — update product. The payload carries isActive,
// so deactivation needs no separate route.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  await updateProduct(id, parsed.data);
  return NextResponse.json({ data: { id } });
}
