import { useId, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api, citySchema, type City } from '../lib/api'
export function CityPicker({ cities }: { cities: City[] }) {
  const [q, setQ] = useState(''), [active, setActive] = useState(0), [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const id = useId(), navigate = useNavigate()
  const matches = cities.filter(c => c.name.toLocaleLowerCase('id').includes(q.toLocaleLowerCase('id'))).slice(0, 25)
  const choose = (c: City) => { setOpen(false); void navigate({ to: '/kota/$citySlug', params: { citySlug: c.slug } }) }
  function gps() {
    if (!navigator.geolocation) { setError('Browser ini tidak mendukung deteksi lokasi. Silakan pilih kota.'); return }
    setBusy(true); setError('')
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try { choose(await api(`/cities/nearest?lat=${coords.latitude}&lng=${coords.longitude}`, citySchema)) } catch { setError('Kota terdekat belum dapat dimuat. Silakan pilih kota.') } finally { setBusy(false) }
    }, () => { setBusy(false); setError('Lokasi tidak tersedia atau izin ditolak. Silakan pilih kota.') }, { timeout: 10000, maximumAge: 300000 })
  }
  return <section className="panel"><label htmlFor={id}>Kota mana yang ingin Anda jelajahi?</label><div className="row"><input id={id} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open && matches[active] ? `${id}-${active}` : undefined} value={q} placeholder="Cari kabupaten atau kota…" onFocus={() => setOpen(true)} onChange={e => { setQ(e.target.value); setActive(0); setOpen(true) }} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Tab') setOpen(false); if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, matches.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) } if (e.key === 'Enter' && open && matches[active]) { e.preventDefault(); choose(matches[active]) } }} /><button onClick={gps} disabled={busy}>{busy ? 'Mencari lokasi…' : 'Gunakan lokasi saya'}</button></div>{open && <ul role="listbox" id={`${id}-list`} className="listbox">{matches.map((c, i) => <li key={c.id} role="option" id={`${id}-${i}`} aria-selected={active === i}><button onClick={() => choose(c)}>{c.name}</button></li>)}</ul>}{open && !matches.length && <p role="status">Kota tidak ditemukan.</p>}{error && <p role="alert">{error}</p>}<p className="muted">Lokasi digunakan setelah Anda menekan tombol. Anda juga dapat memilih kota secara manual.</p></section>
}
