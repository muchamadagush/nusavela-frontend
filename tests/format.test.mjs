import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatRupiah,
  formatTicketRange,
  formatTimezoneLabel,
  formatDateTimeId,
  sanitizePhoneDigits,
} from '../src/lib/format.ts'

test('formatTicketRange handles null, zero, single price, and ranges', () => {
  assert.equal(formatTicketRange(null, null), null)
  assert.equal(formatTicketRange(0, 0), 'Gratis')
  assert.ok(formatTicketRange(25000, 25000)?.includes('25.000'))
  const range = formatTicketRange(15000, 50000)
  assert.ok(range?.includes('15.000') && range?.includes('50.000'))
  assert.ok(formatRupiah(100000).includes('100.000'))
})

test('formatTimezoneLabel and formatDateTimeId map Indonesian timezones accurately', () => {
  assert.equal(formatTimezoneLabel('Asia/Jakarta'), 'WIB')
  assert.equal(formatTimezoneLabel('Asia/Makassar'), 'WITA')
  assert.equal(formatTimezoneLabel('Asia/Jayapura'), 'WIT')
  assert.ok(formatDateTimeId(1793491200, 'Asia/Makassar').endsWith('WITA'))
  assert.ok(formatDateTimeId('2026-11-01T00:00:00Z', 'Asia/Jayapura').endsWith('WIT'))
})

test('sanitizePhoneDigits accepts valid numbers and rejects unsafe strings', () => {
  assert.equal(sanitizePhoneDigits('+62 812-3456-7890'), '6281234567890')
  assert.equal(sanitizePhoneDigits('119'), '119')
  assert.equal(sanitizePhoneDigits('javascript:alert(1)'), undefined)
  assert.equal(sanitizePhoneDigits('12'), undefined)
})
