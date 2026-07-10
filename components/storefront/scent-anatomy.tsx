import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";

const LAYERS = [
  {
    index: "01",
    label: "The First Impression",
    duration: "Top Notes · 0–30 Minutes",
    body: "Fresh, vibrant, and instantly captivating. These opening notes introduce the fragrance with a bright burst of energy before gently unfolding into something deeper.",
  },
  {
    index: "02",
    label: "The Heart of KOKA",
    duration: "Heart Notes · 30 Minutes–4 Hours",
    body: "Where the fragrance finds its true identity. Soft florals and delicate accords bloom gracefully, creating the signature character of every KOKA scent.",
  },
  {
    index: "03",
    label: "The Lasting Signature",
    duration: "Base Notes · 4+ Hours",
    body: "Fondasi yang membekas di pakaian sampai esok hari. Aroma kayu dan resin yang dalam — cendana, vanila, musk.",
  },
];

/**
 * Editorial explainer on fragrance structure. Doubles as SEO surface: the copy
 * targets long-tail queries around eau de parfum longevity and note layers.
 */
export function ScentAnatomy() {
  return (
    <section className="space-y-8">
      <Reveal className="space-y-4">
        <SectionHeading eyebrow="Introduction" title="The KOKA Scent Journey" />
        <p className="max-w-2xl text-base text-muted-foreground">
          Every KOKA fragrance is crafted to evolve with you. From the first
          spray to the final trace, each layer is thoughtfully composed to
          create a scent that feels refined, balanced, and unforgettable.
        </p>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <Reveal
            key={layer.index}
            as="article"
            delay={i * 110}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <span className="display-number text-5xl text-terracotta/80 transition-transform duration-500 group-hover:scale-110">
              {layer.index}
            </span>
            <div>
              <h3 className="font-heading text-xl text-foreground">
                {layer.label}
              </h3>
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                {layer.duration}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{layer.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
