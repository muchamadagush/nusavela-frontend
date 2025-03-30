import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'id' | 'en'

interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  toggleLocale: () => void
  tx: (idText: string, enText: string) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'id',
  setLocale: () => {},
  toggleLocale: () => {},
  tx: (idText: string) => idText,
})

const STORAGE_KEY = 'nusavela_lang'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlLang = params.get('lang')?.toLowerCase()
      if (urlLang === 'en' || urlLang === 'id') {
        setLocaleState(urlLang)
        window.localStorage.setItem(STORAGE_KEY, urlLang)
        document.documentElement.lang = urlLang
        return
      }
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'id') {
        setLocaleState(saved)
        document.documentElement.lang = saved
      } else {
        document.documentElement.lang = 'id'
      }
    } catch {
      /* Default to Indonesian ('id') when storage is unavailable */
    }
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Ignore storage restrictions */
    }
  }

  function toggleLocale() {
    setLocale(locale === 'id' ? 'en' : 'id')
  }

  function tx(idText: string, enText: string): string {
    return locale === 'en' ? enText : idText
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, tx }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

const CATEGORY_TRANSLATIONS: Record<string, { id: string; en: string }> = {
  wisata: { id: 'Wisata', en: 'Tourism & Attractions' },
  'rumah-sakit': { id: 'Rumah Sakit & Faskes', en: 'Hospitals & 24H ER' },
  kuliner: { id: 'Kuliner & UMKM', en: 'Culinary & Local SMEs' },
  transportasi: { id: 'Transportasi', en: 'Transport Hubs' },
  'layanan-publik': { id: 'Layanan Publik', en: 'Public Services' },
}

export function localizeCategoryName(
  slug: string,
  fallbackName: string,
  locale: Locale,
): string {
  const entry = CATEGORY_TRANSLATIONS[slug]
  if (!entry) return fallbackName
  return locale === 'en' ? entry.en : fallbackName || entry.id
}

export function localizeCityName(name: string, locale: Locale): string {
  if (locale === 'id') return name
  if (name.startsWith('Kota Administrasi ')) {
    const rest = name.replace('Kota Administrasi ', '')
    const jakartaMap: Record<string, string> = {
      'Jakarta Pusat': 'Central Jakarta City',
      'Jakarta Selatan': 'South Jakarta City',
      'Jakarta Barat': 'West Jakarta City',
      'Jakarta Timur': 'East Jakarta City',
      'Jakarta Utara': 'North Jakarta City',
    }
    return jakartaMap[rest] || `${rest} Administrative City`
  }
  if (name.startsWith('Kabupaten Administrasi ')) {
    return `${name.replace('Kabupaten Administrasi ', '')} Administrative Regency`
  }
  if (name.startsWith('Kota ')) {
    return `${name.replace(/^Kota\s+/, '')} City`
  }
  if (name.startsWith('Kabupaten ')) {
    return `${name.replace(/^Kabupaten\s+/, '')} Regency`
  }
  return name
}
