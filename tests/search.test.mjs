import test from 'node:test'
import assert from 'node:assert/strict'
import { directorySearch, queryString } from '../src/lib/search.ts'

test('zero coordinates are preserved in the API request', () => {
  const s = directorySearch.parse({ lat: 0, lng: 0 })
  const q = new URLSearchParams(queryString(s))
  assert.equal(q.get('lat'), '0')
  assert.equal(q.get('lng'), '0')
})

test('false from a URL never becomes true', () => {
  assert.equal(directorySearch.parse({ open24h: 'false' }).open24h, false)
  assert.equal(directorySearch.parse({ open24h: 'true' }).open24h, true)
  assert.equal(directorySearch.safeParse({ open24h: 'yes' }).success, false)
})

test('emergencyOnly is optional and serialized when present', () => {
  const s = directorySearch.parse({ emergencyOnly: 'true' })
  assert.equal(s.emergencyOnly, true)
  const q = new URLSearchParams(queryString(s))
  assert.equal(q.get('emergency_only'), 'true')
})

test('reject incomplete or invalid coordinates', () => {
  for (const v of [
    { lat: 0 },
    { lng: 0 },
    { lat: 91, lng: 0 },
    { lat: 0, lng: 181 },
    { lat: NaN, lng: 0 },
    { lat: Infinity, lng: 0 },
  ]) {
    assert.equal(directorySearch.safeParse(v).success, false)
  }
})

test('radius and pagination are bounded', () => {
  for (const v of [
    { radius: -1 },
    { radius: 100001 },
    { page: 0 },
    { page: 1.5 },
    { page: 10001 },
  ]) {
    assert.equal(directorySearch.safeParse(v).success, false)
  }
})

test('defaults match the backend contract', () => {
  assert.deepEqual(directorySearch.parse({}), {
    radius: 25000,
    open24h: false,
    emergencyOnly: undefined,
    sort: 'distance',
    page: 1,
  })
})
