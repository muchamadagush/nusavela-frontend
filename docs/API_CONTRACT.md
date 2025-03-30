# Kontrak frontend → Rust API v1 (100% Tersinkronisasi)

Kontrak ini telah disinkronkan 100% antara `nusavela-frontend` (TanStack Start) dan `nusavela-backend` (Rust Axum 0.8 + SQLx + PostGIS). Seluruh respons menggunakan JSON dengan struktur error standar `{"error":{"code":"...","message":"..."}}`.

| Metode | Path setelah `/api/v1` | Respons / perilaku |
| --- | --- | --- |
| GET | `/coverage` | Statistik jumlah provinsi, kota aktif, tempat aktif/terverifikasi, dan kontak darurat aktif. |
| GET | `/sitemap/places?page=1` | Array `{city_slug,category_slug,place_slug,updated_at}` hingga 5.000 item per halaman untuk indeksasi SEO. |
| GET | `/cities` | Array seluruh kota aktif `{id,province_id,name,short_name,slug,latitude,longitude,tier,timezone}`. |
| GET | `/cities/nearest?lat=&lng=` | Objek kota aktif terdekat dalam radius 500 km. |
| GET | `/cities/{slug}` | Objek kota aktif; 404 bila tidak ditemukan. |
| GET | `/categories` | Array `{id,slug,name}`. |
| GET | `/kota/{city}/{category}` | Array `Place` lengkap. Mendukung filter `lat,lng,radius_meters,is_24_hours,emergency_only,sort,page`. Ukuran halaman 60; urutan: sponsor aktif (`is_sponsored DESC, sponsored_tier DESC`), jarak/rating, lalu ID stabil. |
| GET | `/kota/{city}/{category}/{place}` | Satu objek `Place` aktif yang cocok dengan kota dan kategori pada path. |
| GET | `/cities/{slug}/emergency` | Daftar nomor darurat nasional & kota yang aktif dan terverifikasi (`source_url` & `verified_at`). |
| GET | `/cities/{slug}/weather` | Data suhu, deskripsi cuaca, waktu pengamatan, dan atribusi OpenWeather (cache 30 menit). |
| GET | `/cities/{slug}/news` | Maksimal 30 berita daerah/provinsi terbaru dengan ringkasan maksimal 160 karakter. |
| GET | `/cities/{slug}/events` | Daftar agenda kota aktif dalam rentang tanggal (default 31 hari ke depan). |
| POST | `/submissions` | Menerima `{city_id,place_id,submission_type,submitter_name,submitter_contact,payload:{message}}` untuk 4 tipe: `correction`, `business_claim`, `new_place`, dan `new_event`. |
| POST | `/clicks` | Menerima `{city_id,place_id,click_type}` untuk 4 tipe: `affiliate_hotel`, `affiliate_ticket`, `whatsapp_lead`, dan `phone_call`. Target URL ditentukan oleh server. |
| GET/POST/PATCH | `/admin/*` | Endpoint moderasi kontribusi, pembuatan entitas terkurasi, pengaturan sponsor (`tier`, `until`, `payment_reference`), tautan afiliasi, dan analitik klik 30 hari (wajib Bearer JWT HS256). |
