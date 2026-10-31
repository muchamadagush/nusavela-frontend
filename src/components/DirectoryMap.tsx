import { useEffect, useRef, useState } from 'react'
import type { Place } from '../lib/api'
import 'leaflet/dist/leaflet.css'
export function DirectoryMap({ places, center }: { places: Place[], center: [number, number] }) {
  const node = useRef<HTMLDivElement>(null), [error, setError] = useState('')
  const tile = import.meta.env.VITE_MAP_TILE_URL as string | undefined
  useEffect(() => {
    let removed = false, map: import('leaflet').Map | undefined
    if (!tile || !node.current) return
    import('leaflet').then(L => {
      if (removed || !node.current) return
      map = L.map(node.current).setView(center, 12)
      L.tileLayer(tile, { attribution: import.meta.env.VITE_MAP_ATTRIBUTION || '', maxZoom: 19 }).addTo(map)
      const attribution = document.createElement('a'); attribution.href = 'https://www.openstreetmap.org/copyright'; attribution.textContent = '© OpenStreetMap contributors'; attribution.target = '_blank'; attribution.rel = 'noopener noreferrer'
      const control = new L.Control({ position: 'bottomright' }); control.onAdd = () => { const el = document.createElement('div'); el.className = 'leaflet-control-attribution'; el.append(attribution); return el }; control.addTo(map)
      for (const p of places) { const label = document.createElement('span'); label.textContent = p.name; L.circleMarker([p.latitude, p.longitude], { radius: 7, color: '#0D5C46' }).bindPopup(label).addTo(map) }
      if (places.length) map.fitBounds(places.map(p => [p.latitude, p.longitude] as [number, number]), { padding: [25, 25], maxZoom: 15 })
    }).catch(() => setError('Peta belum dapat dimuat. Daftar tempat tetap tersedia.'))
    return () => { removed = true; map?.remove() }
  }, [places, center[0], center[1], tile])
  return <aside className="map" aria-label="Peta tempat">{tile && !error ? <div ref={node} className="map-canvas" /> : <div className="panel"><h2>Peta daerah</h2><p>{error || 'Peta tersedia setelah penyedia tile dikonfigurasi.'}</p><p>© OpenStreetMap contributors</p></div>}</aside>
}
