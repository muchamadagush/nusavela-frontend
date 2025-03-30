import { Link } from '@tanstack/react-router'
import { activeSponsor, safeLink, sponsorBadgeLabel, type Place } from '../lib/api'
import { formatTicketRange } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { isCommercialCategory } from '../lib/monetization'
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
  const { locale, tx } = useI18n()
  const badge = sponsorBadgeLabel(p)
  const ticketRaw = formatTicketRange(p.ticket_price_min, p.ticket_price_max)
  const ticket =
    locale === 'en' && ticketRaw === 'Gratis' ? 'Free' : ticketRaw
  const imageUrl = safeLink(p.image_url)
  const catMeta = CATEGORY_META[categorySlug] ?? CATEGORY_META.wisata
  const commercial = isCommercialCategory(categorySlug)

  const autoHotelUrl =
    safeLink(p.affiliate_hotel_url) ||
    `https://www.stay22.com/allez/roam?aid=nusavela&lat=${p.latitude.toFixed(6)}&lng=${p.longitude.toFixed(6)}&address=${encodeURIComponent(p.name)}`

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
            {p.is_verified && (
              <span className="badge verified">
                ✓ {tx('Terverifikasi', 'Verified')}
              </span>
            )}
            {p.has_emergency && p.is_24_hours && (
              <span className="badge emergency">
                🚨 {tx('IGD 24 Jam', '24H ER')}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="place-card-top-badges">
          <span className="place-cat-pill">
            {catMeta.icon} {locale === 'en' ? catMeta.badgeEn : catMeta.badge}
          </span>
          <div className="row">
            {badge && <span className="badge">{badge}</span>}
            {p.is_verified && (
              <span className="badge verified">
                ✓ {tx('Terverifikasi', 'Verified')}
              </span>
            )}
            {p.has_emergency && p.is_24_hours && (
              <span className="badge emergency">
                🚨 {tx('IGD 24 Jam', '24H ER')}
              </span>
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
          📍{' '}
          {p.address ||
            tx(
              'Alamat mengikuti titik koordinat peta',
              'Address follows map coordinates',
            )}
        </p>
        {p.description && <p className="place-excerpt">{p.description}</p>}

        <div className="place-meta-chips">
          <span className="meta-chip">
            🕒{' '}
            {p.is_24_hours
              ? tx('Buka 24 jam', 'Open 24 hours')
              : p.opening_hours ||
                tx('Jam buka belum dikonfirmasi', 'Opening hours unconfirmed')}
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
              🎟️ {tx('Tiket', 'Ticket')}: {ticket}
            </span>
          )}
        </div>

        <div className="place-card-actions">
          <Link
            to="/kota/$citySlug/$categorySlug/$placeSlug"
            params={{ citySlug, categorySlug, placeSlug: p.slug }}
            className="button button-sm"
          >
            {tx('Lihat Detail →', 'View Details →')}
          </Link>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline button-sm"
          >
            {tx('Rute ke lokasi ↗', 'Get Directions ↗')}
          </a>
          {commercial && (
            <a
              href={autoHotelUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="button affiliate button-sm"
            >
              🏨 {tx('Hotel Terdekat ↗', 'Nearby Hotels ↗')}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
