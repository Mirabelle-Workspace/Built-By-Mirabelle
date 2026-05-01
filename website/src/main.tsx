/**
 * main — Vite entry point.
 *
 * StrictMode is on because every component on the site is small and
 * pure, so the double-invoke behaviour costs us nothing and surfaces
 * accidental side-effects early.
 *
 * Note: theme/a11y/low-carbon classes are applied to <html> by the
 * inline pre-paint script in index.html, before this bundle ever runs.
 * That's deliberate — see usePreferences.ts.
 *
 * — Mirabelle
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
