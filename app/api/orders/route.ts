import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/db/repo";

// POST /api/orders — public. Create order (status `pending`). No payment
// call — demo checkout only persists the order.
//
// The client sends product/variant/quantity only. Prices, subtotal, and total
// are computed server-side from trusted product data (never from the request).
const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postal: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  shippingCost: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, phone, address, city, postal, items, shippingCost } =
    parsed.data;

  let result;
  try {
    result = await createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      shippingCity: city,
      shippingPostalCode: postal,
      shippingCost,
      items,
    });
  } catch (e) {
    // Invalid/inactive product or variant — reject rather than persisting.
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal membuat pesanan" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      data: {
        orderNumber: result.orderNumber,
        status: result.status,
        token: result.accessToken,
      },
    },
    { status: 201 },
  );
}
