import { useState } from 'react'
import { z } from 'zod'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'

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
  const { tx } = useI18n()
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const title =
    heading ||
    (placeId
      ? tx(
          'Koreksi informasi atau klaim usaha',
          'Submit a correction or claim this business',
        )
      : tx(
          'Kontribusi warga & agenda daerah',
          'Community contribution & local event submission',
        ))

  const options = placeId
    ? [
        {
          value: 'correction',
          label: tx(
            'Koreksi informasi (jam buka, alamat, harga)',
            'Information correction (hours, address, ticket price)',
          ),
        },
        {
          value: 'business_claim',
          label: tx(
            'Klaim usaha & pengajuan mitra UMKM',
            'Business claim & local SME partner application',
          ),
        },
      ]
    : [
        {
          value: 'new_place',
          label: tx(
            'Usulkan tempat wisata / faskes / UMKM baru',
            'Suggest a new attraction / hospital / local SME',
          ),
        },
        {
          value: 'new_event',
          label: tx(
            'Usulkan agenda / event kota baru',
            'Suggest a new cultural festival / city event',
          ),
        },
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
      setStatus(
        tx(
          'Terima kasih. Kontribusi masuk antrean verifikasi admin.',
          'Thank you. Your submission has entered the operator moderation queue.',
        ),
      )
    } catch {
      setStatus(
        tx(
          'Kontribusi belum terkirim. Silakan coba lagi.',
          'Submission could not be sent. Please try again.',
        ),
      )
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
              {tx(
                'Bantu lengkapi data lokal atau klaim halaman bisnis Anda. Ditinjau oleh operator sebelum tampil.',
                'Help enrich local data or claim your business listing. Reviewed by operators before publishing.',
              )}
            </p>
          </div>
          <span className="pill">
            {tx('Buka Formulir ▾', 'Open Form ▾')}
          </span>
        </summary>
        <div className="community-body">
          <p className="muted">
            {tx(
              'Perubahan ditinjau admin sebelum dipublikasikan. Jangan kirim kata sandi atau dokumen identitas melalui formulir ini.',
              'Submissions are verified by moderators before publication. Do not send passwords or sensitive ID documents.',
            )}
          </p>
          <form onSubmit={submit} className="form-grid">
            <label>
              {tx('Jenis kontribusi', 'Submission type')}
              <select name="type">
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {tx('Nama Pengirim / Pemilik Usaha', 'Your Name / Business Owner')}
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder={tx('Nama lengkap Anda', 'Your full name')}
              />
            </label>
            <label className="full-width">
              {tx(
                'Kontak (Email atau Nomor WhatsApp Aktif)',
                'Contact (Active Email or WhatsApp Number)',
              )}
              <input
                name="contact"
                required
                minLength={3}
                maxLength={100}
                placeholder={tx(
                  'Contoh: 0812-xxxx-xxxx atau nama@email.com',
                  'e.g., +62 812-xxxx-xxxx or name@email.com',
                )}
              />
            </label>
            <label className="full-width">
              {tx('Informasi yang diajukan', 'Details of your submission')}
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={3000}
                placeholder={
                  placeId
                    ? tx(
                        'Tuliskan koreksi jam buka, harga tiket, nomor WhatsApp usaha, atau detail klaim mitra UMKM…',
                        'Provide updated opening hours, ticket prices, WhatsApp contact, or business claim details…',
                      )
                    : tx(
                        'Tuliskan nama tempat/agenda baru, alamat lengkap, jam buka, dan sumber informasi…',
                        'Provide the new place or event name, full address, opening hours, and reference source…',
                      )
                }
              />
            </label>
            <div className="full-width">
              <button disabled={busy}>
                {busy
                  ? tx('Mengirim…', 'Submitting…')
                  : tx('Kirim untuk ditinjau', 'Submit for review')}
              </button>
            </div>
          </form>
          <p role="status">{status}</p>
        </div>
      </details>
    </section>
  )
}
