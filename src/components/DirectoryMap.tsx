import { useEffect, useRef, useState } from 'react'
import { activeSponsor, type Place } from '../lib/api'
import { useI18n } from '../lib/i18n'
import { CATEGORY_MAP_COLORS, markerStyle } from '../lib/map-style'
import 'leaflet/dist/leaflet.css'

export function DirectoryMap({
  places,
  center,
  categorySlug = 'wisata',
}: {
  places: Place[]
  center: [number, number]
  categorySlug?: string
}) {
  const { tx } = useI18n()
  const node = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const tile = import.meta.env.VITE_MAP_TILE_URL as string | undefined
  const martinTile = import.meta.env.VITE_MARTIN_TILE_URL as string | undefined
  const commercialMap = !['rumah-sakit', 'layanan-publik'].includes(categorySlug)

  useEffect(() => {
    let removed = false
    let map: import('leaflet').Map | undefined
    if (!tile || !node.current) return
    import('leaflet')
      .then(L => {
        if (removed || !node.current) return
        map = L.map(node.current).setView(center, 12)
        L.tileLayer(tile, {
          attribution: import.meta.env.VITE_MAP_ATTRIBUTION || '',
          maxZoom: 19,
        }).addTo(map)
        const attribution = document.createElement('a')
        attribution.href = 'https://www.openstreetmap.org/copyright'
        attribution.textContent = '© OpenStreetMap contributors'
        attribution.target = '_blank'
        attribution.rel = 'noopener noreferrer'
        const control = new L.Control({ position: 'bottomright' })
        control.onAdd = () => {
          const el = document.createElement('div')
          el.className = 'leaflet-control-attribution'
          el.append(attribution)
          return el
        }
        control.addTo(map)
        for (const p of places) {
          const label = document.createElement('span')
          label.textContent = p.name
          L.circleMarker(
            [p.latitude, p.longitude],
            markerStyle(categorySlug, activeSponsor(p)),
          )
            .bindPopup(label)
            .addTo(map)
        }
        if (places.length) {
          map.fitBounds(
            places.map(p => [p.latitude, p.longitude] as [number, number]),
            { padding: [25, 25], maxZoom: 15 },
          )
        }
      })
      .catch(() =>
        setError(
          tx(
            'Peta belum dapat dimuat. Daftar tempat tetap tersedia.',
            'Map could not be loaded. The place directory remains available.',
          ),
        ),
      )
    return () => {
      removed = true
      map?.remove()
    }
  }, [places, center[0], center[1], tile, categorySlug])

  const categoryInfo = CATEGORY_MAP_COLORS[categorySlug] || CATEGORY_MAP_COLORS.wisata

  return (
    <aside className="map" aria-label={tx('Peta tempat', 'Places map')}>
      {tile && !error ? (
        <div ref={node} className="map-canvas" />
      ) : (
        <div className="panel">
          <h2>{tx('Peta daerah', 'Regional map')}</h2>
          <p>
            {error ||
              tx(
                'Peta tersedia setelah penyedia tile dikonfigurasi.',
                'Interactive map is available once the tile provider URL is configured.',
              )}
          </p>
          {martinTile && (
            <p className="mono">
              {tx('Sumber MVT Martin siap:', 'Martin MVT source ready:')} {martinTile}
            </p>
          )}
          <div className="row" aria-label={tx('Legenda pin peta', 'Map pin legend')}>
            <span className="badge" style={{ borderColor: categoryInfo.color }}>
              ● {categoryInfo.label}
            </span>
            {commercialMap && (
              <span className="badge" style={{ borderColor: '#C89B3C' }}>
                ★ {tx('Mitra Spotlight (#C89B3C)', 'Spotlight Partner (#C89B3C)')}
              </span>
            )}
          </div>
          <p>© OpenStreetMap contributors</p>
        </div>
      )}
    </aside>
  )
}
