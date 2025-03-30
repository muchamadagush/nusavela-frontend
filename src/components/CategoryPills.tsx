import { Link } from '@tanstack/react-router'
import type { Category } from '../lib/api'
import { CATEGORY_META } from '../lib/regions'

export function CategoryPills({
  citySlug,
  categories,
  activeSlug,
}: {
  citySlug: string
  categories: Category[]
  activeSlug?: string
}) {
  return (
    <nav aria-label="Kategori direktori kota" className="category-pills">
      <Link
        to="/kota/$citySlug"
        params={{ citySlug }}
        className={`pill ${!activeSlug ? 'active' : ''}`}
      >
        ✨ Ringkasan Kota
      </Link>
      {categories.map(c => {
        const meta = CATEGORY_META[c.slug]
        return (
          <Link
            key={c.slug}
            to="/kota/$citySlug/$categorySlug"
            params={{ citySlug, categorySlug: c.slug }}
            search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
            className={`pill ${activeSlug === c.slug ? 'active' : ''}`}
          >
            <span>{meta?.icon ?? '📍'}</span>
            <span>{c.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
