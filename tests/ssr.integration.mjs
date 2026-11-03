import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
const serverModulePath = existsSync(new URL('../dist/server/server.js', import.meta.url))
  ? '../dist/server/server.js'
  : '../node_modules/.nitro/vite/services/ssr/index.js'
const { default: server } = await import(serverModulePath)
const originalFetch = globalThis.fetch
const city = { id: 'test-city', name: 'Kota Uji', slug: 'kota-uji', latitude: -6.9, longitude: 107.6 }
const place = { id: 'test-place', name: 'Tempat <Uji>', slug: 'tempat-uji', address: null, latitude: -6.9, longitude: 107.6, is_24_hours: true, is_sponsored: false }
const requests = []
let emergencyContacts = [{ id: 1, service_name: 'Ambulans Uji', phone_number: '119', is_active: true, is_24_hours: true, source_url: 'https://example.org/verified', verified_at: '2026-10-31T00:00:00Z' }]
let emergencyUnavailable = false
globalThis.fetch = async (input) => {
  const url = new URL(String(input)); requests.push(url)
  const path = url.pathname
  if (path.endsWith('/events')) return Response.json([{ id: 'event-1', title: 'Festival Uji', venue_name: 'Alun-alun', start_datetime: '2026-11-02T00:00:00Z', end_datetime: '2026-11-02T08:00:00Z', ticket_price: 0, is_sponsored: false }])
  if (path.endsWith('/news')) return Response.json([{ id: 'news-1', title: 'Berita <Uji>', summary: 'Ringkasan '.repeat(30), source_name: 'Media Uji', source_url: 'https://example.org/news', published_at: '2026-11-01T00:00:00Z' }])
  if (path.endsWith('/weather')) return Response.json({ temperature_c: 27.5, description: 'Cerah berawan', observed_at: 1793491200, attribution: { name: 'OpenWeather', url: 'https://openweathermap.org/' } })
  if (path.endsWith('/emergency')) return emergencyUnavailable ? new Response('', { status: 503 }) : Response.json(emergencyContacts)
  const payload = path.endsWith('/cities') ? [city] : path.endsWith('/cities/kota-uji') ? city : path.endsWith('/categories') ? [{ slug: 'wisata', name: 'Wisata' }] : path.endsWith('/tempat-uji') ? place : path.endsWith('/wisata') ? [place] : undefined
  return payload === undefined ? new Response('', { status: 404 }) : Response.json(payload)
}
try {
  for (const path of ['/', '/kota/kota-uji', '/kota/kota-uji/wisata?lat=0&lng=0&open24h=false', '/kota/kota-uji/wisata/tempat-uji']) {
    let requestUrl = `http://localhost${path}`; let response = await server.fetch(new Request(requestUrl));
    for (let redirects = 0; response.status >= 300 && response.status < 400 && redirects < 5; redirects++) { requestUrl = new URL(response.headers.get('location'), requestUrl).href; response = await server.fetch(new Request(requestUrl)) }
    const html = await response.text()
    assert.equal(response.status, 200, path)
    assert.ok(html.includes('<html lang="id"'), path)
    assert.ok(html.includes('application/ld+json'), path)
    assert.ok(!html.includes('<Uji>'), 'API text must not become executable HTML')
    if (path.startsWith('/kota/')) assert.ok(response.headers.get('cache-control')?.includes('s-maxage=3600'))
  }
  assert.ok(requests.some(u => u.searchParams.get('lat') === '0' && u.searchParams.get('is_24_hours') === 'false'))
  async function cityHtml() {
    const response = await server.fetch(new Request('http://localhost/kota/kota-uji'))
    assert.equal(response.status, 200)
    return response.text()
  }
  const emergencyHtml = await cityHtml()
  assert.ok(emergencyHtml.includes('href="tel:119"'))
  assert.ok(emergencyHtml.includes('Sumber verifikasi'))
  assert.ok(emergencyHtml.replace(/<!--.*?-->/g, '').includes('28 °C'))
  assert.ok(emergencyHtml.includes('Sumber: OpenWeather'))
  assert.ok(emergencyHtml.includes('Faskes dengan IGD 24 jam'))
  assert.ok(requests.some(u => u.pathname.endsWith('/rumah-sakit') && u.searchParams.get('emergency_only') === 'true'))
  assert.ok(emergencyHtml.includes('Festival Uji'))
  assert.ok(emergencyHtml.includes('Gratis'))
  assert.ok(emergencyHtml.includes('Media Uji'))
  assert.ok(emergencyHtml.includes('https://example.org/news'))
  assert.ok(!emergencyHtml.includes('Ringkasan '.repeat(19)), 'RSS summary must be capped at 160 characters')
  emergencyContacts = [{ ...emergencyContacts[0], is_active: false }]
  assert.ok(!(await cityHtml()).includes('href="tel:119"'), 'Inactive contacts must not be callable')
  emergencyContacts = [{ ...emergencyContacts[0], is_active: true, source_url: 'javascript:alert(1)' }]
  assert.ok(!(await cityHtml()).includes('href="tel:119"'), 'Unsafe verification sources must not authorize a contact')
  emergencyContacts = []
  assert.ok((await cityHtml()).includes('Belum ada kontak darurat terverifikasi'))
  emergencyUnavailable = true
  assert.ok((await cityHtml()).includes('Kontak darurat belum dapat dimuat'))
  const sitemap = await server.fetch(new Request('http://localhost/sitemap.xml'))
  assert.equal(sitemap.status, 200)
  assert.ok(sitemap.headers.get('content-type').includes('application/xml'))
  const xml = await sitemap.text()
  for (const path of ['/', '/kota/kota-uji', '/kota/kota-uji/wisata']) {
    assert.ok(xml.includes(`<loc>https://nusavela.com${path}</loc>`))
  }
  assert.equal((xml.match(/<url>/g) || []).length, 3, 'Only real API cities and categories are indexed')
  const robots = await server.fetch(new Request('http://localhost/robots.txt'))
  assert.equal(robots.status, 200)
  assert.ok((await robots.text()).includes('Sitemap: https://nusavela.com/sitemap.xml'))
  globalThis.fetch = async () => { throw new Error('simulated API outage') }
  const unavailableSitemap = await server.fetch(new Request('http://localhost/sitemap.xml'))
  assert.equal(unavailableSitemap.status, 503)
  assert.equal(unavailableSitemap.headers.get('cache-control'), 'no-store')

  const outage = await server.fetch(new Request('http://localhost/')); const html = await outage.text()
  assert.equal(outage.status, 200); assert.ok(html.includes('Daftar kota belum dapat dimuat'))
  console.log('SSR integration: 4 page routes, emergency contacts (verified/inactive/unsafe/empty/outage), sitemap, robots, SEO and API outage passed')
} finally { globalThis.fetch = originalFetch }
