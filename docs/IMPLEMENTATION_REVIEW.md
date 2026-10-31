# Review empat dokumen NusaVela dan status implementasi

Tanggal pemeriksaan: 31 Oktober 2026. Empat berkas lampiran dibaca penuh: agents.md (83 baris), skill.md (65), design(1).md (91), PRD (592). Snapshot dokumen dipertahankan dalam repository ini.

## Kondisi repository dan akses

- GitHub terhubung sebagai `muchamadagush`.
- `muchamadagush/nusavela-frontend`: repository kosong, default branch main; bisa dibaca. Percobaan membuat README di main ditolak HTTP 403 `Resource not accessible by integration`. Tidak ada perubahan remote yang berhasil.
- `muchamadagush/nusavela-backend`: pemeriksaan metadata mengembalikan HTTP 404; pencarian nama repository juga tidak menemukan hasil. Ini tidak membuktikan repo tidak ada, karena izin koneksi dapat menyembunyikan repo privat.
- Rust/Cargo/PostgreSQL tidak tersedia pada runtime pemeriksaan ini. Backend belum diimplementasikan atau diuji.
- Commit disusun lokal di main. Tidak ada klaim push berhasil. Perbaikan izin GitHub diperlukan sebelum meneruskan rangkaian commit/push per fitur.

## Hasil analisis spesifikasi

| Temuan | Keputusan / konsekuensi |
| --- | --- |
| AGENTS mengharuskan monorepo, permintaan pengguna dua repo | Instruksi pengguna berlaku: root frontend menggantikan folder `frontend/`; backend dan migrasi harus berada di repo backend. |
| RSS di AGENTS/SKILL mengizinkan 160–200 karakter, PRD menyebut maksimal 160 | Pilih maksimal 160 Unicode characters; bersihkan markup, pertahankan sumber dan tautan. Belum ada worker RSS. |
| API wilayah dicontohkan seolah menyediakan pusat koordinat dan cakupan mutakhir | Verifikasi versi dataset, jumlah wilayah, ID dan koordinat sebelum impor. Jangan mengisi koordinat nol atau mengklaim 514 kota tanpa data. |
| `osm_id BIGINT UNIQUE` menyatukan namespace OSM | Schema backend harus memakai `UNIQUE(osm_type,osm_id)`; node dan way dapat memakai ID numerik sama. |
| Kota terdekat dianggap sebagai kota tempat POI berada | Utamakan point-in-polygon batas administrasi; nearest-centroid hanya fallback dengan penanda kualitas. |
| Parser way membutuhkan referensi node | Seeder way perlu resolusi node/geometry; satu pass node sederhana tidak cukup. Batasi memori, checkpoint dan batch dengan backpressure. |
| Upsert OSM berpotensi menimpa kurasi dan sponsor | Pisahkan atribut sumber dengan atribut hasil verifikasi admin; proses impor idempotent dan transaksi per batch. |
| Urutan sponsor di contoh PRD mengabaikan tier dan expiry | Server perlu menghitung sponsor efektif dan mengurutkan tier, distance, rating serta stable ID. Frontend tidak menampilkan sponsor kedaluwarsa. |
| `.bind(params.lng)` dan `.bind(params.lat)` di contoh backend | Urutan itu benar untuk ST_MakePoint(longitude,latitude); pertahankan dan uji. |
| Contoh frontend `deps.lat && deps.lng` | Salah untuk koordinat nol; implementasi memakai `!== undefined`. |
| Boolean URL dan Zod coercion | `Boolean('false')` bernilai true; implementasi parse literal true/false secara eksplisit. |
| Contoh handler `Result<_, String>` mengekspos database error dan tidak menyediakan respons Axum terstruktur | Backend memerlukan AppError + IntoResponse, status konsisten, log internal terpisah. |
| SQLx query_as dinamis disebut memeriksa SQL saat compile | Dynamic query_as tidak memeriksa SQL terhadap database saat compile; butuh query macros + metadata offline atau integration test database nyata. |
| `geo` boleh kosong / trigger pembaruan | Trigger harus menghapus geometry bila koordinat dibersihkan; schema harus menerapkan rentang koordinat dan integritas lat/lng berpasangan. |
| Tanggal dan harga event tidak diberi CHECK | Backend perlu end >= start, harga nonnegatif, interval tanggal dengan zona waktu kota. |
| Cache public untuk halaman berbasis GPS | Cache key CDN harus menyertakan search params; pertimbangkan private/no-store untuk konten dipersonalisasi. Cache error/submit/admin harus dipisah. |
| Martin menyajikan vector tile, Leaflet di sini raster | Jangan menghubungkan URL MVT langsung sebagai raster. Adapter/provider raster atau MapLibre + style dibutuhkan. |
| Warna gold disebut WCAG compliant untuk semua konteks | Warna token bukan jaminan kontras setiap pasangan. Gold digunakan sebagai border/badge; kontras dan aksesibilitas perlu audit visual. |
| Status 24 jam diperlakukan sama dengan IGD | Data jam buka saja tidak membuktikan ada IGD. Perlu atribut emergency/layanan dan verifikasi untuk direktori darurat. |
| Target impor <3 menit, RAM <30 MB, SQL <10 ms, indeks >90%, CTR 3–5% | Target pengukuran; belum dapat dijanjikan tanpa dataset dan benchmark aktual. |

