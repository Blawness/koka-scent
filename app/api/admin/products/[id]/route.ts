import { NextResponse } from "next/server";

// TODO: replace with real Supabase Auth admin check (Feature 4).
async function requireAdmin(): Promise<boolean> {
  return true; // STUB.
}

// PUT /api/admin/products/[id] — admin. Update product. STUB: echoes input.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  // TODO: validate + update in Supabase.
  return NextResponse.json({ data: { id, ...body } });
}
