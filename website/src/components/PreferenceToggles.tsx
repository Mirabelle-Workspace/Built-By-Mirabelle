/**
 * PreferenceToggles — A11y + Low Carbon buttons.
 *
 * Each button is its own <button aria-pressed> so a screen reader
 * announces the active state independently. State lives in
 * usePreferences; the click handler just flips the store.
 *
 * Visible labels are hidden on small screens (icon + aria-label only)
 * to keep the navbar tight. The aria-pressed attribute makes the
 * toggle state explicit even without the label.
 *
 * — Mirabelle
 */
import { Accessibility, Leaf } from 'lucide-react'
import {
  setA11y,
  setLowCarbon,
  useA11y,
  useLowCarbon,
} from '../hooks/usePreferences'

export function PreferenceToggles() {
  const a11y = useA11y()
  const lowCarbon = useLowCarbon()

  return (
    <div className="inline-flex gap-2 items-center">
      <button
        type="button"
        onClick={() => setA11y(!a11y)}
        aria-pressed={a11y}
        aria-label={
          a11y ? 'Disable accessibility mode' : 'Enable accessibility mode'
        }
        title={a11y ? 'Accessibility mode on' : 'Accessibility mode off'}
        className={`inline-flex justify-center items-center w-9 h-9 rounded-md border transition-colors ${
          a11y
            ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)] border-[color:var(--color-accent)]'
            : 'border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]'
        }`}
      >
        <Accessibility className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setLowCarbon(!lowCarbon)}
        aria-pressed={lowCarbon}
        aria-label={
          lowCarbon ? 'Disable low-carbon mode' : 'Enable low-carbon mode'
        }
        title={lowCarbon ? 'Low-carbon mode on' : 'Low-carbon mode off'}
        className={`inline-flex justify-center items-center w-9 h-9 rounded-md border transition-colors ${
          lowCarbon
            ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)] border-[color:var(--color-accent)]'
            : 'border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]'
        }`}
      >
        <Leaf className="w-4 h-4" />
      </button>
    </div>
  )
}
