import { NextResponse } from "next/server";
import { seedProducts } from "@/db/seed-data";

// TODO: replace with real Supabase Auth admin check (Feature 4).
// Every /api/admin/* handler must be gated behind this.
async function requireAdmin(): Promise<boolean> {
  return true; // STUB: allow all during scaffolding.
}

// GET /api/admin/products — admin. List all products (incl. inactive).
// STUB: reads in-repo seed data directly (admin data layer is out of scope
// for this task; not backed by db/repo.ts yet).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: seedProducts });
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
