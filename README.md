# Built by Mirabelle

A workspace of small, focused Chrome extensions, plus the website that
hosts them. Built by [Mirabelle Doiron](https://builtbymirabelle.com).

## Layout

| Folder | What it is |
| --- | --- |
| [`homebase/`](./homebase/) | **HomeBase** — a customizable, themed new-tab page with categorized bookmarks. Chrome Web Store listing live. |
| [`saved-links/`](./saved-links/) | **Saved Links** — bulk-import open tabs into a categorized, searchable, WCAG 2.1 AA-conformant local library. |
| [`website/`](./website/) | The [builtbymirabelle.com](https://builtbymirabelle.com) source — a Vite + React multi-page showcase covering both extensions. |

## Adding another extension

Drop a new folder at the root (`homebase/`, `saved-links/` are the templates).
Each extension is fully self-contained: its own `manifest.json`, its own build
output, its own README, its own Chrome Web Store listing. No shared
code or shared state across extensions — they only share design language
and the umbrella website.

## Author

Mirabelle Doiron — UX Engineer working at the implementation layer between
design intent and production code. Find more at
[builtbymirabelle.com](https://builtbymirabelle.com).
