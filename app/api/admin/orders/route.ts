import { NextResponse, type NextRequest } from "next/server";
import type { OrderStatus, OrderWithItems } from "@/types";

// TODO: replace with real Supabase Auth admin check (Feature 4).
async function requireAdmin(): Promise<boolean> {
  return true; // STUB.
}

// GET /api/admin/orders — admin. List/filter orders.
// STUB: no order-listing query exists in db/repo.ts yet (out of scope for
// this task); returns an empty list until that's added.
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status") as OrderStatus | null;

  const orders: OrderWithItems[] = [];
  const filtered = status ? orders.filter((o) => o.status === status) : orders;
  return NextResponse.json({ data: filtered });
}
