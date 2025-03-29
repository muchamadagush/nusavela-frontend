import { createFileRoute } from '@tanstack/react-router'
import { cities, seo } from '../lib/api'
import { CityPicker } from '../components/CityPicker'
export const Route = createFileRoute('/')({
  loader: async () => { try { return { cities: await cities(), unavailable: false } } catch { return { cities: [], unavailable: true } } },
  head: () => seo('NusaVela — Jelajahi Nusantara', 'Temukan wisata, fasilitas kesehatan, transportasi dan informasi lokal di Indonesia.', '/', { '@type': 'WebSite', name: 'NusaVela', url: 'https://nusavela.com' }), component: Home,
})
function Home() { const data = Route.useLoaderData(); return <main id="main"><section className="hero"><p className="eyebrow">KENALI DAERAH. TEMUKAN CERITA.</p><h1>Nusantara,<br /><em>lebih dekat.</em></h1><p>Temukan wisata, layanan kesehatan, dan informasi lokal di kota tujuan Anda.</p></section><CityPicker cities={data.cities} />{data.unavailable && <p role="status">Daftar kota belum dapat dimuat dari server. Coba muat ulang beberapa saat lagi.</p>}<section className="section grid">{[['Jelajah wisata', 'Temukan destinasi dan rute menuju cerita berikutnya.'], ['Layanan sehari-hari', 'Cari fasilitas kesehatan, transportasi, dan layanan publik.'], ['Kabar dari daerah', 'Ikuti berita dan agenda dari sumber lokal.']].map(([title, text]) => <article key={title} className="panel"><h2>{title}</h2><p className="muted">{text}</p></article>)}</section></main> }
