# Hikimori Web 2.0 — Portofolio Mahfud Febry Styanto

Portofolio bergaya **soft dashboard** (warm gray → cream → kuning, kartu kaca membulat, pill hitam, tipografi Inter tipis) dengan **CMS tanpa coding** di `/admin`.

## Halaman

| URL | Isi |
|---|---|
| `/` | Dashboard ringkas: sapaan, komposisi masa kerja, angka besar, kartu foto, grafik **Pengalaman** (klik batang → pilih), **Deskripsi Kerja** (auto-slideshow + play/pause/next), **Usia** (bar tahun lahir → ∞ yang terus mengisi tapi tak pernah penuh), **Biodata & Pendidikan** (accordion), **Ringkasan** (gaya kalender), **Sertifikat & Lisensi** (kartu gelap) |
| `/profil` | Cerita lengkap, biodata, ringkasan, organisasi, hobi, sosial media, referensi |
| `/pengalaman` | Timeline seluruh pekerjaan + filter kategori, durasi, deskripsi lengkap, tag, komposisi masa kerja |
| `/pendidikan` | Cerita pendidikan, detail studi (IPK, mata kuliah, skripsi), alur & sejarah, organisasi kampus |
| `/sertifikat` | Semua lisensi/pelatihan/sertifikat + preview gambar & link verifikasi |
| `/keahlian` | Hard & soft skill dengan level, tools per grup |
| `/layanan` | Layanan + alur kerja sama |
| `/portofolio` | Proyek (koleksi Firestore `portfolio`) + detail modal |
| `/kontak` | Info kontak + form yang membuka WhatsApp / email |
| `/admin` | CMS |

URL lama `/about`, `/services` otomatis diarahkan ke halaman baru. Setiap kartu di dashboard punya tombol ↗ ke halaman detailnya.

## Intro

Monogram **HK** (SVG, sama dengan `src/components/LogoMark.tsx`) dirakit dari piksel → **cat air muncrat** dari logo → **berputar** jadi pusaran di tengah → cat membentuk huruf **H-I-K-I-M-O-R-I satu per satu** → huruf tajam muncul di atas cat lalu cat meresap. Semua di `public/index.html` (canvas 2D, tanpa library). HP: partikel 240 (desktop 640), resolusi 1×, durasi lebih singkat. Klik di mana saja untuk melewati; tidak tampil di `/admin`.

**Sekali per sesi:** intro penuh tampil saat pertama kali membuka situs; reload / kunjungan ulang di sesi (tab) yang sama memakai versi kilat ±1 detik. Untuk selalu menampilkan intro penuh, ganti `var QUICK = false; try { ... }` di `public/index.html` menjadi `var QUICK = false;`.

## Dashboard

- **Komposisi pengalaman profesional** — pill & angka "Th. profesional" hanya menghitung kategori relevan (HR & Administrasi, IT Support, Operasional). Pekerjaan lapangan/part-time (kategori *Lainnya*) tetap tampil lengkap di `/pengalaman`.
- **Kartu Pencapaian** — angka-angka dari CMS → Profil → Pencapaian. Bisa diganti kembali ke bar Usia lewat toggle di CMS.
- **Privasi** — tanggal lahir, usia & jenis kelamin disembunyikan dari publik secara bawaan (toggle di CMS → Profil & Biodata).

## SEO

- `src/seo/routes.json` = satu sumber judul & deskripsi tiap halaman (dipakai aplikasi saat berpindah halaman **dan** oleh skrip build).
- `npm run build` otomatis menjalankan `scripts/prerender-meta.js` (postbuild): membuat `build/<halaman>/index.html` dengan title/description/canonical/Open Graph sendiri, `404.html` (noindex), `sitemap.xml`, dan `robots.txt`. Preview link WhatsApp/LinkedIn tiap halaman jadi benar.
- Domain diambil dari `"site"` di `routes.json`, atau env `SITE_URL` saat build.
- `vercel.json`: URL lama `/about`, `/services`, `/portfolio` → redirect permanen 308; URL yang tidak ada → 404 sungguhan.

## CMS (`/admin`)

1. Buka `/admin/login`, masuk dengan **username `Mahfudfebry`** (atau email akun) + password akun Firebase.
2. Pilih menu: Profil & Biodata, Pengalaman, Pendidikan, Sertifikat, Keahlian & Tools, Layanan, Kontak & Referensi, Portofolio, Backup.
3. Semua teks punya kolom **Indonesia + English** (tombol *ID → EN* untuk menyalin). Gambar bisa **upload** (Cloudinary) atau tempel URL. Item bisa ditambah, diduplikat, dihapus, dan diurutkan.
4. Draft tersimpan otomatis di browser. Tekan **Publikasikan** → tersimpan ke Firestore (`siteContent/main`) dan langsung tampil untuk semua pengunjung.
5. **Backup & Reset**: unduh/import seluruh konten sebagai `.json`, atau kembalikan ke konten bawaan.
6. **Riwayat publikasi**: setiap Publikasikan otomatis menyimpan versi ke `siteContentHistory`; pulihkan versi lama ke draft dari menu Backup & Reset.
7. **Deteksi bentrok**: kalau konten sudah dipublikasikan dari tab/perangkat lain setelah draft Anda dibuat, CMS meminta konfirmasi sebelum menimpa.
8. Upload gambar dibatasi **hanya file gambar, maks. 5 MB**.

