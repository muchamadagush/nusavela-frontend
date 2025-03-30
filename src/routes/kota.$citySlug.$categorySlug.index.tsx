import { createFileRoute } from '@tanstack/react-router'
import { api, categories, city, cacheHeaders, placeSchema, seo } from '../lib/api'
import { localizeCategoryName, localizeCityName, useI18n } from '../lib/i18n'
import { directorySearch, queryString } from '../lib/search'
import { getFallbackPlacesForCity } from '../lib/regions'
import { DirectoryMap } from '../components/DirectoryMap'
import { PlaceCard } from '../components/PlaceCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CategoryPills } from '../components/CategoryPills'
import { CityTravelBookingHub } from '../components/MonetizationWidget'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/kota/$citySlug/$categorySlug/')({
  validateSearch: s => directorySearch.parse(s),
  loaderDeps: ({ search }) => search,
  loader: async ({ params: p, deps }) => {
    const [c, cats, places] = await Promise.all([
      city(p.citySlug),
      categories(),
      api(
        `/kota/${encodeURIComponent(p.citySlug)}/${encodeURIComponent(p.categorySlug)}?${queryString(deps)}`,
        placeSchema.array(),
      ).catch(() => []),
    ])
    const category = cats.find(x => x.slug === p.categorySlug)
    if (!category) throw new Error('Kategori tidak ditemukan')
    const finalPlaces =
      places.length > 0 ? places : getFallbackPlacesForCity(c, p.categorySlug)
    return { city: c, categories: cats, category, places: finalPlaces }
  },
  headers: cacheHeaders,
  head: ({ loaderData: d }) =>
    d
      ? seo(
          `${d.category.name} di ${d.city.name} — NusaVela`,
          `Direktori ${d.category.name.toLowerCase()} di ${d.city.name}, dilengkapi lokasi dan rute.`,
          `/kota/${d.city.slug}/${d.category.slug}`,
          { '@type': 'CollectionPage', name: `${d.category.name} di ${d.city.name}` },
        )
      : {},
  component: Directory,
})

