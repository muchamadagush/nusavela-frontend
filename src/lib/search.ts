import { z } from 'zod'
const number = (min: number, max: number) => z.preprocess(v => v === '' ? undefined : v, z.coerce.number().finite().min(min).max(max))
const boolean = z.preprocess(v => v === 'false' ? false : v === 'true' ? true : v, z.boolean())
export const directorySearch = z.object({
  lat: number(-90, 90).optional(), lng: number(-180, 180).optional(),
  radius: number(100, 100000).default(25000), open24h: boolean.default(false),
  sort: z.enum(['distance', 'rating']).default('distance'), page: z.coerce.number().int().min(1).max(10000).default(1),
}).refine(v => (v.lat === undefined) === (v.lng === undefined), { message: 'Latitude dan longitude harus berpasangan' })
export type DirectorySearch = z.infer<typeof directorySearch>
export function queryString(s: DirectorySearch) {
  const q = new URLSearchParams({ radius_meters: String(s.radius), is_24_hours: String(s.open24h), sort: s.sort, page: String(s.page) })
  if (s.lat !== undefined && s.lng !== undefined) { q.set('lat', String(s.lat)); q.set('lng', String(s.lng)) }
  return q.toString()
}
