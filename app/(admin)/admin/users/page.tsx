import type { Metadata } from "next";
import { UsersManager } from "@/components/admin/users-manager";
import { requirePermission } from "@/lib/dal";
import { listAdminUsers } from "@/db/repo";

export const metadata: Metadata = { title: "Pengguna" };

export default async function AdminUsersPage() {
  const user = await requirePermission("users:manage");
  const users = await listAdminUsers();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl">Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Kelola akun admin dan perannya. Admin punya akses penuh; staf tidak
          bisa mengubah katalog produk atau mengelola pengguna.
        </p>
      </div>
      <UsersManager
        currentEmail={user.email ?? ""}
        initialUsers={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </section>
  );
}
