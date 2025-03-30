import { createRootRoute, HeadContent, Outlet, Scripts, Link } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { I18nProvider, useI18n } from '../lib/i18n'
import styles from '../styles/app.css?url'

const TRAVELPAYOUTS_DRIVE_HEAD_SCRIPT = `
  (function () {
      var script = document.createElement("script");
      script.async = 1;
      script.setAttribute("data-cmp-ab","2");
      script.src = 'https://tpembars.com/NTk1ODM0.js?t=595834';
      document.head.appendChild(script);
  })();
`

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
  notFoundComponent: () => <NotFoundView />,
  errorComponent: ({ reset }) => <ErrorView reset={reset} />,
})

function NotFoundView() {
  const { tx } = useI18n()
  return (
    <main>
      <section className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p className="eyebrow">{tx('404 · HALAMAN TIDAK DITEMUKAN', '404 · PAGE NOT FOUND')}</p>
        <h1>{tx('Destinasi belum terdaftar', 'Destination not found')}</h1>
        <p className="muted" style={{ margin: '0 auto 24px', maxWidth: '480px' }}>
          {tx(
            'Halaman atau rute yang Anda tuju tidak ditemukan. Silakan kembali ke beranda untuk menjelajahi 514 kabupaten/kota di Indonesia.',
            'The page or route you requested could not be found. Return home to explore 514 regencies and cities across Indonesia.',
          )}
        </p>
        <Link to="/" className="button">
          ← {tx('Kembali ke Beranda NusaVela', 'Back to NusaVela Home')}
        </Link>
      </section>
    </main>
  )
}

function ErrorView({ reset }: { reset: () => void }) {
  const { tx } = useI18n()
  return (
    <main role="alert">
      <section className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p className="eyebrow">{tx('GANGGUAN JARINGAN', 'NETWORK INTERRUPTION')}</p>
        <h1>{tx('Informasi belum dapat dimuat', 'Information could not be loaded')}</h1>
        <p className="muted">
          {tx(
            'Periksa koneksi Anda atau coba kembali beberapa saat lagi.',
            'Please check your connection or try again in a moment.',
          )}
        </p>
        <button onClick={reset}>{tx('Coba kembali', 'Try again')}</button>
      </section>
    </main>
  )
}

