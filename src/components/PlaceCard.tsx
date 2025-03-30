import { Link } from '@tanstack/react-router'
import { activeSponsor, safeLink, sponsorBadgeLabel, type Place } from '../lib/api'
import { formatTicketRange } from '../lib/format'

export function PlaceCard({
  place: p,
  citySlug,
  categorySlug,
}: {
  place: Place
  citySlug: string
  categorySlug: string
}) {
  const badge = sponsorBadgeLabel(p)
  const ticket = formatTicketRange(p.ticket_price_min, p.ticket_price_max)
  const imageUrl = safeLink(p.image_url)

  return (
    <article className={`card ${activeSponsor(p) ? 'sponsored' : ''}`}>
      <div className="row">
        {badge && <span className="badge">{badge}</span>}
        {p.is_verified && <span className="badge verified">Terverifikasi</span>}
        {p.has_emergency && p.is_24_hours && (
          <span className="badge emergency">IGD 24 Jam</span>
        )}
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={p.name}
          loading="lazy"
          className="card-image"
        />
      )}
      <h3>
        <Link
          to="/kota/$citySlug/$categorySlug/$placeSlug"
          params={{ citySlug, categorySlug, placeSlug: p.slug }}
        >
          {p.name}
        </Link>
      </h3>
      <p className="muted">{p.address || 'Alamat mengikuti titik peta'}</p>
      <p>
        {p.is_24_hours ? 'Buka 24 jam' : p.opening_hours || 'Jam buka belum dikonfirmasi'}
      </p>
      <div className="row">
        {p.distance_meters != null && (
          <span className="mono">{(p.distance_meters / 1000).toFixed(1)} km</span>
        )}
        {p.rating_avg != null && p.rating_avg > 0 && (
          <span className="mono">★ {p.rating_avg.toFixed(1)}</span>
        )}
        {ticket && <span className="mono">Tiket: {ticket}</span>}
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Rute ke lokasi ↗
      </a>
    </article>
  )
}
