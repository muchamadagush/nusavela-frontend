import { z } from 'zod'
import { api, safeLink, type City, type Place } from './api'

const PROTECTED_CATEGORIES = new Set(['rumah-sakit', 'layanan-publik'])

export function isCommercialCategory(categorySlug?: string): boolean {
  if (!categorySlug) return true
  return !PROTECTED_CATEGORIES.has(categorySlug)
}

function getStay22Aid(): string {
  return (
    (import.meta.env.VITE_STAY22_AID as string | undefined)?.trim() ||
    'nusavela'
  )
}

function getTravelpayoutsMarker(): string {
  return (
    (import.meta.env.VITE_TRAVELPAYOUTS_MARKER as string | undefined)?.trim() ||
    '595834'
  )
}

export interface SmartMonetizationLinks {
  isCommercial: boolean
  isCustomHotel: boolean
  isCustomTicket: boolean
  hotelUrl: string
  ticketUrl: string
  transportUrl: string
  stay22MapEmbedUrl: string
}

export function resolvePlaceMonetization(
  place: Pick<
    Place,
    | 'name'
    | 'latitude'
    | 'longitude'
    | 'affiliate_hotel_url'
    | 'affiliate_ticket_url'
  >,
  city: Pick<City, 'name' | 'short_name'>,
  categorySlug: string,
): SmartMonetizationLinks | null {
  if (!isCommercialCategory(categorySlug)) return null

  const aid = encodeURIComponent(getStay22Aid())
  const marker = encodeURIComponent(getTravelpayoutsMarker())
  const cityLabel = city.short_name || city.name
  const query = encodeURIComponent(`${place.name} ${cityLabel}`)
  const cityQuery = encodeURIComponent(cityLabel)
  const lat = place.latitude.toFixed(6)
  const lng = place.longitude.toFixed(6)

  const customHotel = safeLink(place.affiliate_hotel_url)
  const customTicket = safeLink(place.affiliate_ticket_url)

  const defaultHotelUrl = `https://www.stay22.com/allez/roam?aid=${aid}&lat=${lat}&lng=${lng}&address=${query}`
  const defaultTicketUrl = `https://www.klook.com/id/search/result/?query=${query}&aid=${marker}`
  const transportUrl = `https://www.tiket.com/kereta-api?utm_source=${marker}&q=${cityQuery}`
  const stay22MapEmbedUrl = `https://www.stay22.com/embed/gm?aid=${aid}&lat=${lat}&lng=${lng}&maincolor=0D5C46&venue=${query}`

  return {
    isCommercial: true,
    isCustomHotel: Boolean(customHotel),
    isCustomTicket: Boolean(customTicket),
    hotelUrl: customHotel || defaultHotelUrl,
    ticketUrl: customTicket || defaultTicketUrl,
    transportUrl,
    stay22MapEmbedUrl,
  }
}

export function resolveCityMonetization(
  city: Pick<City, 'name' | 'short_name' | 'latitude' | 'longitude'>,
): SmartMonetizationLinks {
  const aid = encodeURIComponent(getStay22Aid())
  const marker = encodeURIComponent(getTravelpayoutsMarker())
  const cityLabel = city.short_name || city.name
  const query = encodeURIComponent(cityLabel)
  const lat = city.latitude.toFixed(6)
  const lng = city.longitude.toFixed(6)

  return {
    isCommercial: true,
    isCustomHotel: false,
    isCustomTicket: false,
    hotelUrl: `https://www.stay22.com/allez/roam?aid=${aid}&lat=${lat}&lng=${lng}&address=${query}`,
    ticketUrl: `https://www.klook.com/id/search/result/?query=${query}&aid=${marker}`,
    transportUrl: `https://www.tiket.com/kereta-api?utm_source=${marker}&q=${query}`,
    stay22MapEmbedUrl: `https://www.stay22.com/embed/gm?aid=${aid}&lat=${lat}&lng=${lng}&maincolor=0D5C46&venue=${query}`,
  }
}

