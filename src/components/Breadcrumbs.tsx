import { Link } from '@tanstack/react-router'

export interface Crumb {
  label: string
  to?: string
  params?: Record<string, string>
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Beranda</Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.label}-${idx}`} aria-current={isLast ? 'page' : undefined}>
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
              {item.to && !isLast ? (
                <Link to={item.to as any} params={item.params as any}>
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
