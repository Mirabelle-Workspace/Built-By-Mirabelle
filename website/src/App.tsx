/**
 * App — route table.
 *
 * BrowserRouter ships one HTML shell; every route renders inside the
 * shared <Layout /> (header, toggles, footer). The wildcard route
 * falls back to <Home /> instead of a dedicated 404 — the navbar gives
 * the user obvious places to go, and Vercel's rewrite in vercel.json
 * routes every URL through index.html so the SPA can resolve it.
 *
 * Add a route here and update public/sitemap.xml in the same commit
 * so search engines get the new URL on the next crawl.
 *
 * — Mirabelle
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { HomeBase } from './pages/HomeBase'
import { SavedLinks } from './pages/SavedLinks'
import { About } from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/products/homebase" element={<HomeBase />} />
          <Route path="/products/saved-links" element={<SavedLinks />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
