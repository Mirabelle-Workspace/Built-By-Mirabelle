// Saved Links — page logic.
// Compiled from src/links.ts to ../links.js by tsc.

type ItemId = string & { readonly __brand: 'ItemId' };
type CategoryId = string & { readonly __brand: 'CategoryId' };

interface Item {
  id: ItemId;
  url: string;
  title: string;
  tags: string[];
  desc: string;
}

interface Category {
  id: CategoryId;
  title: string;
  items: Item[];
}

interface State {
  categories: Category[];
}

interface TabRef {
  url?: string | undefined;
  title?: string | undefined;
}

interface BulkAddResult {
  added: number;
  skipped: number;
  ignored: number;
}

interface BulkAddOptions {
  categoryTitle?: string;
}

interface SavedLinksApi {
  bulkAdd(tabs: ReadonlyArray<TabRef>, options?: BulkAddOptions): BulkAddResult;
}

interface Window {
  savedLinks?: SavedLinksApi;
}

const STORAGE_KEY = 'saved-links-state-v1';
const TOAST_DURATION_MS = 2500;
const SKIP_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'about:',
  'edge://',
  'view-source:',
  'devtools://',
  'javascript:',
  'file://',
] as const;

const ALLOWED_TAGS = [
  'Resources',
  'Design Systems',
  'Case Studies',
  'Guides',
  'Must Read',
  'Component',
  'Frameworks',
  'Tokens',
  'Courses',
] as const;
type AllowedTag = (typeof ALLOWED_TAGS)[number];

const REMOVED_TAGS: ReadonlySet<string> = new Set([
  'Atelier Primitives',
  'ColorX',
  'TWC',
  'TWP',
  'Plan A interview',
  'Design Systems',
  'Case Studies',
  'Tokens',
  'Courses',
  'Resources',
]);

// Seed is a starter set, not a fixed structure. Every category here can be
// renamed or deleted by the user — categories live in user state, not in code.
const SEED: State = {
  categories: [
    {
      id: 'watch-later' as CategoryId,
      title: 'Watch Later',
      items: [
        mkItem('https://example.com', 'A talk you want to watch later', ['Must Read'], ''),
      ],
    },
    {
      id: 'inspiration' as CategoryId,
      title: 'Inspiration',
      items: [
        mkItem('https://example.com', 'A reference you want to revisit', ['Must Read'], ''),
      ],
    },
    {
      id: 'tools' as CategoryId,
      title: 'Tools',
      items: [
        mkItem('https://example.com', 'A framework worth exploring', ['Frameworks', 'Component'], ''),
      ],
    },
    {
      id: 'resources' as CategoryId,
      title: 'Resources',
      items: [
        mkItem('https://example.com', 'A guide worth bookmarking', ['Guides'], ''),
        mkItem('https://example.com', 'A free component library', ['Component'], ''),
      ],
    },
  ],
};

// Strip retired project-specific tags from existing localStorage state on load.
function migrateTags(state: State): State {
  state.categories.forEach((c) => {
    c.items.forEach((item) => {
      item.tags = item.tags.filter((t) => !REMOVED_TAGS.has(t));
    });
  });
  return state;
}

function mkItem(url: string, title: string, tags: string[], desc: string): Item {
  return { id: uid<ItemId>(), url, title, tags, desc };
}

function uid<T extends string = string>(): T {
  return ('i_' + Math.random().toString(36).slice(2, 10)) as T;
}

function withIds(state: State): State {
  if (!Array.isArray(state.categories)) state.categories = [];
  state.categories.forEach((c) => {
    if (!c.id) c.id = uid<CategoryId>();
    if (!Array.isArray(c.items)) c.items = [];
    c.items.forEach((it) => {
      if (!it.id) it.id = uid<ItemId>();
      if (!Array.isArray(it.tags)) it.tags = [];
      if (typeof it.url !== 'string') it.url = '';
      if (typeof it.title !== 'string') it.title = '';
      if (typeof it.desc !== 'string') it.desc = '';
    });
  });
  return state;
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateTags(withIds(JSON.parse(raw) as State));
  } catch {
    /* fall through to seed */
  }
  return withIds(JSON.parse(JSON.stringify(SEED)) as State);
}

function saveState(state: State): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing required element #${id}`);
  return el as T;
}

