import { createFileRoute, Link } from '@tanstack/react-router'
import { api, categories, city, cacheHeaders, seo } from '../lib/api'
import { EmergencyPanel, emergencySchema } from '../components/EmergencyPanel'
export const Route = createFileRoute('/kota/$citySlug/')({
  loader: async ({ params }) => {
    const [location, groups, emergency] = await Promise.all([
      city(params.citySlug), categories(),
      api(`/cities/${encodeURIComponent(params.citySlug)}/emergency`, emergencySchema.array()).catch(() => null),
    ])
    return { city: location, categories: groups, emergency }
  }, headers: cacheHeaders,
  head: ({ loaderData: d }) => d ? seo(`Jelajahi ${d.city.name} — NusaVela`, `Wisata, fasilitas kesehatan dan layanan lokal di ${d.city.name}.`, `/kota/${d.city.slug}`, { '@type': 'City', name: d.city.name }) : {}, component: Dashboard,
})
function Dashboard() { const d = Route.useLoaderData(); return <main id="main"><p className="eyebrow">DESTINASI & KESEHARIAN</p><h1>Menjelajahi {d.city.name}</h1><p className="muted">Pilih kategori untuk melihat direktori dan peta daerah.</p><EmergencyPanel contacts={d.emergency} /><div className="bento section">{d.categories.map(c => <Link className="panel" key={c.slug} to="/kota/$citySlug/$categorySlug" params={{ citySlug: d.city.slug, categorySlug: c.slug }} search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}><h2>{c.name}</h2><p>Lihat tempat & rute →</p></Link>)}</div></main> }