> Password admin **tidak lagi ditanam di kode**. Login sepenuhnya lewat Firebase Authentication. Ganti password di Firebase Console → Authentication → Users.

## Setup Firebase (sekali saja)

1. Firebase Console → **Authentication → Sign-in method** → aktifkan *Email/Password*. Pastikan user `mahfudfebry@hikimori.web.id` ada (buat di tab *Users* bila belum) dan gunakan password yang kuat.
2. **Firestore → Rules** → tempel isi file [`firestore.rules`](firestore.rules) → *Publish*.
   Publik hanya bisa membaca konten; menulis (dan membaca riwayat versi) hanya untuk email admin di atas.
3. Cloudinary: upload preset unsigned `clouds_hikimori` (lihat `src/config/services.ts`).

## Menjalankan

```bash
npm install
npm start        # mode development: http://localhost:3000
npm run local    # build production + server lokal: http://localhost:5050
npm run preview  # sajikan folder build yang sudah ada
```

Uji tampilan HP (mode lite) di browser desktop: `http://localhost:5050/?lite=1` (`?lite=0` untuk mematikan).

## Versi mobile (mode lite)

Aktif otomatis di HP/tablet sentuh, mode hemat data, jaringan 2G/3G, atau RAM ≤ 2 GB:

- **Muat bergantian berurutan** — kartu dashboard & blok halaman detail di-mount satu per satu lewat antrean (blok berikutnya menunggu blok sebelumnya selesai dirender + browser idle). Blok di bawah layar baru antre saat mendekati viewport.
- Tanpa `backdrop-filter`, gradien latar 1 lapis, bayangan ringan, animasi tak berujung dimatikan, angka langsung tampil.
- Foto memakai `srcset` Cloudinary (420/640/900 px) sesuai lebar layar.
- Intro lebih singkat & ringan, koneksi Firestore ditunda sampai render awal selesai.
- **Tanpa SDK Firestore untuk pengunjung** — konten & portofolio dibaca lewat Firestore REST API (satu fetch JSON). SDK (±330 KB JS) hanya dimuat di CMS.
- **Hanya animasi GPU (transform/opacity)** — bar Usia, progres slideshow, dan intro versi HP tidak memicu layout/paint ulang tiap frame.
- **Font sistem di HP** (Roboto / San Francisco) — font Inter 47 KB hanya untuk desktop.
- **CSS containment** per kartu — memasukkan satu kartu tidak memaksa hitung ulang layout seluruh halaman.
- Foto LCP di HP maks. 540 px (preload terpisah HP/desktop).

Hasil Lighthouse mobile (localhost): skor 47 → 74, main-thread 25,5 s → ±4 s, total unduhan 346 KB → 142 KB, CLS 0,02 → 0,006.

## Masa kerja

"Tahun kerja" = **masa kerja efektif**: gabungan semua periode kerja, pekerjaan yang tumpang-tindih dihitung sekali, dan **jeda tanpa pekerjaan tidak dihitung**. Rinciannya (termasuk daftar jeda) tampil di /pengalaman.

## Optimasi yang diterapkan

- Firebase (Auth & Firestore) di-load **lazy** setelah first paint → bundle utama jauh lebih kecil; konten tampil instan dari cache/bawaan.
- Pengunjung biasa **tidak memuat Firebase Auth** sama sekali.
- Semua halaman selain dashboard & CMS di-*code-split*.
- framer-motion, react-icons, heroicons, emailjs, ajv, react-intersection-observer dihapus — animasi pakai CSS + IntersectionObserver.
- Satu font variabel (Inter 300–600) dimuat non-blocking; 6 keluarga font lama dihapus.
- Dihapus: background JPG 337 KB, video kontak, canvas bintang/tinta, cursor glow (re-render tiap gerak mouse), puluhan animasi tak berujung.
- Service worker v2: cache aset statis + gambar Cloudinary (stale-while-revalidate).
- `vercel.json`: cache immutable untuk `/static`, header keamanan, SPA rewrite.

## Struktur

```
src/
├── content/        ← model konten (types), bawaan (defaults + seed.json), context Firestore, helper tanggal
├── components/     ← ui.tsx (ikon, reveal, modal…), Layout.tsx (navbar, footer)
├── pages/          ← Home + 8 halaman detail
├── admin/          ← CMS: AdminLogin, AdminPanel, PortfolioAdmin, fields (form kit)
├── contexts/       ← Auth, Language (ID/EN), Theme (terang/gelap)
├── hooks/          ← usePortfolio
└── index.css       ← design system
```
