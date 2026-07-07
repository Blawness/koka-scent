"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import {
  CheckoutForm,
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/components/storefront/checkout-form";
import { ShippingCostBox } from "@/components/storefront/shipping-cost-box";
import { OrderSummary } from "@/components/storefront/order-summary";
import { SectionHeading } from "@/components/storefront/section-heading";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartStore } from "@/stores/cart-store";
import type { ShippingRate } from "@/lib/shipping";

// Checkout — shipping form (name/phone/address/city/postal), dynamic
// shipping cost, create order. No payment integration (Global Constraints —
// demo only persists the order as `pending`).
export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useHydrated();
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Once an order is placed we navigate to the confirmation page and clear the
  // cart. Without this flag, clearing the cart re-renders with items.length===0
  // and the empty-cart guard below would race the push and bounce the user to
  // /cart instead of the confirmation.
  const [placed, setPlaced] = useState(false);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const totalItems = useCartStore((state) => state.totalItems());
  const clear = useCartStore((state) => state.clear);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { name: "", phone: "", address: "", city: "", postal: "" },
  });

  useEffect(() => {
    if (mounted && !placed && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, placed, items.length, router]);

  const city = form.watch("city");
  const postal = form.watch("postal");

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!selectedRate) {
      toast.error("Pilih opsi pengiriman terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postal: values.postal,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
          shippingCost: selectedRate.cost,
          subtotal,
          total: subtotal + selectedRate.cost,
        }),
      });

      const body = await res.json();

      if (!res.ok || !body?.data?.orderNumber) {
        throw new Error(body?.error ?? "Gagal membuat pesanan");
      }

      setPlaced(true);
      router.push(`/checkout/confirmation?order=${body.data.orderNumber}`);
      clear();
    } catch {
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      setSubmitting(false);
    }
  };

  if (!mounted || items.length === 0) {
    return (
      <section className="space-y-6">
        <SectionHeading eyebrow="Checkout" title="Checkout" titleAs="h1" />
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <SectionHeading eyebrow="Checkout" title="Checkout" titleAs="h1" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 lg:grid-cols-3 lg:items-start"
        >
          <div className="space-y-6 lg:col-span-2">
            <CheckoutForm form={form} />
            <ShippingCostBox
              city={city}
              postal={postal}
              weightGrams={totalItems * 250}
              selected={selectedRate}
              onSelect={setSelectedRate}
            />
          </div>

          <div className="lg:sticky lg:top-24">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={selectedRate?.cost ?? null}
              submitting={submitting}
              submitDisabled={!selectedRate}
            />
          </div>
        </form>
      </Form>
    </section>
  );
}
