import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { readFile, realpath, stat } from 'node:fs/promises'
import { resolve, sep, extname } from 'node:path'
import { existsSync } from 'node:fs'
const serverModulePath = existsSync(new URL('../dist/server/server.js', import.meta.url))
  ? '../dist/server/server.js'
  : '../node_modules/.nitro/vite/services/ssr/index.js'
const { default: app } = await import(serverModulePath)
const root = existsSync(resolve('dist/client')) ? resolve('dist/client') : resolve('.output/public')
const port = Number(process.env.PORT || 3000)
const origin = process.env.PUBLIC_ORIGIN || `http://localhost:${port}`
const types = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  try {
    if (req.url === '/healthz') { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end('{"status":"ok"}'); return }
    const url = new URL(req.url, origin)
    if (url.pathname.startsWith('/assets/')) {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return }
      try {
        const file = await realpath(resolve(root, `.${decodeURIComponent(url.pathname)}`))
        if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) throw new Error('Invalid asset')
        res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' })
        res.end(req.method === 'HEAD' ? undefined : await readFile(file)); return
      } catch { res.writeHead(404); res.end(); return }
    }
    let size = 0
    const chunks = []
    for await (const chunk of req) { size += chunk.length; if (size > 1048576) { res.writeHead(413); res.end(); return }; chunks.push(chunk) }
    const request = new Request(url, { method: req.method, headers: req.headers, ...(!['GET', 'HEAD'].includes(req.method) ? { body: Buffer.concat(chunks) } : {}) })
    const response = await app.fetch(request)
    res.writeHead(response.status, Object.fromEntries(response.headers))
    if (req.method === 'HEAD' || !response.body) res.end()
    else await pipeline(Readable.fromWeb(response.body), res)
  } catch (error) { console.error('Request failed:', error.message); if (!res.headersSent) res.writeHead(500, { 'Cache-Control': 'no-store' }); res.end('Request failed') }
})
server.requestTimeout = 30000
server.headersTimeout = 15000
server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`SSR listening on ${port}`))
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000).unref() })
