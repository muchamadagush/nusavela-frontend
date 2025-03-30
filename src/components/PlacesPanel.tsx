import { Link } from '@tanstack/react-router'
import { PlaceCard } from './PlaceCard'
import type { City, Place } from '../lib/api'

export function PlacesPanel({
  city,
  places,
  medical = false,
}: {
  city: City
  places: Place[] | null
  medical?: boolean
}) {
  const category = medical ? 'rumah-sakit' : 'wisata'
  return (
    <section className="panel places-showcase-panel">
      <div className="panel-header-row">
        <div>
          <p className="eyebrow">
            {medical ? 'LAYANAN KESEHATAN DARURAT' : 'REKOMENDASI DESTINASI'}
          </p>
          <h2>{medical ? 'Faskes dengan IGD 24 jam' : 'Jelajah wisata'}</h2>
        </div>
        <Link
          to="/kota/$citySlug/$categorySlug"
          params={{ citySlug: city.slug, categorySlug: category }}
          search={{ radius: 25000, open24h: medical, sort: 'distance', page: 1 }}
          className="pill"
        >
          Lihat direktori lengkap →
        </Link>
      </div>
      {places === null ? (
        <p role="status" className="muted">
          Daftar tempat belum dapat dimuat.
        </p>
      ) : !places.length ? (
        <p className="muted">Belum ada tempat yang sesuai.</p>
      ) : (
        <div className="places-panel-grid">
          {places.slice(0, 4).map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              citySlug={city.slug}
              categorySlug={category}
            />
          ))}
        </div>
      )}
    </section>
  )
}
