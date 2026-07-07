"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderConfirmation } from "@/components/storefront/order-confirmation";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  if (!orderNumber) {
    return (
      <section className="py-16 text-center">
        <p className="text-foreground">Nomor pesanan tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg">
      <OrderConfirmation orderNumber={orderNumber} />
    </section>
  );
}

// Order confirmation — reads ?order= from the checkout redirect and looks up
// the order via GET /api/orders/[orderNumber].
export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
