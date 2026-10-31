# NusaVela Frontend

Web SSR TanStack Start untuk direktori informasi lokal Indonesia.

## Struktur
Repo ini adalah bagian frontend dari arsitektur di `AGENTS.md`; direktori `frontend/` pada blueprint dipetakan ke root repo ini. Backend Rust dan migrasi PostgreSQL/PostGIS berada di repo `nusavela-backend` yang terpisah.

## Keputusan implementasi
- Maksimal ringkasan RSS 160 karakter, mengikuti batas PRD yang lebih ketat.
- Sponsor hanya mendapat prioritas selama masa aktif; label sponsor berbeda dari status verifikasi.
- Koordinat nol valid. Latitude dan longitude wajib berpasangan; input nonfinite ditolak.
- Sumber wilayah harus menyediakan koordinat dan versi batas administratif yang diverifikasi. Jumlah 38/514 merupakan target cakupan, bukan data yang boleh direkayasa.
- Data OSM memerlukan identitas gabungan tipe objek + ID untuk menghindari benturan node/way/relation.
- Penempatan POI ke kota sebaiknya memakai polygon administrasi; pusat kota terdekat hanya fallback yang diberi penanda.
- Target waktu impor, performa, SEO dan pendapatan pada PRD memerlukan pengukuran, bukan jaminan implementasi.

## Status awal
Frontend kosong pada pemeriksaan awal. Akses repository backend mengembalikan 404 sehingga kontrak API perlu diverifikasi setelah repository tersedia. Tidak ada data demo yang dianggap sebagai data nasional terverifikasi.

## Menjalankan dan memeriksa

Gunakan Node.js 24 LTS (Node 22.12+ untuk Vite, tetapi test TypeScript langsung menggunakan runtime Node 24).

```sh
npm ci
cp .env.example .env
# Isi VITE_API_URL dan URL tile raster yang berlisensi.
npm run dev
```

```sh
npm run build
npm run typecheck
npm test
npm run test:integration
```

Uji integrasi mengimpor hasil build server dan memakai fixture API dalam memori; tidak mengakses database produksi. `VITE_API_URL` bersifat publik dan harus dapat dijangkau browser serta SSR. Perubahan variabel `VITE_*` membutuhkan rebuild.

`VITE_MAP_TILE_URL` mengharapkan template raster `{z}/{x}/{y}`. Endpoint vector MVT Martin tidak dapat digunakan langsung oleh Leaflet raster; gunakan provider raster berlisensi atau adapter raster, atau implementasikan MapLibre dengan style vector sebelum menghubungkan Martin.

Lihat `docs/IMPLEMENTATION_REVIEW.md` untuk cakupan, keterbatasan, dan urutan pekerjaan berikutnya; `docs/API_CONTRACT.md` untuk kontrak integrasi yang masih menunggu validasi terhadap backend.
