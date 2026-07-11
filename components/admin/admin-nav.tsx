"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { can, type Permission } from "@/lib/rbac";

const LINKS: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
  requires?: Permission;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produk", icon: Package, exact: false },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag, exact: false },
  {
    href: "/admin/users",
    label: "Pengguna",
    icon: Users,
    exact: false,
    requires: "users:manage",
  },
];

/** Sidebar navigation with active-link highlighting; links gate by role. */
export function AdminNav({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2 text-sm">
      {LINKS.filter((l) => !l.requires || can(role, l.requires)).map(
        ({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/60",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
