import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import { listPublishedReviews } from "@/db/repo";

export async function Testimonials() {
  const reviews = await listPublishedReviews();

  if (reviews.length === 0) {
    return null;
  }

  const base = reviews.map((r) => ({
    quote: r.comment,
    name: r.customerName,
    city: r.customerCity,
    product: r.productName,
    slug: r.productSlug,
  }));

  const loop = [...base, ...base];

  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading eyebrow="Kata Mereka" title="Cerita Pelanggan" />
      </Reveal>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((testimonial, i) => (
            <figure
              key={`${testimonial.name}-${i}`}
              className="flex h-[18rem] min-h-[18rem] w-[min(85vw,22rem)] shrink-0 flex-col justify-between gap-6 rounded-2xl border border-border bg-card px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <blockquote className="font-heading text-lg leading-relaxed text-foreground flex-1 overflow-hidden">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="flex-shrink-0 space-y-2 text-sm text-muted-foreground">
                {testimonial.slug ? (
                  <Link
                    href={`/products/${testimonial.slug}`}
                    className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {testimonial.product}
                  </Link>
                ) : (
                  <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                    {testimonial.product}
                  </span>
                )}
                <div>
                  <span className="font-medium text-foreground">
                    {testimonial.name}
                  </span>
                  {" · "}
                  {testimonial.city}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}