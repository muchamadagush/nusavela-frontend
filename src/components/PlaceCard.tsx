import { Link } from '@tanstack/react-router'
import { activeSponsor, type Place } from '../lib/api'
export function PlaceCard({ place: p, citySlug, categorySlug }: { place: Place, citySlug: string, categorySlug: string }) {
  return <article className={`card ${activeSponsor(p) ? 'sponsored' : ''}`}>{activeSponsor(p) && <span className="badge">Rekomendasi Mitra · Sponsor</span>}<h3><Link to="/kota/$citySlug/$categorySlug/$placeSlug" params={{ citySlug, categorySlug, placeSlug: p.slug }}>{p.name}</Link></h3>{p.is_verified && <p>Terverifikasi</p>}<p className="muted">{p.address || 'Alamat mengikuti titik peta'}</p><p>{p.is_24_hours ? 'Buka 24 jam' : p.opening_hours || 'Jam buka belum dikonfirmasi'}</p>{p.distance_meters != null && <p className="mono">{(p.distance_meters / 1000).toFixed(1)} km</p>}<a href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`} target="_blank" rel="noopener noreferrer">Rute ke lokasi ↗</a></article>
}
