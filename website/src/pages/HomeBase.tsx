/**
 * HomeBase — product page for the HomeBase Chrome extension.
 *
 * Sections: header (logo + tagline), Why I built it, Install (4-step
 * download flow with ZIP + GitHub buttons), How to use, Features grid.
 *
 * The hero logo uses LowCarbonImage so it disappears in low-carbon
 * mode (decorative, the H1 already names the product).
 *
 * — Mirabelle
 */
import {
  Bookmark,
  Palette,
  Search,
  GripVertical,
  Download,
  Shield,
  Globe,
  Github,
} from 'lucide-react'
import { LowCarbonImage } from '../components/LowCarbonImage'
import { usePageMeta } from '../hooks/usePageMeta'

const features = [
  {
    icon: Bookmark,
    title: 'Curated bookmarks',
    desc: 'Group the links you actually use into named categories with custom titles and URLs.',
  },
  {
    icon: Palette,
    title: 'Themes',
    desc: 'Pick from built-in themes or set your own background, card, and text colors.',
  },
  {
    icon: Search,
    title: 'Quick search',
    desc: 'Filter your saved bookmarks instantly, or pass through to your default search engine.',
  },
  {
    icon: GripVertical,
    title: 'Drag to reorder',
    desc: 'Reorganize categories and links on the fly without diving into settings.',
  },
  {
    icon: Download,
    title: 'Backup & restore',
    desc: 'Export your data as JSON, restore it later, or move it between machines.',
  },
  {
    icon: Shield,
    title: 'Local-only',
    desc: 'Everything stays in your browser. No accounts, no servers, no telemetry.',
  },
  {
    icon: Globe,
    title: 'Works offline',
    desc: "Your dashboard loads even when the internet doesn't.",
  },
]

export function HomeBase() {
  usePageMeta({
    title: 'HomeBase',
    description:
      'A new tab page you actually open on purpose. Themed bookmarks, categories, search, and offline access. Local-only Chrome extension by Mirabelle Doiron.',
    canonical: '/products/homebase',
  })

  return (
    <div className="px-6 py-12 mx-auto max-w-4xl">
      <header className="mb-16">
        <div className="flex flex-col gap-6 items-start mb-8 sm:flex-row sm:items-center">
          <LowCarbonImage
            src="/homebase-logo.svg"
            alt="HomeBase logo"
            className="w-20 h-20 rounded-2xl"
          />
          <div>
            <p className="mb-1 text-sm tracking-widest uppercase text-[color:var(--color-fg-subtle)]">
              Chrome Extension
            </p>
            <h1 className="text-4xl font-bold text-[color:var(--color-fg)]">
              HomeBase
            </h1>
            <p className="mt-2 text-lg text-[color:var(--color-fg-muted)]">
              A new tab page you actually open on purpose.
            </p>
          </div>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-semibold text-[color:var(--color-fg)]">
          Why I built it
        </h2>
        <p className="mb-4 text-[color:var(--color-fg-muted)]">
          Chrome&rsquo;s default new-tab page is wasted real estate. Most days
          I open a new tab and immediately type into the address bar &mdash;
          the page itself disappears. HomeBase replaces it with something
          worth landing on: a calm, themed dashboard of the bookmarks I
          actually use, organized into the categories that match how I think.
        </p>
        <p className="text-[color:var(--color-fg-muted)]">
          No accounts. No syncing. No telemetry. Just a quiet home base for
          the start of every browsing session.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold text-[color:var(--color-fg)]">
          Install
        </h2>
        <ol className="space-y-4">
          {[
            { title: 'Download from GitHub', desc: 'Click the button below to grab the ZIP from the repo.' },
            { title: 'Enable Developer mode', desc: <>Open <code className="px-2 py-0.5 text-xs rounded bg-[color:var(--color-bg-muted)] text-[color:var(--color-fg)]">chrome://extensions/</code> and toggle Developer mode on (top-right).</> },
            { title: 'Load unpacked', desc: 'Click "Load unpacked" and pick the unzipped HomeBase folder.' },
            { title: 'Open a new tab', desc: 'Cmd+T or Ctrl+T. HomeBase greets you.' },
          ].map((step, i) => (
            <li key={step.title} className="flex gap-4 items-start">
              <span className="flex flex-shrink-0 justify-center items-center w-8 h-8 text-sm font-semibold rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[color:var(--color-fg)]">{step.title}</p>
                <p className="text-sm text-[color:var(--color-fg-muted)]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href="/homebase.zip"
            download
            className="inline-flex gap-2 items-center px-4 py-2 text-sm rounded-lg transition-colors bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)] hover:bg-[color:var(--color-accent-hover)]"
          >
            <Download className="w-4 h-4" />
            Download ZIP
          </a>
          <a
            href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center px-4 py-2 text-sm rounded-lg border transition-colors border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold text-[color:var(--color-fg)]">
          How to use
        </h2>
        <ul className="space-y-3 text-[color:var(--color-fg-muted)]">
          <li>
            <strong className="text-[color:var(--color-fg)]">Add a bookmark.</strong> Open the
            sidebar, give the link a title, paste the URL, and pick a category.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Make a category.</strong> Type a new
            category name in the sidebar to start grouping links your way.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Theme it.</strong> Pick a built-in
            theme or open Settings to set custom colors for background, cards,
            text, and headers.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Search.</strong> Use the search bar
            at the top to filter bookmarks. Press Enter on a query that
            doesn&rsquo;t match to send it to your search engine.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Backup.</strong> Settings &rarr;
            Export downloads a JSON of everything. Settings &rarr; Import
            restores it.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[color:var(--color-fg)]">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] lc-card"
            >
              <Icon className="mb-3 w-5 h-5 text-[color:var(--color-accent)]" />
              <p className="mb-1 font-medium text-[color:var(--color-fg)]">{title}</p>
              <p className="text-sm text-[color:var(--color-fg-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
