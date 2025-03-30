import { createRootRoute, HeadContent, Outlet, Scripts, Link } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import styles from '../styles/app.css?url'

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'NusaVela — Jelajahi Nusantara' },
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
      <h1>Halaman tidak ditemukan</h1>
      <Link to="/" className="button">
        Kembali ke beranda
      </Link>
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main role="alert">
      <h1>Informasi belum dapat dimuat</h1>
      <p>Periksa koneksi Anda atau coba kembali beberapa saat lagi.</p>
      <button onClick={reset}>Coba kembali</button>
    </main>
  ),
})

function Root() {
  const [client] = useState(() => new QueryClient())
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip" href="#main">
          Lewati ke konten
        </a>
        <QueryClientProvider client={client}>
          <header>
            <Link to="/" className="brand">
              NusaVela<span>LAYAR JELAJAH NUSANTARA</span>
            </Link>
            <nav aria-label="Navigasi utama" className="row">
              <Link to="/" className="nav-link">
                Jelajahi 514 Kota
              </Link>
              <Link to="/admin" className="nav-link operator-pill">
                Login Operator
              </Link>
            </nav>
          </header>
          <Outlet />
          <footer>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>NusaVela (`nusavela.com`)</strong>
              <Link to="/admin">Portal Operator & Mitra UMKM</Link>
            </div>
            <p>Informasi lokal, untuk perjalanan dan keseharian Anda di 514 Kabupaten/Kota Indonesia.</p>
            <p>
              Data © OpenStreetMap contributors · Verifikasi informasi penting langsung kepada penyedia layanan.
            </p>
          </footer>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
