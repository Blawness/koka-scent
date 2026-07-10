import { db } from "@/db/client";
import { products, reviews } from "@/db/schema";

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

  const reviewData = [
    {
      productId: allProducts[0].id,
      customerName: "Rani P.",
      customerCity: "Bandung",
      rating: 5,
      comment:
        "Sakura Senja jadi parfum harian saya sekarang. Wanginya lembut, tidak menusuk, tapi masih kecium waktu pulang kerja.",
      isPublished: true,
    },
    {
      productId: allProducts[0].id,
      customerName: "Dimas A.",
      customerCity: "Surabaya",
      rating: 5,
      comment:
        "Beli Cendana Senja buat suami dan dia langsung nanya belinya di mana. Base notes-nya hangat banget.",
      isPublished: true,
    },
    {
      productId: allProducts[1]?.id || allProducts[0].id,
      customerName: "Laras W.",
      customerCity: "Yogyakarta",
      rating: 5,
      comment:
        "Diffuser Bambu Hutan bikin ruang kerja terasa lebih tenang. Sudah dua bulan dan aromanya masih konsisten.",
      isPublished: true,
    },
    {
      productId: allProducts[0].id,
      customerName: "Andi S.",
      customerCity: "Jakarta",
      rating: 4,
      comment:
        "Yuzu Senja jadi favorit baru — segar tapi nggak terlalu asam. Tahan juga sampai malam.",
      isPublished: true,
    },
    {
      productId: allProducts[1]?.id || allProducts[0].id,
      customerName: "Siti R.",
      customerCity: "Medan",
      rating: 5,
      comment:
        "Packaging-nya rapi, segel rapi, wangi beneran premium. Beneran worth it belinya di Koka Scent.",
      isPublished: true,
    },
    {
      productId: allProducts[0].id,
      customerName: "Budi H.",
      customerCity: "Semarang",
      rating: 5,
      comment:
        "Cendana Senja kesukaan saya. Wanginya kayak di spa mewah tapi harga bersahabat.",
      isPublished: true,
    },
    {
      productId: allProducts[1]?.id || allProducts[0].id,
      customerName: "Dewi L.",
      customerCity: "Makassar",
      rating: 5,
      comment:
        "Sudah beli 3x, konsisten kualitasnya. Sakura Senja yang terakhir bener-bener beda sama merk lain.",
      isPublished: true,
    },
    {
      productId: allProducts[1]?.id || allProducts[0].id,
      customerName: "Rizky P.",
      customerCity: "Bali",
      rating: 5,
      comment:
        "Diffuser Bambu Hutan taruh di kamar tidur, bikin tidur nyenyak. Aromanya gak ngebuat pusing.",
      isPublished: true,
    },
    {
      productId: allProducts[0].id,
      customerName: "Fajar N.",
      customerCity: "Palembang",
      rating: 4,
      comment:
        "Pengiriman cepat, botol bersegel rapi. Yuzu Senja wanginya segar banget cocok buat cuaca panas.",
      isPublished: true,
    },
    {
      productId: allProducts[1]?.id || allProducts[0].id,
      customerName: "Intan M.",
      customerCity: "Bandung",
      rating: 5,
      comment:
        "Customer service-nya ramah, bantu pilih parfum sesuai preferensi. Cendana Senja emang juara.",
      isPublished: true,
    },
  ];

  await db.insert(reviews).values(reviewData);
  console.log(`Seeded ${reviewData.length} reviews.`);
}

main().catch(console.error);