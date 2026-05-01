/**
 * Home — landing page.
 *
 * Hero copy frames the site as a workspace of small, sharp Chrome
 * extensions. Two ProductCards (HomeBase, Saved Links) and a "How I
 * build" section that connects the extensions to the design-systems
 * engineering practice on the About page.
 *
 * Page metadata (title, description, OG, canonical) is set at runtime
 * via usePageMeta — the static <head> in index.html is just a fallback.
 *
 * — Mirabelle
 */
import { ProductCard } from '../components/ProductCard'
import { usePageMeta } from '../hooks/usePageMeta'

export function Home() {
  usePageMeta({
    title: 'Small, sharp Chrome extensions',
    description:
      'Built by Mirabelle Doiron — a workspace of small, sharp Chrome extensions for design-system-minded engineers. Token-driven, accessible (WCAG 2.1 AA), local-only, open source.',
    canonical: '/',
  })

  return (
    <div className="px-6 py-16 mx-auto max-w-6xl">
      <section className="mb-20 text-center">
        <p className="mb-4 text-sm tracking-widest uppercase text-[color:var(--color-fg-subtle)]">
          Built by Mirabelle Doiron
        </p>
        <h1 className="mb-6 text-4xl font-bold text-[color:var(--color-fg)] md:text-6xl">
          Small, sharp Chrome extensions
          <br />
          for the way you actually work.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[color:var(--color-fg-muted)]">
          A growing collection of focused tools, each one solving a single
          everyday browser annoyance. Local-only, accessible, open source.
        </p>
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-2xl font-semibold text-[color:var(--color-fg)]">
          Products
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProductCard
            to="/products/homebase"
            name="HomeBase"
            tagline="A new tab page you actually open on purpose."
            logo={{ src: '/homebase-logo.svg', alt: 'HomeBase logo' }}
            status="shipped"
            features={[
              'Themed bookmarks',
              'Categories & search',
              'Offline',
              'No account',
            ]}
          />
          <ProductCard
            to="/products/saved-links"
            name="Saved Links"
            tagline="Bulk-import open tabs into a categorized, searchable library."
            logo={{ src: '/saved-links-logo.svg', alt: 'Saved Links logo' }}
            status="shipped"
            features={[
              'One-click tab import',
              'Tag filters',
              'JSON export/import',
              'WCAG 2.1 AA',
            ]}
          />
        </div>
      </section>

      <section className="p-8 rounded-2xl border md:p-12 border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] lc-card">
        <h2 className="mb-4 text-2xl font-semibold text-[color:var(--color-fg)]">
          How I build
        </h2>
        <p className="mb-4 text-[color:var(--color-fg-muted)]">
          These extensions are personal infrastructure, built the way I
          build production design-system work: semantic tokens, accessibility
          audited and tested to WCAG 2.1 AA, TypeScript types that prevent
          invalid states, and documentation that lets someone else pick it
          up without asking.
        </p>
        <p className="text-[color:var(--color-fg-muted)]">
          Each tool ships small and stays small. If something grows, it
          becomes its own extension rather than bloating an existing one
          &mdash; the same composition principle that keeps a design system
          from collapsing under its own weight.
        </p>
      </section>
    </div>
  )
}
