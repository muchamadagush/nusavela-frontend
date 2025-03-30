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
  const d = Route.useLoaderData()
  const commercial = !['rumah-sakit', 'layanan-publik'].includes(d.category.slug)
  const sponsorLabel = sponsorBadgeLabel(d.place)
  const ticketRange = formatTicketRange(
    d.place.ticket_price_min,
    d.place.ticket_price_max,
  )
  const whatsappDigits = sanitizePhoneDigits(d.place.whatsapp)
  const phoneDigits = sanitizePhoneDigits(d.place.phone)
  const imageUrl = safeLink(d.place.image_url)
  const hotelUrl = safeLink(d.place.affiliate_hotel_url)
  const ticketUrl = safeLink(d.place.affiliate_ticket_url)

  return (
    <main id="main">
      <Breadcrumbs
        items={[
          { label: d.city.name, to: '/kota/$citySlug', params: { citySlug: d.city.slug } },
          {
            label: d.category.name,
            to: '/kota/$citySlug/$categorySlug',
            params: { citySlug: d.city.slug, categorySlug: d.category.slug },
          },
          { label: d.place.name },
        ]}
      />

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="eyebrow">
          {d.city.name} / {d.category.name}
        </p>
        <Link
          to="/kota/$citySlug/$categorySlug"
          params={{ citySlug: d.city.slug, categorySlug: d.category.slug }}
          search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
          className="pill"
        >
          ← Kembali ke {d.category.name}
        </Link>
      </div>

      <div className="row" style={{ marginTop: '8px' }}>
        {sponsorLabel && <span className="badge">{sponsorLabel}</span>}
        {d.place.is_verified && <span className="badge verified">Terverifikasi</span>}
        {d.place.has_emergency && d.place.is_24_hours && (
          <span className="badge emergency">IGD 24 Jam</span>
        )}
      </div>

      <h1>{d.place.name}</h1>
      <p className="muted">{d.place.address || 'Alamat mengikuti titik peta'}</p>

      <div className="directory">
        <div>
          <section className="panel">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={d.place.name}
                loading="lazy"
                className="card-image"
              />
            )}
            <h2>Informasi tempat</h2>
            <p>{d.place.description || 'Deskripsi belum tersedia.'}</p>

            <div className="grid section">
              <div className="submission-card">
                <small className="muted">Jam Operasional</small>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>
                  {d.place.is_24_hours
                    ? '🕒 Buka 24 jam'
                    : d.place.opening_hours || 'Jam buka belum dikonfirmasi'}
                </p>
              </div>
              <div className="submission-card">
                <small className="muted">Tiket & Penilaian</small>
                <p className="mono" style={{ margin: '4px 0 0', fontWeight: 600 }}>
                  {ticketRange ? `Tiket: ${ticketRange}` : 'Tiket: Belum ada info'}
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
                🗺️ Rute ke lokasi ↗
              </a>
              {whatsappDigits && whatsappDigits.length >= 5 && (
                <a
                  className="button whatsapp"
                  href={`https://wa.me/${whatsappDigits}`}
                  onClick={() => trackClick(d.city.id, d.place.id, 'whatsapp_lead')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Hubungi via WhatsApp ↗
                </a>
              )}
              {phoneDigits && phoneDigits.length >= 5 && (
                <a
                  className="button button-outline"
                  href={`tel:+${phoneDigits}`}
                  onClick={() => trackClick(d.city.id, d.place.id, 'phone_call')}
                >
                  📞 Telepon ({d.place.phone})
                </a>
              )}
            </div>

            {commercial && (hotelUrl || ticketUrl) && (
              <div className="submission-card">
                <h3>Pemesanan Perjalanan & Tiket</h3>
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
                        🏨 Cek hotel terdekat ↗
                      </a>
                      <small className="muted"> Tautan afiliasi</small>
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
                        🎟️ Cek tiket wisata ↗
                      </a>
                      <small className="muted"> Tautan afiliasi</small>
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
