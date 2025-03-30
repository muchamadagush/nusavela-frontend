import { Link } from '@tanstack/react-router'
import type { Category } from '../lib/api'
import { localizeCategoryName, useI18n } from '../lib/i18n'
import { CATEGORY_META } from '../lib/regions'

export function CategoryPills({
  citySlug,
  categories,
  activeSlug,
  activeCategorySlug,
}: {
  citySlug: string
  categories: Category[]
  activeSlug?: string
  activeCategorySlug?: string
}) {
  const { locale, tx } = useI18n()
  const current = activeCategorySlug ?? activeSlug
  return (
    <nav
      aria-label={tx('Kategori direktori kota', 'City directory categories')}
      className="category-pills"
    >
      <Link
        to="/kota/$citySlug"
        params={{ citySlug }}
        className={`pill ${!current ? 'active' : ''}`}
      >
        ✨ {tx('Ringkasan Kota', 'City Overview')}
      </Link>
      {categories.map(c => {
        const meta = CATEGORY_META[c.slug]
        return (
          <Link
            key={c.slug}
            to="/kota/$citySlug/$categorySlug"
            params={{ citySlug, categorySlug: c.slug }}
            search={{ radius: 25000, open24h: false, sort: 'distance', page: 1 }}
            className={`pill ${current === c.slug ? 'active' : ''}`}
          >
            <span>{meta?.icon ?? '📍'}</span>
            <span>{localizeCategoryName(c.slug, c.name, locale)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
