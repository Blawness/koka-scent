"use client";

import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Checkout contact + shipping-address fields — react-hook-form + zod.
export const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor telepon tidak valid")
    .max(15, "Nomor telepon tidak valid")
    .regex(/^[0-9+ -]+$/, "Nomor telepon tidak valid"),
  address: z.string().trim().min(1, "Alamat wajib diisi"),
  city: z.string().trim().min(1, "Kota wajib diisi"),
  postal: z
    .string()
    .trim()
    .min(4, "Kode pos tidak valid")
    .max(6, "Kode pos tidak valid")
    .regex(/^[0-9]+$/, "Kode pos hanya berisi angka"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm({
  form,
}: {
  form: UseFormReturn<CheckoutFormValues>;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h2 className="font-heading text-lg text-foreground">
        Data Penerima
      </h2>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Lengkap</FormLabel>
            <FormControl>
              <Input placeholder="Nama penerima" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Telepon</FormLabel>
            <FormControl>
              <Input placeholder="08xxxxxxxxxx" inputMode="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl>
              <Input placeholder="Nama jalan, nomor rumah, RT/RW" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota</FormLabel>
              <FormControl>
                <Input placeholder="Jakarta Selatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Pos</FormLabel>
              <FormControl>
                <Input
                  placeholder="12345"
                  inputMode="numeric"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
