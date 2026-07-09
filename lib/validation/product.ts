// One schema per entity, used twice: client-side via react-hook-form and again
// inside the Server Action. The server never trusts the client.

import { z } from "zod";

export const productVariantSchema = z.object({
  label: z.string().min(1, "Label varian wajib diisi"),
  priceOverride: z.number().int().positive().nullable(),
  stock: z.number().int().min(0),
});

export const productInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, tanda -"),
  category: z.enum(["unisex", "wanita", "pria", "diffuser"]),
  price: z.number().int().positive("Harga harus lebih dari 0"),
  stock: z.number().int().min(0),
  notesTop: z.string(),
  notesMiddle: z.string(),
  notesBase: z.string(),
  isActive: z.boolean(),
  images: z.array(z.string().min(1)),
  variants: z.array(productVariantSchema),
});

export type ProductInputValues = z.infer<typeof productInputSchema>;
