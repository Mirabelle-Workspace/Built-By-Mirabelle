/**
 * ThemeToggle — sun/moon button that flips light/dark and persists.
 *
 * The actual class on <html> is owned by usePreferences.setTheme; this
 * is just an accessible button bound to that store. aria-pressed announces
 * the current state to screen readers ("dark mode, toggle button, pressed").
 *
 * — Mirabelle
 */
import { Moon, Sun } from 'lucide-react'
import { setTheme, useTheme } from '../hooks/usePreferences'

export function ThemeToggle() {
  const theme = useTheme()
  const isDark = theme === 'dark'
  const next = isDark ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-pressed={isDark}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex justify-center items-center w-9 h-9 rounded-md border transition-colors border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
