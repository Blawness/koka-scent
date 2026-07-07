import { NextResponse, type NextRequest } from "next/server";
import { dummyOrders } from "@/lib/dummy-data";
import type { OrderStatus } from "@/types";

// TODO: replace with real Supabase Auth admin check (Feature 4).
async function requireAdmin(): Promise<boolean> {
  return true; // STUB.
}

// GET /api/admin/orders — admin. List/filter orders. STUB: dummy data.
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status") as OrderStatus | null;

  let orders = dummyOrders;
  if (status) {
    orders = orders.filter((o) => o.status === status);
  }
  return NextResponse.json({ data: orders });
}
