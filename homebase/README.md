# HomeBase - Chrome Extension

A beautiful, customizable HomeBase that replaces your new tab with organized bookmarks, themes, and search functionality.

## Features

- **Bookmark Management**: Organize links into custom categories
- **5 Beautiful Themes**: Choose from Elegant Midnight, Modern Tech, Soft Pastel, and more
- **Smart Search**: Find links instantly with real-time filtering
- **Drag & Drop**: Reorder links and move between categories
- **Responsive Design**: Works perfectly on desktop and mobile
- **Fully Accessible**: Keyboard navigation and screen reader support
- **Persistent Storage**: Never lose your data - uses Chrome's storage API

## Standalone HomeBase Features

**Data Persistence Guaranteed:**

- Uses localStorage - Your browser's built-in storage that persists between sessions
- No internet required - Works completely offline
- Automatic saving - Every change (add, edit, delete, reorder) is saved immediately
- Browser storage - Data stays until you manually clear it

**What Protects Your Data:**

- localStorage is persistent and survives:
- Browser restarts
- Computer reboots
- Browser updates
- Power outages
- Internet disconnections

**Extra Safety Features:**

- Export function - Download backup files anytime
- Import function - Restore from backups if needed
- Data validation - Checks data integrity on load

**Bottom Line:**

Your links are as safe as your browser bookmarks - they'll persist indefinitely unless you intentionally delete them. The standalone page is actually more reliable than cloud-based solutions since it doesn't depend on external services or internet connectivity.
**Pro tip:** Export your data periodically as a backup file for extra peace of mind.

**All Original Features:**¬

- 5 beautiful themes
- Drag & drop link organization
- Search functionality
- Category management
- Responsive design

**How to Use:**

- Save the file as home-base.html on your computer
- Double-click to open it in any browser
- Bookmark the page for easy access
- Set as homepage if you want it to load automatically

**Data Safety:**

- Your links are stored in your browser's localStorage
- Export regularly to create backup files
- Keep backup files safe - they contain all your bookmarks
- Import feature lets you restore everything instantly

**Pro Tips:**

- Bookmark this page in your browser's bookmarks bar
- Export your data after adding many links
- Set as homepage in your browser settings
- Works in any modern browser (Chrome, Firefox, Safari, Edge)

Your data will never be lost as long as you don't clear your browser's storage, and with the export feature, you can always create backups for extra safety!

## Installation

1. **Enable Developer Mode**:
   - Go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right

2. **Load Extension**:
   - Click "Load unpacked"
   - Select this folder
   - Your HomeBase will now appear on new tabs!

## Usage

### Adding Bookmarks

1. Fill in the title and URL
2. Choose an existing category or create a new one
3. Click "Add Bookmark"

### Organizing Links

- **Drag & Drop**: Move links within categories or between categories
- **Edit**: Click the pencil icon to modify links
- **Delete**: Click the × icon to remove links
- **Categories**: Edit or delete entire categories

### Customizing Themes

1. **Select Theme**: Choose from 5 built-in themes in the sidebar
2. **Custom Colors**: Map any theme color to page elements
3. **Save Theme**: Save your custom color combinations

### Searching

- Use the search bar to find links by title, URL, or category
- Press `Ctrl+F` to quickly focus the search
- Press `Escape` to clear search

## Keyboard Shortcuts

- **Ctrl/Cmd + F**: Focus search bar
- **Escape**: Clear search (when search is focused)
- **Tab**: Navigate through all interactive elements
- **Enter/Space**: Activate buttons and links

## Technical Details

### Storage

- Uses Chrome's `chrome.storage.local` API for reliable data persistence
- Automatically syncs across devices when signed into Chrome
- Falls back to localStorage for standalone use¬

### Permissions

- **storage**: Required to save bookmarks and settings
- **chrome_url_overrides**: Required to replace new tab page

### Content Security Policy

- Implements strict CSP for enhanced security
- All scripts are loaded from extension's origin
- No inline scripts allowed

### Files

- `manifest.json`: Extension configuration and CSP settings
- `home-base.html`: Main HomeBase interface
- `standalone-homebase.html`: Standalone version with all code embedded
- `script.js`: All JavaScript functionality
- `icons/`: Extension icons for Chrome interface
  - `icon16.png`: 16×16 pixels (toolbar)
  - `icon48.png`: 48×48 pixels (extension page)
  - `icon128.png`: 128×128 pixels (Chrome Web Store)

## License

Created by [Mirabelle Doiron](https://mirabelledoiron.com/) - Feel free to customize for personal use.

**Enjoy your beautiful, organized HomeBase!**
