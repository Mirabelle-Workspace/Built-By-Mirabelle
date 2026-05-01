/**
 * usePreferences — runtime stores for theme, a11y, and low-carbon toggles.
 *
 * Each preference is its own external store so a component that only
 * cares about theme doesn't re-render when the a11y toggle flips.
 *
 * The pre-paint script in index.html applies the right classes on
 * <html> before React mounts. These hooks are responsible for keeping
 * the runtime in sync after the user toggles something:
 *   - read: subscribe to the relevant store, return the boolean/value
 *   - write: setTheme/setA11y/setLowCarbon update <html>.classList,
 *            persist to localStorage, and notify subscribers
 *
 * The keys ('theme', 'pref:a11y', 'pref:low-carbon') match the keys
 * the inline script reads in index.html — keep them in lockstep.
 *
 * — Mirabelle
 */
import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

type Listener = () => void

/* -------------------------------------------------------------------------
 * Tiny store helper: useSyncExternalStore needs `subscribe` and `getSnapshot`,
 * and we want a setter that mutates the source of truth and notifies. This
 * factory bundles all three plus a server snapshot for SSR-safety.
 * ----------------------------------------------------------------------- */
function createStore<T>(read: () => T) {
  const listeners = new Set<Listener>()
  return {
    subscribe(l: Listener) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    getSnapshot: read,
    notify() {
      listeners.forEach((l) => l())
    },
  }
}

/* -------------------------------------------------------------------------
 * Theme — light | dark
 * ----------------------------------------------------------------------- */
const themeStore = createStore<Theme>(() => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
})

export function useTheme(): Theme {
  return useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => 'dark',
  )
}

export function setTheme(next: Theme): void {
  const root = document.documentElement
  if (next === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* private mode — best-effort persistence */
  }
  themeStore.notify()
}

/* -------------------------------------------------------------------------
 * A11y mode — boolean
 * ----------------------------------------------------------------------- */
const a11yStore = createStore<boolean>(() => {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('a11y')
})

export function useA11y(): boolean {
  return useSyncExternalStore(
    a11yStore.subscribe,
    a11yStore.getSnapshot,
    () => false,
  )
}

export function setA11y(enabled: boolean): void {
  const root = document.documentElement
  root.classList.toggle('a11y', enabled)
  try {
    localStorage.setItem('pref:a11y', enabled ? '1' : '0')
  } catch {
    /* ignore */
  }
  a11yStore.notify()
}

/* -------------------------------------------------------------------------
 * Low-carbon mode — boolean
 * ----------------------------------------------------------------------- */
const lowCarbonStore = createStore<boolean>(() => {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('low-carbon')
})

export function useLowCarbon(): boolean {
  return useSyncExternalStore(
    lowCarbonStore.subscribe,
    lowCarbonStore.getSnapshot,
    () => false,
  )
}

export function setLowCarbon(enabled: boolean): void {
  const root = document.documentElement
  root.classList.toggle('low-carbon', enabled)
  try {
    localStorage.setItem('pref:low-carbon', enabled ? '1' : '0')
  } catch {
    /* ignore */
  }
  lowCarbonStore.notify()
}
