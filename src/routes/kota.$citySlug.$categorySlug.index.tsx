import { createFileRoute } from '@tanstack/react-router'
import { api, categories, city, cacheHeaders, placeSchema, seo } from '../lib/api'
import { directorySearch, queryString } from '../lib/search'
import { DirectoryMap } from '../components/DirectoryMap'
import { PlaceCard } from '../components/PlaceCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CategoryPills } from '../components/CategoryPills'
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
      ),
    ])
    const category = cats.find(x => x.slug === p.categorySlug)
    if (!category) throw new Error('Kategori tidak ditemukan')
    return { city: c, categories: cats, category, places }
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
  const d = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const list = useRef<HTMLDivElement>(null)
  const drag = useRef<number | null>(null)
  const [filterError, setFilterError] = useState('')
  const [gpsBusy, setGpsBusy] = useState(false)
  const isMedical = d.category.slug === 'rumah-sakit'

  function applyGpsFilter() {
    if (!navigator.geolocation) {
      setFilterError('Browser ini tidak mendukung deteksi lokasi GPS.')
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
        setFilterError('Lokasi GPS tidak tersedia atau izin ditolak.')
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
          { label: d.city.name, to: '/kota/$citySlug', params: { citySlug: d.city.slug } },
          { label: d.category.name },
        ]}
      />
      <h1>
        {d.category.name} di {d.city.name}
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
            {gpsBusy ? 'Mencari GPS…' : '📍 Urutkan dari Lokasi Saya'}
          </button>

          <label>
            Radius Pencarian
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
            Urutkan Berdasarkan
            <select name="sort" defaultValue={search.sort}>
              <option value="distance">Jarak Terdekat</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </label>

          <label className="row">
            <input name="open24h" type="checkbox" defaultChecked={search.open24h} />
            🕒 Buka 24 jam
          </label>

          {isMedical && (
            <label className="row">
              <input
                name="emergencyOnly"
                type="checkbox"
                defaultChecked={Boolean(search.emergencyOnly)}
              />
              🚑 Khusus IGD 24 jam
            </label>
          )}

          <button type="submit">Terapkan filter</button>

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
              Reset Filter
            </button>
          )}

          <details className="coords-details" open={search.lat !== undefined}>
            <summary>Pengaturan koordinat manual (opsional)</summary>
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
            aria-label="Geser tinggi daftar tempat"
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
          {!d.places.length && <p role="status">Belum ada tempat untuk filter ini.</p>}
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
              ← Sebelumnya
            </button>
            <span className="mono">Halaman {search.page}</span>
            <button
              className="button-outline"
              disabled={d.places.length < 60}
              onClick={() => navigate({ search: { ...search, page: search.page + 1 } })}
            >
              Berikutnya →
            </button>
          </div>
        </div>
        <DirectoryMap
          categorySlug={d.category.slug}
          places={d.places}
          center={[search.lat ?? d.city.latitude, search.lng ?? d.city.longitude]}
        />
      </div>
    </main>
  )
}
