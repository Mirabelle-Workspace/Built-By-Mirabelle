/**
 * ProductCard — link card on the home page that previews each extension.
 *
 * Wraps a <Link> around the whole card so the entire surface is the
 * hit target. Status badge styles map a 'shipped' | 'beta' |
 * 'coming-soon' literal union onto token-driven classes.
 *
 * The logo is decorative (the H3 names the product) so it uses
 * LowCarbonImage and disappears in low-carbon mode.
 *
 * — Mirabelle
 */
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { LowCarbonImage } from './LowCarbonImage'

interface ProductCardProps {
  to: string
  name: string
  tagline: string
  logo: { src: string; alt: string }
  features: string[]
  status: 'shipped' | 'beta' | 'coming-soon'
}

const statusStyles: Record<ProductCardProps['status'], string> = {
  shipped:
    'text-[color:var(--color-success)] border-[color:var(--color-success)]',
  beta: 'text-[color:var(--color-warning)] border-[color:var(--color-warning)]',
  'coming-soon':
    'text-[color:var(--color-fg-subtle)] border-[color:var(--color-border-strong)]',
}

const statusLabel: Record<ProductCardProps['status'], string> = {
  shipped: 'Shipped',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
}

export function ProductCard({
  to,
  name,
  tagline,
  logo,
  features,
  status,
}: ProductCardProps) {
  return (
    <Link
      to={to}
      className="block p-6 rounded-2xl border transition-all border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] hover:border-[color:var(--color-border-strong)] group lc-card"
    >
      <div className="flex gap-4 items-start mb-4">
        <LowCarbonImage
          src={logo.src}
          alt={logo.alt}
          className="flex-shrink-0 w-14 h-14 rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <h3 className="text-lg font-semibold text-[color:var(--color-fg)]">
              {name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded border ${statusStyles[status]}`}
            >
              {statusLabel[status]}
            </span>
          </div>
          <p className="text-sm text-[color:var(--color-fg-muted)]">{tagline}</p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-6 text-sm text-[color:var(--color-fg-muted)]">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="flex gap-1 items-center text-sm font-medium transition-transform text-[color:var(--color-accent)] group-hover:translate-x-1">
        Read more <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
