const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(amount: number): string {
  return idrFormatter.format(amount)
}

export function formatTicketRange(
  min?: number | null,
  max?: number | null,
): string | null {
  if (min == null && max == null) return null
  const low = min ?? max ?? 0
  const high = max ?? min ?? 0
  if (low === 0 && high === 0) return 'Gratis'
  if (low === high) return formatRupiah(low)
  return `${formatRupiah(low)} – ${formatRupiah(high)}`
}

export function formatTimezoneLabel(timezone?: string | null): 'WIB' | 'WITA' | 'WIT' {
  if (timezone === 'Asia/Makassar') return 'WITA'
  if (timezone === 'Asia/Jayapura') return 'WIT'
  return 'WIB'
}

export function formatDateTimeId(
  isoOrEpochSeconds: string | number,
  timezone?: string | null,
): string {
  const tz =
    timezone && ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'].includes(timezone)
      ? timezone
      : 'Asia/Jakarta'
  const date =
    typeof isoOrEpochSeconds === 'number'
      ? new Date(isoOrEpochSeconds * 1000)
      : new Date(isoOrEpochSeconds)
  const formatted = date.toLocaleString('id-ID', { timeZone: tz })
  return `${formatted} ${formatTimezoneLabel(tz)}`
}

export function sanitizePhoneDigits(value?: string | null): string | undefined {
  if (!value || !/^[\d+ ()-]{3,50}$/.test(value)) return undefined
  const digits = value.replace(/\D/g, '')
  return digits.length >= 3 && digits.length <= 15 ? digits : undefined
}
