import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { verifySession } from "@/lib/dal";
import { signOut } from "@/auth";

/**
 * Admin shell — sidebar + user footer. Auth display only: the real per-page
 * gate is requireAdmin() in each page (layouts don't re-render on client-side
 * navigation, so they must not be the authorization check).
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySession();

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="font-heading text-lg">Koka Admin</span>
          <ThemeToggle />
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-sidebar-border px-4 py-3 text-xs">
          <p className="font-medium text-sidebar-foreground">
            {user?.name ?? "Admin"}
          </p>
          {user?.email && (
            <p className="text-sidebar-foreground/70">{user.email}</p>
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="mt-2 text-terracotta hover:underline"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
