// HomeBase - Main JavaScript
// Created by Mirabelle Doiron

// Set current year in footer
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

const themes = {
    "Minimalist Neutral": {
        "--primary": "#2E2E2E",
        "--secondary": "#B0B0B0",
        "--accent": "#FF6B6B",
        "--background": "#FFFFFF",
        "--text": "#1A1A1A"
    },
    "Elegant Midnight": {
        "--primary": "#0D1B2A",
        "--secondary": "#1B263B",
        "--accent": "#E0A458",
        "--background": "#F4F4F4",
        "--text": "#0D1B2A"
    },
    "Soft Pastel": {
        "--primary": "#A3D2CA",
        "--secondary": "#F7D9D9",
        "--accent": "#FFB085",
        "--background": "#FFFFFF",
        "--text": "#444444"
    },
    "Modern Tech": {
        "--primary": "#0F4C81",
        "--secondary": "#1B9AAA",
        "--accent": "#F5A623",
        "--background": "#F2F2F2",
        "--text": "#222222"
    },
    "Earthy Organic": {
        "--primary": "#6A994E",
        "--secondary": "#A7C957",
        "--accent": "#BC4749",
        "--background": "#FDF0D5",
        "--text": "#1B1B1E"
    }
};

const mappings = {
    "pageBgSelect": "--page-bg",
    "cardBgSelect": "--card-bg",
    "headerColorSelect": "--header-color",
    "textColorSelect": "--text-color"
};

// Enhanced Chrome Extension Storage (with localStorage fallback)
const SafeStorage = (() => {
    let memoryStorage = {};
    let isExtension = false;
    let hasShownWarning = false;

    // Check if we're running as a Chrome extension
    try {
        isExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
    } catch (e) {
        isExtension = false;
    }

    return {
        setItem: async (key, value) => {
            try {
                if (isExtension) {
                    await chrome.storage.local.set({ [key]: value });
                } else {
                    // Fallback to localStorage for standalone use
                    try {
                        localStorage.setItem(key, value);
                    } catch (e) {
                        memoryStorage[key] = value;
                    }
                }
            } catch (e) {
                memoryStorage[key] = value;
            }
        },

        getItem: async (key) => {
            try {
                if (isExtension) {
                    const result = await chrome.storage.local.get([key]);
                    return result[key] || null;
                } else {
                    // Fallback to localStorage for standalone use
                    try {
                        return localStorage.getItem(key);
                    } catch (e) {
                        return memoryStorage[key] || null;
                    }
                }
            } catch (e) {
                return memoryStorage[key] || null;
            }
        },

        removeItem: async (key) => {
            try {
                if (isExtension) {
                    await chrome.storage.local.remove([key]);
                } else {
                    // Fallback to localStorage for standalone use
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        delete memoryStorage[key];
                    }
                }
            } catch (e) {
                delete memoryStorage[key];
            }
        },

        // Utility method to check if persistent storage is available
        isPersistent: () => isExtension || (typeof Storage !== 'undefined'),

        // Get all data (useful for export functionality)
        getAllData: async () => {
            try {
                if (isExtension) {
                    return await chrome.storage.local.get(null);
                } else {
                    try {
                        const data = {};
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            data[key] = localStorage.getItem(key);
                        }
                        return data;
                    } catch (e) {
                        return { ...memoryStorage };
                    }
                }
            } catch (e) {
                return { ...memoryStorage };
            }
        },

        // Check if running as extension
        isExtension: () => isExtension
    };
})();

// Search and Filter functionality
let currentSearchTerm = '';

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterLinks();
        updateSearchStats();

        // Show/hide clear button based on content
        clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
    });

    clearBtn.addEventListener('click', () => {
        clearSearch();
    });

    // Keyboard shortcuts and accessibility
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    // Global keyboard shortcut: Ctrl+F or Cmd+F to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }

        // Escape key globally clears search if search is focused
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            clearSearch();
        }
    });

    // Initialize clear button visibility
    clearBtn.style.display = 'none';
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    searchInput.value = '';
    currentSearchTerm = '';
    clearBtn.style.display = 'none';
    filterLinks();
    updateSearchStats();
    searchInput.focus();
}

