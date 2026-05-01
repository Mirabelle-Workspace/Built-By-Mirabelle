# Saved Links — WCAG 2.1 AA Conformance Audit

Last reviewed: 2026-04-29
Reviewer: Mirabelle Doiron (self-audit, augmented with computed contrast
verification and a Playwright + axe-core automated test suite).

## Scope

This document records how the Saved Links Chrome extension (`links.html`,
`links.js`, `styles.css`, `tokens.css`) meets each applicable WCAG 2.1 Level AA
success criterion. Where a criterion is not applicable, that is stated.

Saved Links is a single-page extension with no dynamic routing, no media,
no time-based content, and no third-party dependencies in the page itself.

## Verification approach

1. **Color contrast** — every foreground/background pair derived from token
   combinations was computed against the WCAG 2.1 relative luminance formula.
   Ratios recorded in the table below.
2. **Automated test suite** (`tests/a11y.spec.ts`) — 16 Playwright tests
   covering: axe-core scan in light + dark + error states, keyboard tab
   order, Esc handling, tag-pill toggle, form error identification (3.3.1)
   and suggestion (3.3.3), reflow at 320 px, 200% zoom equivalent,
   `prefers-reduced-motion` token collapse, and accessibility-tree
   snapshots (the programmatic equivalent of "what an SR sees").
3. **Code review** — every interactive element traced for keyboard access,
   visible focus, accessible name, and state announcement.
4. **Manual VoiceOver pass** — listed under "still required" below; not yet
   executed. Automated tests cover ~80% of what an SR walkthrough finds; the
   remaining 20% (announcement order, idiom, intonation) needs human ears.

### Bugs found and fixed by the automated suite

- `item-actions` used `opacity: 0.4` for visual de-emphasis. axe-core flagged
  this as a 1.4.3 failure because opacity composites against the card
  background and dropped effective contrast below 4.5:1. Replaced with
  `--color-text-muted` (≥6.3:1) at rest, full text color on hover/focus.
- Tag-pill click handler called `renderTagFilters()`, which destroyed the
  focused button. Replaced with an in-place `aria-pressed` sync so keyboard
  focus is preserved on toggle (2.4.3 / 2.4.7).
- `<main>` was not focusable, so the skip-link scrolled but did not move
  focus. Added `tabindex="-1"` so Enter on the skip-link transfers focus
  into the main landmark (2.4.1).

## Contrast results

All values computed using sRGB relative luminance per WCAG 2.1.

### Light mode (text — must be ≥4.5:1)

| Pair | Ratio |
| --- | --- |
| `--color-text` on `--color-bg` | 16.64:1 |
| `--color-text` on `--color-surface` | 17.40:1 |
| `--color-text-muted` on `--color-bg` | 6.70:1 |
| `--color-text-muted` on `--color-surface` | 7.00:1 |
| `--color-text-muted` on `--color-tag-bg` | 5.99:1 |
| `--color-accent` on `--color-bg` (h2 headings) | 10.41:1 |
| `--color-tag-text` on `--color-tag-bg` | 9.30:1 |
| `--color-link` on `--color-bg` | 8.26:1 |
| `--color-link` on `--color-surface` | 8.64:1 |
| `--color-danger` on `--color-surface` (delete button) | 7.72:1 |
| `--color-bg` on `--color-accent` (primary button text) | 10.41:1 |

### Light mode (UI boundaries — must be ≥3:1)

| Pair | Ratio |
| --- | --- |
| `--color-border-strong` on `--color-surface` (form input boundary) | 4.84:1 |
| `--color-border-strong` on `--color-bg` (search input boundary) | 4.63:1 |
| `--color-border-strong` on `--color-tag-bg` | 4.14:1 |
| `--color-focus-ring` on `--color-bg` (focus outline) | 10.41:1 |
| `--color-focus-ring` on `--color-surface` | 10.88:1 |

> Note: focus on the primary button uses `outline-offset: 2px`, putting body
> color between the button fill and the outline. The outline is therefore
> adjacent to body color (10.41:1), not button fill.

### Dark mode (text — must be ≥4.5:1)

| Pair | Ratio |
| --- | --- |
| `--color-text` on `--color-bg` | 14.91:1 |
| `--color-text` on `--color-surface` | 13.47:1 |
| `--color-text-muted` on `--color-bg` | 7.05:1 |
| `--color-text-muted` on `--color-surface` | 6.37:1 |
| `--color-text-muted` on `--color-tag-bg` | 5.65:1 |
| `--color-accent` on `--color-bg` | 10.18:1 |
| `--color-tag-text` on `--color-tag-bg` | 8.17:1 |
| `--color-link` on `--color-bg` | 9.12:1 |
| `--color-link` on `--color-surface` | 8.24:1 |
| `--color-danger` on `--color-surface` | 7.68:1 |
| `--color-bg` on `--color-accent` (primary button text) | 10.18:1 |

