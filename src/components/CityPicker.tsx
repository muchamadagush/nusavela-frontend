import { useId, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api, citySchema, type City } from '../lib/api'
import { formatTimezoneLabel } from '../lib/format'

export function CityPicker({ cities }: { cities: City[] }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const id = useId()
  const navigate = useNavigate()

  const matches = cities
    .filter(c =>
      c.name.toLocaleLowerCase('id').includes(q.toLocaleLowerCase('id')) ||
      (c.short_name && c.short_name.toLocaleLowerCase('id').includes(q.toLocaleLowerCase('id'))),
    )
    .slice(0, 25)

  const featured = cities.filter(c => c.tier === 1).slice(0, 8)
  const quickCities = featured.length ? featured : cities.slice(0, 8)

  const choose = (c: City) => {
    setOpen(false)
    void navigate({ to: '/kota/$citySlug', params: { citySlug: c.slug } })
  }

  function gps() {
    if (!navigator.geolocation) {
      setError('Browser ini tidak mendukung deteksi lokasi. Silakan pilih kota.')
      return
    }
    setBusy(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          choose(
            await api(
              `/cities/nearest?lat=${coords.latitude}&lng=${coords.longitude}`,
              citySchema,
            ),
          )
        } catch {
          setError('Kota terdekat belum dapat dimuat. Silakan pilih kota.')
        } finally {
          setBusy(false)
        }
      },
      () => {
        setBusy(false)
        setError('Lokasi tidak tersedia atau izin ditolak. Silakan pilih kota.')
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <section className="panel city-picker-panel">
      <label htmlFor={id} className="picker-label">
        Kota mana yang ingin Anda jelajahi?
      </label>
      <div className="picker-bar">
        <div className="picker-input-wrap">
          <input
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-activedescendant={
              open && matches[active] ? `${id}-${active}` : undefined
            }
            value={q}
            placeholder="Ketik nama kabupaten atau kota (misal: Bandung, Surabaya, Sragen)…"
            onFocus={() => setOpen(true)}
            onChange={e => {
              setQ(e.target.value)
              setActive(0)
              setOpen(true)
            }}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setOpen(true)
                setActive(i => Math.min(i + 1, matches.length - 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive(i => Math.max(i - 1, 0))
              }
              if (e.key === 'Enter' && open && matches[active]) {
                e.preventDefault()
                choose(matches[active])
              }
            }}
          />
          {q && (
            <button
              type="button"
              className="clear-btn"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQ('')
                setActive(0)
              }}
            >
              ✕
            </button>
          )}
        </div>
        <button type="button" onClick={gps} disabled={busy} className="gps-btn">
          {busy ? 'Mencari lokasi…' : '📍 Gunakan lokasi saya'}
        </button>
      </div>

      {open && matches.length > 0 && (
        <ul role="listbox" id={`${id}-list`} className="listbox">
          {matches.map((c, i) => (
            <li
              key={c.id}
              role="option"
              id={`${id}-${i}`}
              aria-selected={active === i}
            >
              <button type="button" onClick={() => choose(c)}>
                <span>{c.name}</span>
                <span className="row">
                  {c.tier === 1 && <span className="badge">Unggulan</span>}
                  {c.timezone && (
                    <small className="mono">{formatTimezoneLabel(c.timezone)}</small>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !matches.length && <p role="status">Kota tidak ditemukan.</p>}
      {error && <p role="alert" className="error">{error}</p>}

      {quickCities.length > 0 && (
        <div className="quick-cities">
          <span className="muted">Populer:</span>
          {quickCities.map(c => (
            <button
              key={c.id}
              type="button"
              className="chip"
              onClick={() => choose(c)}
            >
              {c.short_name || c.name}
            </button>
          ))}
        </div>
      )}

      <p className="muted picker-hint">
        Lokasi digunakan setelah Anda menekan tombol. Anda juga dapat memilih kota secara manual.
      </p>
    </section>
  )
}
