import { createFileRoute } from '@tanstack/react-router'
import { categories, cities, sitemapPlaces } from '../lib/api'

const escapeXml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    char =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!,
  )

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [locations, groups, placeItems] = await Promise.all([
            cities(),
            categories(),
            sitemapPlaces(1).catch(() => []),
          ])
          const paths = new Set(['/'])
          for (const city of locations) {
            const path = `/kota/${encodeURIComponent(city.slug)}`
            paths.add(path)
            for (const group of groups) {
              paths.add(`${path}/${encodeURIComponent(group.slug)}`)
            }
          }
          for (const item of placeItems) {
            if (paths.size >= 49999) break
            paths.add(
              `/kota/${encodeURIComponent(item.city_slug)}/${encodeURIComponent(item.category_slug)}/${encodeURIComponent(item.place_slug)}`,
            )
          }
          // The sitemap protocol permits at most 50,000 URLs per document.
          if (paths.size > 50000) throw new Error('Sitemap requires pagination')
          const xml =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            [...paths]
              .map(path => `<url><loc>${escapeXml(`https://nusavela.com${path}`)}</loc></url>`)
              .join('') +
            '</urlset>'
          return new Response(xml, {
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
              'Cache-Control': 'public, max-age=300, s-maxage=3600',
            },
          })
        } catch {
          return new Response('Sitemap sementara tidak tersedia', {
            status: 503,
            headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' },
          })
        }
      },
    },
  },
})
