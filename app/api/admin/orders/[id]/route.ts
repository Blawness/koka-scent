import { NextResponse } from "next/server";
import type { OrderStatus } from "@/types";

// TODO: replace with real Supabase Auth admin check (Feature 4).
async function requireAdmin(): Promise<boolean> {
  return true; // STUB.
}

// PUT /api/admin/orders/[id] — admin. Update order status. STUB: echoes input.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: OrderStatus };
  // TODO: validate status transition + update in Supabase.
  return NextResponse.json({ data: { id, status: body.status ?? "pending" } });
}
