import { createRootRoute, HeadContent, Outlet, Scripts, Link } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import styles from '../styles/app.css?url'
export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'NusaVela — Jelajahi Nusantara' }], links: [{ rel: 'stylesheet', href: styles }] }),
  component: Root,
  notFoundComponent: () => <main><h1>Halaman tidak ditemukan</h1><Link to="/">Kembali ke beranda</Link></main>,
  errorComponent: ({ reset }) => <main role="alert"><h1>Informasi belum dapat dimuat</h1><p>Periksa koneksi Anda atau coba kembali beberapa saat lagi.</p><button onClick={reset}>Coba kembali</button></main>,
})
function Root() {
  const [client] = useState(() => new QueryClient())
  return <html lang="id"><head><HeadContent /></head><body><a className="skip" href="#main">Lewati ke konten</a><QueryClientProvider client={client}><header><Link to="/" className="brand">NusaVela<span>LAYAR JELAJAH NUSANTARA</span></Link><nav aria-label="Navigasi utama"><Link to="/">Jelajahi kota</Link></nav></header><Outlet /><footer><strong>NusaVela</strong><p>Informasi lokal, untuk perjalanan dan keseharian Anda.</p><p>Data © OpenStreetMap contributors · Verifikasi informasi penting langsung kepada penyedia layanan.</p></footer></QueryClientProvider><Scripts /></body></html>
}
