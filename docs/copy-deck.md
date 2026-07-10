# Copy Deck — Koka Scent Storefront

Dokumen ini memuat seluruh teks pemasaran yang tayang di website Koka Scent, tersusun sesuai urutan tampilnya di layar. Disiapkan agar tim Koka Scent dapat meninjau dan merevisi seluruh copy tanpa perlu membuka kode.

**Disiapkan:** 10 Juli 2026
**Status website:** tahap pengembangan, belum tayang untuk publik

---

## Cara Pakai Dokumen Ini

Setiap section punya satu tabel. Tiap baris tabel adalah satu potong teks yang bisa diubah.

1. **Isi hanya kolom "Revisi".** Kosongkan kalau teks sekarang sudah pas — baris kosong berarti "tidak ada perubahan".
2. **Jangan ubah kolom "ID".** Kode itu yang kami pakai untuk menempatkan revisi Anda kembali ke website. Kalau ID hilang, kami tidak tahu teks itu milik bagian mana.
3. **Perhatikan batas panjang.** Beberapa teks punya catatan panjang maksimal. Melewatinya membuat tampilan pecah di layar ponsel atau terpotong di hasil pencarian Google.
4. **Baris bertanda ⚠ butuh keputusan, bukan sekadar revisi kalimat.** Lihat [Catatan Serah Terima](#catatan-serah-terima) di bagian akhir sebelum menyentuhnya.

Kalau lebih nyaman bekerja di Google Docs, salin saja seluruh isi dokumen ini ke sana — tabelnya akan terbawa.

---

## Peta Layout Halaman Utama

Urutan section dari atas ke bawah saat pengunjung membuka halaman depan:

| # | Section | Isi Singkat |
|---|---------|-------------|
| 1 | **Hero** | Layar pembuka. Headline besar di kiri, foto produk unggulan di kanan. |
| 2 | **Value Props** | Empat kotak berjajar berisi alasan membeli. |
| 3 | **Best Seller** | Empat produk terlaris dalam bentuk kartu. |
| 4 | **Kategori** | Satu pintu masuk ke katalog: Oil Based Perfume. |
| 5 | **Anatomi Wangi** | Penjelasan editorial tiga lapisan notes. Juga berfungsi sebagai materi SEO. |
| 6 | **Produk Pilihan** | Satu produk disorot di atas latar gelap. |
| 7 | **Cerita Koka Scent** | Narasi brand tiga paragraf, foto, dan tiga angka statistik. |
| 8 | **Cerita Pelanggan** | Tiga kutipan testimoni. |
| 9 | **Pertanyaan Umum** | Enam pertanyaan yang bisa dibuka-tutup. |
| 10 | **Closing CTA** | Ajakan terakhir di atas latar gelap sebelum footer. |

Halaman lain — Katalog, Detail Produk, Keranjang, Checkout — hanya memuat judul section dan teks pendukung. Semuanya tercantum di bawah.

---

# Bagian 1 — Global

Muncul di semua halaman.

## Header

*Berkas: `app/(storefront)/layout.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| NAV-01 | Nama brand (kiri atas) | KOKA SCENT | |
| NAV-02 | Menu 1 | Beranda | |
| NAV-03 | Menu 2 | Katalog | |

## Footer

*Berkas: `app/(storefront)/layout.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| FOOT-01 | Tautan 1 | Katalog | |
| FOOT-02 | ⚠ Tautan 2 | Koleksi | |
| FOOT-03 | ⚠ Tautan 3 | Tentang | |
| FOOT-04 | Baris hak cipta | © 2026 Koka Scent — An Oil Based Perfume | |

> Tahun pada FOOT-04 terisi otomatis mengikuti tahun berjalan. Yang bisa direvisi hanya kalimat setelahnya.

---

# Bagian 2 — Halaman Utama

## 1. Hero

*Berkas: `components/storefront/hero.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| HERO-01 | Eyebrow (teks kecil di atas headline) | An Oil Based Perfume | |
| HERO-02 | Headline | Made to Be **Remembered**. | |
| HERO-03 | Subheadline | Long-lasting fragrances designed to leave a memorable impression wherever you go. | |
| HERO-04 | Tombol utama | Shop Now | |
| HERO-05 | ⚠ Tombol kedua | Our Products | |
| HERO-06 | Angka dekoratif | 001 Dakishimete | |

> **HERO-06** ditulis statis (bukan diambil dari database) — sama seperti "No 01" sebelumnya. Karena kartu kecil di bawah foto (lihat catatan di bawah) sudah menampilkan nama produk hero secara otomatis, saat produk hero memang "001 Dakishimete" kedua teks ini akan sama persis. Kalau produk hero berubah nanti, teks dekoratif ini **tidak ikut berubah otomatis** kecuali diminta untuk dibuat dinamis. Mohon konfirmasi apakah ini yang diinginkan.
>
> **HERO-02** — kata **Remembered** dicetak dengan warna terracotta sebagai penekanan. Kalau Anda mengganti headline, tandai kata mana yang ingin diberi warna dengan menebalkannya.
>
> **HERO-02** sebaiknya maksimal 45 karakter agar tidak pecah jadi empat baris di layar ponsel. **HERO-03** maksimal 120 karakter.
>
> Nama produk dan harga "Mulai Rp…" pada kartu kecil di bawah foto diambil otomatis dari database, bukan ditulis manual.

## 2. Value Props

*Berkas: `components/storefront/value-props.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| VALUE-01-J | Kotak 1 · Judul | Why KOKA? | |
| VALUE-01-B | Kotak 1 · Isi | Crafted with high-grade fragrance oils to deliver a refined and authentic scent experience. | |
| VALUE-02-J | Kotak 2 · Judul | All-Day Wear | |
| VALUE-02-B | Kotak 2 · Isi | Oil Based Perfume concentration that stays with you for 8+ hours. | |
| VALUE-03-J | Kotak 3 · Judul | Delivered with Care | |
| VALUE-03-B | Kotak 3 · Isi | Securely packed and shipped across Indonesia. | |
| VALUE-04-J | Kotak 4 · Judul | 100% Authentic | |
| VALUE-04-B | ⚠ Kotak 4 · Isi | Setiap botol bersegel. Tidak sesuai deskripsi, kami ganti. | |

> Judul sebaiknya maksimal 3 kata dan isi maksimal 90 karakter — keempat kotak berbagi tinggi yang sama, jadi satu teks yang jauh lebih panjang akan menarik ketiganya ikut memanjang.

## 3. Best Seller

*Berkas: `app/(storefront)/page.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| BEST-01 | Eyebrow | Paling Dicari | |
| BEST-02 | Judul section | Best Seller | |
| BEST-03 | Tombol kanan atas | Lihat Semua | |

> Empat produk yang tampil di sini diambil otomatis dari database — saat ini empat produk pertama yang berstatus aktif, bukan dipilih manual.

## 4. Kategori

*Berkas: `components/storefront/category-index.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| KAT-00-E | Eyebrow | Jelajahi | |
| KAT-00-J | Judul section | Kategori | |
| KAT-01 | Kategori 1 | Oil Based Perfume | |

> ⚠ **Perubahan struktur, bukan copy:** sejak katalog diisi 8 SKU asli (KS-001–KS-008), seluruh produk berada dalam satu kategori — "Oil Based Perfume". KAT-02/03/04 (Wanita/Pria/Diffuser) sudah tidak ada di kode; revisi terbaru yang menyebut "Kategori 4: Diffuser" tidak diterapkan karena section Kategori sekarang cuma render satu kartu. Nama kategori ini dipakai juga sebagai label di kartu produk, filter katalog, dan halaman detail produk — ubah di satu tempat berefek ke semua tempat itu.

## 5. Anatomi Wangi

*Berkas: `components/storefront/scent-anatomy.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| ANAT-00-E | Eyebrow | Introduction | |
| ANAT-00-J | Judul section | The KOKA Scent Journey | |
| ANAT-00-P | Paragraf pengantar | Every KOKA fragrance is crafted to evolve with you. From the first spray to the final trace, each layer is thoughtfully composed to create a scent that feels refined, balanced, and unforgettable. | |
| ANAT-01-J | Lapisan 1 · Nama | The First Impression | |
| ANAT-01-D | Lapisan 1 · Durasi | Top Notes · 0–30 Minutes | |
| ANAT-01-B | Lapisan 1 · Isi | Fresh, vibrant, and instantly captivating. These opening notes introduce the fragrance with a bright burst of energy before gently unfolding into something deeper. | |
| ANAT-02-J | Lapisan 2 · Nama | The Heart of KOKA | |
| ANAT-02-D | Lapisan 2 · Durasi | Heart Notes · 30 Minutes–4 Hours | |
| ANAT-02-B | Lapisan 2 · Isi | Where the fragrance finds its true identity. Soft florals and delicate accords bloom gracefully, creating the signature character of every KOKA scent. | |
| ANAT-03-J | Lapisan 3 · Nama | The Lasting Signature | |
| ANAT-03-D | Lapisan 3 · Durasi | Base Notes · 4+ Hours | |
| ANAT-03-B | Lapisan 3 · Isi | Fondasi yang membekas di pakaian sampai esok hari. Aroma kayu dan resin yang dalam — cendana, vanila, musk. | |

> Section ini sengaja ditulis untuk menjaring pencarian Google seputar "berapa lama parfum bertahan" dan "apa itu base notes". Revisi terbaru mengganti istilah lapisan dari Top/Middle/Base Notes menjadi Heart Notes untuk lapisan tengah — pertahankan istilah *top notes*, *heart notes* (dulu *middle notes*), *base notes*, dan *eau de parfum* secara utuh, itu kata kunci yang dicari orang.
>
> ⚠ **ANAT-03-B** (isi lapisan 3, belum direvisi klien) masih menyatakan base notes "membekas di pakaian sampai esok hari", sementara durasi barunya (**ANAT-03-D**) sudah eksplisit "4+ Hours". Kalimat isi ini juga belum diselaraskan dengan **ANAT-02-B** yang baru (tidak lagi mengklaim middle/heart notes "bertahan paling lama di kulit"). Mohon dikonfirmasi apakah ANAT-03-B ikut direvisi.

## 6. Produk Pilihan

*Berkas: `components/storefront/featured-product.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| PILIH-01 | Eyebrow | Pilihan | |
| PILIH-02 | Tombol | Lihat Detail | |

> Nama produk, harga, dan notes pada section ini diambil otomatis dari database. Produk yang tampil saat ini adalah produk aktif kedua, bukan dipilih manual — kalau Koka Scent ingin menyorot produk tertentu, beri tahu kami dan akan kami ubah jadi bisa dipilih dari admin panel.

## 7. Cerita Koka Scent

*Berkas: `components/storefront/brand-story.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| CERITA-00-E | Eyebrow | Tentang Kami | |
| CERITA-00-J | Judul section | Cerita Koka Scent | |
| CERITA-01 | ⚠ Paragraf 1 | Koka Scent lahir dari satu kebiasaan sederhana: berhenti sejenak, menarik napas, dan membiarkan aroma menandai satu momen agar ia tidak hilang begitu saja. | |
| CERITA-02 | ⚠ Paragraf 2 | Kami mengambil disiplin peracikan Jepang — sabar, presisi, tidak berlebihan — lalu menerjemahkannya lewat bahan yang tumbuh di sekitar kami. Sakura bertemu cendana. Yuzu bertemu melati. | |
| CERITA-03 | ⚠ Paragraf 3 | Setiap botol diracik dalam batch kecil, diuji berminggu-minggu di kulit sungguhan, dan baru dirilis ketika aromanya terasa jujur. | |
| CERITA-04-A | ⚠ Statistik 1 · Angka | 12 | |
| CERITA-04-L | Statistik 1 · Label | Aroma dalam koleksi | |
| CERITA-05-A | ⚠ Statistik 2 · Angka | 8 jam | |
| CERITA-05-L | Statistik 2 · Label | Ketahanan rata-rata | |
| CERITA-06-A | ⚠ Statistik 3 · Angka | 2019 | |
| CERITA-06-L | Statistik 3 · Label | Tahun kami mulai | |
| CERITA-07 | Tombol | Jelajahi Koleksi | |

> **Seluruh narasi di section ini adalah teks sementara yang kami tulis sebagai contoh, bukan cerita asli Koka Scent.** Mohon ditulis ulang sepenuhnya. Lihat [Catatan Serah Terima](#catatan-serah-terima).
>
> Ketiga angka statistik ditulis manual, tidak dihitung dari database. Angka "12 aroma" tidak akan berubah sendiri kalau jumlah produk bertambah.

## 8. Cerita Pelanggan

*Berkas: `components/storefront/testimonials.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| TESTI-00-E | Eyebrow | Kata Mereka | |
| TESTI-00-J | Judul section | Cerita Pelanggan | |
| TESTI-01-K | ⚠ Testimoni 1 · Kutipan | Sakura Senja jadi parfum harian saya sekarang. Wanginya lembut, tidak menusuk, tapi masih kecium waktu pulang kerja. | |
| TESTI-01-N | ⚠ Testimoni 1 · Nama | Rani P. | |
| TESTI-01-C | ⚠ Testimoni 1 · Kota | Bandung | |
| TESTI-02-K | ⚠ Testimoni 2 · Kutipan | Beli Cendana Senja buat suami dan dia langsung nanya belinya di mana. Base notes-nya hangat banget. | |
| TESTI-02-N | ⚠ Testimoni 2 · Nama | Dimas A. | |
| TESTI-02-C | ⚠ Testimoni 2 · Kota | Surabaya | |
| TESTI-03-K | ⚠ Testimoni 3 · Kutipan | Diffuser Bambu Hutan bikin ruang kerja terasa lebih tenang. Sudah dua bulan dan aromanya masih konsisten. | |
| TESTI-03-N | ⚠ Testimoni 3 · Nama | Laras W. | |
| TESTI-03-C | ⚠ Testimoni 3 · Kota | Yogyakarta | |

> **Ketiga testimoni ini fiktif — kami yang mengarangnya sebagai contoh tampilan.** Nama dan kotanya bukan pelanggan sungguhan. Jangan sekadar memoles kalimatnya; ganti dengan testimoni asli, atau minta kami menghapus section ini. Lihat [Catatan Serah Terima](#catatan-serah-terima).

## 9. Pertanyaan Umum

*Berkas: `components/storefront/faq-section.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| FAQ-00-E | Eyebrow | Bantuan | |
| FAQ-00-J | Judul section | Pertanyaan Umum | |
| FAQ-01-P | Pertanyaan 1 | Apa bedanya eau de parfum (EDP) dan eau de toilette (EDT)? | |
| FAQ-01-J | ⚠ Jawaban 1 | Perbedaannya ada di konsentrasi minyak parfum. EDP mengandung 15–20% minyak sehingga bertahan 6–8 jam, sedangkan EDT hanya 5–15% dan bertahan 3–4 jam. Seluruh parfum Koka Scent diracik dengan konsentrasi eau de parfum. | |
| FAQ-02-P | Pertanyaan 2 | Bagaimana cara memilih parfum tanpa mencoba langsung? | |
| FAQ-02-J | Jawaban 2 | Mulai dari base notes, karena itu yang paling lama menempel di kulitmu. Kalau kamu suka aroma hangat, pilih cendana atau vanila. Kalau lebih suka segar dan ringan, cari yang base notes-nya musk atau bambu. Setiap halaman produk mencantumkan ketiga lapisan notes-nya. | |
| FAQ-03-P | Pertanyaan 3 | Berapa lama parfum bertahan di kulit? | |
| FAQ-03-J | ⚠ Jawaban 3 | Rata-rata 8 jam, tergantung jenis kulit dan cuaca. Kulit lembap menahan aroma lebih lama daripada kulit kering. Semprotkan pada titik nadi — pergelangan tangan, leher, belakang telinga — dan jangan digosok, karena itu memecah molekul aromanya. | |
| FAQ-04-P | Pertanyaan 4 | Apakah produk Koka Scent asli dan bersegel? | |
| FAQ-04-J | ⚠ Jawaban 4 | Ya. Setiap botol dikirim dalam keadaan bersegel dengan kemasan asli Koka Scent. Jika produk yang kamu terima tidak sesuai deskripsi, kami ganti tanpa biaya tambahan. | |
| FAQ-05-P | Pertanyaan 5 | Berapa lama pengiriman dan ke mana saja? | |
| FAQ-05-J | ⚠ Jawaban 5 | Kami mengirim ke seluruh Indonesia dari Jakarta. Pesanan yang masuk sebelum pukul 15.00 WIB pada hari kerja dikirim di hari yang sama. Estimasi tiba 1–2 hari untuk Jabodetabek dan 2–5 hari untuk luar Jawa. | |
| FAQ-06-P | Pertanyaan 6 | Bisakah saya menukar atau mengembalikan produk? | |
| FAQ-06-J | ⚠ Jawaban 6 | Produk yang masih bersegel dapat dikembalikan dalam 7 hari setelah diterima. Karena alasan higienis, botol yang sudah dibuka hanya dapat dikembalikan jika ada cacat produksi atau kerusakan saat pengiriman. | |

> **Keenam pertanyaan dan jawaban ini dikirim ke Google sebagai data terstruktur**, sehingga berpotensi muncul langsung di halaman hasil pencarian. Apa pun yang Anda tulis di sini akan terbaca publik persis seperti tertulis.
>
> Jawaban yang ditandai ⚠ memuat janji operasional, bukan sekadar penjelasan produk: batas pengiriman pukul 15.00 WIB, estimasi tiba 1–2 hari Jabodetabek dan 2–5 hari luar Jawa, retur 7 hari, garansi penggantian, dan klaim konsentrasi minyak 15–20%. Mohon dikonfirmasi bahwa Koka Scent sanggup memenuhi semuanya.
>
> ⚠ **FAQ-02-J** menyebut base notes "paling lama menempel", sementara **ANAT-02-B** di section Anatomi Wangi menyebut middle notes yang bertahan paling lama. Perlu diselaraskan.

## 10. Closing CTA

*Berkas: `components/storefront/closing-cta.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| CTA-01 | Eyebrow | Mulai Dari Sini | |
| CTA-02 | Headline | Temukan wangi yang terasa seperti dirimu. | |
| CTA-03 | ⚠ Paragraf | Dua belas aroma, diracik dalam batch kecil. Bingung memilih? Tim kami bantu carikan yang paling cocok. | |
| CTA-04 | Tombol utama | Belanja Sekarang | |
| CTA-05 | ⚠ Tombol kedua | Lihat Semua Aroma | |
| CTA-06 | Teks dekoratif latar | Koka | |

> ⚠ **CTA-03** menyebut "dua belas aroma" dan **CERITA-04-A** menyebut angka "12". Keduanya ditulis manual di tempat berbeda — kalau jumlahnya berubah, dua-duanya harus ikut diperbarui.
>
> ⚠ **CTA-03** menjanjikan "Tim kami bantu carikan yang paling cocok", tetapi website belum punya kontak WhatsApp, live chat, maupun formulir. Pengunjung yang tertarik tidak punya cara menghubungi siapa pun. Mohon tentukan kanal kontaknya.

## Kondisi Khusus

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| KOSONG-01 | Muncul kalau belum ada produk aktif sama sekali | Katalog sedang disiapkan. | |

---

# Bagian 3 — Halaman Katalog

*Berkas: `app/(storefront)/products/page.tsx`, `components/storefront/category-filter.tsx`, `components/storefront/product-card.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| KAT-H-01 | Eyebrow | Koleksi | |
| KAT-H-02 | Judul halaman | Semua Produk | |
| KAT-H-03 | Angka dekoratif | No 07 | |
| KAT-H-04 | Filter "semua kategori" | Semua | |
| KAT-H-05 | Label stok kosong pada kartu produk | Stok Habis | |
| KAT-H-06 | Pesan kalau produk gagal dimuat | Gagal memuat produk. Silakan muat ulang halaman. | |

> ⚠ **KAT-H-03** tertulis "No 07" tanpa alasan yang jelas — ini bukan nomor halaman maupun jumlah produk. Kemungkinan sisa dari desain awal. Mohon dikonfirmasi apakah mau dihapus.

---

# Bagian 4 — Halaman Detail Produk

*Berkas: `app/(storefront)/products/[slug]/product-detail.tsx`*

Hampir seluruh isi halaman ini — nama produk, harga, notes, ukuran varian — diambil otomatis dari database dan dapat diubah lewat admin panel, bukan lewat dokumen ini.

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| PDP-01 | Angka dekoratif | No | |
| PDP-02 | Label stok kosong | Stok Habis | |

> Eyebrow di atas nama produk otomatis mengikuti kategori produk — saat ini selalu "Oil Based Perfume", lihat KAT-01.

---

# Bagian 5 — Keranjang

*Berkas: `app/(storefront)/cart/page.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| CART-01 | Eyebrow | Keranjang | |
| CART-02 | Judul halaman | Keranjang Belanja | |
| CART-03 | Judul keranjang kosong | Keranjang masih kosong | |
| CART-04 | ⚠ Isi keranjang kosong | Belum ada produk di keranjang Anda. Jelajahi katalog untuk menemukan aroma favorit Anda. | |
| CART-05 | Tombol keranjang kosong | Lihat Katalog | |

> ⚠ **CART-04** memakai sapaan "Anda", sementara seluruh halaman utama memakai "kamu" (lihat HERO-03 "harimu", ANAT-01-B "kamu cium"). Mohon tentukan satu sapaan untuk seluruh website. Lihat [Catatan Serah Terima](#catatan-serah-terima).

---

# Bagian 6 — Checkout

*Berkas: `app/(storefront)/checkout/page.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| CHECK-01 | Eyebrow | Checkout | |
| CHECK-02 | Judul halaman | Checkout | |

> Label formulir, pesan kesalahan, dan tombol pembayaran tidak dimasukkan ke dokumen ini karena bersifat teknis. Beri tahu kami kalau ingin ikut ditinjau.

---

# Bagian 7 — Teks untuk Google

Teks berikut tidak terlihat di halaman, tetapi muncul sebagai judul dan deskripsi ketika website Koka Scent tampil di hasil pencarian Google atau dibagikan di WhatsApp.

## Judul & Deskripsi Umum

*Berkas: `app/layout.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| SEO-01 | Judul cadangan | Koka Scent | |
| SEO-02 | Pola judul halaman | %s · Koka Scent | |
| SEO-03 | Deskripsi umum | Parfum terinspirasi Jepang — cerita aroma dalam setiap botol. Koka Scent. | |

> **SEO-02** — tanda `%s` otomatis diganti nama halaman. Contoh: halaman produk "Sakura Senja" jadi `Sakura Senja · Koka Scent`. Jangan hapus `%s`.

## Halaman Utama

*Berkas: `app/(storefront)/page.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| SEO-04 | Judul di hasil Google | Koka Scent — Parfum Terinspirasi Jepang | |
| SEO-05 | Deskripsi di hasil Google | Eau de parfum dan diffuser terinspirasi Jepang, diracik dalam batch kecil. Notes autentik, tahan 8+ jam, dikirim ke seluruh Indonesia. | |
| SEO-06 | Judul saat dibagikan (WhatsApp, dll.) | Koka Scent — Parfum Terinspirasi Jepang | |
| SEO-07 | Deskripsi saat dibagikan | Eau de parfum dan diffuser terinspirasi Jepang, diracik dalam batch kecil. Notes autentik, tahan 8+ jam. | |

> **SEO-04** maksimal 60 karakter dan **SEO-05** maksimal 155 karakter — Google memotong yang lebih panjang dengan tanda "…".
>
> ⚠ **SEO-05** menjanjikan "tahan 8+ jam", sementara FAQ-01-J menyebut EDP bertahan "6–8 jam". Angka ini juga muncul di VALUE-02-J dan CERITA-05-A. Mohon disepakati satu angka.

## Identitas Bisnis

*Berkas: `lib/seo.ts`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| SEO-08 | Nama resmi bisnis | Koka Scent | |
| SEO-09 | Deskripsi bisnis | Koka Scent — parfum dan diffuser terinspirasi Jepang, diracik dan dikirim dari Indonesia. | |
| SEO-10 | Judul daftar produk unggulan | Produk Pilihan Koka Scent | |

## Halaman Produk

*Berkas: `app/(storefront)/products/[slug]/page.tsx`*

| ID | Elemen | Teks Sekarang | Revisi |
|----|--------|---------------|--------|
| SEO-11 | Pola deskripsi produk | *(Nama produk)* — eau de parfum dengan top notes *(top)*, middle notes *(middle)*, dan base notes *(base)*. Mulai *(harga)*. | |
| SEO-12 | Judul kalau produk tidak ditemukan | Produk tidak ditemukan | |

> **SEO-11** adalah pola yang otomatis terisi untuk setiap produk. Bagian dalam kurung diambil dari database. Yang bisa direvisi hanya kalimat penghubungnya.

---

# Catatan Serah Terima

Enam hal berikut memerlukan **keputusan dari Koka Scent**, bukan sekadar revisi kalimat. Kami sarankan menyelesaikan ini lebih dulu sebelum menyunting kata per kata.

## 1. Testimoni pelanggan seluruhnya fiktif

Ketiga testimoni di section Cerita Pelanggan (TESTI-01 sampai TESTI-03) beserta nama dan kotanya kami karang sebagai contoh tampilan. Tidak ada pelanggan bernama Rani P., Dimas A., maupun Laras W.

Kalau teks ini hanya dipoles lalu website ditayangkan, Koka Scent menerbitkan testimoni palsu atas nama brand sendiri. Pilihannya tiga: ganti dengan testimoni pelanggan sungguhan beserta izin tertulis dari mereka, minta kami menghapus section ini sampai testimoni asli tersedia, atau tayangkan tanpa nama dan kota.

Sebagai catatan teknis, kami sengaja **tidak** memasang penanda ulasan (`Review` / `AggregateRating`) untuk Google pada section ini. Google melarang data terstruktur untuk ulasan yang bukan dari pelanggan sungguhan, dan pelanggarannya berisiko sanksi manual pada seluruh domain. Penanda itu baru akan kami pasang setelah testimoni diganti dengan yang asli.

## 2. Cerita brand adalah teks contoh

Ketiga paragraf di section Cerita Koka Scent (CERITA-01 sampai CERITA-03) kami tulis sebagai pengisi agar tata letaknya bisa dinilai. Narasi tentang "disiplin peracikan Jepang" dan "batch kecil" bukan berasal dari Koka Scent. Mohon ditulis ulang sepenuhnya.

## 3. Tiga angka statistik belum terverifikasi

CERITA-04-A hingga CERITA-06-A menampilkan **12 aroma dalam koleksi**, **8 jam ketahanan rata-rata**, dan **2019 sebagai tahun mulai**. Ketiganya kami tulis manual, tidak dihitung dari data mana pun. Angka-angka ini akan terbaca publik sebagai klaim resmi. Mohon dikonfirmasi satu per satu.

Perhatikan juga bahwa "12" muncul dua kali di tempat berbeda — sekali sebagai angka di CERITA-04-A, sekali sebagai kata "dua belas" di CTA-03.

## 4. FAQ memuat janji operasional yang mengikat

Enam jawaban FAQ memuat komitmen yang akan ditagih pelanggan: pengiriman hari yang sama untuk pesanan sebelum pukul 15.00 WIB, estimasi tiba 1–2 hari Jabodetabek dan 2–5 hari luar Jawa, retur 7 hari untuk produk bersegel, penggantian gratis kalau tidak sesuai deskripsi, dan klaim konsentrasi minyak 15–20%.

Ini kebijakan bisnis, bukan copywriting. Semuanya juga dikirim ke Google sebagai data terstruktur dan berpotensi tampil langsung di hasil pencarian.

## 5. Klaim ketahanan aroma saling bertentangan

Angka ketahanan muncul di empat tempat dengan dua nilai berbeda:

| Lokasi | Klaim |
|--------|-------|
| VALUE-02-J | Tahan 8+ jam |
| CERITA-05-A | 8 jam ketahanan rata-rata |
| SEO-05 | Tahan 8+ jam |
| FAQ-01-J | EDP bertahan 6–8 jam |

Selain itu, ANAT-02-B menyebut *middle notes* bertahan paling lama di kulit, sementara FAQ-02-J dan ANAT-03-B menyebut *base notes* yang paling membekas. Mohon disepakati satu versi untuk masing-masing.

## 6. Beberapa tombol dan tautan belum punya tujuan

| ID | Teks | Masalah |
|----|------|---------|
| HERO-04 & HERO-05 | Belanja Sekarang / Lihat Koleksi | Dua tombol bersebelahan, keduanya menuju halaman katalog yang sama |
| CTA-04 & CTA-05 | Belanja Sekarang / Lihat Semua Aroma | Sama — dua tombol, satu tujuan |
| FOOT-01 & FOOT-02 | Katalog / Koleksi | Dua tautan footer, keduanya menuju katalog |
| FOOT-03 | Tentang | Menuju halaman utama, karena halaman "Tentang" belum dibuat |
| CTA-03 | "Tim kami bantu carikan yang paling cocok" | Belum ada kanal kontak — tidak ada WhatsApp, live chat, maupun formulir |

Mohon ditentukan: tombol kedua dihapus, atau diarahkan ke tujuan lain. Untuk CTA-03, perlu diputuskan kanal kontak apa yang dipakai, atau kalimatnya diubah agar tidak menjanjikan bantuan yang belum tersedia.

---

# Di Luar Cakupan Dokumen Ini

**Nama produk, harga, notes, ukuran varian, dan stok** tersimpan di database dan sudah dapat diubah sendiri lewat admin panel. Tidak perlu lewat dokumen ini.

**Label tombol fungsional, formulir checkout, pesan kesalahan, dan nama status pesanan** belum dimasukkan karena bersifat teknis dan jarang direvisi. Beri tahu kami kalau ingin ikut ditinjau.

**Seluruh foto produk saat ini adalah gambar contoh dari Unsplash**, bukan foto produk Koka Scent. Beberapa di antaranya masih menampilkan kemasan bermerek lain. Semuanya harus diganti dengan foto asli sebelum website ditayangkan. Penggantian foto dilakukan lewat admin panel, di luar cakupan dokumen ini.
