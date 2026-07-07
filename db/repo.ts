// The ONLY module that decides between Drizzle (Neon) and the in-repo seed
// data fallback. Route Handlers must import exclusively from here and never
// touch `db/client.ts` or `db/seed-data.ts` directly.
//
// When `process.env.DATABASE_URL` is set, reads/writes go through Drizzle.
// Otherwise, product reads come from `db/seed-data.ts` and orders are held in
// a module-level in-memory array — good enough for the zero-setup demo path,
// reset on every server restart.

import { and, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "./client";
import { orderItems, orders, productVariants, products } from "./schema";
import { seedProducts } from "./seed-data";
import type {
  OrderStatus,
  OrderWithItems,
  ProductCategory,
  ProductWithVariants,
} from "@/types";

// ---------------------------------------------------------------------------
// Row -> domain mappers (Drizzle rows use `Date`; domain types use ISO strings)
// ---------------------------------------------------------------------------

type ProductRow = typeof products.$inferSelect & {
  variants: (typeof productVariants.$inferSelect)[];
};

function mapProductRow(row: ProductRow): ProductWithVariants {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    images: row.images,
    notesTop: row.notesTop,
    notesMiddle: row.notesMiddle,
    notesBase: row.notesBase,
    stock: row.stock,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    variants: row.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      label: v.label,
      priceOverride: v.priceOverride,
      stock: v.stock,
    })),
  };
}

type OrderRow = typeof orders.$inferSelect & {
  items: (typeof orderItems.$inferSelect)[];
};

function mapOrderRow(row: OrderRow): OrderWithItems {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    shippingAddress: row.shippingAddress,
    shippingCity: row.shippingCity,
    shippingPostalCode: row.shippingPostalCode,
    shippingCost: row.shippingCost,
    subtotal: row.subtotal,
    total: row.total,
    status: row.status,
    midtransOrderId: row.midtransOrderId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    items: row.items.map((i) => ({
      id: i.id,
      orderId: i.orderId,
      productId: i.productId,
      variantId: i.variantId,
      quantity: i.quantity,
      priceAtPurchase: i.priceAtPurchase,
    })),
  };
}

// ---------------------------------------------------------------------------
// No-DB demo path: in-memory order store (module-level, reset on restart)
// ---------------------------------------------------------------------------

const memoryOrders: OrderWithItems[] = [];

function orderNumberPrefix(date: Date): string {
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;
  return `KS-${ymd}-`;
}

function nextOrderNumber(prefix: string, countToday: number): string {
  return `${prefix}${String(countToday + 1).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function listActiveProducts(
  category?: ProductCategory,
): Promise<ProductWithVariants[]> {
  if (db) {
    const rows = await db.query.products.findMany({
      where: category
        ? and(eq(products.isActive, true), eq(products.category, category))
        : eq(products.isActive, true),
      with: { variants: true },
    });
    return rows.map(mapProductRow);
  }

  return seedProducts.filter(
    (p) => p.isActive && (!category || p.category === category),
  );
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  if (db) {
    const row = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { variants: true },
    });
    return row ? mapProductRow(row) : null;
  }

  return seedProducts.find((p) => p.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type CreateOrderItemInput = {
  productId: string;
  variantId: string | null;
  quantity: number;
  priceAtPurchase: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  items: CreateOrderItemInput[];
};

export type CreateOrderResult = {
  orderNumber: string;
  status: OrderStatus;
};

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const now = new Date();
  const prefix = orderNumberPrefix(now);

  if (db) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(sql`${orders.orderNumber} like ${prefix + "%"}`);

    const orderNumber = nextOrderNumber(prefix, count);

    const [orderRow] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingPostalCode: input.shippingPostalCode,
        shippingCost: input.shippingCost,
        subtotal: input.subtotal,
        total: input.total,
        status: "pending",
      })
      .returning();

    if (input.items.length > 0) {
      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId: orderRow.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
      );
    }

    return { orderNumber: orderRow.orderNumber, status: orderRow.status };
  }

  const countToday = memoryOrders.filter((o) =>
    o.orderNumber.startsWith(prefix),
  ).length;
  const orderNumber = nextOrderNumber(prefix, countToday);
  const orderId = randomUUID();
  const nowIso = now.toISOString();

  const newOrder: OrderWithItems = {
    id: orderId,
    orderNumber,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    shippingCity: input.shippingCity,
    shippingPostalCode: input.shippingPostalCode,
    shippingCost: input.shippingCost,
    subtotal: input.subtotal,
    total: input.total,
    status: "pending",
    midtransOrderId: null,
    createdAt: nowIso,
    updatedAt: nowIso,
    items: input.items.map((item) => ({
      id: randomUUID(),
      orderId,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    })),
  };

  memoryOrders.push(newOrder);
  return { orderNumber, status: "pending" };
}

export async function getOrderByNumber(
  orderNumber: string,
  phone?: string,
): Promise<OrderWithItems | null> {
  if (db) {
    const row = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: { items: true },
    });
    if (!row) return null;
    if (phone && row.customerPhone !== phone) return null;
    return mapOrderRow(row);
  }

  const order = memoryOrders.find((o) => o.orderNumber === orderNumber);
  if (!order) return null;
  if (phone && order.customerPhone !== phone) return null;
  return order;
}
