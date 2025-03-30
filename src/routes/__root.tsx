import { createRootRoute, HeadContent, Outlet, Scripts, Link } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import styles from '../styles/app.css?url'

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'NusaVela — Pesona Destinasi & Informasi Lokal 514 Kota Indonesia' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: GOOGLE_FONTS_URL },
      { rel: 'stylesheet', href: styles },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <main>
      <section className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p className="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</p>
        <h1>Destinasi belum terdaftar</h1>
        <p className="muted" style={{ margin: '0 auto 24px', maxWidth: '480px' }}>
          Halaman atau rute yang Anda tuju tidak ditemukan. Silakan kembali ke beranda untuk menjelajahi 514 kabupaten/kota di Indonesia.
        </p>
        <Link to="/" className="button">
          ← Kembali ke Beranda NusaVela
        </Link>
      </section>
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main role="alert">
      <section className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p className="eyebrow">GANGGUAN JARINGAN</p>
        <h1>Informasi belum dapat dimuat</h1>
        <p className="muted">Periksa koneksi Anda atau coba kembali beberapa saat lagi.</p>
        <button onClick={reset}>Coba kembali</button>
      </section>
    </main>
  ),
})

function Root() {
  const [client] = useState(() => new QueryClient())
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('nusavela_theme')
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved)
        document.documentElement.setAttribute('data-theme', saved)
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    } catch {
      /* Ignore storage restrictions */
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      window.localStorage.setItem('nusavela_theme', next)
    } catch {
      /* Ignore storage restrictions */
    }
  }

  return (
    <html lang="id" data-theme={theme}>
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip" href="#main">
          Lewati ke konten
        </a>
        <QueryClientProvider client={client}>
          <div className="top-utility-bar">
            <div className="top-utility-inner">
              <span>🇮🇩 Panduan Wisata, Kuliner, Transportasi & Layanan Darurat 514 Kab/Kota</span>
              <div className="row" style={{ gap: '16px' }}>
                <span>📞 Darurat Nasional: <strong>112</strong> · Medis SPGDT: <strong>119</strong></span>
              </div>
            </div>
          </div>

          <header className="site-header">
            <div className="header-inner">
              <Link to="/" className="brand">
                <span className="brand-mark">✦</span>
                <div>
                  NusaVela
                  <span className="brand-sub">WONDERFUL ARCHIPELAGO & LOCAL GUIDE</span>
                </div>
              </Link>

              <nav aria-label="Navigasi kepulauan dan fitur utama" className="header-nav">
                <a href="/#rekomendasi-populer" className="nav-link">
                  Destinasi Populer
                </a>
                <a href="/#hidden-gems" className="nav-link">
                  Hidden Gems
                </a>
                <a href="/#jelajah-kepulauan" className="nav-link">
                  Jelajah 6 Kepulauan
                </a>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  aria-label="Ubah tema tampilan terang atau malam"
                >
                  {theme === 'light' ? '🌙 Mode Malam' : '☀️ Mode Terang'}
                </button>
                <Link to="/admin" className="nav-link operator-pill">
                  🔐 Portal Operator
                </Link>
              </nav>
            </div>
          </header>

          <Outlet />

          <footer className="site-footer">
            <div className="footer-grid">
              <div className="footer-brand-col">
                <strong className="footer-logo">NusaVela · nusavela.com</strong>
                <p className="muted">
                  Sebagai pedoman wisata dan utilitas publik Nusantara, NusaVela menghadirkan panduan lengkap destinasi unggulan, kuliner, transportasi, agenda budaya, serta fasilitas kesehatan & IGD 24 jam di 38 provinsi dan 514 kabupaten/kota Indonesia.
                </p>
              </div>
              <div>
                <h4>Jelajah Kepulauan</h4>
                <ul className="footer-links">
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kota-bandung' }}>Jawa · Kota Bandung</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kota-yogyakarta' }}>Jawa · Kota Yogyakarta</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kota-denpasar' }}>Bali · Kota Denpasar</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kabupaten-manggarai-barat' }}>NTT · Labuan Bajo</Link></li>
                </ul>
              </div>
              <div>
                <h4>Pesona Nusantara</h4>
                <ul className="footer-links">
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kabupaten-raja-ampat' }}>Papua · Raja Ampat</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kota-manado' }}>Sulawesi · Bunaken Manado</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kabupaten-samosir' }}>Sumatera · Danau Toba</Link></li>
                  <li><Link to="/kota/$citySlug" params={{ citySlug: 'kota-singkawang' }}>Kalimantan · Singkawang</Link></li>
                </ul>
              </div>
              <div>
                <h4>Layanan & Kemitraan</h4>
                <ul className="footer-links">
                  <li><Link to="/admin">Login Operator & Kurator</Link></li>
                  <li><a href="/sitemap.xml">Peta Situs (XML Sitemap)</a></li>
                  <li><span>Darurat Terpadu: 112 / 119</span></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>
                © 2026 NusaVela (`nusavela.com`). Data peta © OpenStreetMap contributors · Cuaca oleh OpenWeather · Verifikasi informasi darurat langsung kepada penyelenggara resmi.
              </p>
            </div>
          </footer>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
