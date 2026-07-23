import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/social";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-10 sm:py-20">
      <span className="display-number pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[10rem] leading-none opacity-10 select-none sm:text-[14rem]">
        Koka
      </span>
      <div className="relative mx-auto max-w-xl space-y-6">
        <span className="text-xs font-medium tracking-[0.25em] uppercase opacity-80">
          Mulai Dari Sini
        </span>
        <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
          Temukan wangi yang terasa seperti dirimu.
        </h2>
        <p className="text-sm opacity-90 sm:text-base">
          Not sure where to start? Our team is happy to help you find the
          scent that feels like you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link href="/products">Belanja Sekarang</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a
              href={whatsappLink(
                "Halo Koka Scent, saya butuh bantuan memilih aroma yang cocok.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircleIcon data-icon="inline-start" />
              Tanya Tim Kami
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
