import { createFileRoute, Link } from '@tanstack/react-router'
import { api, categories, city, cacheHeaders, seo, placeSchema } from '../lib/api'
import { formatTimezoneLabel } from '../lib/format'
import {
  CATEGORY_META,
  getCityRegion,
  getFallbackPlacesForCity,
  getProvinceName,
} from '../lib/regions'
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
    const [location, groups, emergency, weather, news, events, tourismRaw, hospitalsRaw] =
      await Promise.all([
        city(params.citySlug),
        categories().catch(() => [
          { slug: 'wisata', name: 'Wisata' },
          { slug: 'rumah-sakit', name: 'Rumah Sakit & Faskes' },
          { slug: 'kuliner', name: 'Kuliner & UMKM' },
          { slug: 'transportasi', name: 'Transportasi' },
          { slug: 'layanan-publik', name: 'Layanan Publik' },
        ]),
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

    const tourism =
      tourismRaw && tourismRaw.length > 0
        ? tourismRaw
        : tourismRaw !== null
          ? getFallbackPlacesForCity(location, 'wisata')
          : null

    const hospitals =
      hospitalsRaw && hospitalsRaw.length > 0
        ? hospitalsRaw
        : hospitalsRaw !== null
          ? getFallbackPlacesForCity(location, 'rumah-sakit')
          : null

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
          `Jelajahi ${d.city.name} — Panduan Wisata, Kuliner & IGD 24 Jam | NusaVela`,
          `Temukan destinasi wisata, kuliner khas, transportasi, agenda budaya, dan fasilitas kesehatan IGD 24 jam di ${d.city.name}.`,
          `/kota/${d.city.slug}`,
          { '@type': 'City', name: d.city.name },
        )
      : {},
  component: Dashboard,
})

function Dashboard() {
  const d = Route.useLoaderData()
  const region = getCityRegion(d.city)
  const province = getProvinceName(d.city)

  return (
    <main id="main">
      <Breadcrumbs items={[{ label: d.city.name }]} />

      <section
        className="city-hero-banner"
        style={{ background: region.gradient }}
      >
        <div className="city-hero-top">
          <span className="hero-kicker">
            {region.icon} KEPULAUAN {region.name.toUpperCase()} · PROVINSI {province.toUpperCase()}
          </span>
          <span className="badge mono">
            Zona Waktu: {formatTimezoneLabel(d.city.timezone)}
          </span>
        </div>

        <h1>Menjelajahi {d.city.name}</h1>
        <p className="city-hero-lead">
          Panduan terpadu destinasi wisata unggulan, kuliner daerah, simpul transportasi, prakiraan cuaca, hingga akses cepat fasilitas kesehatan & IGD 24 jam di {d.city.name}.
        </p>

        <div className="city-hero-meta mono">
          <span>📍 Koordinat: {d.city.latitude.toFixed(4)}, {d.city.longitude.toFixed(4)}</span>
          {d.city.tier === 1 && <span>✦ Kota Prioritas Nasional</span>}
        </div>
      </section>

      <CategoryPills citySlug={d.city.slug} categories={d.categories} />

      <EmergencyPanel contacts={d.emergency} />

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">KATEGORI DIREKTORI KOTA</p>
            <h2>Jelajahi Layanan & Destinasi di {d.city.name}</h2>
          </div>
        </div>
        <div className="category-cards-grid">
          {d.categories.map(c => {
            const meta = CATEGORY_META[c.slug] ?? CATEGORY_META.wisata
            return (
              <Link
                className="panel category-feature-card"
                key={c.slug}
                to="/kota/$citySlug/$categorySlug"
                params={{ citySlug: d.city.slug, categorySlug: c.slug }}
                search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="category-card-icon">{meta.icon}</span>
                  <span className="badge">{meta.badge}</span>
                </div>
                <h3>{c.name}</h3>
                <p className="muted">{meta.desc}</p>
                <span className="story-link-primary">
                  Buka Direktori & Peta Interaktif →
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="bento section">
        <PlacesPanel city={d.city} places={d.tourism} />
        <PlacesPanel city={d.city} places={d.hospitals} medical />
        <WeatherPanel weather={d.weather} timezone={d.city.timezone} />
        <EventsPanel events={d.events} timezone={d.city.timezone} />
        <div className="wide">
          <NewsPanel news={d.news} />
        </div>
      </div>

      <CommunityForm
        cityId={d.city.id}
        heading={`Usulkan tempat wisata, kuliner, atau agenda baru di ${d.city.name}`}
      />
    </main>
  )
}
