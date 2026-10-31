import assert from 'node:assert/strict'
import { default as server } from '../dist/server/server.js'
const originalFetch = globalThis.fetch
const city = { id: 'test-city', name: 'Kota Uji', slug: 'kota-uji', latitude: -6.9, longitude: 107.6 }
const place = { id: 'test-place', name: 'Tempat <Uji>', slug: 'tempat-uji', address: null, latitude: -6.9, longitude: 107.6, is_24_hours: true, is_sponsored: false }
const requests = []
globalThis.fetch = async (input) => {
  const url = new URL(String(input)); requests.push(url)
  const path = url.pathname
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
  console.log('SSR integration: 4 routes, cache headers, JSON-LD, escaped content, coordinates and API outage passed')
} finally { globalThis.fetch = originalFetch }