function Directory() {
  const { locale, tx } = useI18n()
  const d = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const list = useRef<HTMLDivElement>(null)
  const drag = useRef<number | null>(null)
  const [filterError, setFilterError] = useState('')
  const [gpsBusy, setGpsBusy] = useState(false)
  const isMedical = d.category.slug === 'rumah-sakit'

  const displayCityName = localizeCityName(d.city.name, locale)
  const displayCatName = localizeCategoryName(
    d.category.slug,
    d.category.name,
    locale,
  )

  function applyGpsFilter() {
    if (!navigator.geolocation) {
      setFilterError(
        tx(
          'Browser ini tidak mendukung deteksi lokasi GPS.',
          'This browser does not support GPS geolocation.',
        ),
      )
      return
    }
    setGpsBusy(true)
    setFilterError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGpsBusy(false)
        void navigate({
          search: {
            ...search,
            lat: Number(coords.latitude.toFixed(6)),
            lng: Number(coords.longitude.toFixed(6)),
            page: 1,
          },
        })
      },
      () => {
        setGpsBusy(false)
        setFilterError(
          tx(
            'Lokasi GPS tidak tersedia atau izin ditolak.',
            'GPS location unavailable or permission denied.',
          ),
        )
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  const hasCustomFilter =
    search.lat !== undefined ||
    search.open24h ||
    Boolean(search.emergencyOnly) ||
    search.radius !== 25000 ||
    search.sort !== 'distance'

  return (
    <main id="main">
      <Breadcrumbs
        items={[
          {
            label: displayCityName,
            to: '/kota/$citySlug',
            params: { citySlug: d.city.slug },
          },
          { label: displayCatName },
        ]}
      />
      <h1>
        {locale === 'en'
          ? `${displayCatName} in ${displayCityName}`
          : `${d.category.name} di ${d.city.name}`}
      </h1>
      <CategoryPills
        citySlug={d.city.slug}
        categories={d.categories}
        activeCategorySlug={d.category.slug}
      />

      <div className="filters-card">
        <form
          className="filters"
          onSubmit={e => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            const emergencyChecked = f.get('emergencyOnly') === 'on'
            const next = directorySearch.safeParse({
              lat: f.get('lat') || undefined,
              lng: f.get('lng') || undefined,
              radius: f.get('radius'),
              open24h: f.get('open24h') === 'on' || emergencyChecked,
              ...(isMedical ? { emergencyOnly: emergencyChecked } : {}),
              sort: f.get('sort'),
              page: 1,
            })
            if (next.success) {
              setFilterError('')
              void navigate({ search: next.data })
            } else {
              setFilterError(next.error.issues.map(i => i.message).join('. '))
            }
          }}
        >
          <button
            type="button"
            className="button-outline"
            onClick={applyGpsFilter}
            disabled={gpsBusy}
          >
            {gpsBusy
              ? tx('Mencari GPS…', 'Locating GPS…')
              : tx('📍 Urutkan dari Lokasi Saya', '📍 Sort by My Location')}
          </button>

          <label>
            {tx('Radius Pencarian (m)', 'Search Radius (m)')}
            <input
              name="radius"
              type="number"
              min="100"
              max="100000"
              step="500"
              defaultValue={search.radius}
              required
            />
          </label>

          <label>
            {tx('Urutkan Berdasarkan', 'Sort By')}
            <select name="sort" defaultValue={search.sort}>
              <option value="distance">
                {tx('Jarak Terdekat', 'Nearest Distance')}
              </option>
              <option value="rating">
                {tx('Rating Tertinggi', 'Highest Rating')}
              </option>
            </select>
          </label>

          <label className="row">
            <input name="open24h" type="checkbox" defaultChecked={search.open24h} />
            🕒 {tx('Buka 24 jam', 'Open 24 hours')}
          </label>

          {isMedical && (
            <label className="row">
              <input
                name="emergencyOnly"
                type="checkbox"
                defaultChecked={Boolean(search.emergencyOnly)}
              />
              🚑 {tx('Khusus IGD 24 jam', '24H Emergency Room Only')}
            </label>
          )}

          <button type="submit">
            {tx('Terapkan filter', 'Apply filters')}
          </button>

          {hasCustomFilter && (
            <button
              type="button"
              className="button-outline"
              onClick={() =>
                void navigate({
                  search: { radius: 25000, open24h: false, sort: 'distance', page: 1 },
                })
              }
            >
              {tx('Reset Filter', 'Reset Filters')}
            </button>
          )}

          <details className="coords-details" open={search.lat !== undefined}>
            <summary>
              {tx(
                'Pengaturan koordinat manual (opsional)',
                'Manual coordinate settings (optional)',
              )}
            </summary>
            <div className="row" style={{ marginTop: '10px' }}>
              <label>
                Latitude
                <input
                  name="lat"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  defaultValue={search.lat}
                  placeholder="-6.9147"
                />
              </label>
              <label>
                Longitude
                <input
                  name="lng"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  defaultValue={search.lng}
                  placeholder="107.6098"
                />
              </label>
            </div>
          </details>
        </form>
      </div>

      {filterError && (
        <p role="alert" className="error">
          {filterError}
        </p>
      )}

      <div className="directory">
        <div className="directory-list" ref={list}>
          <button
            className="sheet-grip"
            aria-label={tx(
              'Geser tinggi daftar tempat',
              'Resize directory list height',
            )}
            onPointerDown={e => {
              drag.current = e.clientY
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={e => {
              if (drag.current !== null && list.current) {
                const height = Math.max(
                  180,
                  Math.min(
                    window.innerHeight * 0.85,
                    list.current.getBoundingClientRect().height + drag.current - e.clientY,
                  ),
                )
                list.current.style.maxHeight = `${height}px`
                list.current.style.overflowY = 'auto'
                drag.current = e.clientY
              }
            }}
            onPointerUp={() => {
              drag.current = null
            }}
            onPointerCancel={() => {
              drag.current = null
            }}
          />
          {!d.places.length && (
            <p role="status">
              {tx(
                'Belum ada tempat untuk filter ini.',
                'No places found for the selected filters.',
              )}
            </p>
          )}
          {d.places.map(p => (
            <PlaceCard
              key={p.id}
              place={p}
              citySlug={d.city.slug}
              categorySlug={d.category.slug}
            />
          ))}
          <div className="row" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
            <button
              className="button-outline"
              disabled={search.page === 1}
              onClick={() => navigate({ search: { ...search, page: search.page - 1 } })}
            >
              ← {tx('Sebelumnya', 'Previous')}
            </button>
            <span className="mono">
              {tx('Halaman', 'Page')} {search.page}
            </span>
            <button
              className="button-outline"
              disabled={d.places.length < 60}
              onClick={() => navigate({ search: { ...search, page: search.page + 1 } })}
            >
              {tx('Berikutnya', 'Next')} →
            </button>
          </div>
        </div>
        <DirectoryMap
          categorySlug={d.category.slug}
          places={d.places}
          center={[search.lat ?? d.city.latitude, search.lng ?? d.city.longitude]}
        />
      </div>
      <CityTravelBookingHub city={d.city} categorySlug={d.category.slug} />
    </main>
  )
}
