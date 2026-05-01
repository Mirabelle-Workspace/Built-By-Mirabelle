// Background service worker for HomeBase Chrome Extension
// Created by Mirabelle Doiron

// Installation and update handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('HomeBase extension installed successfully!');

        // Set default settings on first install
        chrome.storage.local.set({
            'selectedTheme': 'Elegant Midnight',
            'sidebarCollapsed': 'false',
            'extensionVersion': '1.0.0'
        }).then(() => {
            console.log('Default settings applied');
        });

        // Optional: Show welcome notification
        chrome.action.setBadgeText({ text: 'NEW' });
        chrome.action.setBadgeBackgroundColor({ color: '#E0A458' });

        // Remove badge after 5 seconds
        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 5000);

    } else if (details.reason === 'update') {
        const previousVersion = details.previousVersion;
        console.log(`HomeBase extension updated from version ${previousVersion} to 1.0.0`);

        // Handle any migration logic here if needed in future versions
        chrome.storage.local.set({
            'extensionVersion': '1.0.0'
        });
    }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('HomeBase extension started');
});

// Handle messages from HomeBase
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getExtensionInfo':
            sendResponse({
                name: chrome.runtime.getManifest().name,
                version: chrome.runtime.getManifest().version,
                author: chrome.runtime.getManifest().author
            });
            break;

        case 'exportData':
            // Export all stored data for backup
            chrome.storage.local.get(null).then((data) => {
                const exportData = {
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    data: data
                };
                sendResponse({ success: true, exportData: exportData });
            }).catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
            return true; // Keep message channel open for async response

        case 'importData':
            // Import data from backup
            if (request.importData && request.importData.data) {
                chrome.storage.local.set(request.importData.data).then(() => {
                    sendResponse({ success: true, message: 'Data imported successfully' });
                }).catch((error) => {
                    sendResponse({ success: false, error: error.message });
                });
                return true;
            } else {
                sendResponse({ success: false, error: 'Invalid import data' });
            }
            break;

        case 'clearAllData':
            // Clear all extension data (for reset functionality)
            chrome.storage.local.clear().then(() => {
                sendResponse({ success: true, message: 'All data cleared' });
            }).catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
            return true;

        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Optional: Handle keyboard shortcuts (if you want to add them)
chrome.commands?.onCommand.addListener((command) => {
    switch (command) {
        case 'open-homebase':
            // This would open HomeBase in new tab (though it's already the default)
            chrome.tabs.create({ url: chrome.runtime.getURL('home-base.html') });
            break;
    }
});

// Keep service worker alive for critical operations
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

// Error handling
chrome.runtime.onSuspend?.addListener(() => {
    console.log('HomeBase extension suspended');
});

// Handle uninstall (cleanup if needed)
chrome.runtime.setUninstallURL('https://builtbymirabelle.com/products/homebase', () => {
    console.log('Uninstall URL set');
});