function filterLinks() {
    const categories = document.querySelectorAll('.category-card');
    let visibleCategories = 0;
    let visibleLinks = 0;
    let totalLinks = 0;

    categories.forEach(category => {
        const links = category.querySelectorAll('.link-grid a');
        let hasVisibleLinks = false;

        links.forEach(link => {
            totalLinks++;
            const title = link.textContent.toLowerCase();
            const url = link.href.toLowerCase();
            const categoryName = category.querySelector('h2').textContent.toLowerCase();

            const isVisible = currentSearchTerm === '' ||
                title.includes(currentSearchTerm) ||
                url.includes(currentSearchTerm) ||
                categoryName.includes(currentSearchTerm);

            if (isVisible) {
                link.classList.remove('hidden');
                hasVisibleLinks = true;
                visibleLinks++;
                highlightSearchTerm(link, currentSearchTerm);
            } else {
                link.classList.add('hidden');
            }
        });

        if (hasVisibleLinks || currentSearchTerm === '') {
            category.classList.remove('hidden');
            visibleCategories++;
        } else {
            category.classList.add('hidden');
        }
    });

    // Update search statistics
    updateSearchStats(visibleLinks, totalLinks, visibleCategories);
}

function highlightSearchTerm(linkElement, searchTerm) {
    if (!searchTerm) return;

    const titleElement = linkElement.childNodes[0]; // First text node
    if (titleElement && titleElement.nodeType === Node.TEXT_NODE) {
        const originalText = titleElement.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');

        if (highlightedText !== originalText) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = highlightedText;

            // Replace text node with highlighted content
            while (tempDiv.firstChild) {
                titleElement.parentNode.insertBefore(tempDiv.firstChild, titleElement);
            }
            titleElement.remove();
        }
    }
}

function updateSearchStats(visibleLinks = 0, totalLinks = 0, visibleCategories = 0) {
    const statsElement = document.getElementById('searchStats');

    if (currentSearchTerm) {
        statsElement.style.display = 'block';
        statsElement.textContent = `Found ${visibleLinks} of ${totalLinks} links in ${visibleCategories} categories`;
    } else {
        statsElement.style.display = 'none';
    }
}

// Enhanced Drag and Drop functionality
let draggedLink = null;
let draggedData = null;
let draggedFromCategory = null;

function initDragAndDrop() {
    // Global drag event listeners
    document.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
    });
}

function makeElementDraggable(linkElement, linkData) {
    linkElement.draggable = true;

    // Add drag handle
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.setAttribute('aria-label', `Drag to reorder ${linkData.title}`);
    dragHandle.title = 'Drag to reorder or move to another category';
    dragHandle.setAttribute('role', 'button');
    dragHandle.setAttribute('tabindex', '0');
    linkElement.appendChild(dragHandle);

    // Add keyboard support for drag handle
    dragHandle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Could implement keyboard-based moving here
            // For now, just inform user to use mouse
            alert('Use mouse to drag and drop links. Keyboard reordering coming soon!');
        }
    });

    linkElement.addEventListener('dragstart', (e) => {
        draggedLink = linkElement;
        draggedData = { ...linkData }; // Create a copy
        draggedFromCategory = linkData.category;
        linkElement.classList.add('dragging');

        // Store data for the drop event
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(linkData));

        console.log('Drag started:', linkData.title);
    });

    linkElement.addEventListener('dragend', (e) => {
        linkElement.classList.remove('dragging');

        // Clean up all drag-over effects
        document.querySelectorAll('.link-grid').forEach(grid => {
            grid.classList.remove('drag-over');
        });
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });

        // Reset drag state after a short delay to allow drop event to complete
        setTimeout(() => {
            draggedLink = null;
            draggedData = null;
            draggedFromCategory = null;
        }, 100);
    });
}