function AppShell({
  theme,
  toggleTheme,
}: {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}) {
  const { locale, setLocale, tx } = useI18n()

  return (
    <>
      <a className="skip" href="#main">
        {tx('Lewati ke konten', 'Skip to main content')}
      </a>
      <div className="top-utility-bar">
        <div className="top-utility-inner">
          <span>
            🇮🇩{' '}
            {tx(
              'Panduan Wisata, Kuliner, Transportasi & Layanan Darurat 514 Kab/Kota',
              "Indonesia's 514-City Tourism, Culinary, Transit & Emergency Utility Guide",
            )}
          </span>
          <div className="row" style={{ gap: '16px' }}>
            <span>
              📞 {tx('Darurat Nasional:', 'National Emergency:')}{' '}
              <strong>112</strong> · {tx('Medis SPGDT:', 'Medical ER:')}{' '}
              <strong>119</strong>
            </span>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">✦</span>
            <div>
              NusaVela
              <span className="brand-sub">
                {tx(
                  'LAYAR JELAJAH NUSANTARA · 514 KOTA',
                  'WONDERFUL ARCHIPELAGO & LOCAL GUIDE',
                )}
              </span>
            </div>
          </Link>

          <nav
            aria-label={tx(
              'Navigasi kepulauan dan fitur utama',
              'Archipelago and main feature navigation',
            )}
            className="header-nav"
          >
            <a href="/#rekomendasi-populer" className="nav-link">
              {tx('Destinasi Populer', 'Popular Destinations')}
            </a>
            <a href="/#hidden-gems" className="nav-link">
              {tx('Hidden Gems', 'Hidden Gems')}
            </a>
            <a href="/#jelajah-kepulauan" className="nav-link">
              {tx('Jelajah 6 Kepulauan', 'Explore 6 Islands')}
            </a>

            <div
              className="lang-switcher"
              role="group"
              aria-label={tx('Pilih bahasa', 'Select language')}
            >
              <button
                type="button"
                onClick={() => setLocale('id')}
                aria-pressed={locale === 'id'}
                className={`lang-btn ${locale === 'id' ? 'active' : ''}`}
                title="Bahasa Indonesia (Default)"
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                aria-pressed={locale === 'en'}
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={tx(
                'Ubah tema tampilan terang atau malam',
                'Toggle light or dark display mode',
              )}
            >
              {theme === 'light'
                ? tx('🌙 Mode Malam', '🌙 Night')
                : tx('☀️ Mode Terang', '☀️ Light')}
            </button>

            <Link to="/admin" className="nav-link operator-pill">
              🔐 {tx('Portal Operator', 'Operator Portal')}
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
              {tx(
                'Sebagai pedoman wisata dan utilitas publik Nusantara, NusaVela menghadirkan panduan lengkap destinasi unggulan, kuliner, transportasi, agenda budaya, serta fasilitas kesehatan & IGD 24 jam di 38 provinsi dan 514 kabupaten/kota Indonesia.',
                'As an Indonesian travel and civic utility platform, NusaVela delivers curated guides to iconic attractions, regional cuisine, transit hubs, cultural festivals, and 24-hour emergency hospitals across 38 provinces and 514 regencies/cities.',
              )}
            </p>
          </div>
          <div>
            <h4>{tx('Jelajah Kepulauan', 'Explore the Archipelago')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/kota/$citySlug" params={{ citySlug: 'kota-bandung' }}>
                  {tx('Jawa · Kota Bandung', 'Java · Bandung City')}
                </Link>
              </li>
              <li>
                <Link to="/kota/$citySlug" params={{ citySlug: 'kota-yogyakarta' }}>
                  {tx('Jawa · Kota Yogyakarta', 'Java · Yogyakarta City')}
                </Link>
              </li>
              <li>
                <Link to="/kota/$citySlug" params={{ citySlug: 'kota-denpasar' }}>
                  {tx('Bali · Kota Denpasar', 'Bali · Denpasar City')}
                </Link>
              </li>
              <li>
                <Link
                  to="/kota/$citySlug"
                  params={{ citySlug: 'kabupaten-manggarai-barat' }}
                >
                  {tx('NTT · Labuan Bajo', 'NTT · Labuan Bajo (Komodo)')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{tx('Pesona Nusantara', 'Archipelago Wonders')}</h4>
            <ul className="footer-links">
              <li>
                <Link
                  to="/kota/$citySlug"
                  params={{ citySlug: 'kabupaten-raja-ampat' }}
                >
                  {tx('Papua · Raja Ampat', 'Papua · Raja Ampat')}
                </Link>
              </li>
              <li>
                <Link to="/kota/$citySlug" params={{ citySlug: 'kota-manado' }}>
                  {tx('Sulawesi · Bunaken Manado', 'Sulawesi · Bunaken Manado')}
                </Link>
              </li>
              <li>
                <Link
                  to="/kota/$citySlug"
                  params={{ citySlug: 'kabupaten-samosir' }}
                >
                  {tx('Sumatera · Danau Toba', 'Sumatra · Lake Toba')}
                </Link>
              </li>
              <li>
                <Link to="/kota/$citySlug" params={{ citySlug: 'kota-singkawang' }}>
                  {tx('Kalimantan · Singkawang', 'Kalimantan · Singkawang')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{tx('Layanan & Bahasa', 'Services & Language')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/admin">
                  {tx('Login Operator & Kurator', 'Operator & Curator Login')}
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml">
                  {tx('Peta Situs (XML Sitemap)', 'XML Sitemap')}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                  className="chip"
                >
                  {locale === 'id'
                    ? '🇬🇧 Switch to English'
                    : '🇮🇩 Gunakan Bahasa Indonesia'}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            {tx(
              '© 2026 NusaVela (`nusavela.com`). Data peta © OpenStreetMap contributors · Cuaca oleh OpenWeather · Verifikasi informasi darurat langsung kepada penyelenggara resmi.',
              '© 2026 NusaVela (`nusavela.com`). Map data © OpenStreetMap contributors · Weather by OpenWeather · Verify critical emergency details directly with official providers.',
            )}
          </p>
        </div>
      </footer>
    </>
  )
}

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
        <script
          {...({ nowprocket: '' } as Record<string, string>)}
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          seraph-accel-crit="1"
          data-no-defer="1"
          data-cmp-ab="2"
          dangerouslySetInnerHTML={{ __html: TRAVELPAYOUTS_DRIVE_HEAD_SCRIPT }}
        />
      </head>
      <body>
        <QueryClientProvider client={client}>
          <I18nProvider>
            <AppShell theme={theme} toggleTheme={toggleTheme} />
          </I18nProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
