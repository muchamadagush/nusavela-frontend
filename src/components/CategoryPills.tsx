import { Link } from '@tanstack/react-router'
import type { Category } from '../lib/api'

const CATEGORY_ICONS: Record<string, string> = {
  wisata: '🧭',
  'rumah-sakit': '🏥',
  kuliner: '🍜',
  transportasi: '🚆',
  'layanan-publik': '🏛️',
}

export function CategoryPills({
  citySlug,
  categories,
  activeCategorySlug,
}: {
  citySlug: string
  categories: Category[]
  activeCategorySlug?: string
}) {
  return (
    <nav aria-label="Kategori direktori kota" className="category-pills">
      <Link
        to="/kota/$citySlug"
        params={{ citySlug }}
        className={`pill ${!activeCategorySlug ? 'active' : ''}`}
      >
        ✦ Ringkasan Kota
      </Link>
      {categories.map(c => (
        <Link
          key={c.slug}
          to="/kota/$citySlug/$categorySlug"
          params={{ citySlug, categorySlug: c.slug }}
          search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
          className={`pill ${activeCategorySlug === c.slug ? 'active' : ''}`}
        >
          <span aria-hidden="true">{CATEGORY_ICONS[c.slug] || '📍'}</span> {c.name}
        </Link>
      ))}
    </nav>
  )
}
