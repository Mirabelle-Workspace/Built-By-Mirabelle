/**
 * SavedLinks — product page for the Saved Links Chrome extension.
 *
 * Sections: header (logo + tagline), Why I built it, Install, How to
 * use, Features. The WCAG 2.1 AA feature card links straight to the
 * audit report in the repo so the claim is verifiable.
 *
 * — Mirabelle
 */
import {
  Bookmark,
  Tag,
  Search,
  Download,
  Upload,
  Shield,
  Keyboard,
  Github,
  Accessibility,
} from 'lucide-react'
import { LowCarbonImage } from '../components/LowCarbonImage'
import { usePageMeta } from '../hooks/usePageMeta'

const features = [
  {
    icon: Bookmark,
    title: 'One-click tab import',
    desc: "Import every tab in your current window into Saved Links. Duplicates are skipped, internal pages are ignored, and a toast tells you what landed.",
  },
  {
    icon: Tag,
    title: 'Tag filters',
    desc: "Click any tag pill to filter to just those links. Combine with search for fast, precise navigation.",
  },
  {
    icon: Search,
    title: 'Live search',
    desc: 'Search across titles, URLs, descriptions, tags, and category names. Esc clears, results announced for screen readers.',
  },
  {
    icon: Download,
    title: 'JSON export',
    desc: "Download a timestamped backup any time. Perfect for moving between machines or version-controlling in the Backups folder.",
  },
  {
    icon: Upload,
    title: 'JSON import',
    desc: "Restore a previous export, or use a JSON file as a starter set someone else exported.",
  },
  {
    icon: Shield,
    title: 'Local-only',
    desc: 'Stored in this extension origin&rsquo;s localStorage. No accounts, no sync, no telemetry, no cloud.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard ready',
    desc: 'Edit, delete, and form controls reachable via Tab. Esc closes the form. Skip-link for screen reader users.',
  },
  {
    icon: Accessibility,
    title: 'WCAG 2.1 AA',
    desc: (
      <>
        Every text/UI pair audited for contrast, full keyboard nav, semantic
        disclosure pattern, role=alert error handling, prefers-reduced-motion
        respected.{' '}
        <a
          href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle/blob/main/saved-links/AUDIT.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[color:var(--color-fg)]"
        >
          See audit
        </a>
        .
      </>
    ),
  },
]

export function SavedLinks() {
  usePageMeta({
    title: 'Saved Links',
    description:
      'Bulk-import open tabs into a categorized, searchable library. WCAG 2.1 AA audited. Local-only Chrome extension by Mirabelle Doiron.',
    canonical: '/products/saved-links',
  })

  return (
    <div className="px-6 py-12 mx-auto max-w-4xl">
      <header className="mb-16">
        <div className="flex flex-col gap-6 items-start mb-8 sm:flex-row sm:items-center">
          <LowCarbonImage
            src="/saved-links-logo.svg"
            alt="Saved Links logo"
            className="w-20 h-20 rounded-2xl"
          />
          <div>
            <p className="mb-1 text-sm tracking-widest uppercase text-[color:var(--color-fg-subtle)]">
              Chrome Extension
            </p>
            <h1 className="text-4xl font-bold text-[color:var(--color-fg)]">
              Saved Links
            </h1>
            <p className="mt-2 text-lg text-[color:var(--color-fg-muted)]">
              Bulk-import open tabs into a categorized, searchable library.
            </p>
          </div>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-semibold text-[color:var(--color-fg)]">
          Why I built it
        </h2>
        <p className="mb-4 text-[color:var(--color-fg-muted)]">
          Open-tab fatigue is real. I&rsquo;d end every research session with
          forty tabs across three windows and no good way to triage them.
          Bookmarking each one is friction. Closing them feels like loss.
          Reading-list apps want accounts.
        </p>
        <p className="mb-4 text-[color:var(--color-fg-muted)]">
          Saved Links is the in-between: one click takes every tab in your
          current window and drops it into a categorized, tagged, searchable
          local library. Then you can actually close the tabs.
        </p>
        <p className="text-[color:var(--color-fg-muted)]">
          It lives separately from HomeBase on purpose. HomeBase is your
          permanent dashboard. Saved Links is your temporary holding zone for
          the firehose.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold text-[color:var(--color-fg)]">
          Install
        </h2>
        <ol className="space-y-4">
          {[
            { title: 'Download the ZIP', desc: 'Click the button below to grab the Saved Links extension as a ZIP, then unzip it anywhere on your machine.' },
            { title: 'Enable Developer mode', desc: <>Open <code className="px-2 py-0.5 text-xs rounded bg-[color:var(--color-bg-muted)] text-[color:var(--color-fg)]">chrome://extensions/</code> and toggle Developer mode on (top-right).</> },
            { title: 'Load unpacked', desc: <>Click <em>Load unpacked</em> and pick the unzipped <code className="px-2 py-0.5 text-xs rounded bg-[color:var(--color-bg-muted)] text-[color:var(--color-fg)]">saved-links</code> folder.</> },
            { title: 'Pin the icon', desc: 'Click the puzzle-piece icon in the Chrome toolbar and pin Saved Links for quick access.' },
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
            href="/saved-links.zip"
            download
            className="inline-flex gap-2 items-center px-4 py-2 text-sm rounded-lg transition-colors bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)] hover:bg-[color:var(--color-accent-hover)]"
          >
            <Download className="w-4 h-4" />
            Download ZIP
          </a>
          <a
            href="https://github.com/Mirabelle-Workspace/Built-By-Mirabelle/tree/main/saved-links"
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
            <strong className="text-[color:var(--color-fg)]">Import open tabs.</strong> Open
            Saved Links from the toolbar icon, then click <em>Import open
            tabs</em>. Every tab in the current window lands in an
            &ldquo;Imported&rdquo; category, deduped against what you already
            have.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Add a single link.</strong> Click
            <em> + Add link</em>, fill the form (URL, title, category, tags,
            description), Save.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Filter by tag.</strong> Click any
            tag pill at the top of the page to filter. Click again to clear.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Search.</strong> Type in the search
            bar to filter across all fields and category names. Esc clears.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Edit or delete.</strong> Hover or
            tab onto any link card &mdash; Edit and Delete buttons appear in
            the top-right.
          </li>
          <li>
            <strong className="text-[color:var(--color-fg)]">Backup.</strong> Click <em>Export
            JSON</em> any time to download a timestamped snapshot. Use
            <em> Import JSON</em> to restore.
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
