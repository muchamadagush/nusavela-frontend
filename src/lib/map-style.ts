export function markerStyle(category: string, sponsored: boolean) {
  const colors: Record<string, string> = { wisata: '#0D5C46', 'rumah-sakit': '#DC2626', kuliner: '#C2410C', transportasi: '#1D4ED8', 'layanan-publik': '#0B1F3A' }
  // Medical and public-service maps preserve emergency category colors.
  const spotlight = sponsored && !['rumah-sakit', 'layanan-publik'].includes(category)
  return { radius: spotlight ? 8.75 : 7, color: spotlight ? '#C89B3C' : colors[category] || '#0D5C46', weight: spotlight ? 3 : 2 }
}
