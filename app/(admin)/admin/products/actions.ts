"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { can } from "@/lib/rbac";
import { productInputSchema } from "@/lib/validation/product";
import {
  createProduct,
  setProductActive,
  updateProduct,
} from "@/db/repo";

export type ProductActionResult = { ok?: true; error?: string };

const NO_ACCESS = "Anda tidak memiliki akses untuk mengubah produk.";

/** Auth + "products:write" gate. Returns the error string if denied, else null. */
async function requireProductWrite(): Promise<string | null> {
  const user = await requireAdmin();
  return can(user.role, "products:write") ? null : NO_ACCESS;
}

export async function createProductAction(
  input: unknown,
): Promise<ProductActionResult> {
  const denied = await requireProductWrite();
  if (denied) return { error: denied };
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  try {
    await createProduct(parsed.data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat produk" };
  }
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateProductAction(
  id: string,
  input: unknown,
): Promise<ProductActionResult> {
  const denied = await requireProductWrite();
  if (denied) return { error: denied };
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  try {
    await updateProduct(id, parsed.data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan produk" };
  }
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function setProductActiveAction(
  id: string,
  isActive: boolean,
): Promise<ProductActionResult> {
  const denied = await requireProductWrite();
  if (denied) return { error: denied };
  try {
    await setProductActive(id, isActive);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui status" };
  }
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}
