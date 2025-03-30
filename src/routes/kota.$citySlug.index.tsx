import { createFileRoute, Link } from '@tanstack/react-router'
import { api, categories, city, cacheHeaders, seo, placeSchema } from '../lib/api'
import { formatTimezoneLabel } from '../lib/format'
import { EmergencyPanel, emergencySchema } from '../components/EmergencyPanel'
import { WeatherPanel, weatherSchema } from '../components/WeatherPanel'
import { NewsPanel, newsSchema } from '../components/NewsPanel'
import { EventsPanel, eventSchema } from '../components/EventsPanel'
import { PlacesPanel } from '../components/PlacesPanel'
import { CommunityForm } from '../components/CommunityForm'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CategoryPills } from '../components/CategoryPills'

export const Route = createFileRoute('/kota/$citySlug/')({
  loader: async ({ params }) => {
    const [location, groups, emergency, weather, news, events, tourism, hospitals] =
      await Promise.all([
        city(params.citySlug),
        categories(),
        api(
          `/cities/${encodeURIComponent(params.citySlug)}/emergency`,
          emergencySchema.array(),
        ).catch(() => null),
        api(
          `/cities/${encodeURIComponent(params.citySlug)}/weather`,
          weatherSchema,
        ).catch(() => null),
        api(
          `/cities/${encodeURIComponent(params.citySlug)}/news`,
          newsSchema.array(),
        ).catch(() => null),
        api(
          `/cities/${encodeURIComponent(params.citySlug)}/events`,
          eventSchema.array(),
        ).catch(() => null),
        api(
          `/kota/${encodeURIComponent(params.citySlug)}/wisata`,
          placeSchema.array(),
        ).catch(() => null),
        api(
          `/kota/${encodeURIComponent(params.citySlug)}/rumah-sakit?is_24_hours=true&emergency_only=true`,
          placeSchema.array(),
        ).catch(() => null),
      ])
    return {
      city: location,
      categories: groups,
      emergency,
      weather,
      news,
      events,
      tourism,
      hospitals,
    }
  },
  headers: cacheHeaders,
  head: ({ loaderData: d }) =>
    d
      ? seo(
          `Jelajahi ${d.city.name} — NusaVela`,
          `Wisata, fasilitas kesehatan dan layanan lokal di ${d.city.name}.`,
          `/kota/${d.city.slug}`,
          { '@type': 'City', name: d.city.name },
        )
      : {},
  component: Dashboard,
})

function Dashboard() {
  const d = Route.useLoaderData()
  return (
    <main id="main">
      <Breadcrumbs items={[{ label: d.city.name }]} />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="eyebrow">DESTINASI & KESEHARIAN</p>
        <span className="badge mono">
          Zona Waktu: {formatTimezoneLabel(d.city.timezone)}
        </span>
      </div>
      <h1>Menjelajahi {d.city.name}</h1>
      <p className="muted">
        Pilih kategori untuk melihat direktori, filter jarak GPS, dan peta interaktif daerah.
      </p>

      <CategoryPills citySlug={d.city.slug} categories={d.categories} />

      <EmergencyPanel contacts={d.emergency} />

      <div className="bento section">
        <PlacesPanel city={d.city} places={d.tourism} />
        <PlacesPanel city={d.city} places={d.hospitals} medical />
        <WeatherPanel weather={d.weather} timezone={d.city.timezone} />
        <EventsPanel events={d.events} timezone={d.city.timezone} />
        <div className="wide">
          <NewsPanel news={d.news} />
        </div>
        {d.categories.map(c => (
          <Link
            className="panel"
            key={c.slug}
            to="/kota/$citySlug/$categorySlug"
            params={{ citySlug: d.city.slug, categorySlug: c.slug }}
            search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
            style={{ textDecoration: 'none' }}
          >
            <h2>{c.name}</h2>
            <p>Lihat tempat & rute →</p>
          </Link>
        ))}
      </div>

      <CommunityForm
        cityId={d.city.id}
        heading={`Usulkan tempat atau agenda baru di ${d.city.name}`}
      />
    </main>
  )
}
