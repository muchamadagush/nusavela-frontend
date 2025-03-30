import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { cities, seo } from '../lib/api'
import { DEFAULT_CITIES } from '../lib/default-cities'
import { formatTimezoneLabel } from '../lib/format'
import { localizeCityName, useI18n } from '../lib/i18n'
import {
  ARCHIPELAGO_REGIONS,
  HERO_SPOTLIGHTS,
  HIDDEN_GEMS,
  POPULAR_RECOMMENDATIONS,
  PROVINCE_NAMES,
  PROVINCE_NAMES_EN,
  getCityRegion,
  getProvinceCode,
  getProvinceName,
} from '../lib/regions'
import { CityPicker } from '../components/CityPicker'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      return { cities: await cities(), unavailable: false }
    } catch {
      return { cities: DEFAULT_CITIES, unavailable: true }
    }
  },
  head: () =>
    seo(
      'NusaVela — Panduan Lengkap Wisata, Kuliner & Layanan Lokal 514 Kota Indonesia',
      'Jelajahi keindahan destinasi wisata Nusantara, kuliner daerah, agenda budaya, rute transportasi, dan fasilitas kesehatan IGD 24 jam di 514 kabupaten/kota Indonesia.',
      '/',
      { '@type': 'WebSite', name: 'NusaVela', url: 'https://nusavela.com' },
    ),
  component: Home,
})

