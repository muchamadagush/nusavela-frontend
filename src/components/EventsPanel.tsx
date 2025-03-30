import { z } from 'zod'
import { formatDateTimeId, formatRupiah } from '../lib/format'
import { useI18n } from '../lib/i18n'

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
  const { tx } = useI18n()
  return (
    <section className="panel events-panel">
      <p className="eyebrow">
        {tx('KALENDER BUDAYA & FESTIVAL', 'CULTURAL & FESTIVAL CALENDAR')}
      </p>
      <h2>{tx('Agenda kota · 31 hari ke depan', 'City events · Next 31 days')}</h2>
      {events === null ? (
        <p role="status" className="muted">
          {tx('Agenda belum dapat dimuat.', 'Events could not be loaded.')}
        </p>
      ) : !events.length ? (
        <p className="muted">
          {tx('Belum ada agenda terkurasi.', 'No curated events scheduled yet.')}
        </p>
      ) : (
        <ul className="events-list">
          {events.slice(0, 6).map(event => (
            <li key={event.id} className="event-item">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="badge verified">
                  📅 {tx('Festival & Event', 'Festival & Event')}
                </span>
                {event.is_sponsored && (
                  <span className="badge">{tx('Sponsor', 'Sponsored')}</span>
                )}
              </div>
              <h3>{event.title}</h3>
              <p className="muted">
                📍 {event.venue_name || tx('Lokasi belum dikonfirmasi', 'Venue TBA')}
              </p>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
                <time dateTime={event.start_datetime} className="mono muted">
                  🕒 {formatDateTimeId(event.start_datetime, timezone)}
                </time>
                <span className="mono badge">
                  {event.ticket_price === 0
                    ? tx('Gratis', 'Free')
                    : formatRupiah(event.ticket_price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
