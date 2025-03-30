import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { cities, seo } from '../lib/api'
import { DEFAULT_CITIES } from '../lib/default-cities'
import { formatTimezoneLabel } from '../lib/format'
import {
  ARCHIPELAGO_REGIONS,
  HERO_SPOTLIGHTS,
  HIDDEN_GEMS,
  POPULAR_RECOMMENDATIONS,
  PROVINCE_NAMES,
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
  const data = Route.useLoaderData()
  const catalog = data.cities.length > 0 ? data.cities : DEFAULT_CITIES

  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [regionFilterQuery, setRegionFilterQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(16)

  const activeSpotlight = HERO_SPOTLIGHTS[spotlightIndex] ?? HERO_SPOTLIGHTS[0]

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
      .map(code => ({ code, name: PROVINCE_NAMES[code] || `Provinsi ${code}` }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'))
  }, [catalog, selectedRegion])

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
          const prov = getProvinceName(c).toLocaleLowerCase('id')
          return (
            c.name.toLocaleLowerCase('id').includes(q) ||
            (c.short_name && c.short_name.toLocaleLowerCase('id').includes(q)) ||
            prov.includes(q)
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

  return (
    <main id="main">
      {/* 1. CINEMATIC WONDERFUL ARCHIPELAGO HERO SHOWCASE */}
      <section className="hero-showcase" aria-label="Sorotan Destinasi Utama Nusantara">
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url(${activeSpotlight.imageUrl})` }}
        />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-top-pills">
            <span className="hero-kicker">✦ WONDERFUL ARCHIPELAGO & PUBLIC UTILITY</span>
            <span className="hero-region-pill">{activeSpotlight.badge}</span>
          </div>

          <h1>
            {activeSpotlight.title}
            <br />
            <em>{activeSpotlight.subtitle}</em>
          </h1>

          <p className="hero-lead">{activeSpotlight.description}</p>

          <div className="hero-highlights">
            {activeSpotlight.highlights.map(item => (
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
              🧭 Jelajahi {activeSpotlight.cityName} →
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
              🗺️ Lihat Peta & Destinasi
            </Link>
          </div>

          <div className="hero-spotlight-tabs" role="tablist" aria-label="Pilih sorotan destinasi">
            {HERO_SPOTLIGHTS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={spotlightIndex === idx}
                className={`spotlight-tab ${spotlightIndex === idx ? 'active' : ''}`}
                onClick={() => setSpotlightIndex(idx)}
              >
                <span className="spotlight-tab-region">{item.region}</span>
                <strong>{item.cityName}</strong>
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
          Daftar kota belum dapat dimuat dari server. Menampilkan katalog direktori lokal 514 kabupaten/kota Indonesia.
        </p>
      )}

      {/* 3. ARCHIPELAGO ISLAND CARDS (PESONA INDONESIA DI SETIAP PULAUNYA) */}
      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">DESTINASI WISATA INDONESIA</p>
            <h2>Pesona Indonesia di Setiap Pulaunya</h2>
          </div>
          <a href="#jelajah-kepulauan" className="pill">
            Lihat Semua 514 Kab/Kota ↓
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
                  {regionCounts[region.id] ?? 0} Kab/Kota
                </span>
              </div>
              <h3>{region.name}</h3>
              <p>{region.tagline}</p>
              <span className="region-card-cta">Jelajahi Kepulauan →</span>
            </a>
          ))}
        </div>
      </section>

      {/* 4. REKOMENDASI WISATA POPULER (EDITORIAL DESTINATION CARDS) */}
      <section id="rekomendasi-populer" className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">REKOMENDASI WISATA POPULER</p>
            <h2>Jelajahi Keindahan & Warisan Nusantara</h2>
          </div>
          <span className="mono muted">Kurasi Destinasi & Utilitas Kota</span>
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
                  alt={card.title}
                  loading="lazy"
                  className="story-card-img"
                />
                <span className="story-region-tag">{card.regionBadge}</span>
              </Link>
              <div className="story-card-body">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="mono muted" style={{ fontSize: '12px' }}>
                    📍 {card.cityName}
                  </span>
                  <span className="badge">{card.readTimeOrTag}</span>
                </div>
                <h3>
                  <Link
                    to="/kota/$citySlug"
                    params={{ citySlug: card.citySlug }}
                  >
                    {card.title}
                  </Link>
                </h3>
                <p className="muted">{card.summary}</p>
                <div className="story-card-footer">
                  <Link
                    to="/kota/$citySlug"
                    params={{ citySlug: card.citySlug }}
                    className="story-link-primary"
                  >
                    Panduan Kota →
                  </Link>
                  <div className="row" style={{ gap: '6px' }}>
                    <Link
                      to="/kota/$citySlug/$categorySlug"
                      params={{ citySlug: card.citySlug, categorySlug: 'wisata' }}
                      search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
                      className="chip"
                    >
                      🧭 Wisata
                    </Link>
                    <Link
                      to="/kota/$citySlug/$categorySlug"
                      params={{ citySlug: card.citySlug, categorySlug: 'rumah-sakit' }}
                      search={{ radius: 25000, open24h: true, sort: 'distance', page: 1 }}
                      className="chip"
                    >
                      🏥 IGD 24 Jam
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
            <span className="hero-kicker">✦ REKOMENDASI PENGALAMAN TERLENGKAP</span>
            <h2>Taman Nasional Bunaken & Pesona Bahari Sulawesi</h2>
            <p>
              Mencari perjalanan dengan kombinasi penyelaman dinding karang tropis, wisata kuliner rempah pesisir Manado, serta kepastian layanan darurat & transportasi kota yang terverifikasi? Mulailah petualangan Anda dari gerbang Sulawesi Utara.
            </p>
            <div className="row" style={{ marginTop: '20px' }}>
              <Link
                to="/kota/$citySlug"
                params={{ citySlug: 'kota-manado' }}
                className="button hero-cta-primary"
              >
                🌊 Lihat Panduan Kota Manado & Bunaken →
              </Link>
              <Link
                to="/kota/$citySlug"
                params={{ citySlug: 'kabupaten-raja-ampat' }}
                className="button hero-cta-secondary"
              >
                🏝️ Jelajahi Raja Ampat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HIDDEN GEMS TERBARU INDONESIA */}
      <section id="hidden-gems" className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">REKOMENDASI WISATA TERBARU</p>
            <h2>Hidden Gem & Lanskap Ikonik Indonesia</h2>
          </div>
          <span className="mono muted">Eksplorasi Lintas Pulau</span>
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
                alt={gem.title}
                loading="lazy"
                className="gem-card-img"
              />
              <div className="gem-card-overlay">
                <span className="story-region-tag">{gem.regionBadge}</span>
                <h3>{gem.title}</h3>
                <p>{gem.summary}</p>
                <span className="gem-card-cta">
                  Buka Direktori {gem.cityName} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. 3 PILLARS OF NUSAVELA (TOURISM + EMERGENCY UTILITY + REGIONAL PULSE) */}
      <section className="section grid">
        {[
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
        ].map(([title, text]) => (
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
            <p className="eyebrow">DIREKTORI NASIONAL 38 PROVINSI</p>
            <h2>Jelajahi 514 Kabupaten & Kota Berdasarkan Kepulauan</h2>
          </div>
          <span className="badge verified mono">
            Menampilkan {filteredDirectoryCities.length} dari {catalog.length} daerah
          </span>
        </div>

        <div className="region-filter-tabs" role="tablist" aria-label="Filter berdasarkan kepulauan">
          <button
            type="button"
            role="tab"
            aria-selected={selectedRegion === 'all'}
            className={`pill ${selectedRegion === 'all' ? 'active' : ''}`}
            onClick={() => handleSelectRegion('all')}
          >
            🌏 Semua Kepulauan ({catalog.length})
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
              {r.icon} {r.name} ({regionCounts[r.id] ?? 0})
            </button>
          ))}
        </div>

        <div className="explorer-controls-row">
          <label className="explorer-control">
            Filter Provinsi
            <select
              value={selectedProvince}
              onChange={e => {
                setSelectedProvince(e.target.value)
                setVisibleCount(16)
              }}
            >
              <option value="all">Semua Provinsi ({availableProvinces.length})</option>
              {availableProvinces.map(p => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="explorer-control explorer-search-control">
            Filter Nama Kota / Kabupaten
            <input
              type="search"
              value={regionFilterQuery}
              placeholder="Ketik untuk menyaring daftar di bawah (misal: Bandung, Malang, Badung)…"
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
            const province = getProvinceName(c)
            return (
              <Link
                key={c.id}
                to="/kota/$citySlug"
                params={{ citySlug: c.slug }}
                className="card city-directory-card"
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  {c.tier === 1 ? (
                    <span className="badge">★ Destinasi Unggulan</span>
                  ) : (
                    <span className="muted mono" style={{ fontSize: '12px' }}>
                      {region.icon} {region.shortName}
                    </span>
                  )}
                  <span className="mono badge-tz">
                    {formatTimezoneLabel(c.timezone)}
                  </span>
                </div>
                <h3>{c.name}</h3>
                <p className="city-card-province">
                  Provinsi {province}
                </p>
                <p className="city-card-links">
                  Wisata · RS & IGD · Kuliner · Transportasi →
                </p>
              </Link>
            )
          })}
        </div>

        {filteredDirectoryCities.length === 0 && (
          <p role="status" className="muted" style={{ textAlign: 'center', padding: '24px 0' }}>
            Tidak ada kabupaten/kota yang cocok dengan filter tersebut.
          </p>
        )}

        {visibleCount < filteredDirectoryCities.length && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="button"
              className="button button-outline"
              onClick={() => setVisibleCount(v => v + 24)}
            >
              Tampilkan Lebih Banyak Daerah ({filteredDirectoryCities.length - visibleCount} tersisa) ↓
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