### Dark mode (UI boundaries — must be ≥3:1)

| Pair | Ratio |
| --- | --- |
| `--color-border-strong` on `--color-surface` | 3.70:1 |
| `--color-border-strong` on `--color-bg` | 4.09:1 |
| `--color-focus-ring` on `--color-bg` | 10.18:1 |
| `--color-focus-ring` on `--color-surface` | 9.20:1 |

## SC-by-SC conformance

### Perceivable

- **1.1.1 Non-text Content (A)** — no images convey information. The two
  decorative `&times;` and `+` glyphs are wrapped with `aria-hidden="true"`
  or come with a sibling `aria-label`.
- **1.3.1 Info and Relationships (A)** — semantic `<header>`, `<main>`,
  `<section>`, `<h1>`/`<h2>`, `<ul>`/`<li>`. Form labels use explicit `for`.
  The form panel is `<section role="region" aria-labelledby="form-panel-heading">`.
  Tag filter row is `role="group" aria-label="Filter by tag"`.
- **1.3.2 Meaningful Sequence (A)** — DOM order matches visual order; no
  CSS reordering that breaks semantics.
- **1.3.4 Orientation (AA)** — fully responsive; no orientation lock.
- **1.3.5 Identify Input Purpose (AA)** — input types correctly use `url`,
  `text`, `search`, and `file` attributes; `autocomplete` is intentionally
  set to `off` on the search field (not personal data).
- **1.4.1 Use of Color (A)** — color is never the only indicator. Active
  tag pills also use `aria-pressed` and a filled background. Invalid form
  fields use `aria-invalid` and a visible error message in addition to
  border color.
- **1.4.3 Contrast (Minimum) (AA)** — every text pair ≥4.5:1; see table above.
- **1.4.4 Resize Text (AA)** — layout uses CSS pixels and rem-friendly
  spacing tokens. Tested at 200% browser zoom; no clipping or loss of
  function.
- **1.4.5 Images of Text (AA)** — no images of text used.
- **1.4.10 Reflow (AA)** — content reflows at 320 CSS pixels without
  horizontal scrolling. Two-column form rows collapse to single column at
  ≤560px.
- **1.4.11 Non-text Contrast (AA)** — UI component boundaries (form inputs,
  tag pills, search input) use `--color-border-strong` (≥3:1). Focus ring
  uses `--color-focus-ring` (≥9:1). Active state of tag pill uses filled
  accent fill plus `aria-pressed`.
- **1.4.12 Text Spacing (AA)** — no fixed line-height or letter-spacing
  prevents user overrides; verified via Stylus override.
- **1.4.13 Content on Hover or Focus (AA)** — item Edit/Delete actions
  appear on `:hover` and `:focus-within`, are reachable by keyboard, remain
  visible while hovered/focused, and do not obscure other content.

### Operable

- **2.1.1 Keyboard (A)** — every interactive control is a real `<button>`,
  `<input>`, `<select>`, `<textarea>`, or `<a>`. Tag pills are buttons.
  Toolbar buttons, search, search-clear, form fields, item edit/delete,
  and reset are all reachable and activatable from the keyboard.
- **2.1.2 No Keyboard Trap (A)** — no focus traps. Form is a disclosure
  pattern (not a modal); focus can leave it freely. Esc closes it and
  returns focus to the toggle.
- **2.1.4 Character Key Shortcuts (A)** — only modifier-based shortcuts
  (`Alt+Shift+S`, `Alt+Shift+L`) and Esc on focused contexts; no
  single-character shortcuts active outside form inputs.
- **2.4.1 Bypass Blocks (A)** — visible-on-focus skip link to `#main`.
- **2.4.2 Page Titled (A)** — `<title>Saved Links</title>`.
- **2.4.3 Focus Order (A)** — DOM order matches reading order; no
  `tabindex > 0`.
- **2.4.4 Link Purpose (In Context) (A)** — link text is the page title.
  External links open with `rel="noopener"` and `target="_blank"`.
- **2.4.5 Multiple Ways (AA)** — search and tag-filter both find content.
- **2.4.6 Headings and Labels (AA)** — every form field has a visible label;
  every section has a heading.
- **2.4.7 Focus Visible (AA)** — all interactive elements use
  `:focus-visible` with a 2px outline at `--color-focus-ring`. Outline is
  always offset by 2px so it is never confused with a button border.
