import { Reveal } from "@/components/reveal";

const PROPS = [
  {
    title: "Notes Autentik",
    body: "Diracik dari bahan parfum grade premium, bukan pewangi sintetis biasa.",
  },
  {
    title: "Tahan 8+ Jam",
    body: "Konsentrasi eau de parfum, menetap dari pagi sampai petang.",
  },
  {
    title: "Kirim Seluruh Indonesia",
    body: "Dikemas aman dengan bubble wrap dan dikirim dari Jakarta setiap hari kerja.",
  },
  {
    title: "Garansi Keaslian",
    body: "Setiap botol bersegel. Tidak sesuai deskripsi, kami ganti.",
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
