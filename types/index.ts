// Data models — PRD Section 5.
// These mirror the Supabase schema in supabase/migrations.

export type ProductCategory = "unisex" | "wanita" | "pria" | "diffuser";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "failed"
  | "expired";

export type Product = {
  id: string; // UUID
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // IDR, smallest unit (no decimals)
  images: string[]; // Supabase Storage URLs
  notesTop: string;
  notesMiddle: string;
  notesBase: string;
  stock: number;
  isActive: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string; // FK → Product
  label: string; // "10ml", "50ml"
  priceOverride: number | null;
  stock: number;
};

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export type Order = {
  id: string;
  orderNumber: string; // human-readable, e.g. KS-20260707-0001
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  userId: string | null; // Neon Auth user; null for guest checkout
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  midtransOrderId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string; // FK → Order
  productId: string; // FK → Product
  variantId: string | null;
  quantity: number;
  priceAtPurchase: number;
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};
