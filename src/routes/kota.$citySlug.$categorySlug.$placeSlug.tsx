import { createFileRoute, Link } from '@tanstack/react-router'
import {
  api,
  city,
  categories,
  placeSchema,
  cacheHeaders,
  seo,
  safeLink,
  sponsorBadgeLabel,
  trackClick,
} from '../lib/api'
import { formatTicketRange, sanitizePhoneDigits } from '../lib/format'
import { localizeCategoryName, localizeCityName, useI18n } from '../lib/i18n'
import { getFallbackPlacesForCity } from '../lib/regions'
import { DirectoryMap } from '../components/DirectoryMap'
import { CommunityForm } from '../components/CommunityForm'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/kota/$citySlug/$categorySlug/$placeSlug')({
  loader: async ({ params: p }) => {
    const [c, cats, place] = await Promise.all([
      city(p.citySlug),
      categories(),
      api(
        `/kota/${encodeURIComponent(p.citySlug)}/${encodeURIComponent(p.categorySlug)}/${encodeURIComponent(p.placeSlug)}`,
        placeSchema,
      ).catch(async () => {
        const cFallback = await city(p.citySlug)
        const found = getFallbackPlacesForCity(cFallback, p.categorySlug).find(
          item => item.slug === p.placeSlug,
        )
        if (found) return found
        throw new Error('Tempat tidak ditemukan')
      }),
    ])
    const category = cats.find(x => x.slug === p.categorySlug)
    if (!category) throw new Error('Kategori tidak ditemukan')
    return { city: c, category, place }
  },
  headers: cacheHeaders,
  head: ({ loaderData: d }) =>
    d
      ? seo(
          `${d.place.name} di ${d.city.name} — NusaVela`,
          `${d.place.name}: lokasi, jam buka dan rute di ${d.city.name}.`,
          `/kota/${d.city.slug}/${d.category.slug}/${d.place.slug}`,
          {
            '@type':
              d.category.slug === 'wisata'
                ? 'TouristAttraction'
                : d.category.slug === 'rumah-sakit'
                  ? 'MedicalBusiness'
                  : 'LocalBusiness',
            name: d.place.name,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: d.place.latitude,
              longitude: d.place.longitude,
            },
          },
        )
      : {},
  component: Detail,
})

