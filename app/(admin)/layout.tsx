import Link from "next/link";

/**
 * Admin shell — placeholder. TODO: gate behind Supabase Auth (single `admin`
 * role, Feature 4). No auth wired yet.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <aside className="w-56 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="px-4 py-4 font-heading text-lg">Koka Admin</div>
        <nav className="flex flex-col gap-1 px-2 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 hover:bg-sidebar-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="rounded-md px-3 py-2 hover:bg-sidebar-accent"
          >
            Produk
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-md px-3 py-2 hover:bg-sidebar-accent"
          >
            Pesanan
          </Link>
        </nav>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
