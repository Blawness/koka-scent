"use client";

import Link from "next/link";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartStore } from "@/stores/cart-store";

// Live cart item count in the header. Client component so the persisted
// (localStorage) Zustand store doesn't cause a hydration mismatch — renders
// the count only after mount, matching the server's empty first paint.
export function CartNavLink() {
  const mounted = useHydrated();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <Link href="/cart" className="hover:text-primary">
      Keranjang{mounted && totalItems > 0 ? ` (${totalItems})` : ""}
    </Link>
  );
}
