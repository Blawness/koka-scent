import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/dal";
import { listOrders } from "@/db/repo";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "failed",
  "expired",
];

// GET /api/admin/orders — list/filter orders, server-paginated.
export async function GET(req: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sp = req.nextUrl.searchParams;
  const statusParam = sp.get("status");
  const status =
    statusParam && STATUSES.includes(statusParam as OrderStatus)
      ? (statusParam as OrderStatus)
      : undefined;
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 20));
  const offset = Math.max(0, Number(sp.get("offset")) || 0);

  const { orders, total } = await listOrders({ status, limit, offset });
  return NextResponse.json({ data: orders, total });
}
