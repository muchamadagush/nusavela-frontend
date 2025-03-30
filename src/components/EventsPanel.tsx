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
    <section className="panel">
      <h2>Agenda kota · 31 hari ke depan</h2>
      {events === null ? (
        <p role="status">Agenda belum dapat dimuat.</p>
      ) : !events.length ? (
        <p>Belum ada agenda terkurasi.</p>
      ) : (
        <ul>
          {events.slice(0, 6).map(event => (
            <li key={event.id}>
              {event.is_sponsored && <span className="badge">Sponsor</span>}
              <h3>{event.title}</h3>
              <p>{event.venue_name || 'Lokasi belum dikonfirmasi'}</p>
              <time dateTime={event.start_datetime}>
                {formatDateTimeId(event.start_datetime, timezone)}
              </time>
              <p className="mono">
                {event.ticket_price === 0 ? 'Gratis' : formatRupiah(event.ticket_price)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
