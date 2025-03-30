import { z } from 'zod'
import { formatDateTimeId, formatRupiah } from '../lib/format'

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  venue_name: z.string().nullable(),
  start_datetime: z.string().datetime({ offset: true }),
  end_datetime: z.string().datetime({ offset: true }),
  ticket_price: z.number().int().nonnegative(),
  is_sponsored: z.boolean(),
})

export function EventsPanel({
  events,
  timezone,
}: {
  events: z.infer<typeof eventSchema>[] | null
  timezone?: string
}) {
  return (
    <section className="panel events-panel">
      <p className="eyebrow">KALENDER BUDAYA & FESTIVAL</p>
      <h2>Agenda kota · 31 hari ke depan</h2>
      {events === null ? (
        <p role="status" className="muted">
          Agenda belum dapat dimuat.
        </p>
      ) : !events.length ? (
        <p className="muted">Belum ada agenda terkurasi.</p>
      ) : (
        <ul className="events-list">
          {events.slice(0, 6).map(event => (
            <li key={event.id} className="event-item">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="badge verified">📅 Festival & Event</span>
                {event.is_sponsored && <span className="badge">Sponsor</span>}
              </div>
              <h3>{event.title}</h3>
              <p className="muted">📍 {event.venue_name || 'Lokasi belum dikonfirmasi'}</p>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
                <time dateTime={event.start_datetime} className="mono muted">
                  🕒 {formatDateTimeId(event.start_datetime, timezone)}
                </time>
                <span className="mono badge">
                  {event.ticket_price === 0 ? 'Gratis' : formatRupiah(event.ticket_price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
