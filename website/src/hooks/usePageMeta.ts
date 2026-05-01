/**
 * usePageMeta — per-route page metadata for an SPA.
 *
 * React Router ships one HTML shell, so per-page <title>, meta description,
 * Open Graph tags, and canonical URL all have to be set at runtime. This
 * hook does that on mount and on prop change. The site title is appended
 * automatically so each page can pass just its short title.
 *
 * Usage:
 *   usePageMeta({
 *     title: 'About',
 *     description: 'Mirabelle Doiron, UX Engineer working at the ...'
 *   })
 *
 * Updating SITE_TITLE or SITE_ORIGIN here updates every page.
 *
 * — Mirabelle
 */
import { useEffect } from 'react'

const SITE_TITLE = 'Built by Mirabelle'
const SITE_ORIGIN = 'https://builtbymirabelle.com'

export interface PageMeta {
  /** Page-specific title; the site title is appended automatically. */
  title: string
  /** ~150 char description — drives <meta description>, og:description, twitter:description. */
  description?: string
  /** Optional canonical path override. Defaults to window.location.pathname. */
  canonical?: string
}

export function usePageMeta({ title, description, canonical }: PageMeta): void {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_TITLE}`
    document.title = fullTitle

    setMeta('og:title', fullTitle, 'property')
    setMeta('twitter:title', fullTitle, 'name')

    if (description) {
      setMeta('description', description, 'name')
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description, 'name')
    }

    const path = canonical ?? window.location.pathname
    const fullUrl = `${SITE_ORIGIN}${path}`
    setLink('canonical', fullUrl)
    setMeta('og:url', fullUrl, 'property')
  }, [title, description, canonical])
}

// --- helpers (idempotent: create the tag if missing, otherwise update it) ---

function setMeta(name: string, content: string, attr: 'name' | 'property'): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
