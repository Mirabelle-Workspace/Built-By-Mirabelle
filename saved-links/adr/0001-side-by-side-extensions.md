# ADR 0001: Side-by-side extensions, single repo

**Status:** accepted
**Date:** 2026-04-28

## Context

The repository started as `HomeBase`, a Chrome extension that overrides Chrome's new-tab page with a customizable bookmarks dashboard. After HomeBase was working, a separate need emerged: a fast, keyboard-driven page for collecting and categorizing links — particularly bulk-importing every open tab in a window — without disturbing the new-tab experience.

Three plausible shapes:

1. **Bundle into HomeBase.** Add a second page and command to the existing extension. One extension, one place to manage.
2. **Replace HomeBase.** Make the new UI the new-tab page; retire HomeBase.
3. **Side-by-side, separate extensions, same repo.** Each lives in its own folder with its own `manifest.json`, icons, storage, and identity.

Constraints driving the choice:
- HomeBase already has user data in `chrome.storage.local` that must not be disturbed.
- The bulk-tab-import flow has different concerns (a single shortcut, a different visual identity, separate persistence) than HomeBase's bookmark grid.
- Mirabelle wanted to push both to the same private repo for backup but treat them as independent shipping artifacts.

## Decision

We chose **option 3: side-by-side, separate extensions, single repo**.

```
Homebase/
├── manifest.json     # HomeBase (root of the repo, unchanged path so existing
├── background.js     # installs keep working without reload)
├── ...
└── saved-links/      # Saved Links — its own extension folder
    ├── manifest.json
    ├── background.js
    └── ...
```

Each folder is loaded independently as an unpacked extension via `chrome://extensions` → Load unpacked.

## Consequences

**Wins**
- HomeBase users are unaffected; their `chrome.storage.local` data stays put.
- Each extension has its own identity (icon, name, ID, storage origin). No collisions.
- Permissions are scoped per extension — Saved Links asks for `tabs` and `scripting`; HomeBase doesn't need them.
- Either extension can be developed, versioned, or removed without touching the other.
- One backup (one git push) covers both.

**Tradeoffs**
- Two folders to maintain, two reload steps when both change.
- No code reuse between them today. If shared utilities emerge later, we'd need a `shared/` folder and a build step that copies into both — not a concern at current scale.
- The repo name is `Homebase` but contains both extensions; future-me may find that confusing. Mitigated by the README in each folder explaining what it is.

**Follow-ups**
- If a third extension ever joins, restructure to `Homebase/extensions/{homebase,saved-links,...}` with a top-level README pointing at each.
- If shared storage becomes useful (e.g., shared bookmarks corpus), move both onto `chrome.storage.local` with a shared schema, document the migration in a new ADR.
