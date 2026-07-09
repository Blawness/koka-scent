// Mock data for the visual-only admin phase. No database. Single source of
// truth so screens stay coherent (a product in the list is the same product in
// the form; an order in the list opens as the same order in detail).
//
// The dashboard summary is computed against a FIXED reference date so the demo
// always shows the same numbers regardless of when it is viewed.
// See docs/superpowers/specs/2026-07-09-admin-frontend-mock-design.md.

import { seedProducts } from "@/db/seed-data";
import type { OrderWithItems, ProductWithVariants } from "@/types";

/** Reference "now" for the mock dashboard (Thursday; week starts Mon 2026-07-06). */
export const MOCK_TODAY = "2026-07-09";
const WEEK_START = "2026-07-06"; // Monday
const WEEK_END = "2026-07-13"; // next Monday (exclusive)

export const mockProducts: ProductWithVariants[] = seedProducts;

export function getMockProductById(
  id: string,
): ProductWithVariants | undefined {
  return mockProducts.find((p) => p.id === id);
}

const PID = (n: number) =>
  `10000000-0000-0000-0000-0000000000${n.toString().padStart(2, "0")}`;

// Product price lookup for building coherent line items.
const PRICE = Object.fromEntries(
  mockProducts.map((p) => [p.id, p.price]),
) as Record<string, number>;

type SeedItem = { productId: string; quantity: number };

function buildOrder(
  o: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCost: number;
    status: OrderWithItems["status"];
    createdAt: string;
  },
  items: SeedItem[],
): OrderWithItems {
  const orderId = o.orderNumber;
  const built = items.map((it, i) => ({
    id: `${orderId}-item-${i + 1}`,
    orderId,
    productId: it.productId,
    variantId: null,
    quantity: it.quantity,
    priceAtPurchase: PRICE[it.productId] ?? 0,
  }));
  const subtotal = built.reduce(
    (s, it) => s + it.priceAtPurchase * it.quantity,
    0,
  );
  return {
    id: orderId,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    userId: null,
    shippingAddress: o.shippingAddress,
    shippingCity: o.shippingCity,
    shippingPostalCode: o.shippingPostalCode,
    shippingCost: o.shippingCost,
    subtotal,
    total: subtotal + o.shippingCost,
    status: o.status,
    midtransOrderId: null,
    createdAt: o.createdAt,
    updatedAt: o.createdAt,
    items: built,
  };
}

