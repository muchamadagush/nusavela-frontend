import { useState } from 'react'
import { trackClick, type City, type Place } from '../lib/api'
import { formatRupiah } from '../lib/format'
import { localizeCityName, useI18n } from '../lib/i18n'
import {
  UMKM_SPONSOR_PLANS,
  isCommercialCategory,
  resolveCityMonetization,
  resolvePlaceMonetization,
  submitSelfServeOrder,
} from '../lib/monetization'

export function CityTravelBookingHub({
  city,
  categorySlug,
}: {
  city: City
  categorySlug?: string
}) {
  const { locale, tx } = useI18n()
  const [showHotelMap, setShowHotelMap] = useState(false)

  if (!isCommercialCategory(categorySlug)) return null

  const links = resolveCityMonetization(city)
  const displayCity = localizeCityName(city.name, locale)

  return (
    <section
      className="panel monetization-hub-panel section"
      aria-label={tx(
        `Akomodasi dan tiket perjalanan di ${displayCity}`,
        `Accommodation and travel tickets in ${displayCity}`,
      )}
    >
      <div className="panel-header-row">
        <div>
          <span className="badge">
            ✨ {tx('MONETISASI OTOMATIS · ZERO MANUAL INPUT', 'SMART TRAVEL & ACCOMMODATION HUB')}
          </span>
          <h2 style={{ marginTop: '8px' }}>
            {tx(
              `Rencanakan Perjalanan & Penginapan di ${displayCity}`,
              `Plan Your Stay & Tickets in ${displayCity}`,
            )}
          </h2>
          <p className="muted" style={{ margin: 0 }}>
            {tx(
              `Tautan pemesanan pintar berbasis titik koordinat (${city.latitude.toFixed(4)}, ${city.longitude.toFixed(4)}) untuk hotel, tiket wisata, dan transportasi ke ${displayCity}.`,
              `Coordinate-aware booking links (${city.latitude.toFixed(4)}, ${city.longitude.toFixed(4)}) for hotels, attraction passes, and transit to ${displayCity}.`,
            )}
          </p>
        </div>
        <button
          type="button"
          className="button button-outline button-sm"
          onClick={() => setShowHotelMap(v => !v)}
        >
          {showHotelMap
            ? tx('✕ Tutup Peta Hotel', '✕ Close Hotel Map')
            : tx('🗺️ Buka Peta Harga Hotel (Stay22)', '🗺️ Open Live Hotel Map (Stay22)')}
        </button>
      </div>

      <div className="monetization-cards-grid">
        <a
          href={links.hotelUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="monetization-action-card"
        >
          <span className="monetization-card-icon">🏨</span>
          <div>
            <strong>
              {tx(
                `Cek Hotel & Resort di ${displayCity} ↗`,
                `Find Hotels & Resorts in ${displayCity} ↗`,
              )}
            </strong>
            <p className="muted">
              {tx(
                'Bandingkan penginapan terdekat otomatis berdasarkan koordinat pusat kota.',
                'Compare nearby stays automatically centered on city coordinates.',
              )}
            </p>
          </div>
        </a>

        <a
          href={links.ticketUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="monetization-action-card"
        >
          <span className="monetization-card-icon">🎟️</span>
          <div>
            <strong>
              {tx(
                `Tiket Wisata & Tur Lokal ${displayCity} ↗`,
                `Attraction Passes & Tours in ${displayCity} ↗`,
              )}
            </strong>
            <p className="muted">
              {tx(
                'Pesan tiket masuk destinasi, paket tur harian, dan aktivitas populer.',
                'Book attraction entry passes, day tours, and curated local activities.',
              )}
            </p>
          </div>
        </a>

        <a
          href={links.transportUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="monetization-action-card"
        >
          <span className="monetization-card-icon">🚆</span>
          <div>
            <strong>
              {tx(
                `Tiket Kereta, Pesawat & Bus ke ${displayCity} ↗`,
                `Trains, Flights & Transit to ${displayCity} ↗`,
              )}
            </strong>
            <p className="muted">
              {tx(
                'Cek jadwal dan harga rute perjalanan antarkota secara instan.',
                'Check intercity schedules and fares to this destination instantly.',
              )}
            </p>
          </div>
        </a>
      </div>

      {showHotelMap && (
        <div className="stay22-embed-wrap">
          <iframe
            title={tx(
              `Peta interaktif penginapan sekitar ${displayCity}`,
              `Interactive hotel map around ${displayCity}`,
            )}
            src={links.stay22MapEmbedUrl}
            width="100%"
            height="420"
            loading="lazy"
            style={{ border: 0, borderRadius: '14px' }}
          />
        </div>
      )}
    </section>
  )
}

export function PlaceSmartMonetizationCard({
  place,
  city,
  categorySlug,
  onSponsoredActivated,
}: {
  place: Place
  city: City
  categorySlug: string
  onSponsoredActivated?: () => void
}) {
  const { locale, tx } = useI18n()
  const [showHotelMap, setShowHotelMap] = useState(false)
  const [showSelfServe, setShowSelfServe] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('spotlight_monthly')
  const [bizName, setBizName] = useState(place.name)
  const [contactName, setContactName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [instantActivate, setInstantActivate] = useState(true)
  const [orderBusy, setOrderBusy] = useState(false)
  const [orderResult, setOrderResult] = useState<{
    ref: string
    checkoutUrl: string
    activated: boolean
  } | null>(null)
  const [orderError, setOrderError] = useState('')

  const links = resolvePlaceMonetization(place, city, categorySlug)
  if (!links) return null

  const displayCity = localizeCityName(city.name, locale)

  async function handleCreateOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOrderBusy(true)
    setOrderError('')
    try {
      const res = await submitSelfServeOrder({
        city_id: city.id,
        place_id: place.id,
        business_name: bizName,
        contact_name: contactName,
        contact_phone_or_email: contactInfo,
        plan_code: selectedPlan,
        instant_activate: instantActivate,
      })
      setOrderResult({
        ref: res.order.payment_reference,
        checkoutUrl: res.order.checkout_url,
        activated: res.activated,
      })
      if (res.activated && onSponsoredActivated) {
        onSponsoredActivated()
      }
    } catch {
      setOrderError(
        tx(
          'Pesanan promosi belum dapat diproses. Pastikan seluruh kolom terisi lengkap.',
          'Sponsorship order could not be processed. Please check your inputs.',
        ),
      )
    } finally {
      setOrderBusy(false)
    }
  }

  return (
    <div className="submission-card place-monetization-box">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <span className="badge">
            {links.isCustomHotel || links.isCustomTicket
              ? tx('✦ Tautan Mitra Resmi', '✦ Official Partner Link')
              : tx(
                  '⚡ Otomatis Berbasis Koordinat & Lokasi',
                  '⚡ Auto-Generated from Coordinates',
                )}
          </span>
          <h3 style={{ margin: '6px 0 4px' }}>
            {tx(
              'Pemesanan Hotel, Tiket & Aktivitas Terdekat',
              'Nearby Hotels, Tickets & Activity Booking',
            )}
          </h3>
        </div>
        <button
          type="button"
          className="chip"
          onClick={() => setShowHotelMap(v => !v)}
        >
          {showHotelMap
            ? tx('✕ Tutup Peta Hotel', '✕ Hide Hotel Map')
            : tx('🗺️ Peta Harga Hotel Terdekat', '🗺️ Nearby Hotel Price Map')}
        </button>
      </div>

      <p className="muted" style={{ margin: '4px 0 14px', fontSize: '13.5px' }}>
        {tx(
          `Temukan penginapan dan tiket perjalanan di sekitar ${place.name} (${displayCity}) secara instan.`,
          `Find accommodations and travel passes around ${place.name} (${displayCity}) instantly.`,
        )}
      </p>

      <div className="row">
        <a
          className="button affiliate"
          href={links.hotelUrl}
          onClick={() => trackClick(city.id, place.id, 'affiliate_hotel')}
          target="_blank"
          rel="sponsored noopener noreferrer"
        >
          🏨 {tx('Cek hotel terdekat ↗', 'Check nearby hotels ↗')}
        </a>
        <a
          className="button affiliate"
          href={links.ticketUrl}
          onClick={() => trackClick(city.id, place.id, 'affiliate_ticket')}
          target="_blank"
          rel="sponsored noopener noreferrer"
        >
          🎟️ {tx('Cek tiket wisata & tur ↗', 'Check attraction tickets ↗')}
        </a>
        <a
          className="button button-outline"
          href={links.transportUrl}
          onClick={() => trackClick(city.id, place.id, 'affiliate_ticket')}
          target="_blank"
          rel="sponsored noopener noreferrer"
        >
          🚆 {tx('Transportasi ke sini ↗', 'Transit tickets ↗')}
        </a>
      </div>

      {showHotelMap && (
        <div className="stay22-embed-wrap" style={{ marginTop: '16px' }}>
          <iframe
            title={tx(
              `Peta penginapan dekat ${place.name}`,
              `Hotel map near ${place.name}`,
            )}
            src={links.stay22MapEmbedUrl}
            width="100%"
            height="360"
            loading="lazy"
            style={{ border: 0, borderRadius: '12px' }}
          />
        </div>
      )}

      {/* Self-Serve UMKM Spotlight Upgrade Bar */}
      <div className="self-serve-promo-bar">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>
              🚀{' '}
              {tx(
                'Pemilik usaha ini? Aktifkan Lencana Verified / Spotlight secara instan',
                'Own this business? Activate Verified / Spotlight badge instantly',
              )}
            </strong>
            <p className="muted" style={{ margin: '2px 0 0', fontSize: '12.5px' }}>
              {tx(
                'Tanpa menunggu input manual admin — pilih paket UMKM dan tampil di posisi #1 direktori kota.',
                'No manual admin entry needed — choose an SME plan and appear at #1 in the city directory.',
              )}
            </p>
          </div>
          <button
            type="button"
            className="button button-sm"
            onClick={() => setShowSelfServe(v => !v)}
          >
            {showSelfServe
              ? tx('Tutup Paket ▴', 'Close Plans ▴')
              : tx('⚡ Promosikan Usaha Ini ▾', '⚡ Promote This Business ▾')}
          </button>
        </div>

        {showSelfServe && (
          <form onSubmit={handleCreateOrder} className="self-serve-form">
            <div className="sponsor-plans-grid">
              {UMKM_SPONSOR_PLANS.map(plan => (
                <label
                  key={plan.code}
                  className={`sponsor-plan-card ${selectedPlan === plan.code ? 'selected' : ''}`}
                >
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <input
                      type="radio"
                      name="plan_code"
                      value={plan.code}
                      checked={selectedPlan === plan.code}
                      onChange={() => setSelectedPlan(plan.code)}
                    />
                    <span className="badge">
                      {locale === 'en' ? plan.badgeEn : plan.badgeId}
                    </span>
                  </div>
                  <strong>{locale === 'en' ? plan.nameEn : plan.nameId}</strong>
                  <p className="muted" style={{ fontSize: '12.5px', margin: '4px 0 0' }}>
                    {locale === 'en' ? plan.descEn : plan.descId}
                  </p>
                  <p className="mono" style={{ margin: '8px 0 0', fontWeight: 700 }}>
                    {formatRupiah(plan.amountIdr)}
                  </p>
                </label>
              ))}
            </div>

            <div className="form-grid" style={{ marginTop: '14px' }}>
              <label>
                {tx('Nama Usaha / Brand', 'Business / Brand Name')}
                <input
                  value={bizName}
                  onChange={e => setBizName(e.target.value)}
                  required
                  maxLength={150}
                />
              </label>
              <label>
                {tx('Nama Penanggung Jawab', 'Contact Person Name')}
                <input
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder={tx('Nama lengkap Anda', 'Your full name')}
                />
              </label>
              <label className="full-width">
                {tx('Nomor WhatsApp / Email Invoice', 'WhatsApp Number / Invoice Email')}
                <input
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="0812-xxxx-xxxx / email@usaha.com"
                />
              </label>
              <label className="row full-width" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={instantActivate}
                  onChange={e => setInstantActivate(e.target.checked)}
                />
                <span>
                  {tx(
                    'Simulasi Pembayaran Lunas Otomatis (Langsung aktifkan lencana Spotlight sekarang)',
                    'Simulate Instant Paid Webhook (Immediately activate Spotlight badge now)',
                  )}
                </span>
              </label>
              <div className="full-width">
                <button type="submit" disabled={orderBusy}>
                  {orderBusy
                    ? tx('Memproses aktivasi…', 'Processing activation…')
                    : tx(
                        '⚡ Buat Invoice & Aktifkan Spotlight Sekarang',
                        '⚡ Create Invoice & Activate Spotlight Now',
                      )}
                </button>
              </div>
            </div>

            {orderError && (
              <p role="alert" className="error" style={{ marginTop: '10px' }}>
                {orderError}
              </p>
            )}

            {orderResult && (
              <div className="panel" style={{ marginTop: '14px' }}>
                <span className="badge verified">
                  ✓{' '}
                  {orderResult.activated
                    ? tx('SPOTLIGHT AKTIF OTOMATIS', 'SPOTLIGHT AUTOMATICALLY ACTIVE')
                    : tx('INVOICE PEMBAYARAN DIBUAT', 'PAYMENT INVOICE CREATED')}
                </span>
                <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>
                  {tx('Referensi Invoice:', 'Invoice Reference:')}{' '}
                  <span className="mono">{orderResult.ref}</span>
                </p>
                <p className="muted" style={{ margin: '0 0 10px', fontSize: '13px' }}>
                  {orderResult.activated
                    ? tx(
                        'Lencana Terverifikasi & Spotlight untuk tempat ini sudah diaktifkan otomatis di database!',
                        'Verified & Spotlight badges for this place have been automatically activated in the database!',
                      )
                    : tx(
                        'Silakan selesaikan pembayaran melalui tautan Payment Gateway di bawah ini.',
                        'Complete your payment via the Payment Gateway link below.',
                      )}
                </p>
                <a
                  href={orderResult.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-outline button-sm"
                >
                  💳 {tx('Lihat Tautan Checkout Invoice ↗', 'Open Invoice Checkout Link ↗')}
                </a>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