- **2.5.1 Pointer Gestures (A)** — no multi-point or path gestures.
- **2.5.2 Pointer Cancellation (A)** — all activations on `click`
  (up-event), not `mousedown`.
- **2.5.3 Label in Name (AA)** — accessible names contain visible text.
  Item Edit/Delete buttons use `aria-label="Edit ${title}"` /
  `"Delete ${title}"`, which contain the visible word "Edit"/"Delete".
- **2.5.4 Motion Actuation (A)** — no motion-based input.

### Understandable

- **3.1.1 Language of Page (A)** — `<html lang="en">`.
- **3.2.1 On Focus (A)** — focus does not trigger context changes.
- **3.2.2 On Input (A)** — typing in fields does not submit or navigate.
- **3.2.3 Consistent Navigation (AA)** — single-page app; nav is the
  fixed header.
- **3.2.4 Consistent Identification (AA)** — buttons with the same
  function (e.g. ghost Edit/Delete on every item) have identical names
  and roles.
- **3.3.1 Error Identification (A)** — invalid form fields receive
  `aria-invalid="true"` and a red border (`--color-danger`). The error
  message is rendered into `#form-status` (role="alert") and is linked to
  the offending fields via `aria-describedby`.
- **3.3.2 Labels or Instructions (A)** — every field has a visible label
  plus an `aria-describedby` help string ("Optional if a title is provided").
- **3.3.3 Error Suggestion (AA)** — the error message names the fix:
  *"Add either a URL or a title to save this link."*
- **3.3.4 Error Prevention (AA)** — N/A (no legal/financial commitments;
  Reset and Delete are confirmed via native `confirm()`).

### Robust

- **4.1.1 Parsing (A)** — verified valid HTML5; unique ids; no
  duplicate-attribute or unclosed-tag issues.
- **4.1.2 Name, Role, Value (A)** — every interactive element has a
  programmatic name (label, aria-label, or text content). State is
  exposed via `aria-pressed` (tag pills), `aria-expanded` (form toggle),
  `aria-invalid` (form fields), and `hidden` (form panel).
- **4.1.3 Status Messages (AA)** — toast uses `role="status"` +
  `aria-live="polite"`. Form error uses `role="alert"`. Result count
  uses `aria-live="polite"`.

## Automated test suite

Run with `npm run test:a11y` from the `saved-links/` directory.

| Group | Tests | Status |
| --- | --- | --- |
| axe-core scan (light, dark, form-error states) | 3 | PASS |
| Keyboard navigation (skip-link, tab order, Esc, tag-pill toggle) | 5 | PASS |
| Form error handling (3.3.1, 3.3.3, 4.1.3) | 2 | PASS |
| Reflow at 320 px and 200% zoom (1.4.10, 1.4.4) | 2 | PASS |
| `prefers-reduced-motion` token collapse | 1 | PASS |
| Accessibility tree snapshots (4.1.2 names/roles/values) | 3 | PASS |
| **Total** | **16** | **PASS** |

Visual evidence for reflow/zoom is captured to
`tests/screenshots/reflow-320px.png` and `tests/screenshots/zoom-200pct.png`.

## Still required for full conformance signoff

- **VoiceOver (macOS) walkthrough.** Verify headings, landmarks, and
  live-region announcement order behave as expected. axe and the a11y-tree
  tests catch missing labels, roles, and broken relationships, but they
  cannot verify announcement *quality* (idiom, ordering, intonation).
- **NVDA (Windows) sanity check.** Same as VoiceOver but for Windows; the
  two screen readers occasionally diverge on edge cases (e.g.,
  `role="alert"` re-announcement).
- **Manual prefers-reduced-motion OS toggle.** The token-collapse test
  proves the CSS variables update; the visual confirmation that no
  unexpected motion remains (e.g., third-party transitions) needs eyes.

## Known limits / not in scope

- **Native `confirm()` dialogs** for Delete and Reset. Native dialogs
  are accessible (the browser handles focus, role, and announcement).
  Kept for simplicity. A custom modal would not improve AA conformance.
- **Screen reader reading of the count badge inside tag pills**: the
  pill announces as e.g. "Design Systems 5, toggle button, not pressed".
  The "5" is recognizable as a count from context (the parent group is
  labeled "Filter by tag"). No SC violation; a future improvement could
  use `aria-description` for clarity.
- **Chrome extension popup**: not provided. The toolbar icon opens
  Saved Links directly in a tab, so all UI is exercised inside this
  audited document.
