// Saved Links — extension service worker.
// Compiled from src/background.ts to ../background.js by tsc.

const SAVED_LINKS_URL = chrome.runtime.getURL('links.html');

async function findOrOpenSavedLinksTab(): Promise<chrome.tabs.Tab> {
  const allTabs = await chrome.tabs.query({});
  const existing = allTabs.find((t) => t.url === SAVED_LINKS_URL);

  if (existing && existing.id !== undefined) {
    await chrome.tabs.update(existing.id, { active: true });
    if (existing.windowId !== undefined) {
      await chrome.windows.update(existing.windowId, { focused: true });
    }
    return existing;
  }

  const created = await chrome.tabs.create({ url: SAVED_LINKS_URL, active: true });
  await waitForTabComplete(created.id);
  return created;
}

function waitForTabComplete(tabId: number | undefined): Promise<void> {
  if (tabId === undefined) return Promise.resolve();
  return new Promise((resolve) => {
    const listener = (id: number, info: chrome.tabs.TabChangeInfo) => {
      if (id === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function sendCurrentWindowTabsToSavedLinks(): Promise<void> {
  // Open or focus the saved-links page with an action query param.
  // The page itself reads the param on load and does the import in its
  // own context — eliminates the executeScript race entirely.
  const triggerUrl = SAVED_LINKS_URL + '?action=import-current-window';
  const allTabs = await chrome.tabs.query({});
  const existing = allTabs.find(
    (t) => typeof t.url === 'string' && t.url.startsWith(SAVED_LINKS_URL),
  );

  if (existing && existing.id !== undefined) {
    await chrome.tabs.update(existing.id, { active: true, url: triggerUrl });
    if (existing.windowId !== undefined) {
      await chrome.windows.update(existing.windowId, { focused: true });
    }
    return;
  }

  await chrome.tabs.create({ url: triggerUrl, active: true });
}

chrome.action.onClicked.addListener(() => {
  findOrOpenSavedLinksTab().catch((err) => console.error('open Saved Links failed:', err));
});

chrome.commands?.onCommand.addListener((command) => {
  switch (command) {
    case 'open-saved-links':
      findOrOpenSavedLinksTab().catch((err) =>
        console.error('open-saved-links failed:', err),
      );
      break;
    case 'send-tabs-to-saved-links':
      sendCurrentWindowTabsToSavedLinks().catch((err) =>
        console.error('send-tabs-to-saved-links failed:', err),
      );
      break;
    default:
      // Unknown command — no-op.
      break;
  }
});
