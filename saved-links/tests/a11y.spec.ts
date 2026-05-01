import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';

const FILE_URL = 'file://' + path.resolve(__dirname, '..', 'links.html');

async function freshPage(page: Page): Promise<void> {
  await page.goto(FILE_URL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(FILE_URL);
  await page.waitForSelector('.tag-pill');
}

test.describe('Saved Links — WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    await freshPage(page);
  });

  // ---------- axe-core ----------
  test.describe('axe-core scan', () => {
    test('no AA violations in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.map((n) => n.target).flat(),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });

    test('no AA violations in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.map((n) => n.target).flat(),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });

    test('no AA violations with form open and error', async ({ page }) => {
      await page.click('#add-toggle');
      await page.click('#form-save');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.map((n) => n.target).flat(),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  });

  // ---------- Keyboard ----------
  test.describe('Keyboard navigation (2.1.1, 2.4.3, 2.4.7)', () => {
    test('skip-link is first focusable and moves focus to #main', async ({ page }) => {
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toHaveText('Skip to content');
      await page.keyboard.press('Enter');
      // hash should be #main and focus should land on the main landmark
      expect(page.url()).toContain('#main');
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      expect(focusedId).toBe('main');
    });

    test('tab order through page matches visual order', async ({ page }) => {
      await page.keyboard.press('Tab'); // skip-link
      // After skip-link: AA badge (next visible link in the title block),
      // then header-actions, then search.
      await page.keyboard.press('Tab');
      const afterBadge = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        cls: document.activeElement?.className,
      }));
      expect(afterBadge.cls).toContain('aa-badge');

      const expectedIds = [
        'add-toggle',
        'import-tabs',
        'export',
        'import',
        'reset',
        'q',
      ];
      for (const expected of expectedIds) {
        await page.keyboard.press('Tab');
        const focusedId = await page.evaluate(() => document.activeElement?.id);
        expect(focusedId, `Expected focus on #${expected}`).toBe(expected);
      }
    });

    test('Esc closes the form and returns focus to the toggle', async ({ page }) => {
      await page.click('#add-toggle');
      await expect(page.locator('#form-panel')).toBeVisible();
      await page.locator('#f-url').focus();
      await page.keyboard.press('Escape');
      await expect(page.locator('#form-panel')).toBeHidden();
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      expect(focusedId).toBe('add-toggle');
    });

    test('Esc clears search when input has content', async ({ page }) => {
      await page.locator('#q').fill('design');
      await page.keyboard.press('Escape');
      await expect(page.locator('#q')).toHaveValue('');
    });

    test('Tag pill toggles aria-pressed on Enter', async ({ page }) => {
      const firstPill = page.locator('.tag-pill').first();
      await firstPill.focus();
      await expect(firstPill).toHaveAttribute('aria-pressed', 'false');
      await page.keyboard.press('Enter');
      await expect(firstPill).toHaveAttribute('aria-pressed', 'true');
      await page.keyboard.press('Enter');
      await expect(firstPill).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // ---------- Form errors ----------
  test.describe('Form error handling (3.3.1, 3.3.3, 4.1.3)', () => {
    test('empty form submit identifies errors via aria-invalid + role=alert', async ({ page }) => {
      await page.click('#add-toggle');
      await page.click('#form-save');

      await expect(page.locator('#f-url')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#f-title')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#f-url')).toHaveAttribute(
        'aria-describedby',
        /form-status/,
      );
      await expect(page.locator('#form-status')).toHaveAttribute('role', 'alert');
      await expect(page.locator('#form-status')).toHaveText(
        'Add either a URL or a title to save this link.',
      );
    });

    test('typing into URL clears error state and unlinks describedby', async ({ page }) => {
      await page.click('#add-toggle');
      await page.click('#form-save');
      await page.locator('#f-url').fill('https://example.com');
      await expect(page.locator('#f-url')).not.toHaveAttribute('aria-invalid', /.*/);
      await expect(page.locator('#form-status')).toHaveText('');
      await expect(page.locator('#f-url')).toHaveAttribute('aria-describedby', 'f-url-help');
    });
  });

  // ---------- Reflow / zoom ----------
  test.describe('Reflow (1.4.10) and zoom (1.4.4)', () => {
    test('no horizontal scroll at 320px wide', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.click('#add-toggle'); // open form too — most layout-stressed state
      const measure = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(measure.scroll).toBeLessThanOrEqual(measure.viewport + 1);
      await page.screenshot({
        path: 'tests/screenshots/reflow-320px.png',
        fullPage: true,
      });
    });

    test('no horizontal scroll at 200% zoom equivalent', async ({ page }) => {
      // Setting devicePixelRatio + halving viewport simulates browser zoom 200%.
      await page.setViewportSize({ width: 640, height: 400 });
      await page.click('#add-toggle');
      const measure = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(measure.scroll).toBeLessThanOrEqual(measure.viewport + 1);
      await page.screenshot({
        path: 'tests/screenshots/zoom-200pct.png',
        fullPage: true,
      });
    });
  });

  // ---------- Reduced motion ----------
  test.describe('Reduced motion respected', () => {
    test('motion tokens collapse to 0s under prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(FILE_URL);
      const tokens = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return {
          fast: cs.getPropertyValue('--motion-fast').trim(),
          medium: cs.getPropertyValue('--motion-medium').trim(),
        };
      });
      expect(tokens.fast).toBe('0s');
      expect(tokens.medium).toBe('0s');
    });
  });

  // ---------- A11y tree (SR-equivalent) ----------
  test.describe('Accessibility tree snapshots', () => {
    test('header actions group exposes 5 buttons in correct order with names', async ({ page }) => {
      const group = page.getByRole('group', { name: 'Saved Links actions' });
      await expect(group).toBeVisible();
      const buttonNames = await group.getByRole('button').evaluateAll((els) =>
        els.map((b) => b.textContent?.trim() ?? ''),
      );
      expect(buttonNames).toEqual([
        '+ Add link',
        'Import open tabs',
        'Export JSON',
        'Import JSON',
        'Reset to seed',
      ]);
    });

    test('form toggle exposes correct aria-expanded state', async ({ page }) => {
      await expect(page.locator('#add-toggle')).toHaveAttribute('aria-expanded', 'false');
      await page.click('#add-toggle');
      await expect(page.locator('#add-toggle')).toHaveAttribute('aria-expanded', 'true');
    });

    test('every item Edit/Delete button has unique accessible name including item title', async ({ page }) => {
      const editButtons = await page.locator('.item-actions button').all();
      const names = await Promise.all(
        editButtons.map((b) => b.getAttribute('aria-label')),
      );
      // No duplicates and every label starts with Edit or Delete
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
      for (const n of names) {
        expect(n).toMatch(/^(Edit|Delete) /);
      }
    });
  });
});
