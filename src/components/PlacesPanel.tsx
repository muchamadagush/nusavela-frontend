import { Link } from '@tanstack/react-router'
import { PlaceCard } from './PlaceCard'
import type { City, Place } from '../lib/api'
import { useI18n } from '../lib/i18n'

export function PlacesPanel({
  city,
  places,
  medical = false,
}: {
  city: City
  places: Place[] | null
  medical?: boolean
}) {
  const { tx } = useI18n()
  const category = medical ? 'rumah-sakit' : 'wisata'
  return (
    <section className="panel places-showcase-panel">
      <div className="panel-header-row">
        <div>
          <p className="eyebrow">
            {medical
              ? tx('LAYANAN KESEHATAN DARURAT', 'EMERGENCY MEDICAL CARE')
              : tx('REKOMENDASI DESTINASI', 'FEATURED ATTRACTIONS')}
          </p>
          <h2>
            {medical
              ? tx('Faskes dengan IGD 24 jam', 'Hospitals with 24H ER')
              : tx('Jelajah wisata', 'Explore Tourism')}
          </h2>
        </div>
        <Link
          to="/kota/$citySlug/$categorySlug"
          params={{ citySlug: city.slug, categorySlug: category }}
          search={{ radius: 25000, open24h: medical, sort: 'distance', page: 1 }}
          className="pill"
        >
          {tx('Lihat direktori lengkap →', 'View full directory →')}
        </Link>
      </div>
      {places === null ? (
        <p role="status" className="muted">
          {tx('Daftar tempat belum dapat dimuat.', 'Places could not be loaded.')}
        </p>
      ) : !places.length ? (
        <p className="muted">
          {tx('Belum ada tempat yang sesuai.', 'No matching places yet.')}
        </p>
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
