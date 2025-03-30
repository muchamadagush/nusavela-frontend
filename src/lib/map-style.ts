export const CATEGORY_MAP_COLORS: Record<string, { color: string; label: string }> = {
  wisata: { color: '#0D5C46', label: 'Wisata & Alam' },
  'rumah-sakit': { color: '#DC2626', label: 'RS & IGD Darurat' },
  kuliner: { color: '#C2410C', label: 'Kuliner & UMKM' },
  transportasi: { color: '#1D4ED8', label: 'Transportasi' },
  'layanan-publik': { color: '#0B1F3A', label: 'Layanan Publik' },
}

export function markerStyle(category: string, sponsored: boolean) {
  // Medical and public-service maps preserve emergency category colors.
  const spotlight = sponsored && !['rumah-sakit', 'layanan-publik'].includes(category)
  return {
    radius: spotlight ? 8.75 : 7,
    color: spotlight ? '#C89B3C' : CATEGORY_MAP_COLORS[category]?.color || '#0D5C46',
    weight: spotlight ? 3 : 2,
  }
}
