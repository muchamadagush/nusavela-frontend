import { z } from 'zod'
import { safeLink } from '../lib/api'
import { useI18n } from '../lib/i18n'

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
  const { tx } = useI18n()
  const verified =
    contacts?.filter(contact => contact.is_active && safeLink(contact.source_url)) ??
    []
  return (
    <section className="sos section" aria-labelledby="emergency-heading">
      <div className="sos-header">
        <div>
          <span className="sos-pill">
            🚨 {tx('SIAGA DARURAT NASIONAL & DAERAH', 'NATIONAL & REGIONAL EMERGENCY HOTLINES')}
          </span>
          <h2 id="emergency-heading">
            {tx('Kontak darurat terverifikasi', 'Verified emergency contacts')}
          </h2>
        </div>
        <span className="mono sos-note">
          {tx('Ketuk nomor untuk panggilan langsung', 'Tap any number to call immediately')}
        </span>
      </div>
      {contacts === null ? (
        <p role="status">
          {tx(
            'Kontak darurat belum dapat dimuat. Coba muat ulang halaman.',
            'Emergency contacts could not be loaded. Please reload the page.',
          )}
        </p>
      ) : !verified.length ? (
        <p>
          {tx(
            'Belum ada kontak darurat terverifikasi untuk daerah ini.',
            'No verified emergency contacts available for this area yet.',
          )}
        </p>
      ) : (
        <ul className="sos-grid">
          {verified.map(contact => (
            <li key={contact.id} className="sos-card">
              <div className="sos-card-info">
                <strong>{contact.service_name}</strong>
                {contact.is_24_hours && (
                  <span className="sos-24h">
                    {' '}
                    · {tx('24 jam', '24 hours')}
                  </span>
                )}
              </div>
              <div className="sos-card-actions">
                <a
                  className="sos-call-btn"
                  href={`tel:${contact.phone_number.replace(/[ ()-]/g, '')}`}
                  aria-label={`${tx('Hubungi', 'Call')} ${contact.service_name}: ${contact.phone_number}`}
                >
                  📞 {contact.phone_number}
                </a>
                <a
                  className="sos-verify-link"
                  href={safeLink(contact.source_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx('Sumber verifikasi', 'Verification source')}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
