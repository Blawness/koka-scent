import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * Admin shell — sidebar + topbar. Mock phase: no real auth; the signed-in user
 * is a placeholder and "Keluar" just routes to the (mock) login page.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="px-4 py-4 font-heading text-lg">Koka Admin</div>
        <AdminNav />
        <div className="mt-auto border-t border-sidebar-border px-4 py-3 text-xs">
          <p className="font-medium text-sidebar-foreground">Admin Koka</p>
          <p className="text-sidebar-foreground/70">admin@kokascent.id</p>
          <Link
            href="/admin/login"
            className="mt-2 inline-block text-terracotta hover:underline"
          >
            Keluar
          </Link>
        </div>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
