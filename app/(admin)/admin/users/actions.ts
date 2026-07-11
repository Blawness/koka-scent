"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { can, type Role } from "@/lib/rbac";
import { hashPassword } from "@/lib/auth/password";
import {
  countActiveAdmins,
  createAdminUser,
  deleteAdminUser,
  getAdminByEmail,
  getAdminById,
  updateAdminRole,
} from "@/db/repo";

export type UserActionResult = { ok?: true; error?: string };

const NO_ACCESS = "Anda tidak memiliki akses untuk mengelola pengguna.";

type ManageGate =
  | { error: string; user?: undefined }
  | { error?: undefined; user: Awaited<ReturnType<typeof requireAdmin>> };

/** Auth + "users:manage" gate. Returns { user } or { error }. */
async function requireUserManage(): Promise<ManageGate> {
  const user = await requireAdmin();
  if (!can(user.role, "users:manage")) return { error: NO_ACCESS };
  return { user };
}

const roleSchema = z.enum(["admin", "staff"]);

const createSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  role: roleSchema,
});

export async function createUserAction(
  input: unknown,
): Promise<UserActionResult> {
  const gate = await requireUserManage();
  if (!gate.user) return { error: gate.error };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const { name, email, password, role } = parsed.data;

  if (await getAdminByEmail(email)) {
    return { error: "Email tersebut sudah terdaftar." };
  }

  try {
    await createAdminUser({
      email,
      name,
      role,
      passwordHash: await hashPassword(password),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat pengguna" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserRoleAction(
  id: string,
  role: unknown,
): Promise<UserActionResult> {
  const gate = await requireUserManage();
  if (!gate.user) return { error: gate.error };

  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) return { error: "Peran tidak valid" };
  const nextRole: Role = parsedRole.data;

  const target = await getAdminById(id);
  if (!target) return { error: "Pengguna tidak ditemukan." };

  // Demoting the final admin would lock everyone out of user management.
  const demotingAdmin = target.role !== "staff" && nextRole === "staff";
  if (demotingAdmin && (await countActiveAdmins()) <= 1) {
    return { error: "Tidak bisa menurunkan admin terakhir." };
  }

  try {
    await updateAdminRole(id, nextRole);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui peran" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUserAction(id: string): Promise<UserActionResult> {
  const gate = await requireUserManage();
  if (!gate.user) return { error: gate.error };

  const target = await getAdminById(id);
  if (!target) return { error: "Pengguna tidak ditemukan." };

  if (target.email === gate.user.email) {
    return { error: "Tidak bisa menghapus akun Anda sendiri." };
  }
  if (target.role !== "staff" && (await countActiveAdmins()) <= 1) {
    return { error: "Tidak bisa menghapus admin terakhir." };
  }

  try {
    await deleteAdminUser(id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menghapus pengguna" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}
