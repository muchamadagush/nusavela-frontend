import { createFileRoute, Link } from '@tanstack/react-router'
import { cities, seo } from '../lib/api'
import { formatTimezoneLabel } from '../lib/format'
import { CityPicker } from '../components/CityPicker'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      return { cities: await cities(), unavailable: false }
    } catch {
      return { cities: [], unavailable: true }
    }
  },
  head: () =>
    seo(
      'NusaVela — Jelajahi Nusantara',
      'Temukan wisata, fasilitas kesehatan, transportasi dan informasi lokal di Indonesia.',
      '/',
      { '@type': 'WebSite', name: 'NusaVela', url: 'https://nusavela.com' },
    ),
  component: Home,
})

function Home() {
  const data = Route.useLoaderData()
  const highlighted = data.cities.slice(0, 12)

  return (
    <main id="main">
      <section className="hero">
        <p className="eyebrow">KENALI DAERAH. TEMUKAN CERITA.</p>
        <h1>
          Nusantara,
          <br />
          <em>lebih dekat.</em>
        </h1>
        <p>
          Temukan wisata pilihan, fasilitas kesehatan & IGD 24 jam, rute transportasi, dan kabar daerah di 514 kabupaten/kota tujuan Anda.
        </p>
      </section>

      <CityPicker cities={data.cities} />

      {data.unavailable && (
        <p role="status" className="panel section">
          Daftar kota belum dapat dimuat dari server. Coba muat ulang beberapa saat lagi.
        </p>
      )}

      <section className="section grid">
        {[
          [
            '🧭 Jelajah wisata & kuliner',
            'Temukan destinasi unggulan, estimasi harga tiket, jam buka, dan penginapan terdekat.',
          ],
          [
            '🏥 Layanan darurat & IGD 24 jam',
            'Akses cepat ke nomor darurat terverifikasi (112/119), rumah sakit, apotek, dan layanan publik.',
          ],
          [
            '📰 Kabar & agenda daerah',
            'Pantau cuaca terkini, berita lokal terkurasi, serta kalender festival dan event kota.',
          ],
        ].map(([title, text]) => (
          <article key={title} className="panel">
            <h2>{title}</h2>
            <p className="muted">{text}</p>
          </article>
        ))}
      </section>

      {highlighted.length > 0 && (
        <section className="section">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <p className="eyebrow">DIREKTORI DAERAH</p>
              <h2>Jelajahi Kota & Kabupaten</h2>
            </div>
            <span className="mono muted">{data.cities.length} daerah aktif</span>
          </div>
          <div className="grid">
            {highlighted.map(c => (
              <Link
                key={c.id}
                to="/kota/$citySlug"
                params={{ citySlug: c.slug }}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  {c.tier === 1 ? (
                    <span className="badge">Kota Unggulan</span>
                  ) : (
                    <span className="muted mono">Kab/Kota</span>
                  )}
                  <span className="mono muted">
                    {formatTimezoneLabel(c.timezone)}
                  </span>
                </div>
                <h3>{c.name}</h3>
                <p className="muted">
                  Wisata · RS & IGD · Kuliner · Transportasi →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
