import { Link } from '@tanstack/react-router'
import { activeSponsor, safeLink, sponsorBadgeLabel, type Place } from '../lib/api'
import { formatTicketRange } from '../lib/format'
import { CATEGORY_META } from '../lib/regions'

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
  const catMeta = CATEGORY_META[categorySlug] ?? CATEGORY_META.wisata

  return (
    <article className={`card place-card ${activeSponsor(p) ? 'sponsored' : ''}`}>
      {imageUrl ? (
        <div className="place-card-media">
          <img
            src={imageUrl}
            alt={p.name}
            loading="lazy"
            className="card-image"
          />
          <div className="place-card-overlay-badges">
            {badge && <span className="badge">{badge}</span>}
            {p.is_verified && <span className="badge verified">✓ Terverifikasi</span>}
            {p.has_emergency && p.is_24_hours && (
              <span className="badge emergency">🚨 IGD 24 Jam</span>
            )}
          </div>
        </div>
      ) : (
        <div className="place-card-top-badges">
          <span className="place-cat-pill">
            {catMeta.icon} {catMeta.badge}
          </span>
          <div className="row">
            {badge && <span className="badge">{badge}</span>}
            {p.is_verified && <span className="badge verified">✓ Terverifikasi</span>}
            {p.has_emergency && p.is_24_hours && (
              <span className="badge emergency">🚨 IGD 24 Jam</span>
            )}
          </div>
        </div>
      )}

      <div className="place-card-body">
        <h3>
          <Link
            to="/kota/$citySlug/$categorySlug/$placeSlug"
            params={{ citySlug, categorySlug, placeSlug: p.slug }}
          >
            {p.name}
          </Link>
        </h3>
        <p className="muted place-address">
          📍 {p.address || 'Alamat mengikuti titik koordinat peta'}
        </p>
        {p.description && (
          <p className="place-excerpt">{p.description}</p>
        )}

        <div className="place-meta-chips">
          <span className="meta-chip">
            🕒 {p.is_24_hours ? 'Buka 24 jam' : p.opening_hours || 'Jam buka belum dikonfirmasi'}
          </span>
          {p.distance_meters != null && (
            <span className="meta-chip mono">
              📏 {(p.distance_meters / 1000).toFixed(1)} km
            </span>
          )}
          {p.rating_avg != null && p.rating_avg > 0 && (
            <span className="meta-chip mono rating-chip">
              ★ {p.rating_avg.toFixed(1)}
            </span>
          )}
          {ticket && (
            <span className="meta-chip mono">
              🎟️ Tiket: {ticket}
            </span>
          )}
        </div>

        <div className="place-card-actions">
          <Link
            to="/kota/$citySlug/$categorySlug/$placeSlug"
            params={{ citySlug, categorySlug, placeSlug: p.slug }}
            className="button button-sm"
          >
            Lihat Detail →
          </Link>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline button-sm"
          >
            Rute ke lokasi ↗
          </a>
        </div>
      </div>
    </article>
  )
}
