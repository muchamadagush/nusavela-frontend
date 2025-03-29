import { z } from 'zod'
import { safeLink } from '../lib/api'
export const newsSchema = z.object({ id: z.string(), title: z.string(), summary: z.string().nullable().transform(value => value === null ? null : Array.from(value).slice(0, 160).join('')), source_name: z.string(), source_url: z.string(), published_at: z.string().datetime({ offset: true }) })
export function NewsPanel({ news }: { news: z.infer<typeof newsSchema>[] | null }) {
  const items = news?.filter(item => safeLink(item.source_url)).slice(0, 6) ?? []
  return <section className="panel"><h2>Berita daerah</h2>{news === null ? <p role="status">Berita belum dapat dimuat.</p> : !items.length ? <p>Belum ada berita daerah.</p> : <ul>{items.map(item => <li key={item.id}><h3><a href={safeLink(item.source_url)} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>{item.summary && <p>{Array.from(item.summary).slice(0, 160).join('')}</p>}<small>{item.source_name} · <time dateTime={item.published_at}>{item.published_at.slice(0, 10)}</time></small></li>)}</ul>}</section>
}
