import { db } from "@/db/client";
import { products, reviews } from "@/db/schema";

/**
 * Testimonial seed. Each entry references a real SKU by slug so the copy names
 * a product that actually exists in the catalog (KS-001..KS-008) and the card
 * can link through to its PDP. Quotes reference each scent's real note profile.
 *
 * NOTE: these are still illustrative testimonials, not verified purchases — do
 * not attach Review/AggregateRating schema to them. See the copy-deck decision
 * on testimonials before treating any of this as real customer data.
 */
async function main() {
  if (!db) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }
  const allProducts = await db.select().from(products);
  if (allProducts.length === 0) {
    console.log("No products found. Seed products first.");
    return;
  }

  const bySlug = new Map(allProducts.map((p) => [p.slug, p.id]));
  const pid = (slug: string) => {
    const id = bySlug.get(slug);
    if (!id) throw new Error(`No product with slug "${slug}" — seed products first.`);
    return id;
  };

  const reviewData = [
    {
      slug: "dakishimete",
      customerName: "Rani P.",
      customerCity: "Bandung",
      rating: 5,
      comment:
        "Dakishimete manisnya pas — raspberry sama praline-nya kerasa hangat tanpa bikin enek. Jadi parfum harian saya sekarang.",
    },
    {
      slug: "dakishimete",
      customerName: "Intan M.",
      customerCity: "Bandung",
      rating: 5,
      comment:
        "Sudah beli Dakishimete 3x, konsisten. Black peony-nya bikin wanginya beda dari parfum manis lain di pasaran.",
    },
    {
      slug: "mamoritai",
      customerName: "Dimas A.",
      customerCity: "Surabaya",
      rating: 5,
      comment:
        "Beli Mamoritai buat suami dan dia langsung nanya belinya di mana. Sandalwood-nya hangat, tapi green apple-nya bikin tetap segar.",
    },
    {
      slug: "hanami",
      customerName: "Laras W.",
      customerCity: "Yogyakarta",
      rating: 5,
      comment:
        "Hanami itu floral yang elegan, bukan floral yang norak. Iris sama rose-nya lembut, cocok buat ke kantor.",
    },
    {
      slug: "shinjitsu",
      customerName: "Dewi L.",
      customerCity: "Makassar",
      rating: 5,
      comment:
        "Shinjitsu buat acara malam juara — tuberose sama jasmine-nya mewah banget. Sekali pakai langsung dapat pujian.",
    },
    {
      slug: "okinawa",
      customerName: "Andi S.",
      customerCity: "Jakarta",
      rating: 4,
      comment:
        "Okinawa coconut vanilla-nya bikin serasa liburan di pantai. Manis creamy, tahan sampai malam juga.",
    },
    {
      slug: "waku-waku",
      customerName: "Rizky P.",
      customerCity: "Bali",
      rating: 5,
      comment:
        "Waku-Waku playful banget — blackberry, pear, marshmallow-nya ceria tapi tetap dewasa. Cocok buat harian.",
    },
    {
      slug: "okaeri",
      customerName: "Fajar N.",
      customerCity: "Palembang",
      rating: 4,
      comment:
        "Okaeri segar dan bersih, citrus sama geranium-nya pas buat cuaca panas. Pengiriman cepat, botol bersegel rapi.",
    },
    {
      slug: "hikari-tea",
      customerName: "Budi H.",
      customerCity: "Semarang",
      rating: 5,
      comment:
        "Hikari Tea kesukaan saya. Earl grey sama amber-nya wanginya kayak di spa mewah tapi harga bersahabat.",
    },
    {
      slug: "hikari-tea",
      customerName: "Siti R.",
      customerCity: "Medan",
      rating: 5,
      comment:
        "Packaging rapi, segel rapi, dan Hikari Tea beneran wangi premium. Worth it belinya di Koka Scent.",
    },
  ];

  await db.insert(reviews).values(
    reviewData.map((r) => ({
      productId: pid(r.slug),
      customerName: r.customerName,
      customerCity: r.customerCity,
      rating: r.rating,
      comment: r.comment,
      isPublished: true,
    })),
  );
  console.log(`Seeded ${reviewData.length} reviews.`);
}

main().catch(console.error);
