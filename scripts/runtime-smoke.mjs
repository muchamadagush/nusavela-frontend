import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
const port = 3199
const child = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
try {
  await new Promise((resolve, reject) => { const timeout = setTimeout(() => reject(new Error('Startup timeout')), 15000); child.once('exit', code => reject(new Error(`Server exited: ${code}`))); child.stdout.on('data', data => { if (String(data).includes('SSR listening')) { clearTimeout(timeout); resolve() } }) })
  const base = `http://localhost:${port}`
  assert.equal((await fetch(`${base}/healthz`)).status, 200)
  const response = await fetch(base)
  assert.equal(response.status, 200)
  const html = await response.text()
  const asset = html.match(/(?:src|href)="([^\"]*\/assets\/[^\"]+\.css)"/)?.[1]
  assert.ok(asset, 'SSR must include its built styles')
  const css = await fetch(new URL(asset, base))
  assert.equal(css.status, 200)
  assert.ok(css.headers.get('content-type').includes('text/css'))
  assert.ok(css.headers.get('cache-control').includes('immutable'))
  assert.equal((await fetch(`${base}/assets/nonexistent.js`)).status, 404)
  assert.equal((await fetch(`${base}/assets/%2e%2e%2f%2e%2e%2fpackage.json`)).status, 404)
  console.log('Production runtime: health, SSR, assets and traversal protection passed')
} finally { child.kill('SIGTERM') }