function makeGridDroppable(gridElement, category) {
    gridElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedData) {
            gridElement.classList.add('drag-over');

            // For same-category drops, show insertion point
            if (draggedFromCategory === category) {
                updateDropIndicator(gridElement, e.clientX, e.clientY);
            } else {
                // For cross-category drops, show general drop zone
                const existingIndicator = gridElement.querySelector('.drop-indicator');
                if (!existingIndicator) {
                    const dropIndicator = document.createElement('div');
                    dropIndicator.className = 'drop-indicator';
                    dropIndicator.style.cssText = `
            grid-column: 1 / -1;
            height: 4px;
            background: var(--accent);
            border-radius: 2px;
            margin: 8px 0;
            opacity: 0.7;
            animation: pulse 1s infinite alternate;
          `;
                    gridElement.appendChild(dropIndicator);
                }
            }
        }
    });

    gridElement.addEventListener('dragleave', (e) => {
        // Only remove styles if we're actually leaving the grid
        const rect = gridElement.getBoundingClientRect();
        const isOutside = e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom;

        if (isOutside) {
            gridElement.classList.remove('drag-over');
            const indicator = gridElement.querySelector('.drop-indicator');
            if (indicator) indicator.remove();
        }
    });

    gridElement.addEventListener('drop', async (e) => {
        e.preventDefault();
        gridElement.classList.remove('drag-over');

        // Remove drop indicator
        const indicator = gridElement.querySelector('.drop-indicator');
        if (indicator) indicator.remove();

        if (draggedData && draggedData.title) {
            console.log(`Dropping "${draggedData.title}" into "${category}" category`);

            // Find the original link index
            const originalIndex = savedLinks.findIndex(link =>
                link.title === draggedData.title &&
                link.url === draggedData.url &&
                link.category === draggedData.category
            );

            if (originalIndex !== -1) {
                // Remove the original link
                const linkToMove = savedLinks.splice(originalIndex, 1)[0];

                // Update category
                linkToMove.category = category;

                if (draggedFromCategory === category) {
                    // Same category - calculate insertion position
                    const insertIndex = calculateInsertionIndex(gridElement, e.clientX, e.clientY, category);

                    // Find the actual index in the full savedLinks array
                    const categoryStartIndex = savedLinks.findIndex(link => link.category === category);
                    const actualInsertIndex = categoryStartIndex === -1 ? savedLinks.length : categoryStartIndex + insertIndex;

                    savedLinks.splice(actualInsertIndex, 0, linkToMove);
                    console.log(`Reordered within "${category}" at position ${insertIndex}`);
                } else {
                    // Different category - add at the end of that category
                    const categoryLinks = savedLinks.filter(link => link.category === category);
                    const lastCategoryIndex = savedLinks.map(link => link.category).lastIndexOf(category);
                    const insertIndex = lastCategoryIndex === -1 ? savedLinks.length : lastCategoryIndex + 1;

                    savedLinks.splice(insertIndex, 0, linkToMove);
                    console.log(`Moved from "${draggedFromCategory}" to "${category}"`);
                }

                // Save and re-render
                await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
                renderLinks();
            } else {
                console.error('Could not find original link to move');
            }
        }
    });
}

function updateDropIndicator(gridElement, mouseX, mouseY) {
    // Remove existing indicator
    const existingIndicator = gridElement.querySelector('.drop-indicator');
    if (existingIndicator) existingIndicator.remove();

    // Find the best insertion point
    const links = Array.from(gridElement.children).filter(child =>
        child.tagName === 'DIV' && !child.classList.contains('drop-indicator')
    );

    let insertBefore = null;
    let minDistance = Infinity;

    // Calculate distances to each link
    links.forEach(link => {
        const rect = link.getBoundingClientRect();
        const linkCenterX = rect.left + rect.width / 2;
        const linkCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(mouseX - linkCenterX, 2) + Math.pow(mouseY - linkCenterY, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            // Determine if we should insert before or after this link
            const isLeftSide = mouseX < linkCenterX;
            const isTopSide = mouseY < linkCenterY;

            if (isLeftSide || isTopSide) {
                insertBefore = link;
            } else {
                insertBefore = link.nextElementSibling;
            }
        }
    });

    // Create and insert the drop indicator
    const dropIndicator = document.createElement('div');
    dropIndicator.className = 'drop-indicator';
    dropIndicator.style.cssText = `
    width: 4px;
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    opacity: 0.8;
    animation: pulse 1s infinite alternate;
    pointer-events: none;
    z-index: 100;
  `;

    if (insertBefore) {
        gridElement.insertBefore(dropIndicator, insertBefore);
    } else {
        gridElement.appendChild(dropIndicator);
    }
}

function calculateInsertionIndex(gridElement, mouseX, mouseY, category) {
    const links = Array.from(gridElement.children).filter(child =>
        child.tagName === 'DIV' && !child.classList.contains('drop-indicator')
    );

    if (links.length === 0) return 0;

    let insertIndex = links.length; // Default to end
    let minDistance = Infinity;

    links.forEach((link, index) => {
        const rect = link.getBoundingClientRect();
        const linkCenterX = rect.left + rect.width / 2;
        const linkCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(mouseX - linkCenterX, 2) + Math.pow(mouseY - linkCenterY, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            // Determine if we should insert before or after this link
            const isLeftSide = mouseX < linkCenterX;
            const isTopSide = mouseY < linkCenterY;

            if (isLeftSide || isTopSide) {
                insertIndex = index;
            } else {
                insertIndex = index + 1;
            }
        }
    });

    return Math.max(0, Math.min(insertIndex, links.length));
}

async function applyTheme(theme) {
    const vars = themes[theme];
    for (const key in vars) {
        document.documentElement.style.setProperty(key, vars[key]);
    }
    await SafeStorage.setItem("selectedTheme", theme);
    populateMappingOptions(vars);
}

