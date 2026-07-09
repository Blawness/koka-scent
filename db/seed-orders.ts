// Demo orders for the admin screens. Idempotent: clears prior demo orders
// (identified by the @example.com customer email) before inserting.
// Usage: pnpm db:seed-orders
//
// Dates are relative to now so the dashboard's "today"/"this week" tiles show
// meaningful counts whenever the script is run.

import { inArray, like } from "drizzle-orm";
import { db } from "./client";
import { orderItems, orders, products } from "./schema";
import type { OrderStatus } from "@/types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

type DemoItem = { slug: string; quantity: number };
type DemoOrder = {
  customerName: string;
  city: string;
  postal: string;
  address: string;
  phone: string;
  shippingCost: number;
  status: OrderStatus;
  createdAt: Date;
  items: DemoItem[];
};

function daysAgo(d: number, h = 0): Date {
  return new Date(Date.now() - d * DAY - h * HOUR);
}

const DEMO: DemoOrder[] = [
  {
    customerName: "Andi Pratama",
    city: "Jakarta Selatan",
    postal: "12160",
    address: "Jl. Melati No. 12, Kebayoran Baru",
    phone: "0812-3456-7890",
    shippingCost: 20000,
    status: "pending",
    createdAt: daysAgo(0, 1),
    items: [{ slug: "sakura-senja", quantity: 1 }],
  },
  {
    customerName: "Siti Rahma",
    city: "Bandung",
    postal: "40115",
    address: "Jl. Anggrek Raya No. 5",
    phone: "0813-2233-4455",
    shippingCost: 25000,
    status: "paid",
    createdAt: daysAgo(0, 3),
    items: [
      { slug: "yuzu-embun", quantity: 2 },
      { slug: "diffuser-bambu-hutan", quantity: 1 },
    ],
  },
  {
    customerName: "Budi Santoso",
    city: "Semarang",
    postal: "50241",
    address: "Jl. Diponegoro No. 88",
    phone: "0857-6677-8899",
    shippingCost: 22000,
    status: "processing",
    createdAt: daysAgo(1),
    items: [
      { slug: "kayu-manis-malam", quantity: 1 },
      { slug: "cendana-senja", quantity: 1 },
    ],
  },
  {
    customerName: "Dewi Lestari",
    city: "Surabaya",
    postal: "60174",
    address: "Jl. Gajah Mada No. 21",
    phone: "0821-1122-3344",
    shippingCost: 20000,
    status: "shipped",
    createdAt: daysAgo(2),
    items: [{ slug: "melati-tengah-malam", quantity: 1 }],
  },
  {
    customerName: "Rizky Hidayat",
    city: "Yogyakarta",
    postal: "55223",
    address: "Jl. Sudirman No. 3",
    phone: "0838-9988-7766",
    shippingCost: 30000,
    status: "completed",
    createdAt: daysAgo(8),
    items: [{ slug: "sakura-senja", quantity: 3 }],
  },
  {
    customerName: "Fajar Nugroho",
    city: "Malang",
    postal: "65119",
    address: "Jl. Pahlawan No. 47",
    phone: "0819-3344-5566",
    shippingCost: 18000,
    status: "cancelled",
    createdAt: daysAgo(9),
    items: [{ slug: "yuzu-embun", quantity: 1 }],
  },
];

function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
}

async function main() {
  if (!db) {
    console.error("[db:seed-orders] DATABASE_URL is not set.");
    process.exit(1);
  }

  // Clear prior demo orders (items cascade on order delete).
  const prior = await db
    .select({ id: orders.id })
    .from(orders)
    .where(like(orders.customerEmail, "%@example.com"));
  if (prior.length > 0) {
    await db.delete(orders).where(
      inArray(
        orders.id,
        prior.map((o) => o.id),
      ),
    );
  }

  const allProducts = await db.select().from(products);
  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));

  let seq = 0;
  for (const o of DEMO) {
    const built = o.items.map((it) => {
      const p = bySlug.get(it.slug);
      if (!p) throw new Error(`Unknown product slug: ${it.slug}`);
      return { productId: p.id, price: p.price, quantity: it.quantity };
    });
    const subtotal = built.reduce((s, b) => s + b.price * b.quantity, 0);
    const y = o.createdAt.getUTCFullYear();
    const m = String(o.createdAt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(o.createdAt.getUTCDate()).padStart(2, "0");
    const orderNumber = `KS-${y}${m}${d}-${String(++seq).padStart(4, "0")}`;

    const [row] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: o.customerName,
        customerEmail: emailFor(o.customerName),
        customerPhone: o.phone,
        shippingAddress: o.address,
        shippingCity: o.city,
        shippingPostalCode: o.postal,
        shippingCost: o.shippingCost,
        subtotal,
        total: subtotal + o.shippingCost,
        status: o.status,
        createdAt: o.createdAt,
        updatedAt: o.createdAt,
      })
      .returning({ id: orders.id });

    await db.insert(orderItems).values(
      built.map((b) => ({
        orderId: row.id,
        productId: b.productId,
        variantId: null,
        quantity: b.quantity,
        priceAtPurchase: b.price,
      })),
    );
  }

  console.log(`[db:seed-orders] inserted ${DEMO.length} demo orders.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[db:seed-orders] failed:", err);
  process.exit(1);
});