## Cakupan kode frontend saat ini

| Modul | Status |
| --- | --- |
| TanStack Start + Router, React Query provider, Tailwind v4 | Diimplementasikan; build client dan SSR lulus. |
| Token warna light/dark, serif/sans/mono fallback, layout 55/45 | Diimplementasikan. Font bernama belum dibundel; fallback lokal dipakai. |
| Beranda, pencarian kota, kontrol keyboard, GPS setelah klik | Diimplementasikan; integrasi backend belum nyata. |
| Dashboard kota | Dasar kategori dinamis tersedia. Widget cuaca, darurat, berita, wisata dan event belum selesai. |
| Direktori dengan validasi Zod dan filter URL | Diimplementasikan: lat/lng berpasangan, radius, 24 jam, sort, page. |
| Detail lokasi, link rute | Diimplementasikan. Harga tiket/foto/kontak belum tersedia dalam kontrak aktif. |
| Peta | Leaflet client-only, marker dan atribusi OSM; konfigurasi tile wajib. Drag grip daftar mobile dasar tersedia; belum diuji sentuh di browser. Marker per kategori dan sponsor belum diimplementasikan. |
| Metadata SEO, canonical, Open Graph, JSON-LD, ISR | Diimplementasikan pada rute kota/kategori/detail. Sitemap dan robots belum dibuat. |
| Form koreksi dan klaim | UI dan POST kontrak tersedia; endpoint, moderasi dan anti-abuse backend belum tersedia. |
| Afiliasi dan click tracking | HTTPS link tervalidasi, rel sponsored, POST tidak menghambat navigasi. Link komersial disembunyikan pada kategori medis/layanan publik. Belum ada akun affiliate/URL nyata. |
| Perlindungan UI darurat | Tidak ada iklan atau popup yang diimplementasikan. Panel SOS terverifikasi dan kontak API belum selesai. |
| Backend Rust, PostGIS dan data nasional | Terblokir akses; tidak ada implementasi atau pengujian. |
| RSS, weather, event, admin JWT, promosi sponsor, seeders | Belum selesai; membutuhkan backend, data dan kredensial yang sesuai. |
| Flutter, AI itinerary, transport koridor terkurasi | Belum diimplementasikan. Dua repo yang diminta hanya backend dan frontend web. |
| Docker, deployment VPS, Martin, integrasi CDN | Belum diimplementasikan atau dipublikasikan. |

## Verifikasi dan batasnya

Build produksi, typecheck dan lima test input dijalankan. Pengujian SSR memakai fixture API terkontrol untuk empat rute, metadata, cache, escaping konten, dan kondisi API tidak tersedia. Fixture adalah data pengujian, tidak ditampilkan sebagai data produksi. Tidak ada pengujian browser, izin GPS nyata, perangkat sentuh, database/PostGIS, performa atau integrasi dengan backend asli. UI saat API tidak tersedia tidak mengklaim cakupan nasional sudah terisi.

## Urutan implementasi berikutnya setelah akses pulih

1. Pastikan GitHub App punya Contents read/write pada kedua repository dan repo backend tersedia dengan owner/path yang tepat. Fetch main terbaru sebelum menerapkan commit lokal; jangan force push.
2. Push fondasi frontend dan verifikasi tiap commit. Pertahankan commit kecil per fitur di main sesuai instruksi pengguna.
3. Backend: skeleton Axum dan AppError; migrasi PostGIS; kategori; cities/nearest; directory/detail; integration tests PostGIS. Jalankan cargo check, clippy -D warnings dan cargo test sebelum commit.
4. Validasi kontrak API terhadap frontend. Tambahkan pembatasan laju, CORS, observability dan pengujian error.
5. Seed wilayah terversi + koordinat; importer OSM node/way dengan identitas tipe dan checkpoint; uji idempotensi dan integritas kurasi.
6. Emergency contacts terverifikasi, layanan IGD, dashboard bento; kemudian worker RSS 160 karakter, weather TTL 30 menit + attribution, event.
7. Submit/moderasi JWT, sponsor dengan expiry dan audit, click tracking server-side; peta Martin/MapLibre, sitemap, robots dan audit aksesibilitas.
8. Docker/CI untuk tiap repo, database staging, smoke test lintas layanan, lalu konfigurasi deployment milik pengguna. Jangan mendaftarkan layanan eksternal atau mengklaim aktivasi affiliate/iklan tanpa akses dan data nyata.
