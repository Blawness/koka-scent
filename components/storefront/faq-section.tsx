import { SectionHeading } from "@/components/storefront/section-heading";

/**
 * Exported so the homepage can emit FAQPage JSON-LD from the same source —
 * structured data must match the text a visitor actually sees on the page.
 */
export const FAQ_ITEMS = [
  {
    question: "Apa bedanya eau de parfum (EDP) dan eau de toilette (EDT)?",
    answer:
      "Perbedaannya ada di konsentrasi minyak parfum. EDP mengandung 15–20% minyak sehingga bertahan 6–8 jam, sedangkan EDT hanya 5–15% dan bertahan 3–4 jam. Seluruh parfum Koka Scent diracik dengan konsentrasi eau de parfum.",
  },
  {
    question: "Bagaimana cara memilih parfum tanpa mencoba langsung?",
    answer:
      "Mulai dari base notes, karena itu yang paling lama menempel di kulitmu. Kalau kamu suka aroma hangat, pilih cendana atau vanila. Kalau lebih suka segar dan ringan, cari yang base notes-nya musk atau bambu. Setiap halaman produk mencantumkan ketiga lapisan notes-nya.",
  },
  {
    question: "Berapa lama parfum bertahan di kulit?",
    answer:
      "Rata-rata 8 jam, tergantung jenis kulit dan cuaca. Kulit lembap menahan aroma lebih lama daripada kulit kering. Semprotkan pada titik nadi — pergelangan tangan, leher, belakang telinga — dan jangan digosok, karena itu memecah molekul aromanya.",
  },
  {
    question: "Apakah produk Koka Scent asli dan bersegel?",
    answer:
      "Ya. Setiap botol dikirim dalam keadaan bersegel dengan kemasan asli Koka Scent. Jika produk yang kamu terima tidak sesuai deskripsi, kami ganti tanpa biaya tambahan.",
  },
  {
    question: "Berapa lama pengiriman dan ke mana saja?",
    answer:
      "Kami mengirim ke seluruh Indonesia dari Jakarta. Pesanan yang masuk sebelum pukul 15.00 WIB pada hari kerja dikirim di hari yang sama. Estimasi tiba 1–2 hari untuk Jabodetabek dan 2–5 hari untuk luar Jawa.",
  },
  {
    question: "Bisakah saya menukar atau mengembalikan produk?",
    answer:
      "Produk yang masih bersegel dapat dikembalikan dalam 7 hari setelah diterima. Karena alasan higienis, botol yang sudah dibuka hanya dapat dikembalikan jika ada cacat produksi atau kerusakan saat pengiriman.",
  },
];

export function FaqSection() {
  return (
    <section className="space-y-8">
      <SectionHeading eyebrow="Bantuan" title="Pertanyaan Umum" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="faq-item group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg text-foreground transition-colors duration-200 hover:text-terracotta marker:content-none">
              {item.question}
              <span
                aria-hidden
                className="display-number shrink-0 text-2xl text-terracotta transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