function populateMappingOptions(themeVars) {
    // First, remove ALL existing color-dot-group elements and restore original labels
    document.querySelectorAll('.color-dot-group').forEach(group => group.remove());

    // Restore all original labels to be visible
    document.querySelectorAll('.dot-label').forEach(label => {
        label.style.display = '';
    });

    Object.entries(mappings).forEach(([selectId, cssVar]) => {
        const select = document.getElementById(selectId);
        const label = select.previousElementSibling;

        const group = document.createElement("div");
        group.className = "color-dot-group";

        // Don't hide the original label - just clone it
        const labelClone = label.cloneNode(true);
        select.style.display = "none";
        group.appendChild(labelClone);

        const row = document.createElement("div");
        row.className = "dot-row";

        Object.entries(themeVars).forEach(([key, val]) => {
            const dot = document.createElement("div");
            dot.style.width = "20px";
            dot.style.height = "20px";
            dot.style.borderRadius = "50%";
            dot.style.backgroundColor = val;
            dot.style.border = "1px solid #ccc";
            dot.style.cursor = "pointer";
            dot.title = key.replace("--", "");
            dot.setAttribute("data-color-value", val);
            dot.setAttribute("data-css-var", cssVar);

            row.appendChild(dot);
        });

        group.appendChild(row);
        label.parentNode.insertBefore(group, select.nextSibling);

        // Now hide the original label since we have the clone
        label.style.display = "none";
    });
}

function renderThemeSelector() {
    const container = document.getElementById("themeSelector");
    container.innerHTML = "";
    Object.entries(themes).forEach(([name, vars]) => {
        const wrapper = document.createElement("div");
        wrapper.style.cursor = "pointer";
        wrapper.style.padding = "6px";
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.borderRadius = "6px";
        wrapper.setAttribute("data-theme", name);
        wrapper.setAttribute("data-action", "select-theme");

        const label = document.createElement("div");
        label.textContent = name;
        wrapper.appendChild(label);

        const palette = document.createElement("div");
        palette.className = "theme-palette";
        Object.values(vars).forEach(color => {
            const swatch = document.createElement("div");
            swatch.style.background = color;
            palette.appendChild(swatch);
        });

        wrapper.appendChild(palette);
        container.appendChild(wrapper);
    });
}

function highlightTheme(name) {
    document.querySelectorAll("#themeSelector > div").forEach(div => {
        div.classList.toggle("theme-selected", div.getAttribute("data-theme") === name);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", async () => {
            Object.entries(mappings).forEach(async ([selectId, cssVar]) => {
                const val = document.getElementById(selectId).value;
                document.documentElement.style.setProperty(cssVar, val);
                await SafeStorage.setItem(cssVar, val);
            });
            renderLinks();
        });
    });
});