(function main() {
  let state = loadState();
  let editingId: ItemId | null = null;

  // ---- DOM references ----
  const content = getEl<HTMLDivElement>('content');
  const form = getEl<HTMLElement>('form-panel');
  const fUrl = getEl<HTMLInputElement>('f-url');
  const fTitle = getEl<HTMLInputElement>('f-title');
  const fCategory = getEl<HTMLSelectElement>('f-category');
  const fNewCategory = getEl<HTMLInputElement>('f-new-category');
  const fTags = getEl<HTMLInputElement>('f-tags');
  const fDesc = getEl<HTMLTextAreaElement>('f-desc');
  const formSave = getEl<HTMLButtonElement>('form-save');
  const formCancel = getEl<HTMLButtonElement>('form-cancel');
  const addToggle = getEl<HTMLButtonElement>('add-toggle');
  const formStatus = getEl<HTMLElement>('form-status');
  const searchInput = getEl<HTMLInputElement>('q');
  const searchClear = getEl<HTMLButtonElement>('clear');
  const countEl = getEl<HTMLElement>('count');
  const emptyEl = getEl<HTMLElement>('empty');
  const toastEl = getEl<HTMLElement>('toast');
  const exportBtn = getEl<HTMLButtonElement>('export');
  const importBtn = getEl<HTMLButtonElement>('import');
  const importInput = getEl<HTMLInputElement>('import-input');
  const resetBtn = getEl<HTMLButtonElement>('reset');
  const importTabsBtn = getEl<HTMLButtonElement>('import-tabs');
  const tagFilters = getEl<HTMLDivElement>('tag-filters');

  let activeTag: string | null = null;

  // ---- toast ----
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  function toast(msg: string): void {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), TOAST_DURATION_MS);
  }

  // ---- tag filters ----
  function collectTags(): Map<string, number> {
    const counts = new Map<string, number>();
    state.categories.forEach((c) =>
      c.items.forEach((it) => {
        it.tags.forEach((t) => {
          counts.set(t, (counts.get(t) ?? 0) + 1);
        });
      }),
    );
    return counts;
  }

  function syncPillPressedState(): void {
    tagFilters.querySelectorAll<HTMLButtonElement>('.tag-pill').forEach((b) => {
      const isActive = b.dataset['tag'] === activeTag;
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function renderTagFilters(): void {
    tagFilters.innerHTML = '';
    const counts = collectTags();
    if (counts.size === 0) return;

    const sorted = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    sorted.forEach(([tag, count]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-pill';
      btn.textContent = tag;
      btn.dataset['tag'] = tag;
      btn.setAttribute('aria-pressed', activeTag === tag ? 'true' : 'false');

      const countEl = document.createElement('span');
      countEl.className = 'tag-count';
      countEl.textContent = String(count);
      btn.appendChild(countEl);

      // Toggle in-place rather than re-rendering the row, so keyboard focus
      // is preserved on the pill the user activated (WCAG 2.4.3 / 2.4.7).
      btn.addEventListener('click', () => {
        activeTag = activeTag === tag ? null : tag;
        syncPillPressedState();
        refreshFilter();
      });
      tagFilters.appendChild(btn);
    });
  }

  // ---- rendering ----
  function render(): void {
    content.innerHTML = '';
    state.categories.forEach((cat) => {
      const section = document.createElement('section');
      section.dataset['catId'] = cat.id;
      section.dataset['catTitle'] = cat.title.toLowerCase();
      section.setAttribute('aria-labelledby', `cat-${cat.id}`);

      section.appendChild(renderCategoryHeader(cat));

      const ul = document.createElement('ul');
      cat.items.forEach((item) => ul.appendChild(renderItem(item, cat)));
      section.appendChild(ul);
      content.appendChild(section);
    });
    renderTagFilters();
    refreshFilter();
  }

  function renderCategoryHeader(cat: Category): HTMLElement {
    const head = document.createElement('div');
    head.className = 'cat-header';

    const h2 = document.createElement('h2');
    h2.id = `cat-${cat.id}`;
    h2.textContent = cat.title;
    head.appendChild(h2);

    const actions = document.createElement('div');
    actions.className = 'cat-actions';

    const renameBtn = document.createElement('button');
    renameBtn.className = 'ghost';
    renameBtn.type = 'button';
    renameBtn.textContent = 'Rename';
    renameBtn.setAttribute('aria-label', `Rename category ${cat.title}`);
    renameBtn.addEventListener('click', () => beginRenameCategory(cat));

    const delBtn = document.createElement('button');
    delBtn.className = 'ghost danger';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('aria-label', `Delete category ${cat.title}`);
    delBtn.addEventListener('click', () => deleteCategory(cat.id));

    actions.appendChild(renameBtn);
    actions.appendChild(delBtn);
    head.appendChild(actions);

    return head;
  }

  function beginRenameCategory(cat: Category): void {
    const head = content.querySelector<HTMLElement>(
      `section[data-cat-id="${cat.id}"] .cat-header`,
    );
    if (!head) return;
    const oldH2 = head.querySelector<HTMLHeadingElement>('h2');
    if (!oldH2) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cat-rename-input';
    input.value = cat.title;
    input.setAttribute('aria-label', 'New category title');

    let committed = false;
    const commit = (save: boolean): void => {
      if (committed) return;
      committed = true;
      if (save) {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== cat.title) {
          cat.title = newTitle;
          saveState(state);
        }
      }
      render();
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        commit(false);
      }
    });
    input.addEventListener('blur', () => commit(true));

    oldH2.replaceWith(input);
    input.focus();
    input.select();
  }

  function deleteCategory(id: CategoryId): void {
    const cat = state.categories.find((c) => c.id === id);
    if (!cat) return;
    const itemCount = cat.items.length;
    const msg =
      itemCount > 0
        ? `Delete "${cat.title}" and its ${itemCount} link${itemCount === 1 ? '' : 's'}?`
        : `Delete "${cat.title}"?`;
    if (!confirm(msg)) return;
    state.categories = state.categories.filter((c) => c.id !== id);
    saveState(state);
    render();
    toast(`Deleted category "${cat.title}".`);
  }

  function renderItem(item: Item, cat: Category): HTMLLIElement {
    const li = document.createElement('li');
    li.dataset['itemId'] = item.id;
    if (!item.url) li.classList.add('is-note');

    const titleEl = document.createElement('span');
    titleEl.className = 'item-title';
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = item.title;
      titleEl.appendChild(a);
    } else {
      titleEl.textContent = item.title;
    }
    item.tags.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      titleEl.appendChild(span);
    });
    li.appendChild(titleEl);

    if (item.desc) {
      const desc = document.createElement('span');
      desc.className = 'desc';
      desc.textContent = item.desc;
      li.appendChild(desc);
    }

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'ghost';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', `Edit ${item.title}`);
    editBtn.addEventListener('click', () => openForm(item, cat));

    const delBtn = document.createElement('button');
    delBtn.className = 'ghost danger';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('aria-label', `Delete ${item.title}`);
    delBtn.addEventListener('click', () => deleteItem(item.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    li.dataset['searchText'] = (
      item.title +
      ' ' +
      item.url +
      ' ' +
      item.desc +
      ' ' +
      item.tags.join(' ') +
      ' ' +
      cat.title
    ).toLowerCase();
    li.dataset['tags'] = item.tags.join('||');

    return li;
  }

  // ---- form (a11y disclosure pattern) ----
  function refreshCategoryOptions(selectedId: string | null): void {
    fCategory.innerHTML = '';
    state.categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.title;
      if (c.id === selectedId) opt.selected = true;
      fCategory.appendChild(opt);
    });
  }

  // ---- form error helpers (WCAG 3.3.1 / 3.3.3 / 4.1.3) ----
  // setFormError points each invalid input's aria-describedby at the visible
  // error message so SRs hear it on focus; role=alert on form-status announces
  // it immediately on insertion.
  function setFormError(msg: string): void {
    formStatus.textContent = msg;
    fUrl.setAttribute('aria-invalid', 'true');
    fTitle.setAttribute('aria-invalid', 'true');
    fUrl.setAttribute('aria-describedby', 'f-url-help form-status');
    fTitle.setAttribute('aria-describedby', 'f-title-help form-status');
  }

  function clearFormError(): void {
    formStatus.textContent = '';
    fUrl.removeAttribute('aria-invalid');
    fTitle.removeAttribute('aria-invalid');
    fUrl.setAttribute('aria-describedby', 'f-url-help');
    fTitle.setAttribute('aria-describedby', 'f-title-help');
  }

  function openForm(item: Item | null, cat: Category | undefined): void {
    editingId = item ? item.id : null;
    const fallbackCatId = cat ? cat.id : (state.categories[0]?.id ?? null);
    refreshCategoryOptions(fallbackCatId);
    fUrl.value = item?.url ?? '';
    fTitle.value = item?.title ?? '';
    fNewCategory.value = '';
    fTags.value = item ? item.tags.join(', ') : '';
    fDesc.value = item?.desc ?? '';
    clearFormError();

    form.hidden = false;
    addToggle.setAttribute('aria-expanded', 'true');
    addToggle.textContent = editingId ? 'Editing…' : 'Adding…';
    requestAnimationFrame(() => fUrl.focus());
  }

  function closeForm(restoreFocus = true): void {
    form.hidden = true;
    editingId = null;
    addToggle.setAttribute('aria-expanded', 'false');
    addToggle.textContent = '+ Add link';
    if (restoreFocus) addToggle.focus();
  }

  function saveForm(): void {
    const url = fUrl.value.trim();
    let title = fTitle.value.trim();
    const newCat = fNewCategory.value.trim();
    const tags = fTags.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const desc = fDesc.value.trim();

    if (!title && !url) {
      setFormError('Add either a URL or a title to save this link.');
      fUrl.focus();
      return;
    }

    if (!title) {
      try {
        title = new URL(url).hostname.replace(/^www\./, '');
      } catch {
        title = url;
      }
    }

    let targetCat: Category;
    if (newCat) {
      targetCat = { id: uid<CategoryId>(), title: newCat, items: [] };
      state.categories.push(targetCat);
    } else {
      const found = state.categories.find((c) => c.id === fCategory.value);
      const fallback = state.categories[0];
      if (found) {
        targetCat = found;
      } else if (fallback) {
        targetCat = fallback;
      } else {
        targetCat = { id: uid<CategoryId>(), title: 'Untitled', items: [] };
        state.categories.push(targetCat);
      }
    }

    if (editingId) {
      const id = editingId;
      state.categories.forEach((c) => {
        const idx = c.items.findIndex((it) => it.id === id);
        if (idx >= 0) {
          const existing = c.items[idx]!;
          c.items.splice(idx, 1);
          targetCat.items.unshift({ ...existing, url, title, tags, desc });
        }
      });
      pruneEmptyCategories();
      toast('Updated.');
    } else {
      targetCat.items.unshift({ id: uid<ItemId>(), url, title, tags, desc });
      toast('Saved.');
    }

    saveState(state);
    render();
    closeForm();
  }

  function pruneEmptyCategories(): void {
    // Categories are user-owned: empty ones disappear. The seed is a starting
    // suggestion, not a permanent structure.
    state.categories = state.categories.filter((c) => c.items.length > 0);
  }

  function deleteItem(id: ItemId): void {
    if (!confirm('Delete this link?')) return;
    state.categories.forEach((c) => {
      const idx = c.items.findIndex((it) => it.id === id);
      if (idx >= 0) c.items.splice(idx, 1);
    });
    saveState(state);
    render();
    toast('Deleted.');
  }

  formSave.addEventListener('click', saveForm);
  formCancel.addEventListener('click', () => closeForm());
  addToggle.addEventListener('click', () => {
    if (form.hidden) {
      openForm(null, state.categories[0]);
    } else {
      closeForm();
    }
  });

  // Clear validation state as soon as the user starts fixing the field.
  [fUrl, fTitle].forEach((el) => {
    el.addEventListener('input', () => {
      if (formStatus.textContent) clearFormError();
    });
  });

  // Escape closes the form when focus is inside.
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeForm();
    }
  });

  // ---- search ----
  function refreshFilter(): void {
    filter(searchInput.value);
  }

  function filter(query: string): void {
    const q = query.trim().toLowerCase();
    const sections = Array.from(content.querySelectorAll('section'));
    let total = 0;
    sections.forEach((section) => {
      const items = Array.from(section.querySelectorAll('li'));
      let sectionMatches = 0;
      items.forEach((li) => {
        const text = li.dataset['searchText'] ?? '';
        const catTitle = (section as HTMLElement).dataset['catTitle'] ?? '';
        const tagsCsv = li.dataset['tags'] ?? '';
        const matchesQuery = !q || text.includes(q) || catTitle.includes(q);
        const matchesTag =
          !activeTag || tagsCsv.split('||').includes(activeTag);
        const match = matchesQuery && matchesTag;
        li.classList.toggle('hidden', !match);
        if (match) sectionMatches++;
      });
      section.classList.toggle('hidden', sectionMatches === 0);
      total += sectionMatches;
    });
    const isFiltering = q.length > 0 || activeTag !== null;
    searchClear.classList.toggle('visible', q.length > 0);
    emptyEl.classList.toggle('visible', isFiltering && total === 0);
    countEl.textContent = isFiltering
      ? `${total} match${total === 1 ? '' : 'es'}`
      : '';
  }

  searchInput.addEventListener('input', (e) => filter((e.target as HTMLInputElement).value));
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    filter('');
    searchInput.focus();
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.value) {
      searchInput.value = '';
      filter('');
    }
  });

  // ---- export ----
  exportBtn.addEventListener('click', exportJson);

  function exportJson(): void {
    const cleanState: State = {
      categories: state.categories.map((c) => ({
        id: c.id,
        title: c.title,
        items: c.items.map((it) => ({
          id: it.id,
          url: it.url,
          title: it.title,
          tags: [...it.tags],
          desc: it.desc,
        })),
      })),
    };
    const blob = new Blob([JSON.stringify(cleanState, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `saved-links-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Exported JSON.');
  }

  // ---- import ----
  importBtn.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      if (!isState(data)) throw new Error('Invalid format: expected { categories: [...] }');
      state = withIds(data);
      saveState(state);
      render();
      const total = state.categories.reduce((n, c) => n + c.items.length, 0);
      toast(`Imported ${total} links.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast(`Import failed: ${msg}`);
    } finally {
      target.value = '';
    }
  });

  function isState(data: unknown): data is State {
    return (
      typeof data === 'object' &&
      data !== null &&
      Array.isArray((data as { categories?: unknown }).categories)
    );
  }

  // ---- reset ----
  resetBtn.addEventListener('click', () => {
    if (!confirm('Discard all your changes and restore the original seed?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = withIds(JSON.parse(JSON.stringify(SEED)) as State);
    render();
    toast('Reset to seed.');
  });

  // ---- public API for extension ----
  const api: SavedLinksApi = {
    bulkAdd(tabs, options) {
      const targetTitle = options?.categoryTitle ?? 'Imported';

      const existingUrls = new Set<string>();
      state.categories.forEach((c) => c.items.forEach((i) => i.url && existingUrls.add(i.url)));

      let added = 0;
      let skipped = 0;
      let ignored = 0;
      const newItems: Item[] = [];

      tabs.forEach((t) => {
        const url = t.url;
        if (!url) {
          ignored++;
          return;
        }
        if (SKIP_PREFIXES.some((p) => url.startsWith(p))) {
          ignored++;
          return;
        }
        if (existingUrls.has(url)) {
          skipped++;
          return;
        }
        let title = t.title;
        if (!title) {
          try {
            title = new URL(url).hostname.replace(/^www\./, '');
          } catch {
            title = url;
          }
        }
        newItems.push({ id: uid<ItemId>(), url, title, tags: [], desc: '' });
        existingUrls.add(url);
        added++;
      });

      if (newItems.length === 0) {
        toast(`Nothing new. Skipped ${skipped} dupes, ignored ${ignored}.`);
        return { added: 0, skipped, ignored };
      }

      let cat = state.categories.find((c) => c.title === targetTitle);
      if (!cat) {
        cat = { id: uid<CategoryId>(), title: targetTitle, items: [] };
        state.categories.unshift(cat);
      }
      cat.items.unshift(...newItems);

      saveState(state);
      render();
      toast(`Added ${added}, skipped ${skipped} dupes, ignored ${ignored}.`);
      return { added, skipped, ignored };
    },
  };

  window.savedLinks = api;

  // ---- import current window's tabs (page-context, reliable) ----
  async function importCurrentWindowTabs(): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      toast('Open this page from the extension to import tabs.');
      return;
    }
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const payload: TabRef[] = tabs.map((t) => ({ url: t.url, title: t.title }));
      api.bulkAdd(payload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast(`Import failed: ${msg}`);
    }
  }

  importTabsBtn.addEventListener('click', () => {
    void importCurrentWindowTabs();
  });

  // If we were opened with ?action=import-current-window (from the keyboard
  // shortcut), run the import once the page is ready, then strip the param so
  // a refresh doesn't re-import.
  const params = new URLSearchParams(window.location.search);
  if (params.get('action') === 'import-current-window') {
    history.replaceState(null, '', window.location.pathname);
    void importCurrentWindowTabs();
  }

  // ---- boot ----
  saveState(state);
  render();
})();
