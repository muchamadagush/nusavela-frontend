import { useId, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { nearestCity, type City } from '../lib/api'
import { DEFAULT_CITIES } from '../lib/default-cities'
import { formatTimezoneLabel } from '../lib/format'
import { getCityRegion, getProvinceName } from '../lib/regions'

const ALIAS_MAP: Record<string, string[]> = {
  jogja: ['yogyakarta', 'sleman', 'bantul', 'kulon progo', 'gunungkidul'],
  yogya: ['yogyakarta', 'sleman', 'bantul'],
  solo: ['surakarta', 'sukoharjo', 'karanganyar'],
  bali: ['denpasar', 'badung', 'gianyar', 'tabanan', 'buleleng', 'klungkung', 'bangli', 'karangasem', 'jembrana'],
  lombok: ['mataram', 'lombok barat', 'lombok tengah', 'lombok timur', 'lombok utara'],
  labuanbajo: ['manggarai barat'],
  'labuan bajo': ['manggarai barat'],
  komodo: ['manggarai barat'],
  bromo: ['malang', 'probolinggo', 'pasuruan', 'lumajang'],
  toba: ['samosir', 'toba', 'apanuli utara', 'simelungun'],
  bunaken: ['manado'],
  makasar: ['makassar'],
  'ujung pandang': ['makassar'],
  betawi: ['jakarta'],
}

function normalizeQuery(text: string): string {
  return text
    .toLocaleLowerCase('id')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchCities(catalog: City[], rawQuery: string, limit = 25): City[] {
  const q = normalizeQuery(rawQuery)
  if (!q) {
    return [...catalog]
      .sort((a, b) => (a.tier ?? 2) - (b.tier ?? 2) || a.name.localeCompare(b.name, 'id'))
      .slice(0, limit)
  }

  const expandedTerms = [q, ...(ALIAS_MAP[q] ?? [])]

  const scored: Array<{ city: City; score: number }> = []
  for (const c of catalog) {
    const nameNorm = normalizeQuery(c.name)
    const shortNorm = normalizeQuery(c.short_name ?? '')
    const slugNorm = normalizeQuery(c.slug.replace(/-/g, ' '))
    const provNorm = normalizeQuery(getProvinceName(c))
    const regionNorm = normalizeQuery(getCityRegion(c).name)

    let bestScore = 0
    for (const term of expandedTerms) {
      if (shortNorm === term || nameNorm === term) {
        bestScore = Math.max(bestScore, 100)
      } else if (nameNorm === `kota ${term}`) {
        bestScore = Math.max(bestScore, 98)
      } else if (nameNorm === `kabupaten ${term}`) {
        bestScore = Math.max(bestScore, 92)
      } else if (shortNorm.startsWith(term) || nameNorm.startsWith(term)) {
        bestScore = Math.max(bestScore, 86)
      } else if (nameNorm.includes(term) || shortNorm.includes(term) || slugNorm.includes(term)) {
        bestScore = Math.max(bestScore, 74)
      } else if (provNorm.includes(term) || regionNorm.includes(term)) {
        bestScore = Math.max(bestScore, 60)
      }
    }

    if (bestScore > 0) {
      if (c.tier === 1) bestScore += 5
      scored.push({ city: c, score: bestScore })
    }
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.city.tier ?? 2) - (b.city.tier ?? 2) ||
        a.city.name.localeCompare(b.city.name, 'id'),
    )
    .slice(0, limit)
    .map(item => item.city)
}

export function CityPicker({ cities }: { cities: City[] }) {
  const catalog = cities.length > 0 ? cities : DEFAULT_CITIES
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const id = useId()
  const navigate = useNavigate()

  const matches = useMemo(() => matchCities(catalog, q, 25), [catalog, q])

  const featured = useMemo(() => catalog.filter(c => c.tier === 1).slice(0, 10), [catalog])
  const quickCities = featured.length ? featured : catalog.slice(0, 10)

  const choose = (c: City) => {
    setOpen(false)
    void navigate({ to: '/kota/$citySlug', params: { citySlug: c.slug } })
  }

  function gps() {
    if (!navigator.geolocation) {
      setError('Browser ini tidak mendukung deteksi lokasi. Silakan pilih kota.')
      return
    }
    setBusy(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          choose(await nearestCity(coords.latitude, coords.longitude))
        } catch {
          setError('Kota terdekat belum dapat dimuat. Silakan pilih kota.')
        } finally {
          setBusy(false)
        }
      },
      () => {
        setBusy(false)
        setError('Lokasi tidak tersedia atau izin ditolak. Silakan pilih kota.')
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <section className="panel city-picker-panel" aria-label="Pencarian destinasi kabupaten dan kota">
      <div className="picker-header-row">
        <div>
          <label htmlFor={id} className="picker-label">
            Kota atau pulau mana yang ingin Anda jelajahi hari ini?
          </label>
          <p className="picker-sublabel">
            Cari langsung dari <strong>{catalog.length} kabupaten/kota</strong> di 38 provinsi (coba ketik: <em>Bandung</em>, <em>Bali</em>, <em>Yogyakarta</em>, <em>Labuan Bajo</em>, atau <em>Raja Ampat</em>)
          </p>
        </div>
        <span className="badge verified mono">38 Provinsi · 514 Daerah</span>
      </div>

      <div className="picker-bar">
        <div className="picker-input-wrap">
          <span className="picker-search-icon" aria-hidden="true">🔍</span>
          <input
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-activedescendant={
              open && matches[active] ? `${id}-${active}` : undefined
            }
            value={q}
            placeholder="Ketik nama kota, kabupaten, provinsi, atau destinasi (misal: Bandung, Bali, Jogja)…"
            onFocus={() => setOpen(true)}
            onChange={e => {
              setQ(e.target.value)
              setActive(0)
              setOpen(true)
            }}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setOpen(true)
                setActive(i => Math.min(i + 1, matches.length - 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive(i => Math.max(i - 1, 0))
              }
              if (e.key === 'Enter' && open && matches[active]) {
                e.preventDefault()
                choose(matches[active])
              }
            }}
          />
          {q && (
            <button
              type="button"
              className="clear-btn"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQ('')
                setActive(0)
              }}
            >
              ✕
            </button>
          )}
        </div>
        <button type="button" onClick={gps} disabled={busy} className="gps-btn">
          {busy ? 'Mencari lokasi…' : '📍 Gunakan lokasi saya'}
        </button>
      </div>

      {open && matches.length > 0 && (
        <ul role="listbox" id={`${id}-list`} className="listbox">
          {matches.map((c, i) => {
            const region = getCityRegion(c)
            const province = getProvinceName(c)
            return (
              <li
                key={c.id}
                role="option"
                id={`${id}-${i}`}
                aria-selected={active === i}
              >
                <button type="button" onClick={() => choose(c)}>
                  <div className="listbox-city-main">
                    <strong>{c.name}</strong>
                    <span className="listbox-city-meta">
                      {region.icon} {province} · Kepulauan {region.shortName}
                    </span>
                  </div>
                  <span className="row">
                    {c.tier === 1 && <span className="badge">Destinasi Unggulan</span>}
                    {c.timezone && (
                      <small className="mono badge-tz">
                        {formatTimezoneLabel(c.timezone)}
                      </small>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {open && !matches.length && <p role="status">Kota tidak ditemukan.</p>}
      {error && <p role="alert" className="error">{error}</p>}

      {quickCities.length > 0 && (
        <div className="quick-cities">
          <span className="muted">✨ Populer dijelajahi:</span>
          {quickCities.map(c => (
            <button
              key={c.id}
              type="button"
              className="chip"
              onClick={() => choose(c)}
            >
              {getCityRegion(c).icon} {c.short_name || c.name}
            </button>
          ))}
        </div>
      )}

      <p className="muted picker-hint">
        Lokasi digunakan setelah Anda menekan tombol. Anda juga dapat memilih kota secara manual.
      </p>
    </section>
  )
}
