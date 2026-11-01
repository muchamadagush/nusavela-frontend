import { test } from 'node:test'
import assert from 'node:assert/strict'
import { markerStyle } from '../src/lib/map-style.ts'
test('map distinguishes categories, active spotlight and protected emergency colors', () => {
  assert.equal(markerStyle('wisata', false).color, '#0D5C46')
  assert.equal(markerStyle('kuliner', false).color, '#C2410C')
  assert.equal(markerStyle('transportasi', false).color, '#1D4ED8')
  assert.equal(markerStyle('wisata', true).radius, 7 * 1.25)
  assert.equal(markerStyle('wisata', true).color, '#C89B3C')
  assert.equal(markerStyle('rumah-sakit', true).color, '#DC2626')
  assert.equal(markerStyle('rumah-sakit', true).radius, 7)
})
