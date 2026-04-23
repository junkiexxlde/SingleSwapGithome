// Overview page - Display all cases with search functionality

const DATABASE_NAME = 'MDWMT_Database';
const DATABASE_VERSION = 4;
const STORE_NAME = 'datasets';

let allCases = [];
let filteredCases = [];

const searchInput = document.getElementById('overviewSearchInput');
const statusMessage = document.getElementById('overviewStatus');
const tableContainer = document.getElementById('overviewTableContainer');
const tableBody = document.getElementById('overviewTableBody');
const noResults = document.getElementById('overviewNoResults');
const resultCount = document.getElementById('overviewResultCount');

// Get current language from navigation or localStorage
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'de';
}

// Simple translation fallback (will be enhanced by navigation.js shared i18n)
const translations = {
    de: {
        'overview-loading': 'Laden...',
        'overview-no-data': 'Keine Fälle vorhanden.',
        'overview-no-results': 'Keine Fälle gefunden. Erstellen Sie einen Neuen Fall.',
        'overview-search-title': 'Fälle durchsuchen',
        'overview-search-label': 'Suche nach Ticketnummer, Asset-ID (Alt oder Neu):',
        'overview-col-ticket': 'Ticketnummer',
        'overview-col-old-device': 'Altes Gerät',
        'overview-col-old-assetid': 'Asset-ID (Alt)',
        'overview-col-new-device': 'Neues Gerät',
        'overview-col-new-assetid': 'Asset-ID (Neu)',
        'overview-col-date': 'Datum',
        'overview-result-count': 'Zeige {count} von {total} Fällen'
    },
    en: {
        'overview-loading': 'Loading...',
        'overview-no-data': 'No cases available.',
        'overview-no-results': 'No cases found. Create a new case.',
        'overview-search-title': 'Search Cases',
        'overview-search-label': 'Search by ticket number, asset ID (old or new):',
        'overview-col-ticket': 'Ticket Number',
        'overview-col-old-device': 'Old Device',
        'overview-col-old-assetid': 'Asset ID (Old)',
        'overview-col-new-device': 'New Device',
        'overview-col-new-assetid': 'Asset ID (New)',
        'overview-col-date': 'Date',
        'overview-result-count': 'Showing {count} of {total} cases'
    }
};

function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations['de'][key] || key;
}

function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString(getCurrentLanguage() === 'de' ? 'de-DE' : 'en-US');
}

function formatDeviceInfo(device) {
    if (!device) return '-';
    const type = device.type || '-';
    const version = device.version || '-';
    return `${type} (${version})`;
}

function normalizeSearchTerm(term) {
    return String(term || '').trim().toLowerCase();
}

function matchesSearch(caseItem, searchTerm) {
    if (!searchTerm) return true;

    const normalized = normalizeSearchTerm(searchTerm);

    // Search in ticket number
    const ticket = normalizeSearchTerm(caseItem.oldDevice?.ticket || caseItem.newDevice?.ticket || '');
    if (ticket.includes(normalized)) return true;

    // Search in old device asset-id
    const oldAssetId = normalizeSearchTerm(caseItem.oldDevice?.assetid || '');
    if (oldAssetId.includes(normalized)) return true;

    // Search in new device asset-id
    const newAssetId = normalizeSearchTerm(caseItem.newDevice?.assetid || '');
    if (newAssetId.includes(normalized)) return true;

    return false;
}

function performSearch() {
    const searchTerm = searchInput?.value || '';
    filteredCases = allCases.filter((caseItem) => matchesSearch(caseItem, searchTerm));
    renderTable();
}

function renderTable() {
    tableBody.innerHTML = '';

    if (filteredCases.length === 0) {
        tableContainer.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    tableContainer.classList.remove('hidden');
    noResults.classList.add('hidden');

    filteredCases.forEach((caseItem) => {
        const ticketNumber = caseItem.oldDevice?.ticket || caseItem.newDevice?.ticket || '-';
        const oldDeviceInfo = formatDeviceInfo(caseItem.oldDevice);
        const oldAssetId = caseItem.oldDevice?.assetid || '-';
        const newDeviceInfo = formatDeviceInfo(caseItem.newDevice);
        const newAssetId = caseItem.newDevice?.assetid || '-';
        const caseDate = formatDate(caseItem.date);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="overview-cell-ticket"><strong>${escapeHtml(ticketNumber)}</strong></td>
            <td class="overview-cell-device">${escapeHtml(oldDeviceInfo)}</td>
            <td class="overview-cell-assetid">${escapeHtml(oldAssetId)}</td>
            <td class="overview-cell-device">${escapeHtml(newDeviceInfo)}</td>
            <td class="overview-cell-assetid">${escapeHtml(newAssetId)}</td>
            <td class="overview-cell-date">${caseDate}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update result count
    if (resultCount) {
        const countLabel = t('overview-result-count')
            .replace('{count}', filteredCases.length)
            .replace('{total}', allCases.length);
        resultCount.textContent = countLabel;
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

async function loadAllCases() {
    try {
        statusMessage.textContent = t('overview-loading');
        tableContainer.classList.add('hidden');
        noResults.classList.add('hidden');

        const db = await openDatabase();

        allCases = await new Promise((resolve, reject) => {
            const tx = db.transaction([STORE_NAME], 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const cases = (request.result || []).sort((a, b) => {
                    const dateA = a.date ? new Date(a.date).getTime() : 0;
                    const dateB = b.date ? new Date(b.date).getTime() : 0;
                    return dateB - dateA; // newest first
                });
                resolve(cases);
            };
        });

        db.close();

        if (allCases.length === 0) {
            statusMessage.textContent = t('overview-no-data');
            noResults.classList.remove('hidden');
            return;
        }

        statusMessage.textContent = '';
        filteredCases = [...allCases];
        renderTable();
    } catch (error) {
        console.error('Error loading cases:', error);
        statusMessage.textContent = t('overview-no-data') || 'Error loading data.';
    }
}

// Event listeners
if (searchInput) {
    searchInput.addEventListener('input', performSearch);
}

// Listen for language change events
document.addEventListener('mdm-language-changed', () => {
    // Re-render table with new language
    renderTable();
});

// Initial load
loadAllCases();