export const mockOrders: OrderWithItems[] = [
  buildOrder(
    {
      orderNumber: "KS-20260709-0001",
      customerName: "Andi Pratama",
      customerEmail: "andi.pratama@example.com",
      customerPhone: "0812-3456-7890",
      shippingAddress: "Jl. Melati No. 12, Kebayoran Baru",
      shippingCity: "Jakarta Selatan",
      shippingPostalCode: "12160",
      shippingCost: 20000,
      status: "pending",
      createdAt: "2026-07-09T02:15:00.000Z",
    },
    [{ productId: PID(1), quantity: 1 }],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260709-0002",
      customerName: "Siti Rahma",
      customerEmail: "siti.rahma@example.com",
      customerPhone: "0813-2233-4455",
      shippingAddress: "Jl. Anggrek Raya No. 5",
      shippingCity: "Bandung",
      shippingPostalCode: "40115",
      shippingCost: 25000,
      status: "paid",
      createdAt: "2026-07-09T04:40:00.000Z",
    },
    [
      { productId: PID(3), quantity: 2 },
      { productId: PID(8), quantity: 1 },
    ],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260708-0001",
      customerName: "Budi Santoso",
      customerEmail: "budi.santoso@example.com",
      customerPhone: "0857-6677-8899",
      shippingAddress: "Jl. Diponegoro No. 88",
      shippingCity: "Semarang",
      shippingPostalCode: "50241",
      shippingCost: 22000,
      status: "processing",
      createdAt: "2026-07-08T09:05:00.000Z",
    },
    [
      { productId: PID(2), quantity: 1 },
      { productId: PID(5), quantity: 1 },
    ],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260707-0001",
      customerName: "Dewi Lestari",
      customerEmail: "dewi.lestari@example.com",
      customerPhone: "0821-1122-3344",
      shippingAddress: "Jl. Gajah Mada No. 21",
      shippingCity: "Surabaya",
      shippingPostalCode: "60174",
      shippingCost: 20000,
      status: "shipped",
      createdAt: "2026-07-07T13:20:00.000Z",
    },
    [{ productId: PID(4), quantity: 1 }],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260706-0001",
      customerName: "Rizky Hidayat",
      customerEmail: "rizky.hidayat@example.com",
      customerPhone: "0838-9988-7766",
      shippingAddress: "Jl. Sudirman No. 3",
      shippingCity: "Yogyakarta",
      shippingPostalCode: "55223",
      shippingCost: 30000,
      status: "completed",
      createdAt: "2026-07-06T01:10:00.000Z",
    },
    [{ productId: PID(1), quantity: 3 }],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260703-0001",
      customerName: "Maya Putri",
      customerEmail: "maya.putri@example.com",
      customerPhone: "0812-5566-7788",
      shippingAddress: "Jl. Cendana No. 9",
      shippingCity: "Medan",
      shippingPostalCode: "20152",
      shippingCost: 20000,
      status: "completed",
      createdAt: "2026-07-03T07:45:00.000Z",
    },
    [{ productId: PID(5), quantity: 1 }],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260702-0001",
      customerName: "Fajar Nugroho",
      customerEmail: "fajar.nugroho@example.com",
      customerPhone: "0819-3344-5566",
      shippingAddress: "Jl. Pahlawan No. 47",
      shippingCity: "Malang",
      shippingPostalCode: "65119",
      shippingCost: 18000,
      status: "cancelled",
      createdAt: "2026-07-02T10:30:00.000Z",
    },
    [{ productId: PID(3), quantity: 1 }],
  ),
  buildOrder(
    {
      orderNumber: "KS-20260701-0001",
      customerName: "Indah Permata",
      customerEmail: "indah.permata@example.com",
      customerPhone: "0822-7788-9900",
      shippingAddress: "Jl. Merdeka No. 15",
      shippingCity: "Denpasar",
      shippingPostalCode: "80113",
      shippingCost: 25000,
      status: "paid",
      createdAt: "2026-07-01T05:00:00.000Z",
    },
    [{ productId: PID(4), quantity: 2 }],
  ),
];

export function getMockOrderById(id: string): OrderWithItems | undefined {
  return mockOrders.find((o) => o.id === id || o.orderNumber === id);
}

const REVENUE_STATUSES = new Set(["paid", "processing", "shipped", "completed"]);

export type DashboardSummary = {
  ordersToday: number;
  ordersThisWeek: number;
  revenueThisWeek: number;
  lowStock: ProductWithVariants[];
};

/** Derived from the mock arrays against the fixed reference date. */
export function getMockDashboardSummary(): DashboardSummary {
  const day = (iso: string) => iso.slice(0, 10);
  const inWeek = (iso: string) => day(iso) >= WEEK_START && day(iso) < WEEK_END;

  const ordersToday = mockOrders.filter(
    (o) => day(o.createdAt) === MOCK_TODAY,
  ).length;
  const thisWeek = mockOrders.filter((o) => inWeek(o.createdAt));
  const revenueThisWeek = thisWeek
    .filter((o) => REVENUE_STATUSES.has(o.status))
    .reduce((s, o) => s + o.total, 0);
  const lowStock = mockProducts.filter((p) => p.isActive && p.stock < 5);

  return {
    ordersToday,
    ordersThisWeek: thisWeek.length,
    revenueThisWeek,
    lowStock,
  };
}
