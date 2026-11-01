# Deployment web

Target PRD: VPS/container di balik reverse proxy HTTPS dan Cloudflare, domain nusavela.com. Domain di dokumen bukan bukti akses DNS/akun hosting.

Build: `npm ci && npm run build && npm run typecheck`. Jalankan `npm start` menggunakan Node 24 dan process supervisor. PORT default 3000; PUBLIC_ORIGIN adalah origin web. Gunakan RUST_API_URL untuk koneksi SSR privat ke Rust dan VITE_API_URL untuk URL API publik yang dijangkau browser. VITE_* disematkan ketika build; perubahan memerlukan rebuild. Backend CORS_ORIGINS harus memuat origin web persis.

Container: `docker build --build-arg VITE_API_URL=https://api.nusavela.com -t nusavela-web .`. Dalam managed cloud, baca runtime skill: gunakan `--secret id=proxy_ca,src="$CODEX_PROXY_CERT"` untuk npm agar tetap memverifikasi TLS. Jalankan container dengan RUST_API_URL menunjuk backend dalam network container, PUBLIC_ORIGIN=https://nusavela.com, port loopback host 3000. Jangan memasukkan ADMIN_JWT_SECRET atau token afiliasi ke VITE_*.

Konfigurasi tile raster berlisensi melalui build args VITE_MAP_TILE_URL dan VITE_MAP_ATTRIBUTION. Martin menghasilkan vector MVT dan memerlukan klien vector/adapter; jangan masukkan endpoint Martin ke Leaflet raster.

Validasi staging: /healthz, halaman kota/data aktual, sitemap.xml, robots.txt, asset CSS/JS, admin 401 tanpa token, CORS, form kontribusi, panggilan provider, serta log. Jalankan npm test, npm run test:integration dan npm run test:runtime. Cache CDN harus menyertakan seluruh query string; jangan cache /admin, API, request non-GET atau error. Header s-maxage saja tidak membuktikan CDN sudah aktif. Aktifkan TLS, pembatasan request, rotasi log, backup Postgres dan uji restore sebelum peluncuran.

Pipeline GitHub menjalankan verifikasi frontend setiap push/PR; hasil remote CI dan akses publik harus diperiksa tersendiri. Build lokal/container bukan deployment publik atau bukti indeksasi Search Console/AdSense.
