import { NextResponse } from "next/server";
import { dummyProducts } from "@/lib/dummy-data";

// TODO: replace with real Supabase Auth admin check (Feature 4).
// Every /api/admin/* handler must be gated behind this.
async function requireAdmin(): Promise<boolean> {
  return true; // STUB: allow all during scaffolding.
}

// GET /api/admin/products — admin. List all products (incl. inactive).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: dummyProducts });
}

// POST /api/admin/products — admin. Create product. STUB: echoes input.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  // TODO: validate + insert into Supabase.
  return NextResponse.json(
    { data: { id: "new-product-id", ...body } },
    { status: 201 },
  );
}