function Detail() {
  const { locale, tx } = useI18n()
  const d = Route.useLoaderData()
  const commercial = !['rumah-sakit', 'layanan-publik'].includes(d.category.slug)
  const sponsorLabel = sponsorBadgeLabel(d.place)
  const ticketRangeRaw = formatTicketRange(
    d.place.ticket_price_min,
    d.place.ticket_price_max,
  )
  const ticketRange =
    locale === 'en' && ticketRangeRaw === 'Gratis' ? 'Free' : ticketRangeRaw
  const whatsappDigits = sanitizePhoneDigits(d.place.whatsapp)
  const phoneDigits = sanitizePhoneDigits(d.place.phone)
  const imageUrl = safeLink(d.place.image_url)
  const hotelUrl = safeLink(d.place.affiliate_hotel_url)
  const ticketUrl = safeLink(d.place.affiliate_ticket_url)

  const displayCityName = localizeCityName(d.city.name, locale)
  const displayCatName = localizeCategoryName(
    d.category.slug,
    d.category.name,
    locale,
  )

  return (
    <main id="main">
      <Breadcrumbs
        items={[
          {
            label: displayCityName,
            to: '/kota/$citySlug',
            params: { citySlug: d.city.slug },
          },
          {
            label: displayCatName,
            to: '/kota/$citySlug/$categorySlug',
            params: { citySlug: d.city.slug, categorySlug: d.category.slug },
          },
          { label: d.place.name },
        ]}
      />

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="eyebrow">
          {displayCityName} / {displayCatName}
        </p>
        <Link
          to="/kota/$citySlug/$categorySlug"
          params={{ citySlug: d.city.slug, categorySlug: d.category.slug }}
          search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
          className="pill"
        >
          ← {tx('Kembali ke', 'Back to')} {displayCatName}
        </Link>
      </div>

      <div className="row" style={{ marginTop: '8px' }}>
        {sponsorLabel && <span className="badge">{sponsorLabel}</span>}
        {d.place.is_verified && (
          <span className="badge verified">
            ✓ {tx('Terverifikasi', 'Verified')}
          </span>
        )}
        {d.place.has_emergency && d.place.is_24_hours && (
          <span className="badge emergency">
            🚨 {tx('IGD 24 Jam', '24H ER')}
          </span>
        )}
      </div>

      <h1>{d.place.name}</h1>
      <p className="muted">
        📍{' '}
        {d.place.address ||
          tx('Alamat mengikuti titik peta', 'Address follows map coordinates')}
      </p>

      <div className="directory">
        <div>
          <section className="panel">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={d.place.name}
                loading="lazy"
                className="card-image"
                style={{ height: '280px', marginBottom: '18px' }}
              />
            )}
            <h2>{tx('Informasi tempat', 'Place information')}</h2>
            <p>
              {d.place.description ||
                tx('Deskripsi belum tersedia.', 'Description not yet available.')}
            </p>

            <div className="grid section">
              <div className="submission-card">
                <small className="muted">
                  {tx('Jam Operasional', 'Operating Hours')}
                </small>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>
                  {d.place.is_24_hours
                    ? `🕒 ${tx('Buka 24 jam', 'Open 24 hours')}`
                    : d.place.opening_hours ||
                      tx(
                        'Jam buka belum dikonfirmasi',
                        'Opening hours unconfirmed',
                      )}
                </p>
              </div>
              <div className="submission-card">
                <small className="muted">
                  {tx('Tiket & Penilaian', 'Ticket & Rating')}
                </small>
                <p className="mono" style={{ margin: '4px 0 0', fontWeight: 600 }}>
                  {ticketRange
                    ? `${tx('Tiket', 'Ticket')}: ${ticketRange}`
                    : tx('Tiket: Belum ada info', 'Ticket: No info yet')}
                  {d.place.rating_avg != null && d.place.rating_avg > 0
                    ? ` · ★ ${d.place.rating_avg.toFixed(1)}`
                    : ''}
                </p>
              </div>
            </div>

            <div className="row section">
              <a
                className="button"
                href={`https://www.google.com/maps/dir/?api=1&destination=${d.place.latitude},${d.place.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ {tx('Rute ke lokasi ↗', 'Get Directions ↗')}
              </a>
              {whatsappDigits && whatsappDigits.length >= 5 && (
                <a
                  className="button whatsapp"
                  href={`https://wa.me/${whatsappDigits}`}
                  onClick={() => trackClick(d.city.id, d.place.id, 'whatsapp_lead')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 {tx('Hubungi via WhatsApp ↗', 'Contact via WhatsApp ↗')}
                </a>
              )}
              {phoneDigits && phoneDigits.length >= 5 && (
                <a
                  className="button button-outline"
                  href={`tel:+${phoneDigits}`}
                  onClick={() => trackClick(d.city.id, d.place.id, 'phone_call')}
                >
                  📞 {tx('Telepon', 'Call')} ({d.place.phone})
                </a>
              )}
            </div>

            {commercial && (hotelUrl || ticketUrl) && (
              <div className="submission-card">
                <h3>
                  {tx(
                    'Pemesanan Perjalanan & Tiket',
                    'Travel & Ticket Booking',
                  )}
                </h3>
                <div className="row">
                  {hotelUrl && (
                    <p style={{ margin: 0 }}>
                      <a
                        className="button affiliate"
                        href={hotelUrl}
                        onClick={() =>
                          trackClick(d.city.id, d.place.id, 'affiliate_hotel')
                        }
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                      >
                        🏨 {tx('Cek hotel terdekat ↗', 'Check nearby hotels ↗')}
                      </a>
                      <small className="muted">
                        {' '}
                        {tx('Tautan afiliasi', 'Affiliate link')}
                      </small>
                    </p>
                  )}
                  {ticketUrl && (
                    <p style={{ margin: 0 }}>
                      <a
                        className="button affiliate"
                        href={ticketUrl}
                        onClick={() =>
                          trackClick(d.city.id, d.place.id, 'affiliate_ticket')
                        }
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                      >
                        🎟️ {tx('Cek tiket wisata ↗', 'Check attraction tickets ↗')}
                      </a>
                      <small className="muted">
                        {' '}
                        {tx('Tautan afiliasi', 'Affiliate link')}
                      </small>
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <CommunityForm cityId={d.city.id} placeId={d.place.id} defaultOpen />
        </div>

        <DirectoryMap
          categorySlug={d.category.slug}
          places={[d.place]}
          center={[d.place.latitude, d.place.longitude]}
        />
      </div>
    </main>
  )
}