async function restoreMappings() {
    for (const [id, varName] of Object.entries(mappings)) {
        const val = await SafeStorage.getItem(varName);
        if (val) document.documentElement.style.setProperty(varName, val);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('saveThemeBtn').addEventListener('click', async () => {
        const currentTheme = { name: 'Custom Theme', colors: {} };
        for (const [selectId, cssVar] of Object.entries(mappings)) {
            const val = document.getElementById(selectId).value;
            currentTheme.colors[cssVar] = val;
            await SafeStorage.setItem(cssVar, val);
        }
        await SafeStorage.setItem('customTheme', JSON.stringify(currentTheme));
        const btn = document.getElementById('saveThemeBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Theme Saved!';
        btn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
});

const form = document.getElementById("linkForm");
const container = document.getElementById("categoriesContainer");
const categorySelect = document.getElementById("categorySelect");
const customCategoryInput = document.getElementById("customCategory");
let savedLinks = [];
let savedCategories = [];

// Initialize data from storage
async function initializeData() {
    console.log('🔄 Initializing data...');
    console.log('Is Extension?', SafeStorage.isExtension());
    
    const linksData = await SafeStorage.getItem("customLinksWithCategories");
    const categoriesData = await SafeStorage.getItem("customCategories");

    console.log('Raw linksData from storage:', linksData);
    console.log('Raw categoriesData from storage:', categoriesData);

    savedLinks = linksData ? JSON.parse(linksData) : [];
    savedCategories = categoriesData ? JSON.parse(categoriesData) : [];
    
    console.log('✅ Loaded links:', savedLinks.length, 'categories:', savedCategories.length);
}

function updateCategoryOptions() {
    categorySelect.innerHTML = '<option value="" disabled selected>Choose category</option>';
    
    // Sort categories alphabetically
    const sortedCategories = [...savedCategories].sort((a, b) => {
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
    
    sortedCategories.forEach(cat => categorySelect.appendChild(new Option(cat, cat)));
    categorySelect.appendChild(new Option("+ New category...", "__custom__"));
}

document.addEventListener('DOMContentLoaded', function () {
    categorySelect.addEventListener("change", () => {
        customCategoryInput.style.display = categorySelect.value === "__custom__" ? "block" : "none";
        customCategoryInput.required = categorySelect.value === "__custom__";
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const title = document.getElementById("linkTitle").value.trim();
        const url = document.getElementById("linkURL").value.trim();
        let category = categorySelect.value;
        if (category === "__custom__") {
            category = customCategoryInput.value.trim();
            if (category && !savedCategories.includes(category)) {
                savedCategories.push(category);
                await SafeStorage.setItem("customCategories", JSON.stringify(savedCategories));
                updateCategoryOptions();
            }
        }

        if (title && url && category) {
            savedLinks.push({ title, url, category });
            console.log('💾 Saving new link:', { title, url, category });
            console.log('Total links:', savedLinks.length);
            await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
            console.log('✅ Link saved to storage');
            renderLinks();
            form.reset();
            customCategoryInput.style.display = "none";
            updateCategoryOptions();
        }
    });
});

function groupLinksByCategory(links) {
    const grouped = {};
    links.forEach(link => {
        (grouped[link.category] = grouped[link.category] || []).push(link);
    });
    return grouped;
}

function renderLinks() {
    container.innerHTML = "";
    const grouped = groupLinksByCategory(savedLinks);
    
    // Sort categories alphabetically
    const sortedEntries = Object.entries(grouped).sort((a, b) => {
        return a[0].localeCompare(b[0], undefined, { sensitivity: 'base' });
    });
    
    sortedEntries.forEach(([category, links]) => {
        const card = document.createElement("section");
        card.className = "category-card";
        card.setAttribute("aria-label", `${category} category with ${links.length} links`);

        // Create category header with edit and delete buttons
        const headerDiv = document.createElement("div");
        headerDiv.className = "category-header";

        const h2 = document.createElement("h2");
        h2.textContent = category;
        h2.id = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;
        headerDiv.appendChild(h2);

        const editCategoryBtn = document.createElement("button");
        editCategoryBtn.className = "edit-category";
        editCategoryBtn.innerHTML = "✎";
        editCategoryBtn.setAttribute("aria-label", `Edit category: ${category}`);
        editCategoryBtn.title = `Edit "${category}" category name`;
        editCategoryBtn.setAttribute("data-action", "edit-category");
        editCategoryBtn.setAttribute("data-category", category);
        headerDiv.appendChild(editCategoryBtn);

        const deleteCategoryBtn = document.createElement("button");
        deleteCategoryBtn.className = "delete-category";
        deleteCategoryBtn.innerHTML = "×";
        deleteCategoryBtn.setAttribute("aria-label", `Delete category: ${category}`);
        deleteCategoryBtn.title = `Delete "${category}" category`;
        deleteCategoryBtn.setAttribute("data-action", "delete-category");
        deleteCategoryBtn.setAttribute("data-category", category);
        headerDiv.appendChild(deleteCategoryBtn);

        card.appendChild(headerDiv);

        const grid = document.createElement("div");
        grid.className = "link-grid";
        grid.setAttribute("role", "list");
        grid.setAttribute("aria-labelledby", `category-${category.replace(/\s+/g, '-').toLowerCase()}`);

        // Make grid droppable for drag and drop
        makeGridDroppable(grid, category);

        links.forEach((link, linkIndex) => {
            const linkWrapper = document.createElement("div");
            linkWrapper.style.position = "relative";

            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = link.title;

            // Make link draggable
            makeElementDraggable(a, link);

            const editLinkBtn = document.createElement("button");
            editLinkBtn.className = "edit-link";
            editLinkBtn.innerHTML = "✎";
            editLinkBtn.title = `Edit "${link.title}"`;
            editLinkBtn.setAttribute("data-action", "edit-link");
            editLinkBtn.setAttribute("data-link-title", link.title);
            editLinkBtn.setAttribute("data-link-url", link.url);
            editLinkBtn.setAttribute("data-link-category", link.category);

            const deleteLinkBtn = document.createElement("button");
            deleteLinkBtn.className = "delete-link";
            deleteLinkBtn.innerHTML = "×";
            deleteLinkBtn.title = `Delete "${link.title}"`;
            deleteLinkBtn.setAttribute("data-action", "delete-link");
            deleteLinkBtn.setAttribute("data-link-title", link.title);
            deleteLinkBtn.setAttribute("data-link-url", link.url);
            deleteLinkBtn.setAttribute("data-link-category", link.category);

            a.appendChild(editLinkBtn);
            a.appendChild(deleteLinkBtn);
            linkWrapper.appendChild(a);
            grid.appendChild(linkWrapper);
        });

        card.appendChild(grid);
        container.appendChild(card);
    });

    // Apply current search filter after rendering
    if (currentSearchTerm) {
        filterLinks();
    }
}

function editLink(linkToEdit) {
    const modal = document.createElement("div");
    modal.className = "edit-modal";

    // Sort categories alphabetically for the dropdown
    const sortedCategories = [...savedCategories].sort((a, b) => {
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });

    modal.innerHTML = `
    <div class="edit-modal-content">
      <h3>Edit Link</h3>
      <input type="text" id="editLinkTitle" placeholder="Title" value="${linkToEdit.title}" />
      <input type="url" id="editLinkURL" placeholder="https://example.com" value="${linkToEdit.url}" />
      <select id="editLinkCategory">
        ${sortedCategories.map(cat =>
        `<option value="${cat}" ${cat === linkToEdit.category ? 'selected' : ''}>${cat}</option>`
    ).join('')}
      </select>
      <div class="edit-modal-buttons">
        <button class="cancel-btn" data-action="close-modal">Cancel</button>
        <button class="save-btn" data-action="save-link" data-original-title="${linkToEdit.title}" data-original-url="${linkToEdit.url}" data-original-category="${linkToEdit.category}">Save</button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
    document.getElementById('editLinkTitle').focus();

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    });

    // Close modal with Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Save with Enter key (when not in select)
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'SELECT') {
            const originalTitle = modal.querySelector('[data-action="save-link"]').getAttribute('data-original-title');
            const originalUrl = modal.querySelector('[data-action="save-link"]').getAttribute('data-original-url');
            const originalCategory = modal.querySelector('[data-action="save-link"]').getAttribute('data-original-category');
            saveEditedLink(originalTitle, originalUrl, originalCategory);
        }
    });
}

async function saveEditedLink(originalTitle, originalUrl, originalCategory) {
    const newTitle = document.getElementById('editLinkTitle').value.trim();
    const newUrl = document.getElementById('editLinkURL').value.trim();
    const newCategory = document.getElementById('editLinkCategory').value;

    if (!newTitle || !newUrl || !newCategory) {
        alert('Please fill in all fields');
        return;
    }

    // Find and update the link
    const linkIndex = savedLinks.findIndex(link =>
        link.title === originalTitle && link.url === originalUrl && link.category === originalCategory
    );

    if (linkIndex !== -1) {
        savedLinks[linkIndex] = {
            title: newTitle,
            url: newUrl,
            category: newCategory
        };

        await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
        renderLinks();
        closeEditModal();
    }
}

async function editCategory(categoryToEdit) {
    const newCategoryName = prompt(`Rename category "${categoryToEdit}" to:`, categoryToEdit);

    if (newCategoryName && newCategoryName.trim() && newCategoryName.trim() !== categoryToEdit) {
        const trimmedName = newCategoryName.trim();

        // Check if new name already exists
        if (savedCategories.includes(trimmedName)) {
            alert('A category with that name already exists');
            return;
        }

        // Update all links in this category
        savedLinks = savedLinks.map(link => {
            if (link.category === categoryToEdit) {
                return { ...link, category: trimmedName };
            }
            return link;
        });

        // Update saved categories
        const categoryIndex = savedCategories.indexOf(categoryToEdit);
        if (categoryIndex !== -1) {
            savedCategories[categoryIndex] = trimmedName;
        }

        await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
        await SafeStorage.setItem("customCategories", JSON.stringify(savedCategories));

        updateCategoryOptions();
        renderLinks();
    }
}

// Remove global window functions since we're using event delegation now
function closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.remove();
    }
}

async function deleteLink(linkToDelete) {
    if (confirm(`Are you sure you want to delete "${linkToDelete.title}"?`)) {
        savedLinks = savedLinks.filter(link =>
            !(link.title === linkToDelete.title && link.url === linkToDelete.url && link.category === linkToDelete.category)
        );
        await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
        renderLinks();
    }
}

async function deleteCategory(categoryToDelete) {
    const linksInCategory = savedLinks.filter(link => link.category === categoryToDelete);
    const confirmMessage = `Are you sure you want to delete the "${categoryToDelete}" category and all ${linksInCategory.length} links in it?`;

    if (confirm(confirmMessage)) {
        // Remove all links in this category
        savedLinks = savedLinks.filter(link => link.category !== categoryToDelete);

        // Remove category from saved categories
        savedCategories = savedCategories.filter(cat => cat !== categoryToDelete);

        await SafeStorage.setItem("customLinksWithCategories", JSON.stringify(savedLinks));
        await SafeStorage.setItem("customCategories", JSON.stringify(savedCategories));

        updateCategoryOptions();
        renderLinks();
    }
}

// Event delegation for dynamically created buttons
document.addEventListener('click', function (e) {
    const action = e.target.getAttribute('data-action') || e.target.closest('[data-action]')?.getAttribute('data-action');

    if (action === 'edit-category') {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        editCategory(category);
    } else if (action === 'delete-category') {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        deleteCategory(category);
    } else if (action === 'edit-link') {
        e.preventDefault();
        e.stopPropagation();
        const linkData = {
            title: e.target.getAttribute('data-link-title'),
            url: e.target.getAttribute('data-link-url'),
            category: e.target.getAttribute('data-link-category')
        };
        editLink(linkData);
    } else if (action === 'delete-link') {
        e.preventDefault();
        e.stopPropagation();
        const linkData = {
            title: e.target.getAttribute('data-link-title'),
            url: e.target.getAttribute('data-link-url'),
            category: e.target.getAttribute('data-link-category')
        };
        deleteLink(linkData);
    } else if (action === 'close-modal') {
        e.preventDefault();
        closeEditModal();
    } else if (action === 'save-link') {
        e.preventDefault();
        const originalTitle = e.target.getAttribute('data-original-title');
        const originalUrl = e.target.getAttribute('data-original-url');
        const originalCategory = e.target.getAttribute('data-original-category');
        saveEditedLink(originalTitle, originalUrl, originalCategory);
    } else if (action === 'select-theme') {
        const themeElement = e.target.closest('[data-theme]');
        if (themeElement) {
            const themeName = themeElement.getAttribute('data-theme');
            applyTheme(themeName);
            highlightTheme(themeName);
            renderLinks();
        }
    } else if (e.target.hasAttribute('data-color-value')) {
        // Handle color dot clicks
        const colorValue = e.target.getAttribute('data-color-value');
        const cssVar = e.target.getAttribute('data-css-var');
        document.documentElement.style.setProperty(cssVar, colorValue);
        SafeStorage.setItem(cssVar, colorValue);
        renderLinks();
    }
});

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

async function toggleSidebar() {
    const isCollapsed = sidebar.classList.contains('collapsed');

    if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        toggleBtn.textContent = '‹';
        toggleBtn.title = 'Collapse Sidebar';
        toggleBtn.setAttribute('aria-expanded', 'true');
        await SafeStorage.setItem('sidebarCollapsed', 'false');
    } else {
        sidebar.classList.add('collapsed');
        toggleBtn.textContent = '›';
        toggleBtn.title = 'Expand Sidebar';
        toggleBtn.setAttribute('aria-expanded', 'false');
        await SafeStorage.setItem('sidebarCollapsed', 'true');
    }
}

// Restore sidebar state
async function restoreSidebarState() {
    const isCollapsed = await SafeStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        toggleBtn.textContent = '›';
        toggleBtn.title = 'Expand Sidebar';
        toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
        toggleBtn.setAttribute('aria-expanded', 'true');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    toggleBtn.addEventListener('click', toggleSidebar);
});

// Show status message
function showStatus(message, type = "info") {
    const statusDiv = document.getElementById("statusMessage");
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Export functionality
async function exportData() {
    try {
        console.log('Starting export...');
        
        // If running as extension, get all data directly from chrome.storage
        let appData;
        if (SafeStorage.isExtension()) {
            appData = await chrome.storage.local.get(null);
            console.log('Export - Data from chrome.storage.local:', appData);
        } else {
            appData = await SafeStorage.getAllData();
            console.log('Export - Data from localStorage:', appData);
        }
        
        const exportData = {
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            appName: "HomeBase",
            data: appData,
        };

        console.log('Export - Full export object:', exportData);

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `homebase-backup-${
            new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus("Data exported successfully!", "success");
        console.log('Export completed successfully');
    } catch (error) {
        console.error('Export error:', error);
        showStatus(`Export failed: ${error.message}`, "error");
    }
}

// Import functionality
async function importData() {
    const fileInput = document.getElementById("importFile");
    const file = fileInput.files[0];

    if (!file) {
        showStatus("Please select a file first", "error");
        return;
    }

    console.log('Import - File selected:', file.name);

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            console.log('Import - File read successfully');
            const importedData = JSON.parse(e.target.result);
            console.log('Import - Parsed JSON:', importedData);

            if (!importedData.data) {
                throw new Error("Invalid backup file format - missing 'data' property");
            }

            console.log('Import - Data to import:', importedData.data);
            console.log('Import - Number of keys:', Object.keys(importedData.data).length);

            // Import the data
            if (SafeStorage.isExtension()) {
                console.log('Import - Using chrome.storage.local');
                // Use chrome.storage.local.set directly for better reliability
                await chrome.storage.local.set(importedData.data);
                console.log('Import - Data successfully written to chrome.storage.local');
                
                // Verify the data was saved
                const verification = await chrome.storage.local.get(null);
                console.log('Import - Verification read:', verification);
            } else {
                console.log('Import - Using localStorage fallback');
                // Fallback to SafeStorage for standalone
                const entries = Object.entries(importedData.data);
                for (const [key, value] of entries) {
                    await SafeStorage.setItem(key, value);
                }
                console.log('Import - Data imported to localStorage');
            }

            showStatus(
                "Data imported successfully! Refreshing page...",
                "success"
            );

            // Refresh the page after a short delay
            setTimeout(() => {
                console.log('Import - Reloading page...');
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Import error details:', error);
            console.error('Import error stack:', error);
            showStatus(`Import failed: ${error.message}`, "error");
        }
    };

    reader.onerror = function(error) {
        console.error('FileReader error:', error);
        showStatus('Failed to read file', 'error');
    };

    reader.readAsText(file);
}

// Reset functionality
async function resetAllData() {
    if (
        confirm(
            "This will delete ALL your bookmarks and settings. Are you absolutely sure?"
        )
    ) {
        if (confirm("FINAL WARNING: This cannot be undone. Continue?")) {
            try {
                console.log('Resetting all data...');
                
                if (SafeStorage.isExtension()) {
                    // Get all data from chrome storage
                    const allData = await chrome.storage.local.get(null);
                    const allKeys = Object.keys(allData);
                    
                    // Filter and remove only our app's keys
                    const keysToRemove = allKeys.filter(key => 
                        key.startsWith("customLinks") ||
                        key.startsWith("customCategories") ||
                        key.startsWith("selectedTheme") ||
                        key.startsWith("--") ||
                        key.startsWith("sidebarCollapsed")
                    );
                    
                    if (keysToRemove.length > 0) {
                        await chrome.storage.local.remove(keysToRemove);
                        console.log('Removed keys:', keysToRemove);
                    }
                } else {
                    // Fallback to SafeStorage for standalone
                    const allData = await SafeStorage.getAllData();
                    const allKeys = Object.keys(allData);
                    for (const key of allKeys) {
                        if (
                            key.startsWith("customLinks") ||
                            key.startsWith("customCategories") ||
                            key.startsWith("selectedTheme") ||
                            key.startsWith("--") ||
                            key.startsWith("sidebarCollapsed")
                        ) {
                            await SafeStorage.removeItem(key);
                        }
                    }
                }

                showStatus(
                    "All data cleared successfully! Refreshing page...",
                    "success"
                );

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                console.error('Reset error:', error);
                showStatus(`Reset failed: ${error.message}`, "error");
            }
        }
    }
}

// Layout Toggle functionality
async function applyLayout(mode) {
    document.body.classList.toggle('layout-grid', mode === 'grid');
    await SafeStorage.setItem('layoutMode', mode);
    
    const rowsBtn = document.getElementById('layoutRowsBtn');
    const gridBtn = document.getElementById('layoutGridBtn');
    
    if (mode === 'grid') {
        rowsBtn.classList.remove('active');
        rowsBtn.setAttribute('aria-pressed', 'false');
        gridBtn.classList.add('active');
        gridBtn.setAttribute('aria-pressed', 'true');
    } else {
        rowsBtn.classList.add('active');
        rowsBtn.setAttribute('aria-pressed', 'true');
        gridBtn.classList.remove('active');
        gridBtn.setAttribute('aria-pressed', 'false');
    }
}

function initLayoutToggle() {
    const rowsBtn = document.getElementById('layoutRowsBtn');
    const gridBtn = document.getElementById('layoutGridBtn');
    
    rowsBtn.addEventListener('click', () => applyLayout('rows'));
    gridBtn.addEventListener('click', () => applyLayout('grid'));
}

async function restoreLayoutMode() {
    const savedLayout = await SafeStorage.getItem('layoutMode') || 'rows';
    await applyLayout(savedLayout);
}

// Initialize everything
async function initialize() {
    await initializeData();

    const savedTheme = await SafeStorage.getItem("selectedTheme") || "Elegant Midnight";

    renderThemeSelector();
    await applyTheme(savedTheme);
    highlightTheme(savedTheme);
    await restoreMappings();
    await restoreSidebarState();
    updateCategoryOptions();
    renderLinks();
    initSearch();
    initDragAndDrop();
    initLayoutToggle();
    await restoreLayoutMode();

    // Setup backup/export buttons
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('resetBtn').addEventListener('click', resetAllData);

    // Log extension status for debugging
    if (SafeStorage.isExtension()) {
        console.log('✅ Running as Chrome Extension - data will persist');
    } else {
        console.log('ℹ️ Running as standalone page - using localStorage fallback');
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
