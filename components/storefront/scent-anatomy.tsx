import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";

const LAYERS = [
  {
    index: "01",
    label: "Top Notes",
    duration: "15–30 menit pertama",
    body: "Kesan pertama yang kamu cium begitu disemprot. Biasanya citrus atau aroma hijau yang segar dan cepat menguap — yuzu, bergamot, daun shiso.",
  },
  {
    index: "02",
    label: "Middle Notes",
    duration: "2–4 jam berikutnya",
    body: "Jantung dari parfum. Muncul saat top notes memudar dan bertahan paling lama di kulit — sakura, melati, teratai putih.",
  },
  {
    index: "03",
    label: "Base Notes",
    duration: "Sisa hari",
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
        <SectionHeading eyebrow="Pelajari" title="Anatomi Wangi" />
        <p className="max-w-2xl text-base text-muted-foreground">
          Parfum tidak berbau sama sepanjang hari. Ia terbuka, mekar, lalu
          mengendap dalam tiga lapisan. Memahami ketiganya membuatmu tahu wangi
          seperti apa yang benar-benar akan menemanimu.
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
