import Link from "next/link";
import { CartNavLink } from "@/components/storefront/cart-nav-link";

/**
 * Storefront shell (public). Placeholder header/footer — final design pending
 * client visual reference (PRD Section 11).
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="font-heading text-xl tracking-wide text-foreground"
          >
            Koka Scent
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:text-primary">
              Katalog
            </Link>
            <CartNavLink />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Koka Scent — Parfum terinspirasi Jepang.
        </div>
      </footer>
    </div>
  );
}
