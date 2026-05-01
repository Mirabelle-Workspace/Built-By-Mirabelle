/**
 * About — short positioning piece.
 *
 * Frames Mirabelle as a UX Engineer working at the implementation layer
 * between design intent and production code. Avoids company names; the
 * paragraph order intentionally stacks design systems → React/TS →
 * accessibility → tokens → docs → AI governance.
 *
 * Don't add specific biographical claims (dates, tenures, projects)
 * here without verifying — see memory: "no invented biography".
 *
 * — Mirabelle
 */
import { Github, ExternalLink } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

export function About() {
  usePageMeta({
    title: 'About',
    description:
      'Mirabelle Doiron, UX Engineer working at the implementation layer between design intent and production code — design systems, React + TypeScript, accessibility, design tokens, documentation.',
    canonical: '/about',
  })

  return (
    <div className="px-6 py-16 mx-auto max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold text-[color:var(--color-fg)]">
        About
      </h1>

      <section className="mb-12 text-lg text-[color:var(--color-fg-muted)]">
        <p className="mb-4">
          I&rsquo;m Mirabelle Doiron, a UX Engineer working at the
          implementation layer between design intent and production code.
        </p>
        <p className="mb-4">
          That intersection sits across five disciplines: design systems,
          React + TypeScript engineering, accessibility, design tokens, and
          documentation. My work is making them mutually reinforcing instead
          of five separate handoffs.
        </p>
        <p className="mb-4">
          A design system succeeds when teams choose it because it&rsquo;s
          faster, clearer, and safer than custom UI &mdash; which makes
          documentation, contribution model, and adoption as load-bearing
          as the code itself. Accessibility belongs in the component
          contract, not in every product team&rsquo;s backlog. Tokens are
          how design decisions become repeatable engineering decisions.
          And as AI moves into the design-to-code loop, governance becomes
          a first-class problem: how do we make generated output follow
          the system instead of creating more drift?
        </p>
        <p className="mb-4">
          The extensions on this site are the same thinking at small scale.
          Token-driven, accessible by construction, documented to be
          self-serve.
        </p>
        <p>If something here is useful to you, take it.</p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-[color:var(--color-fg)]">
          Find me
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://mirabelledoiron.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center px-4 py-2 text-sm rounded-lg border transition-colors border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]"
          >
            Portfolio
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/mirabelledoiron"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center px-4 py-2 text-sm rounded-lg border transition-colors border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </section>
    </div>
  )
}
