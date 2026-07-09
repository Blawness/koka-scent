import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";

// TODO(copy): testimoni placeholder — ganti dengan testimoni pelanggan asli.
//
// Sengaja TIDAK diberi markup schema.org Review/AggregateRating. Google
// melarang structured data untuk ulasan yang tidak berasal dari pelanggan
// sungguhan, dan pelanggarannya berisiko manual action. Tambahkan markup Review
// hanya setelah testimoni di bawah diganti dengan yang asli.
const TESTIMONIALS = [
  {
    quote:
      "Sakura Senja jadi parfum harian saya sekarang. Wanginya lembut, tidak menusuk, tapi masih kecium waktu pulang kerja.",
    name: "Rani P.",
    city: "Bandung",
  },
  {
    quote:
      "Beli Cendana Senja buat suami dan dia langsung nanya belinya di mana. Base notes-nya hangat banget.",
    name: "Dimas A.",
    city: "Surabaya",
  },
  {
    quote:
      "Diffuser Bambu Hutan bikin ruang kerja terasa lebih tenang. Sudah dua bulan dan aromanya masih konsisten.",
    name: "Laras W.",
    city: "Yogyakarta",
  },
];

export function Testimonials() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading eyebrow="Kata Mereka" title="Cerita Pelanggan" />
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, i) => (
          <Reveal
            key={testimonial.name}
            as="figure"
            delay={i * 110}
            className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <blockquote className="font-heading text-lg leading-relaxed text-foreground">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {testimonial.name}
              </span>
              {" · "}
              {testimonial.city}
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
