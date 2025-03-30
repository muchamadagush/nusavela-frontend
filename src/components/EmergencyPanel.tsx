import { z } from 'zod'
import { safeLink } from '../lib/api'

export const emergencySchema = z.object({
  id: z.number(),
  service_name: z.string(),
  phone_number: z.string().regex(/^\+?[\d ()-]{3,50}$/),
  is_active: z.boolean(),
  is_24_hours: z.boolean(),
  source_url: z.string(),
  verified_at: z.string().datetime({ offset: true }),
})
export type EmergencyContact = z.infer<typeof emergencySchema>

export function EmergencyPanel({
  contacts,
}: {
  contacts: EmergencyContact[] | null
}) {
  const verified =
    contacts?.filter(contact => contact.is_active && safeLink(contact.source_url)) ??
    []
  return (
    <section className="sos section" aria-labelledby="emergency-heading">
      <div className="sos-header">
        <div>
          <span className="sos-pill">🚨 SIAGA DARURAT NASIONAL & DAERAH</span>
          <h2 id="emergency-heading">Kontak darurat terverifikasi</h2>
        </div>
        <span className="mono sos-note">Ketuk nomor untuk panggilan langsung</span>
      </div>
      {contacts === null ? (
        <p role="status">Kontak darurat belum dapat dimuat. Coba muat ulang halaman.</p>
      ) : !verified.length ? (
        <p>Belum ada kontak darurat terverifikasi untuk daerah ini.</p>
      ) : (
        <ul className="sos-grid">
          {verified.map(contact => (
            <li key={contact.id} className="sos-card">
              <div className="sos-card-info">
                <strong>{contact.service_name}</strong>
                {contact.is_24_hours && <span className="sos-24h"> · 24 jam</span>}
              </div>
              <div className="sos-card-actions">
                <a
                  className="sos-call-btn"
                  href={`tel:${contact.phone_number.replace(/[ ()-]/g, '')}`}
                  aria-label={`Hubungi ${contact.service_name}: ${contact.phone_number}`}
                >
                  📞 {contact.phone_number}
                </a>
                <a
                  className="sos-verify-link"
                  href={safeLink(contact.source_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sumber verifikasi
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
