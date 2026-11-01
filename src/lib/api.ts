import { z } from 'zod'
export const citySchema = z.object({ id: z.string(), name: z.string(), slug: z.string(), latitude: z.number(), longitude: z.number(), short_name: z.string().optional() })
export type City = z.infer<typeof citySchema>
export const categorySchema = z.object({ slug: z.string(), name: z.string() })
export const placeSchema = z.object({ id: z.string(), name: z.string(), slug: z.string(), address: z.string().nullable(), latitude: z.number(), longitude: z.number(), is_24_hours: z.boolean(), is_sponsored: z.boolean(), sponsored_until: z.string().nullable().optional(), is_verified: z.boolean().optional(), distance_meters: z.number().nullable().optional(), opening_hours: z.string().nullable().optional(), description: z.string().nullable().optional(), affiliate_hotel_url: z.string().nullable().optional(), affiliate_ticket_url: z.string().nullable().optional() })
export type Place = z.infer<typeof placeSchema>
const base = ((import.meta.env.SSR && process.env.RUST_API_URL) || import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
export async function api<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}/api/v1${path}`, { ...init, signal: AbortSignal.timeout(12000), headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`API tidak tersedia (${response.status})`)
  return schema.parse(await response.json())
}
export const segment = encodeURIComponent
export const cities = () => api('/cities', citySchema.array())
export const city = (slug: string) => api(`/cities/${segment(slug)}`, citySchema)
export const categories = () => api('/categories', categorySchema.array())
export function activeSponsor(p: Place) { return p.is_sponsored && !!p.sponsored_until && Date.parse(p.sponsored_until) > Date.now() }
export function safeLink(value: string | undefined | null): string | undefined {
  if (!value) return
  try { const u = new URL(value); if (u.protocol === 'https:' && !u.username && !u.password) return u.href } catch { /* Invalid external links are hidden. */ }
}
export const cacheHeaders = () => ({ 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' })
export function seo(title: string, description: string, path: string, data: Record<string, unknown>) {
  const url = `https://nusavela.com${path}`
  return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:url', content: url }, { property: 'og:type', content: 'website' }], links: [{ rel: 'canonical', href: url }], scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') }] }
}