function Home() {
  const { locale, tx } = useI18n()
  const data = Route.useLoaderData()
  const catalog = data.cities.length > 0 ? data.cities : DEFAULT_CITIES

  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [regionFilterQuery, setRegionFilterQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(16)

  const activeSpotlight = HERO_SPOTLIGHTS[spotlightIndex] ?? HERO_SPOTLIGHTS[0]
  const spotHighlights =
    locale === 'en' ? activeSpotlight.highlightsEn : activeSpotlight.highlights

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of ARCHIPELAGO_REGIONS) counts[r.id] = 0
    for (const c of catalog) {
      const r = getCityRegion(c)
      counts[r.id] = (counts[r.id] ?? 0) + 1
    }
    return counts
  }, [catalog])

  const availableProvinces = useMemo(() => {
    const codes = new Set<string>()
    for (const c of catalog) {
      if (selectedRegion === 'all' || getCityRegion(c).id === selectedRegion) {
        codes.add(getProvinceCode(c))
      }
    }
    return Array.from(codes)
      .map(code => ({
        code,
        name:
          locale === 'en'
            ? PROVINCE_NAMES_EN[code] || PROVINCE_NAMES[code] || `Province ${code}`
            : PROVINCE_NAMES[code] || `Provinsi ${code}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'))
  }, [catalog, selectedRegion, locale])

  const filteredDirectoryCities = useMemo(() => {
    const q = regionFilterQuery.trim().toLocaleLowerCase('id')
    return catalog
      .filter(c => {
        if (selectedRegion !== 'all' && getCityRegion(c).id !== selectedRegion) {
          return false
        }
        if (selectedProvince !== 'all' && getProvinceCode(c) !== selectedProvince) {
          return false
        }
        if (q) {
          const provId = getProvinceName(c, 'id').toLocaleLowerCase('id')
          const provEn = getProvinceName(c, 'en').toLocaleLowerCase('id')
          const nameEn = localizeCityName(c.name, 'en').toLocaleLowerCase('id')
          return (
            c.name.toLocaleLowerCase('id').includes(q) ||
            nameEn.includes(q) ||
            (c.short_name && c.short_name.toLocaleLowerCase('id').includes(q)) ||
            provId.includes(q) ||
            provEn.includes(q)
          )
        }
        return true
      })
      .sort(
        (a, b) =>
          (a.tier ?? 2) - (b.tier ?? 2) || a.name.localeCompare(b.name, 'id'),
      )
  }, [catalog, selectedRegion, selectedProvince, regionFilterQuery])

  function handleSelectRegion(regionId: string) {
    setSelectedRegion(regionId)
    setSelectedProvince('all')
    setVisibleCount(16)
  }

  const pillars =
    locale === 'en'
      ? [
          [
            '🧭 Curated Tourism & Gastronomy',
            'Discover iconic landmarks, ticket price estimates, operating hours, authentic local cuisine, and instant route links.',
          ],
          [
            '🏥 24-Hour Emergency & Hospital Care',
            'Travel with peace of mind: 1-tap access to verified national emergency hotlines (112/119), referral hospitals, and 24H ERs.',
          ],
          [
            '📰 Live Weather, News & Cultural Festivals',
            'Monitor local atmospheric observations, curated regional headlines, and upcoming 31-day cultural festival calendars.',
          ],
        ]
      : [
          [
            '🧭 Jelajah Wisata & Kuliner Terkurasi',
            'Temukan destinasi unggulan, estimasi harga tiket, jam buka operasional, kuliner khas daerah, dan tautan rute langsung.',
          ],
          [
            '🏥 Layanan Darurat & IGD 24 Jam',
            'Standar keamanan wisatawan & warga: akses 1-ketuk ke nomor darurat nasional (112/119), rumah sakit rujukan, dan IGD 24 jam terdekat.',
          ],
          [
            '📰 Cuaca, Kabar & Kalender Festival',
            'Pantau pengamatan cuaca lokal terkini, berita daerah terkurasi, serta jadwal festival budaya 31 hari ke depan di tiap kota.',
          ],
        ]

  return (
    <main id="main">
      {/* 1. CINEMATIC WONDERFUL ARCHIPELAGO HERO SHOWCASE */}
      <section
        className="hero-showcase"
        aria-label={tx(
          'Sorotan Destinasi Utama Nusantara',
          'Featured Indonesian Archipelago Destinations',
        )}
      >
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url(${activeSpotlight.imageUrl})` }}
        />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-top-pills">
            <span className="hero-kicker">
              ✦{' '}
              {tx(
                'PESONA NUSANTARA & LAYANAN LOKAL TERPADU',
                'WONDERFUL ARCHIPELAGO & PUBLIC UTILITY',
              )}
            </span>
            <span className="hero-region-pill">
              {locale === 'en' ? activeSpotlight.badgeEn : activeSpotlight.badge}
            </span>
          </div>

          <h1>
            {locale === 'en' ? activeSpotlight.titleEn : activeSpotlight.title}
            <br />
            <em>
              {locale === 'en'
                ? activeSpotlight.subtitleEn
                : activeSpotlight.subtitle}
            </em>
          </h1>

          <p className="hero-lead">
            {locale === 'en'
              ? activeSpotlight.descriptionEn
              : activeSpotlight.description}
          </p>

          <div className="hero-highlights">
            {spotHighlights.map(item => (
              <span key={item} className="hero-highlight-chip">
                ✓ {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link
              to="/kota/$citySlug"
              params={{ citySlug: activeSpotlight.citySlug }}
              className="button hero-cta-primary"
            >
              🧭 {tx('Jelajahi', 'Explore')}{' '}
              {locale === 'en'
                ? activeSpotlight.cityNameEn
                : activeSpotlight.cityName}{' '}
              →
            </Link>
            <Link
              to="/kota/$citySlug/$categorySlug"
              params={{
                citySlug: activeSpotlight.citySlug,
                categorySlug: 'wisata',
              }}
              search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
              className="button hero-cta-secondary"
            >
              🗺️ {tx('Lihat Peta & Destinasi', 'View Map & Attractions')}
            </Link>
          </div>

          <div
            className="hero-spotlight-tabs"
            role="tablist"
            aria-label={tx('Pilih sorotan destinasi', 'Select destination spotlight')}
          >
            {HERO_SPOTLIGHTS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={spotlightIndex === idx}
                className={`spotlight-tab ${spotlightIndex === idx ? 'active' : ''}`}
                onClick={() => setSpotlightIndex(idx)}
              >
                <span className="spotlight-tab-region">
                  {locale === 'en' ? item.regionEn : item.region}
                </span>
                <strong>
                  {locale === 'en' ? item.cityNameEn : item.cityName}
                </strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FLOATING COMMAND SEARCH & GEOLOCATION BAR */}
      <div className="hero-picker-bridge">
        <CityPicker cities={catalog} />
      </div>

      {data.unavailable && (
        <p role="status" className="panel section">
          {tx(
            'Daftar kota belum dapat dimuat dari server. Menampilkan katalog direktori lokal 514 kabupaten/kota Indonesia.',
            'Daftar kota belum dapat dimuat dari server. Showing built-in directory of 514 Indonesian regencies and cities.',
          )}
        </p>
      )}

      {/* 3. ARCHIPELAGO ISLAND CARDS (PESONA INDONESIA DI SETIAP PULAUNYA) */}
      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {tx('DESTINASI WISATA INDONESIA', 'INDONESIAN ARCHIPELAGO REGIONS')}
            </p>
            <h2>
              {tx(
                'Pesona Indonesia di Setiap Pulaunya',
                'The Enchantment of Indonesia Across Every Island',
              )}
            </h2>
          </div>
          <a href="#jelajah-kepulauan" className="pill">
            {tx('Lihat Semua 514 Kab/Kota ↓', 'Browse All 514 Cities ↓')}
          </a>
        </div>

        <div className="region-cards-grid">
          {ARCHIPELAGO_REGIONS.map(region => (
            <a
              key={region.id}
              href="#jelajah-kepulauan"
              onClick={() => handleSelectRegion(region.id)}
              className="region-showcase-card"
              style={{ background: region.gradient }}
            >
              <div className="region-card-top">
                <span className="region-card-icon">{region.icon}</span>
                <span className="region-card-count mono">
                  {regionCounts[region.id] ?? 0}{' '}
                  {tx('Kab/Kota', 'Cities')}
                </span>
              </div>
              <h3>{locale === 'en' ? region.nameEn : region.name}</h3>
              <p>{locale === 'en' ? region.taglineEn : region.tagline}</p>
              <span className="region-card-cta">
                {tx('Jelajahi Kepulauan →', 'Explore Island Region →')}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 4. REKOMENDASI WISATA POPULER (EDITORIAL DESTINATION CARDS) */}
      <section id="rekomendasi-populer" className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {tx('REKOMENDASI WISATA POPULER', 'POPULAR DESTINATION HIGHLIGHTS')}
            </p>
            <h2>
              {tx(
                'Jelajahi Keindahan & Warisan Nusantara',
                'Explore the Beauty & Heritage of the Archipelago',
              )}
            </h2>
          </div>
          <span className="mono muted">
            {tx(
              'Kurasi Destinasi & Utilitas Kota',
              'Curated Attractions & Civic Utilities',
            )}
          </span>
        </div>

        <div className="story-cards-grid">
          {POPULAR_RECOMMENDATIONS.map(card => (
            <article key={card.id} className="story-card">
              <Link
                to="/kota/$citySlug"
                params={{ citySlug: card.citySlug }}
                className="story-card-media-link"
              >
                <img
                  src={card.imageUrl}
                  alt={locale === 'en' ? card.titleEn : card.title}
                  loading="lazy"
                  className="story-card-img"
                />
                <span className="story-region-tag">
                  {locale === 'en' ? card.regionBadgeEn : card.regionBadge}
                </span>
              </Link>
              <div className="story-card-body">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="mono muted" style={{ fontSize: '12px' }}>
                    📍 {locale === 'en' ? card.cityNameEn : card.cityName}
                  </span>
                  <span className="badge">
                    {locale === 'en' ? card.readTimeOrTagEn : card.readTimeOrTag}
                  </span>
                </div>
                <h3>
                  <Link
                    to="/kota/$citySlug"
                    params={{ citySlug: card.citySlug }}
                  >
                    {locale === 'en' ? card.titleEn : card.title}
                  </Link>
                </h3>
                <p className="muted">
                  {locale === 'en' ? card.summaryEn : card.summary}
                </p>
                <div className="story-card-footer">
                  <Link
                    to="/kota/$citySlug"
                    params={{ citySlug: card.citySlug }}
                    className="story-link-primary"
                  >
                    {tx('Panduan Kota →', 'City Guide →')}
                  </Link>
                  <div className="row" style={{ gap: '6px' }}>
                    <Link
                      to="/kota/$citySlug/$categorySlug"
                      params={{ citySlug: card.citySlug, categorySlug: 'wisata' }}
                      search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
                      className="chip"
                    >
                      🧭 {tx('Wisata', 'Tourism')}
                    </Link>
                    <Link
                      to="/kota/$citySlug/$categorySlug"
                      params={{ citySlug: card.citySlug, categorySlug: 'rumah-sakit' }}
                      search={{ radius: 25000, open24h: true, sort: 'distance', page: 1 }}
                      className="chip"
                    >
                      🏥 {tx('IGD 24 Jam', '24H ER')}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. FEATURED HOLIDAY BANNER (BUNAKEN / BAHARI SPOTLIGHT) */}
      <section className="section">
        <div className="featured-experience-banner">
          <div className="featured-experience-content">
            <span className="hero-kicker">
              ✦{' '}
              {tx(
                'REKOMENDASI PENGALAMAN TERLENGKAP',
                'COMPLETE ARCHIPELAGO EXPERIENCE',
              )}
            </span>
            <h2>
              {tx(
                'Taman Nasional Bunaken & Pesona Bahari Sulawesi',
                'Bunaken Marine National Park & Sulawesi Coastal Wonders',
              )}
            </h2>
            <p>
              {tx(
                'Mencari perjalanan dengan kombinasi penyelaman dinding karang tropis, wisata kuliner rempah pesisir Manado, serta kepastian layanan darurat & transportasi kota yang terverifikasi? Mulailah petualangan Anda dari gerbang Sulawesi Utara.',
                'Looking for a journey combining tropical coral wall diving, Manado coastal spice cuisine, and verified 24-hour emergency & transit utilities? Start your adventure in North Sulawesi.',
              )}
            </p>
            <div className="row" style={{ marginTop: '20px' }}>
              <Link
                to="/kota/$citySlug"
                params={{ citySlug: 'kota-manado' }}
                className="button hero-cta-primary"
              >
                🌊{' '}
                {tx(
                  'Lihat Panduan Kota Manado & Bunaken →',
                  'Explore Manado & Bunaken Guide →',
                )}
              </Link>
              <Link
                to="/kota/$citySlug"
                params={{ citySlug: 'kabupaten-raja-ampat' }}
                className="button hero-cta-secondary"
              >
                🏝️ {tx('Jelajahi Raja Ampat', 'Explore Raja Ampat')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HIDDEN GEMS TERBARU INDONESIA */}
      <section id="hidden-gems" className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {tx('REKOMENDASI WISATA TERBARU', 'CURATED ARCHIPELAGO GEMS')}
            </p>
            <h2>
              {tx(
                'Hidden Gem & Lanskap Ikonik Indonesia',
                'Hidden Gems & Iconic Landscapes of Indonesia',
              )}
            </h2>
          </div>
          <span className="mono muted">
            {tx('Eksplorasi Lintas Pulau', 'Cross-Island Discovery')}
          </span>
        </div>

        <div className="gems-grid">
          {HIDDEN_GEMS.map(gem => (
            <Link
              key={gem.id}
              to="/kota/$citySlug"
              params={{ citySlug: gem.citySlug }}
              className="gem-card"
            >
              <img
                src={gem.imageUrl}
                alt={locale === 'en' ? gem.titleEn : gem.title}
                loading="lazy"
                className="gem-card-img"
              />
              <div className="gem-card-overlay">
                <span className="story-region-tag">
                  {locale === 'en' ? gem.regionBadgeEn : gem.regionBadge}
                </span>
                <h3>{locale === 'en' ? gem.titleEn : gem.title}</h3>
                <p>{locale === 'en' ? gem.summaryEn : gem.summary}</p>
                <span className="gem-card-cta">
                  {tx('Buka Direktori', 'Open Directory')}{' '}
                  {locale === 'en' ? gem.cityNameEn : gem.cityName} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. 3 PILLARS OF NUSAVELA */}
      <section className="section grid">
        {pillars.map(([title, text]) => (
          <article key={title} className="panel">
            <h2>{title}</h2>
            <p className="muted">{text}</p>
          </article>
        ))}
      </section>

      {/* 8. INTERACTIVE 514-CITY ARCHIPELAGO DIRECTORY */}
      <section id="jelajah-kepulauan" className="section panel directory-explorer-panel">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {tx(
                'DIREKTORI NASIONAL 38 PROVINSI',
                'NATIONAL DIRECTORY OF 38 PROVINCES',
              )}
            </p>
            <h2>
              {tx(
                'Jelajahi 514 Kabupaten & Kota Berdasarkan Kepulauan',
                'Explore 514 Regencies & Cities by Archipelago Region',
              )}
            </h2>
          </div>
          <span className="badge verified mono">
            {locale === 'en'
              ? `Showing ${filteredDirectoryCities.length} of ${catalog.length} areas`
              : `Menampilkan ${filteredDirectoryCities.length} dari ${catalog.length} daerah`}
          </span>
        </div>

        <div
          className="region-filter-tabs"
          role="tablist"
          aria-label={tx(
            'Filter berdasarkan kepulauan',
            'Filter by island region',
          )}
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedRegion === 'all'}
            className={`pill ${selectedRegion === 'all' ? 'active' : ''}`}
            onClick={() => handleSelectRegion('all')}
          >
            🌏 {tx('Semua Kepulauan', 'All Islands')} ({catalog.length})
          </button>
          {ARCHIPELAGO_REGIONS.map(r => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={selectedRegion === r.id}
              className={`pill ${selectedRegion === r.id ? 'active' : ''}`}
              onClick={() => handleSelectRegion(r.id)}
            >
              {r.icon} {locale === 'en' ? r.nameEn : r.name} (
              {regionCounts[r.id] ?? 0})
            </button>
          ))}
        </div>

        <div className="explorer-controls-row">
          <label className="explorer-control">
            {tx('Filter Provinsi', 'Filter by Province')}
            <select
              value={selectedProvince}
              onChange={e => {
                setSelectedProvince(e.target.value)
                setVisibleCount(16)
              }}
            >
              <option value="all">
                {tx('Semua Provinsi', 'All Provinces')} ({availableProvinces.length})
              </option>
              {availableProvinces.map(p => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="explorer-control explorer-search-control">
            {tx('Filter Nama Kota / Kabupaten', 'Filter by City / Regency Name')}
            <input
              type="search"
              value={regionFilterQuery}
              placeholder={tx(
                'Ketik untuk menyaring daftar di bawah (misal: Bandung, Malang, Badung)…',
                'Type to filter the list below (e.g., Bandung, Malang, Badung)…',
              )}
              onChange={e => {
                setRegionFilterQuery(e.target.value)
                setVisibleCount(16)
              }}
            />
          </label>
        </div>

        <div className="city-directory-grid">
          {filteredDirectoryCities.slice(0, visibleCount).map(c => {
            const region = getCityRegion(c)
            const province = getProvinceName(c, locale)
            return (
              <Link
                key={c.id}
                to="/kota/$citySlug"
                params={{ citySlug: c.slug }}
                className="card city-directory-card"
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  {c.tier === 1 ? (
                    <span className="badge">
                      ★ {tx('Destinasi Unggulan', 'Featured City')}
                    </span>
                  ) : (
                    <span className="muted mono" style={{ fontSize: '12px' }}>
                      {region.icon}{' '}
                      {locale === 'en' ? region.shortNameEn : region.shortName}
                    </span>
                  )}
                  <span className="mono badge-tz">
                    {formatTimezoneLabel(c.timezone)}
                  </span>
                </div>
                <h3>{localizeCityName(c.name, locale)}</h3>
                <p className="city-card-province">
                  {tx('Provinsi', 'Province')} {province}
                </p>
                <p className="city-card-links">
                  {tx(
                    'Wisata · RS & IGD · Kuliner · Transportasi →',
                    'Tourism · 24H ER · Culinary · Transit →',
                  )}
                </p>
              </Link>
            )
          })}
        </div>

        {filteredDirectoryCities.length === 0 && (
          <p role="status" className="muted" style={{ textAlign: 'center', padding: '24px 0' }}>
            {tx(
              'Tidak ada kabupaten/kota yang cocok dengan filter tersebut.',
              'No regencies or cities match the selected filters.',
            )}
          </p>
        )}

        {visibleCount < filteredDirectoryCities.length && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="button"
              className="button button-outline"
              onClick={() => setVisibleCount(v => v + 24)}
            >
              {tx(
                `Tampilkan Lebih Banyak Daerah (${filteredDirectoryCities.length - visibleCount} tersisa) ↓`,
                `Show More Cities (${filteredDirectoryCities.length - visibleCount} remaining) ↓`,
              )}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
