import Link from "next/link";
import { CartNavLink } from "@/components/storefront/cart-nav-link";

/**
 * Storefront shell (public) — Editorial Warm v2. Pill nav header + pill footer
 * bar over a full-width cream canvas (no outer frame). Logic unchanged.
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-heading text-xl tracking-wide text-foreground"
          >
            Koka Scent
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 text-sm shadow-soft">
            <Link
              href="/"
              className="rounded-full px-4 py-1.5 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="rounded-full px-4 py-1.5 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Katalog
            </Link>
            <div className="rounded-full px-2">
              <CartNavLink />
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="mt-8 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Katalog
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Koleksi
            </Link>
            <Link
              href="/"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Tentang
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Koka Scent — Parfum terinspirasi Jepang.
          </p>
        </div>
      </footer>
    </div>
  );
}
