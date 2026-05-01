# Saved Links

A local-only Chrome extension for collecting, categorizing, and bulk-importing URLs from your open tabs. Lives alongside [HomeBase](../homebase/) in the [Built by Mirabelle](../) workspace as a sibling extension; no shared code, no shared state.

## Overview

- **Local-only** — every link is stored in this extension's `localStorage`. Nothing leaves your browser.
- **TypeScript** — strict types, discriminated unions, branded IDs, `noUncheckedIndexedAccess` on.
- **Token-driven UI** — semantic design tokens in `tokens.css`, component styles in `styles.css`, no hardcoded values in component code.
- **WCAG 2.1 AA targeted** — keyboard-reachable actions, ARIA disclosure for the form, `aria-live` toast announcements, focus-visible rings, `prefers-reduced-motion` support.

## Prereqs

- Node 18+ (only required if you want to rebuild the TypeScript)
- Chrome with Developer mode enabled

## Quickstart

### Install the extension (no build required)

The repo ships with the compiled `links.js` and `background.js`, so loading is one step:

1. `chrome://extensions` → toggle **Developer mode** on
2. Click **Load unpacked** → pick `Homebase/saved-links/`
3. Pin it to your toolbar (puzzle-piece icon → pushpin next to **Saved Links**)

### Build from source (only if you change `.ts` files)

```bash
cd saved-links
npm install
npm run build       # one-shot compile
npm run dev         # watch mode while editing
npm run typecheck   # type-check without emitting
```

After rebuilding, **reload the extension** in `chrome://extensions` to pick up changes.

## How to add links

| Action | How |
|---|---|
| Send every open tab in the current window | Press **⌥ ⇧ L** anywhere in Chrome |
| Open Saved Links | Click the toolbar icon, or **⌥ ⇧ S** |
| Add a single link manually | Open Saved Links → click **+ Add link** → fill the form → **Save** |
| Edit a link | Hover or focus a card → click **Edit** |
| Delete a link | Hover or focus a card → click **Delete** (confirms) |
| Import a JSON backup | Click **Import JSON** → pick a `saved-links-YYYY-MM-DD.json` |
| Export a backup | Click **Export JSON** → file downloads to your Downloads folder. Move it to `saved-links/Backups/` if you want it version-controlled. |
| Wipe everything back to defaults | Click **Reset to seed** (confirms) |

The bulk import (⌥ ⇧ L) auto-skips:
- Internal pages (`chrome://`, the Saved Links page itself, `about:`, etc.)
- URLs you've already saved (deduped by exact URL match)

A toast at the bottom announces results: `Added 5, skipped 12 dupes, ignored 3.`

## Persistence

`localStorage` keyed under `saved-links-state-v1`, scoped to this extension's origin. Survives:

- Page refresh, tab close, browser restart, Mac reboot

Does **not** survive:

- Removing and re-installing the extension (Chrome assigns a new origin)
- Clearing browsing data with "Cookies and other site data" checked
- The **Reset to seed** button

> Always **Export JSON** before any of the above. The exported file can be re-imported on the same or a different machine.

## Search

The sticky search input filters across:

- Link titles
- URLs
- Descriptions
- Tags
- Category names

`Esc` clears the search. The match count is announced via `aria-live`.

## Keyboard shortcuts

| Shortcut | What it does |
|---|---|
| **⌥ ⇧ S** | Open or focus Saved Links |
| **⌥ ⇧ L** | Send current window's tabs to Saved Links |
| **Esc** (in the form) | Cancel and close, focus returns to **+ Add link** |
| **Esc** (in search) | Clear the query |
| **Tab** | Navigates through links, actions, and form controls |

To rebind the global shortcuts, go to `chrome://extensions/shortcuts`.

## Files

```
saved-links/
├── manifest.json        # Extension manifest (Manifest V3)
├── package.json         # npm scripts: build, dev, typecheck
├── tsconfig.json        # strict TS config
├── src/
│   ├── links.ts         # page logic — types, state, render, form, search, IO, bulkAdd
│   └── background.ts    # service worker — toolbar click + keyboard commands
├── links.js             # compiled output (committed for load-unpacked)
├── background.js        # compiled output (committed)
├── links.html           # markup; references tokens.css + styles.css + links.js
├── tokens.css           # design tokens (color, space, radius, motion, typography)
├── styles.css           # component styles, references only tokens
├── icon.svg             # source icon
├── icon-16.png          # toolbar icon (small)
├── icon-48.png          # extensions list icon
├── icon-128.png         # large display
├── adr/
│   └── 0001-side-by-side-extensions.md
├── Backups/             # exported saved-links-YYYY-MM-DD.json snapshots (mirrors HomeBase pattern)
└── README.md
```

## Editing the seed

The `SEED` constant at the top of `src/links.ts` defines the starter set of categories and links. Two ways to change it:

1. **Edit `src/links.ts`**, run `npm run build`, reload the extension. Affects fresh installs and **Reset to seed**.
2. **Use the UI**, then **Export JSON** and check the file in. The exported JSON can also become someone else's seed via **Import JSON**.

## Accessibility

- Every interactive control has a visible focus ring.
- The **+ Add link** disclosure uses `aria-expanded` + `aria-controls`; the panel uses `role="region"` + `aria-labelledby`.
- The toast is an `aria-live="polite" role="status"` region — bulk-import results are announced.
- Search match count is also `aria-live`.
- Item Edit/Delete buttons stay reachable with Tab; visual styling is reduced by default and elevated on `:hover` / `:focus-within`.
- Form errors set `aria-invalid="true"` on the offending fields; the inline status uses `role="alert"`.
- A skip link jumps to `#main` for keyboard users.
- `prefers-reduced-motion: reduce` zeros out transitions via tokens.

## Architecture notes

See [`adr/0001-side-by-side-extensions.md`](./adr/0001-side-by-side-extensions.md) for why Saved Links is a separate extension rather than bundled into HomeBase.

## Troubleshooting

- **Toolbar icon does nothing.** The extension wasn't reloaded after a code change. Go to `chrome://extensions` → click the reload icon on the Saved Links card.
- **⌥ ⇧ L does nothing.** Another extension may own the same shortcut. Rebind at `chrome://extensions/shortcuts`.
- **Imported JSON didn't load.** Check the file is shaped `{ "categories": [...] }`. Otherwise the page toasts `Import failed: ...`.
- **Lost my data after re-install.** Removing and re-adding an unpacked extension gives it a new origin and wipes localStorage. Always **Export JSON** first.
