/**
 * Layout — the chrome around every page.
 *
 *   - Skip-link: first focusable element on the page; sends keyboard
 *     users straight to <main> (which is tabindex="-1" so it can
 *     accept programmatic focus).
 *   - Sticky header: brand link, primary nav, theme + a11y + low-carbon
 *     toggles, GitHub link.
 *   - Mobile menu: collapses nav + toggles into a disclosure pattern.
 *   - <main id="main"> hosts the routed page via <Outlet />.
 *   - <SiteFooter /> renders the standard footer.
 *
 * All colours come from CSS tokens defined in src/index.css, so the
 * whole layout re-themes when the user flips light/dark/a11y/low-carbon.
 *
 * — Mirabelle
 */
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X, Github } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { PreferenceToggles } from './PreferenceToggles'
import { SiteFooter } from './SiteFooter'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products/homebase', label: 'HomeBase' },
  { to: '/products/saved-links', label: 'Saved Links' },
  { to: '/about', label: 'About' },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${
      isActive
        ? 'text-[color:var(--color-fg)] font-medium'
        : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'
    }`

  return (
    <div className="flex flex-col min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-[color:var(--color-accent)] focus:text-[color:var(--color-accent-fg)]"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b backdrop-blur border-[color:var(--color-border)] bg-[color:var(--color-bg)]/85 lc-card">
        <div className="px-6 mx-auto max-w-6xl">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-lg font-semibold text-[color:var(--color-fg)]"
            >
              Built by Mirabelle
            </Link>

            <nav
              aria-label="Primary"
              className="hidden gap-6 items-center md:flex"
            >
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden gap-2 items-center md:flex">
              <PreferenceToggles />
              <ThemeToggle />
              <a
                href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                className="inline-flex justify-center items-center w-9 h-9 rounded-md border transition-colors border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>

            <button
              type="button"
              className="p-2 rounded-md md:hidden text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {mobileOpen && (
            <div id="mobile-nav" className="pb-4 md:hidden">
              <nav
                aria-label="Primary mobile"
                className="flex flex-col gap-4 mb-4"
              >
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={navClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex gap-2 items-center">
                <PreferenceToggles />
                <ThemeToggle />
                <a
                  href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                  className="inline-flex justify-center items-center w-9 h-9 rounded-md border border-[color:var(--color-border-strong)] text-[color:var(--color-fg)]"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}
