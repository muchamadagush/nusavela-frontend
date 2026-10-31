# Kontrak frontend → Rust API v1

Kontrak ini merupakan kebutuhan frontend, **belum diverifikasi terhadap backend** karena repository backend mengembalikan 404 saat pemeriksaan. Seluruh respons JSON; error memakai status HTTP bukan array kosong. URL dasar dikonfigurasi lewat `VITE_API_URL`.

| Metode | Path setelah `/api/v1` | Respons / perilaku |
| --- | --- | --- |
| GET | `/cities` | Array seluruh kota aktif `{id,name,slug,latitude,longitude,short_name?}`. Angka koordinat berupa JSON number, bukan string DECIMAL. |
| GET | `/cities/nearest?lat=&lng=` | Objek kota aktif terdekat. Tolak koordinat nonfinite dan di luar rentang. |
| GET | `/cities/{slug}` | Objek kota; 404 bila tidak ada/nonaktif. |
| GET | `/categories` | Array `{slug,name}`. |
| GET | `/kota/{city}/{category}` | Array Place. Filter `lat,lng,radius_meters,is_24_hours,sort,page`. Ukuran halaman 60; stable tie break memakai ID. |
| GET | `/kota/{city}/{category}/{place}` | Satu Place aktif yang memang termasuk kota dan kategori pada path. |
| POST | `/submissions` | Terima `{city_id,place_id,submission_type,submitter_name,submitter_contact,payload:{message}}`; hasil `{id}`. Status harus `pending`, tidak mengubah listing sebelum moderasi. |
| POST | `/clicks` | `{city_id,place_id,click_type}`; target URL diputuskan server dari listing, bukan dipercaya dari klien. Respons JSON. Kegagalan tidak menghambat navigasi pengguna. |

## Place

Wajib: `id,name,slug,address` (nullable), `latitude,longitude` (number), `is_24_hours,is_sponsored`.

Opsional: `is_verified`, `sponsored_until` (ISO8601/null), `distance_meters` (number/null), `opening_hours,description,affiliate_hotel_url,affiliate_ticket_url` (string/null).

Frontend menyembunyikan status sponsor bila tanggal berakhir kosong atau kedaluwarsa. Server wajib menerapkan aturan yang sama sebelum mengurutkan tempat. Sponsor bukan bukti verifikasi.

## Validasi server yang tetap wajib

Validasi frontend bukan kontrol keamanan. Backend harus memvalidasi koordinat, radius 100–100000 meter, page 1–10000, tipe kontribusi, panjang dan struktur payload, hubungan city/place, serta target link HTTPS. Query memakai parameter SQL, error internal tidak bocor ke klien. Endpoint publik POST memerlukan pembatasan laju dan proteksi penyalahgunaan. Admin memerlukan autentikasi JWT dan otorisasi terpisah.

API membaca data PostgreSQL/PostGIS, tidak boleh memakai fixture test sebagai data nasional. CORS harus membatasi origin frontend yang diizinkan. Endpoint kota, kategori, dan tempat tidak boleh mengembalikan kontak pengirim kontribusi. Halaman publik tidak bergantung pada token admin.
