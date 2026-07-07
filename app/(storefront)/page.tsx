import Link from "next/link";
import { Button } from "@/components/ui/button";

// Landing page — placeholder boilerplate, final design pending (Section 11).
export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-6 py-16">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Japan-inspired perfumery
      </p>
      <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
        Cerita aroma dalam setiap botol.
      </h1>
      <p className="max-w-prose text-muted-foreground">
        Placeholder hero. Katalog lengkap, cart, dan checkout dengan pembayaran
        lokal — semuanya di domain Koka Scent sendiri.
      </p>
      <Button asChild size="lg">
        <Link href="/products">Lihat Katalog</Link>
      </Button>
    </section>
  );
}
