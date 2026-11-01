import { Link } from '@tanstack/react-router'
import { PlaceCard } from './PlaceCard'
import type { City, Place } from '../lib/api'
export function PlacesPanel({ city, places, medical = false }: { city: City, places: Place[] | null, medical?: boolean }) {
  const category = medical ? 'rumah-sakit' : 'wisata'
  return <section className="panel"><h2>{medical ? 'Faskes dengan IGD 24 jam' : 'Jelajah wisata'}</h2>{places === null ? <p role="status">Daftar tempat belum dapat dimuat.</p> : !places.length ? <p>Belum ada tempat yang sesuai.</p> : places.slice(0, 4).map(place => <PlaceCard key={place.id} place={place} citySlug={city.slug} categorySlug={category} />)}<Link to="/kota/$citySlug/$categorySlug" params={{ citySlug: city.slug, categorySlug: category }} search={{ radius: 25000, open24h: medical, sort: 'distance', page: 1 }}>Lihat direktori lengkap →</Link></section>
}
