import { z } from 'zod'
import { safeLink } from '../lib/api'
import { useI18n } from '../lib/i18n'

export const newsSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z
    .string()
    .nullable()
    .transform(value =>
      value === null ? null : Array.from(value).slice(0, 160).join(''),
    ),
  source_name: z.string(),
  source_url: z.string(),
  published_at: z.string().datetime({ offset: true }),
})

export function NewsPanel({
  news,
}: {
  news: z.infer<typeof newsSchema>[] | null
}) {
  const { tx } = useI18n()
  const items = news?.filter(item => safeLink(item.source_url)).slice(0, 6) ?? []
  return (
    <section className="panel news-panel">
      <p className="eyebrow">
        {tx('JURNAL & KABAR TERKINI', 'REGIONAL JOURNAL & HEADLINES')}
      </p>
      <h2>{tx('Berita daerah', 'Regional news')}</h2>
      {news === null ? (
        <p role="status" className="muted">
          {tx('Berita belum dapat dimuat.', 'News could not be loaded.')}
        </p>
      ) : !items.length ? (
        <p className="muted">
          {tx('Belum ada berita daerah.', 'No regional news articles yet.')}
        </p>
      ) : (
        <ul className="news-grid">
          {items.map(item => (
            <li key={item.id} className="news-card">
              <div className="news-meta">
                <span className="badge">{item.source_name}</span>
                <time dateTime={item.published_at} className="mono muted">
                  {item.published_at.slice(0, 10)}
                </time>
              </div>
              <h3>
                <a
                  href={safeLink(item.source_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title} ↗
                </a>
              </h3>
              {item.summary && (
                <p className="muted">
                  {Array.from(item.summary).slice(0, 160).join('')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
