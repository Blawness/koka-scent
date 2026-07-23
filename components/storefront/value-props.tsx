import { Reveal } from "@/components/reveal";

const PROPS = [
  {
    title: "Why KOKA?",
    body: "Crafted with high-grade fragrance oils to deliver a refined and authentic scent experience.",
  },
  {
    title: "All-Day Wear",
    body: "Oil Based Perfume concentration that stays with you for 8+ hours.",
  },
  {
    title: "Delivered with Care",
    body: "Securely packed and shipped across Indonesia.",
  },
  {
    title: "100% Authentic",
    body: "Every bottle is sealed and quality checked before it reaches you.",
  },
];

export function ValueProps() {
  return (
    <section
      aria-label="Keunggulan Koka Scent"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {PROPS.map((prop, i) => (
        <Reveal
          key={prop.title}
          delay={i * 90}
          className="rounded-2xl border border-border bg-card px-5 py-6 transition-colors duration-300 hover:bg-secondary"
        >
          <h3 className="font-heading text-lg text-foreground">{prop.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{prop.body}</p>
        </Reveal>
      ))}
    </section>
  );
}