export interface SponsorPlanOption {
  code: 'verified_monthly' | 'spotlight_monthly' | 'spotlight_quarterly'
  nameId: string
  nameEn: string
  tier: 1 | 2
  durationDays: number
  amountIdr: number
  badgeId: string
  badgeEn: string
  descId: string
  descEn: string
}

export const UMKM_SPONSOR_PLANS: SponsorPlanOption[] = [
  {
    code: 'verified_monthly',
    nameId: 'NusaVela Verified Partner (30 Hari)',
    nameEn: 'NusaVela Verified Partner (30 Days)',
    tier: 1,
    durationDays: 30,
    amountIdr: 99000,
    badgeId: 'Tier 1 · Rp99.000 / 30 Hari',
    badgeEn: 'Tier 1 · IDR 99,000 / 30 Days',
    descId:
      'Lencana Terverifikasi & Rekomendasi Mitra, tampil di atas tempat reguler beserta tombol WhatsApp langsung.',
    descEn:
      'Verified & Partner Badge, priority ranking above regular places with direct WhatsApp lead button.',
  },
  {
    code: 'spotlight_monthly',
    nameId: 'NusaVela City Spotlight Utama (30 Hari)',
    nameEn: 'NusaVela Top City Spotlight (30 Days)',
    tier: 2,
    durationDays: 30,
    amountIdr: 249000,
    badgeId: 'Tier 2 Spotlight · Rp249.000 / 30 Hari',
    badgeEn: 'Tier 2 Spotlight · IDR 249,000 / 30 Days',
    descId:
      'Posisi #1 Paling Atas di direktori kota, pin emas khusus (#C89B3C) di peta interaktif, dan bingkai kartu emas.',
    descEn:
      '#1 Top Spotlight placement in the city directory, enlarged gold map pin (#C89B3C), and highlighted gold card.',
  },
  {
    code: 'spotlight_quarterly',
    nameId: 'NusaVela Spotlight Kuartal (90 Hari · Hemat 20%)',
    nameEn: 'NusaVela Quarterly Spotlight (90 Days · Save 20%)',
    tier: 2,
    durationDays: 90,
    amountIdr: 599000,
    badgeId: 'Tier 2 · Rp599.000 / 90 Hari',
    badgeEn: 'Tier 2 · IDR 599,000 / 90 Days',
    descId:
      'Seluruh manfaat City Spotlight Tier 2 selama 90 hari penuh dengan penghematan Rp148.000.',
    descEn:
      'All Tier 2 City Spotlight benefits for 90 full days (save IDR 148,000 vs monthly).',
  },
]

export const sponsorshipOrderResponseSchema = z.object({
  order: z.object({
    id: z.string(),
    city_id: z.string(),
    place_id: z.string(),
    business_name: z.string(),
    plan_code: z.string(),
    tier: z.number(),
    duration_days: z.number(),
    amount_idr: z.number(),
    status: z.string(),
    payment_reference: z.string(),
    checkout_url: z.string(),
  }),
  activated: z.boolean(),
})

export async function submitSelfServeOrder(payload: {
  city_id: string
  place_id: string
  business_name: string
  contact_name: string
  contact_phone_or_email: string
  plan_code: string
  instant_activate: boolean
}) {
  return api('/monetization/orders', sponsorshipOrderResponseSchema, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const citySyncResultSchema = z.object({
  city_id: z.string(),
  city_slug: z.string(),
  city_name: z.string(),
  synced_from_overpass: z.number(),
  previous_places: z.number(),
  total_active_places: z.number(),
  sources: z.array(z.string()),
})

export async function syncCityFromPublicApi(citySlug: string) {
  return api(
    `/sync/city/${encodeURIComponent(citySlug)}`,
    citySyncResultSchema,
    { method: 'POST' },
  )
}
