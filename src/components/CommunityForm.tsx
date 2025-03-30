import { useState } from 'react'
import { z } from 'zod'
import { api } from '../lib/api'

interface CommunityFormProps {
  cityId: string
  placeId?: string
  heading?: string
  defaultOpen?: boolean
}

export function CommunityForm({
  cityId,
  placeId,
  heading,
  defaultOpen = false,
}: CommunityFormProps) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const title =
    heading ||
    (placeId
      ? 'Koreksi informasi atau klaim usaha'
      : 'Kontribusi warga & agenda daerah')

  const options = placeId
    ? [
        { value: 'correction', label: 'Koreksi informasi (jam buka, alamat, harga)' },
        { value: 'business_claim', label: 'Klaim usaha & pengajuan mitra UMKM' },
      ]
    : [
        { value: 'new_place', label: 'Usulkan tempat wisata / faskes / UMKM baru' },
        { value: 'new_event', label: 'Usulkan agenda / event kota baru' },
      ]

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setBusy(true)
    setStatus('')
    try {
      await api('/submissions', z.object({ id: z.string() }), {
        method: 'POST',
        body: JSON.stringify({
          city_id: cityId,
          place_id: placeId ?? null,
          submission_type: f.get('type'),
          submitter_name: f.get('name'),
          submitter_contact: f.get('contact'),
          payload: { message: f.get('message') },
        }),
      })
      form.reset()
      setStatus('Terima kasih. Kontribusi masuk antrean verifikasi admin.')
    } catch {
      setStatus('Kontribusi belum terkirim. Silakan coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel section community-panel">
      <details open={defaultOpen || Boolean(placeId)}>
        <summary className="community-summary">
          <div>
            <h2>{title}</h2>
            <p className="muted">
              Bantu lengkapi data lokal atau klaim halaman bisnis Anda. Ditinjau oleh operator sebelum tampil.
            </p>
          </div>
          <span className="pill">Buka Formulir ▾</span>
        </summary>
        <div className="community-body">
          <p className="muted">
            Perubahan ditinjau admin sebelum dipublikasikan. Jangan kirim kata sandi atau dokumen identitas melalui formulir ini.
          </p>
          <form onSubmit={submit} className="form-grid">
            <label>
              Jenis kontribusi
              <select name="type">
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nama Pengirim / Pemilik Usaha
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Nama lengkap Anda"
              />
            </label>
            <label className="full-width">
              Kontak (Email atau Nomor WhatsApp Aktif)
              <input
                name="contact"
                required
                minLength={3}
                maxLength={100}
                placeholder="Contoh: 0812-xxxx-xxxx atau nama@email.com"
              />
            </label>
            <label className="full-width">
              Informasi yang diajukan
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={3000}
                placeholder={
                  placeId
                    ? 'Tuliskan koreksi jam buka, harga tiket, nomor WhatsApp usaha, atau detail klaim mitra UMKM…'
                    : 'Tuliskan nama tempat/agenda baru, alamat lengkap, jam buka, dan sumber informasi…'
                }
              />
            </label>
            <div className="full-width">
              <button disabled={busy}>
                {busy ? 'Mengirim…' : 'Kirim untuk ditinjau'}
              </button>
            </div>
          </form>
          <p role="status">{status}</p>
        </div>
      </details>
    </section>
  )
}
