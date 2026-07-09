// The ONLY module that decides between Drizzle (Neon) and the in-repo seed
// data fallback. Route Handlers must import exclusively from here and never
// touch `db/client.ts` or `db/seed-data.ts` directly.
//
// When `process.env.DATABASE_URL` is set, reads/writes go through Drizzle.
// Otherwise, product reads come from `db/seed-data.ts` and orders are held in
// a module-level in-memory array — good enough for the zero-setup demo path,
// reset on every server restart.

import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { canTransition } from "@/lib/order-status";
import {
  jakartaDayStart,
  jakartaOrderPrefix,
  jakartaWeekStart,
} from "@/lib/date-window";
import { db } from "./client";
import {
  adminUsers,
  orderItems,
  orders,
  productVariants,
  products,
} from "./schema";
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
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    userId: row.userId,
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

function nextOrderNumber(prefix: string, countToday: number): string {
  return `${prefix}${String(countToday + 1).padStart(4, "0")}`;
}

/** Admin functions require a real database — no seed-data fallback. */
function requireDb(): NonNullable<typeof db> {
  if (!db) {
    throw new Error(
      "DATABASE_URL is not set. Admin operations require a database.",
    );
  }
  return db;
}

// ---------------------------------------------------------------------------
// Admin accounts (NextAuth Credentials)
// ---------------------------------------------------------------------------

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
};

export async function getAdminByEmail(
  email: string,
): Promise<AdminUser | null> {
  const database = requireDb();
  const row = await database.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });
  return row ?? null;
}

export async function createAdminUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
}): Promise<void> {
  const database = requireDb();
  await database
    .insert(adminUsers)
    .values({
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role ?? "admin",
    })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash: input.passwordHash, name: input.name },
    });
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
  customerEmail: string;
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
  const prefix = jakartaOrderPrefix(now);

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
        customerEmail: input.customerEmail,
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
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    userId: null,
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

// ---------------------------------------------------------------------------
// Admin: products (require a database — no seed-data fallback)
// ---------------------------------------------------------------------------

export type ProductVariantInput = {
  label: string;
  priceOverride: number | null;
  stock: number;
};

export type ProductInput = {
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  stock: number;
  notesTop: string;
  notesMiddle: string;
  notesBase: string;
  isActive: boolean;
  images: string[];
  variants: ProductVariantInput[];
};

export async function listAllProducts(): Promise<ProductWithVariants[]> {
  const database = requireDb();
  const rows = await database.query.products.findMany({
    with: { variants: true },
    orderBy: [desc(products.createdAt)],
  });
  return rows.map(mapProductRow);
}

export async function getProductById(
  id: string,
): Promise<ProductWithVariants | null> {
  const database = requireDb();
  const row = await database.query.products.findFirst({
    where: eq(products.id, id),
    with: { variants: true },
  });
  return row ? mapProductRow(row) : null;
}

async function replaceVariants(
  database: NonNullable<typeof db>,
  productId: string,
  variants: ProductVariantInput[],
): Promise<void> {
  await database
    .delete(productVariants)
    .where(eq(productVariants.productId, productId));
  if (variants.length > 0) {
    await database.insert(productVariants).values(
      variants.map((v) => ({
        productId,
        label: v.label,
        priceOverride: v.priceOverride,
        stock: v.stock,
      })),
    );
  }
}

export async function createProduct(input: ProductInput): Promise<string> {
  const database = requireDb();
  const [row] = await database
    .insert(products)
    .values({
      slug: input.slug,
      name: input.name,
      category: input.category,
      price: input.price,
      images: input.images,
      notesTop: input.notesTop,
      notesMiddle: input.notesMiddle,
      notesBase: input.notesBase,
      stock: input.stock,
      isActive: input.isActive,
    })
    .returning({ id: products.id });
  await replaceVariants(database, row.id, input.variants);
  return row.id;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  const database = requireDb();
  await database
    .update(products)
    .set({
      slug: input.slug,
      name: input.name,
      category: input.category,
      price: input.price,
      images: input.images,
      notesTop: input.notesTop,
      notesMiddle: input.notesMiddle,
      notesBase: input.notesBase,
      stock: input.stock,
      isActive: input.isActive,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));
  await replaceVariants(database, id, input.variants);
}

export async function setProductActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  const database = requireDb();
  await database
    .update(products)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(products.id, id));
}

// ---------------------------------------------------------------------------
// Admin: orders
// ---------------------------------------------------------------------------

export async function listOrders(opts: {
  status?: OrderStatus;
  limit: number;
  offset: number;
}): Promise<{ orders: OrderWithItems[]; total: number }> {
  const database = requireDb();
  const where = opts.status ? eq(orders.status, opts.status) : undefined;

  const rows = await database.query.orders.findMany({
    where,
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
    limit: opts.limit,
    offset: opts.offset,
  });

  const [{ count }] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(where ?? sql`true`);

  return { orders: rows.map(mapOrderRow), total: count };
}

export async function getOrderById(
  id: string,
): Promise<OrderWithItems | null> {
  const database = requireDb();
  const row = await database.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true },
  });
  return row ? mapOrderRow(row) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const database = requireDb();
  const current = await database.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { status: true },
  });
  if (!current) throw new Error("Pesanan tidak ditemukan.");
  if (!canTransition(current.status, status)) {
    throw new Error(
      `Transisi status tidak valid: ${current.status} → ${status}.`,
    );
  }
  await database
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id));
}

// ---------------------------------------------------------------------------
// Admin: dashboard summary (Asia/Jakarta windows)
// ---------------------------------------------------------------------------

const REVENUE_STATUSES: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "completed",
];

export type DashboardSummary = {
  ordersToday: number;
  ordersThisWeek: number;
  revenueThisWeek: number;
  lowStock: ProductWithVariants[];
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const database = requireDb();
  const dayStart = jakartaDayStart();
  const weekStart = jakartaWeekStart();

  const [{ count: ordersToday }] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(gte(orders.createdAt, dayStart));

  const [{ count: ordersThisWeek }] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(gte(orders.createdAt, weekStart));

  const [{ revenue }] = await database
    .select({ revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, weekStart),
        inArray(orders.status, REVENUE_STATUSES),
      ),
    );

  const lowRows = await database.query.products.findMany({
    where: and(eq(products.isActive, true), lt(products.stock, 5)),
    with: { variants: true },
    orderBy: [products.stock],
  });

  return {
    ordersToday,
    ordersThisWeek,
    revenueThisWeek: revenue,
    lowStock: lowRows.map(mapProductRow),
  };
}
