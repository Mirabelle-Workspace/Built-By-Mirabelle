/**
 * SiteFooter — standard footer rendered under every page via Layout.
 *
 * Three columns at desktop, stacked on mobile:
 *   - identity / tagline
 *   - product nav
 *   - off-site links (Portfolio, GitHub)
 *
 * All colours use tokens, so the footer re-themes with the rest of
 * the site under light/dark/a11y/low-carbon. Year is computed at
 * render so it never needs manual updating.
 *
 * — Mirabelle
 */
import { Link } from 'react-router-dom'
import { Github, ExternalLink } from 'lucide-react'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 py-12 mt-24 border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] lc-card">
      <div className="grid grid-cols-1 gap-10 mx-auto max-w-6xl text-sm md:grid-cols-3">
        <div>
          <p className="mb-2 text-base font-semibold text-[color:var(--color-fg)]">
            Built by Mirabelle
          </p>
          <p className="text-[color:var(--color-fg-muted)]">
            Small, sharp Chrome extensions for design-system-minded
            engineers. Token-driven, accessible, local-only, open source.
          </p>
        </div>

        <nav aria-label="Products">
          <p className="mb-3 text-xs tracking-widest uppercase text-[color:var(--color-fg-subtle)]">
            Products
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/products/homebase"
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              >
                HomeBase
              </Link>
            </li>
            <li>
              <Link
                to="/products/saved-links"
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              >
                Saved Links
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Find Mirabelle">
          <p className="mb-3 text-xs tracking-widest uppercase text-[color:var(--color-fg-subtle)]">
            Find me
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://mirabelledoiron.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex gap-1 items-center text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              >
                Portfolio <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/mirabelledoiron"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex gap-1 items-center text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-2 justify-between pt-8 mx-auto mt-10 max-w-6xl text-xs border-t border-[color:var(--color-border)] sm:flex-row text-[color:var(--color-fg-subtle)]">
        <p>&copy; {year} Mirabelle Doiron. Open source under MIT.</p>
        <p>
          <a
            href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-fg)]"
          >
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
