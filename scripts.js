// Sprachdaten
const translations = {
    de: {
        "title": "Lars Junker - Mobile Device Warranty Management Tool [MDWMT]",
        "type-label": "Gerätetyp:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "name-label": "Name:",
        "version-label": "Typ:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "assetid-label": "Asset-ID:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "serialnumber-label": "Seriennummer:",
        "user-label": "Anwender Name:",
        "userid-label": "Nutzer-ID:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "userdata-label": "Nutzerdaten:",
        "swap-reason-label": "Grund f&uuml;r Austausch/Defekt:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "ticket-label": "Ticketnummer:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "costcenter-label": "Kostenstelle:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "save-dataset-button": "Datensatz speichern",
        "view-button": "Gespeicherte Datensätze anzeigen",
        "modal-title": "Gespeicherte Datensätze",
        "select-default": "-- Bitte auswählen --",
        "type-iphone": "iPhone",
        "type-ipad": "iPad",
        "type-macbook": "MacBook",
        "version-iphone-se": "iPhone SE",
        "version-iphone-13": "iPhone 13",
        "version-iphone-15": "iPhone 15",
        "version-ipad-pro": "iPad Pro",
        "version-ipad-air": "iPad Air",
        "version-ipad-mini": "iPad mini",
        "version-macbook-air": "MacBook Air",
        "version-macbook-pro": "MacBook Pro",
        "success-message": "Datensatz erfolgreich gespeichert!",
        "error-message": "Fehler beim Speichern des Datensatzes.",
        "no-devices": "Keine Datensätze gespeichert.",
        "saved-at": "Gespeichert am: ",
        "device-type": "Status:",
        "device-type-old": "Alt",
        "device-type-new": "Neu",
        "old-device": "Altes Gerät",
        "new-device": "Neues Gerät"
        ,
        "sig-technician": "Techniker",
        "sig-customer": "Kunde",
        "sig-location-date": "Ort / Datum:",
        "sig-signature": "Unterschrift:",
        "austausch-note": "Austauschgerät erhalten"
        ,
        "device-reset": "Gerät zurückgesetzt",
        "sim-card-removed": "Simkarte entfernt",
        "printed-at": "Gedruckt am:",
        "dataset-selector-label": "Datensatz auswählen:",
        "select-ticket-label": "Ticketnummer",
        "search-placeholder": "Nach Ticketnummer suchen...",
        "search-label": "Suche:",
        "load-last-dataset-button": "Letzten Datensatz laden",
        "clear-form-button": "Formular leeren",
        "duplicate-ticket-message": "Datensatz kann nicht gespeichert werden: Ticketnummer existiert bereits. Bitte alten Datensatz zuerst löschen.",
        "print-delivery-note-two-copies-prompt": "Lieferschein zwei Mal drucken?",
        "ipad-no-spare-label": "Kein Leihgerät verfügbar",
        "ipad-return-message": "Das Gerät wird nach der Reparatur an den Nutzer zurückgegeben, falls der Vorgesetzte kein Leihgerät bereitstellen kann."
    },
    en: {
        "title": "Lars Junker - Mobile Device Warranty Management Tool [MDWMT]",
        "type-label": "Type:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "name-label": "Name:",
        "version-label": "Model:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "assetid-label": "Asset ID:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "serialnumber-label": "Serial Number:",
        "user-label": "Username:",
        "userid-label": "User ID:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "userdata-label": "User Data:",
        "swap-reason-label": "Reason for swap/defect:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "ticket-label": "Ticket Number:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "costcenter-label": "Cost Center:<span class=\"required\" aria-hidden=\"true\">*</span>",
        "save-dataset-button": "Save Dataset",
        "view-button": "View Saved Datasets",
        "modal-title": "Saved Datasets",
        "select-default": "-- Select --",
        "type-iphone": "iPhone",
        "type-ipad": "iPad",
        "type-macbook": "MacBook",
        "version-iphone-se": "iPhone SE",
        "version-iphone-13": "iPhone 13",
        "version-iphone-15": "iPhone 15",
        "version-ipad-pro": "iPad Pro",
        "version-ipad-air": "iPad Air",
        "version-ipad-mini": "iPad mini",
        "version-macbook-air": "MacBook Air",
        "version-macbook-pro": "MacBook Pro",
        "success-message": "Dataset saved successfully!",
        "error-message": "Error saving dataset.",
        "no-devices": "No datasets saved yet.",
        "saved-at": "Saved: ",
        "device-type": "Status:",
        "device-type-old": "Old",
        "device-type-new": "New",
        "old-device": "Old Device",
        "new-device": "New Device"
        ,
        "sig-technician": "Technician",
        "sig-customer": "Customer",
        "sig-location-date": "Location / Date:",
        "sig-signature": "Signature:",
        "austausch-note": "Exchange device received"
        ,
        "device-reset": "Device reset",
        "sim-card-removed": "SIM card removed",
        "printed-at": "Printed:",
        "dataset-selector-label": "Select Dataset:",
        "select-ticket-label": "Ticket Number",
        "search-placeholder": "Search by ticket number...",
        "search-label": "Search:",
        "load-last-dataset-button": "Load Last Saved Dataset",
        "clear-form-button": "Clear Form",
        "duplicate-ticket-message": "Dataset cannot be saved: ticket number already exists. Please delete the old dataset first.",
        "print-delivery-note-two-copies-prompt": "Print delivery note twice?",
        "ipad-no-spare-label": "No loan device available",
        "ipad-return-message": "The device will be returned to the user after repair if the supervisor cannot provide a spare device."
    }
};

// Add button labels for print/export PDF
translations.de['print-button'] = "Drucken";
translations.de['export-button'] = "Exportieren";
translations.de['export-pdf-button'] = "Als PDF exportieren";
translations.de['import-button'] = "Importieren";
translations.de['refresh-button'] = "Aktualisieren";
translations.de['delete-button'] = "Löschen";
translations.de['delete-confirm'] = "Datensatz löschen?";
translations.de['delete-confirm-msg'] = "Möchten Sie diesen Datensatz wirklich löschen?";
translations.de['export-before-delete'] = "Möchten Sie den Datensatz vor dem Löschen als CSV exportieren?";
translations.de['delete-success'] = "Datensatz erfolgreich gelöscht.";

translations.de['print-delivery-note-button'] = "Lieferschein drucken";
translations.de['export-delivery-note-pdf-button'] = "Lieferschein als PDF exportieren";
translations.de['delivery-note-title'] = "Lieferschein";
translations.de['swap-protocol-title'] = "Tauschprotokoll";
translations.de['app-shell-title'] = "Mobile Device Warranty Management Tool";
translations.de['nav-home'] = "Startseite";
translations.de['nav-new-case'] = "Neuen Fall anlegen";
translations.de['nav-overview'] = "Übersicht";
translations.de['nav-assets'] = "Assets verwalten";
translations.de['singleswap-settings-title'] = "Weitere Aktionen";
translations.de['to-overview-button'] = "zur Übersicht";
translations.de['appearance-settings-title'] = "Darstellung";
translations.de['appearance-surface-toggle-label'] = "Alternative Box-Optik";
translations.de['appearance-surface-toggle-hint'] = "Übernimmt die weichere Pagination-Optik für Karten und Boxen.";
translations.de['settings-placeholder'] = "Einstellungsmenü folgt.";
translations.de['overview-heading'] = "Übersicht";
translations.de['overview-search-title'] = "Fälle durchsuchen";
translations.de['overview-search-label'] = "Suche nach Ticketnummer, Asset-ID (Alt oder Neu):";
translations.de['overview-col-ticket'] = "Ticketnummer";
translations.de['overview-col-old-device'] = "Altes Gerät";
translations.de['overview-col-old-assetid'] = "Asset-ID (Alt)";
translations.de['overview-col-new-device'] = "Neues Gerät";
translations.de['overview-col-new-assetid'] = "Asset-ID (Neu)";
translations.de['overview-col-date'] = "Datum";
translations.de['overview-loading'] = "Laden...";
translations.de['overview-no-data'] = "Keine Fälle vorhanden.";
translations.de['overview-no-results'] = "Keine Fälle gefunden. Erstellen Sie einen Neuen Fall.";
translations.de['overview-result-count'] = "Zeige {count} von {total} Fällen";
translations.de['factory-defaults'] = "Gerät auf Werkseinstellungen zurückgesetzt";
translations.de['delivery-person'] = "Lieferant";
translations.de['receiver'] = "Empfänger";
translations.de['sig-firstname'] = "Vorname:";
translations.de['sig-name-only'] = "Name:";
translations.de['sig-place'] = "Ort:";
translations.de['sig-date-only'] = "Datum:";

translations.en['print-button'] = "Print";
translations.en['export-button'] = "Export";
translations.en['export-pdf-button'] = "Export as PDF";
translations.en['import-button'] = "Import";
translations.en['refresh-button'] = "Refresh";
translations.en['delete-button'] = "Delete";
translations.en['delete-confirm'] = "Delete Dataset?";
translations.en['delete-confirm-msg'] = "Are you sure you want to delete this dataset?";
translations.en['export-before-delete'] = "Do you want to export this dataset as CSV before deleting?";
translations.en['delete-success'] = "Dataset deleted successfully.";

translations.en['print-delivery-note-button'] = "Print Delivery Note";
translations.en['export-delivery-note-pdf-button'] = "Export Delivery Note to PDF";
translations.en['delivery-note-title'] = "Delivery Note";
translations.en['swap-protocol-title'] = "Swap Protocol";
translations.en['app-shell-title'] = "Mobile Device Warranty Management Tool";
translations.en['nav-home'] = "Home";
translations.en['nav-new-case'] = "Create New Case";
translations.en['nav-overview'] = "Overview";
translations.en['nav-assets'] = "Manage Assets";
translations.en['singleswap-settings-title'] = "More Actions";
translations.en['to-overview-button'] = "To Overview";
translations.en['appearance-settings-title'] = "Appearance";
translations.en['appearance-surface-toggle-label'] = "Alternative panel style";
translations.en['appearance-surface-toggle-hint'] = "Apply the softer pagination look to cards and panels.";
translations.en['settings-placeholder'] = "Settings menu coming soon.";
translations.en['overview-heading'] = "Overview";
translations.en['overview-search-title'] = "Search Cases";
translations.en['overview-search-label'] = "Search by ticket number, asset ID (old or new):";
translations.en['overview-col-ticket'] = "Ticket Number";
translations.en['overview-col-old-device'] = "Old Device";
translations.en['overview-col-old-assetid'] = "Asset ID (Old)";
translations.en['overview-col-new-device'] = "New Device";
translations.en['overview-col-new-assetid'] = "Asset ID (New)";
translations.en['overview-col-date'] = "Date";
translations.en['overview-loading'] = "Loading...";
translations.en['overview-no-data'] = "No cases available.";
translations.en['overview-no-results'] = "No cases found. Create a new case.";
translations.en['overview-result-count'] = "Showing {count} of {total} cases";
translations.en['factory-defaults'] = "Device set to factory defaults";
translations.en['delivery-person'] = "Delivery Person";
translations.en['receiver'] = "Receiver";
translations.en['sig-firstname'] = "First Name:";
translations.en['sig-name-only'] = "Surname:";
translations.en['sig-place'] = "Place:";
translations.en['sig-date-only'] = "Date:";

// Add CSV header labels
translations.de['csv-header-ticket'] = "Ticketnummer";
translations.de['csv-header-type'] = "Gerätetyp";
translations.de['csv-header-version'] = "Typ";
translations.de['csv-header-assetid'] = "Asset-ID";
translations.de['csv-header-serialnumber'] = "Seriennummer";
translations.de['csv-header-user'] = "Nutzer";
translations.de['csv-header-userid'] = "Nutzer-ID";
translations.de['csv-header-userdata'] = "Nutzerdaten";
translations.de['csv-header-swapreason'] = "Grund f&uuml;r Austausch/Defekt";
translations.de['csv-header-costcenter'] = "Kostenstelle";
translations.de['assetid-select-prereq'] = "-- Erst Gerätetyp und Typ wählen --";
translations.de['assetid-select-empty'] = "-- Keine passende Asset-ID verfügbar --";
translations.de['assetid-select-default'] = "-- Asset-ID auswählen --";

translations.en['csv-header-ticket'] = "Ticket Number";
translations.en['csv-header-type'] = "Device Type";
translations.en['csv-header-version'] = "Model";
translations.en['csv-header-assetid'] = "Asset ID";
translations.en['csv-header-serialnumber'] = "Serial Number";
translations.en['csv-header-user'] = "User";
translations.en['csv-header-userid'] = "User ID";
translations.en['csv-header-userdata'] = "User Data";
translations.en['csv-header-swapreason'] = "Reason for swap/defect";
translations.en['csv-header-costcenter'] = "Cost Center";
translations.en['assetid-select-prereq'] = "-- Select device type and model first --";
translations.en['assetid-select-empty'] = "-- No matching Asset ID available --";
translations.en['assetid-select-default'] = "-- Select Asset ID --";
translations.de['export-format-csv'] = 'CSV';
translations.de['export-format-xlsx'] = 'Excel (.xlsx)';
translations.de['export-format-ods'] = 'LibreOffice (.ods)';
translations.de['export-format-missing-lib'] = 'Export als XLSX/ODS nicht verfuegbar: XLSX-Bibliothek fehlt.';

translations.en['export-format-csv'] = 'CSV';
translations.en['export-format-xlsx'] = 'Excel (.xlsx)';
translations.en['export-format-ods'] = 'LibreOffice (.ods)';
translations.en['export-format-missing-lib'] = 'Export as XLSX/ODS unavailable: XLSX library missing.';

const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 4;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_DEFAULTS_STORE = 'inventory_defaults';
const INVENTORY_MONTHLY_STORE = 'monthly_inventory_movements';
const INVENTORY_REQUIRED_STORES = [INVENTORY_STORE, INVENTORY_DEFAULTS_STORE, INVENTORY_MONTHLY_STORE];
const MANAGED_DEVICE_TYPES_KEY = 'mdmtool_managed_device_types_v1';
const MANAGED_MODELS_KEY = 'mdmtool_managed_models_v1';
const SURFACE_STYLE_STORAGE_KEY = 'surfaceStyle';
const DEFAULT_DEVICE_TYPES = [];
const CANONICAL_DEVICE_TYPE_MAP = {};
let inventoryAssets = [];
let versionFilterRefreshers = [];

// Sprachumschaltung
let currentLanguage = 'de';

const breadcrumbPageMap = {
    'index.html': 'nav-home',
    'singleswap.html': 'nav-new-case',
    'overview.html': 'nav-overview',
    'assetmanagement.html': 'nav-assets',
    'monthlyinventory.html': 'nav-monthly-inventory'
};

function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return breadcrumbPageMap[path] || 'nav-home';
}

function renderTopbarBreadcrumb(lang) {
    const leftHost = document.querySelector('.topbar-left');
    if (!leftHost) {
        return;
    }

    const currentPageKey = getCurrentPageName();
    const crumbItems = [{ href: 'index.html', key: 'nav-home', current: currentPageKey === 'nav-home' }];

    if (currentPageKey !== 'nav-home') {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        crumbItems.push({ href: currentPath, key: currentPageKey, current: true });
    }

    const breadcrumbHtml = crumbItems.map((item, index) => {
        const label = translations[lang][item.key] || item.key;
        const separator = index > 0 ? '<span class="topbar-breadcrumb-separator" aria-hidden="true">\\</span>' : '';
        if (item.current) {
            return `${separator}<span class="topbar-breadcrumb-current" aria-current="page">${label}</span>`;
        }
        return `${separator}<a class="topbar-breadcrumb-link" href="${item.href}">${label}</a>`;
    }).join('');

    let breadcrumbHost = leftHost.querySelector('.topbar-breadcrumb-host');
    if (!breadcrumbHost) {
        breadcrumbHost = document.createElement('nav');
        breadcrumbHost.className = 'topbar-breadcrumb topbar-breadcrumb-host';
        breadcrumbHost.setAttribute('aria-label', 'Breadcrumb');
        leftHost.appendChild(breadcrumbHost);
    }

    breadcrumbHost.innerHTML = breadcrumbHtml;
}

function cleanLabel(key) {
    const raw = translations[currentLanguage][key] || '';
    return raw.replace(/<span class=\"required\"[^>]*>.*?<\/span>/g, '').replace(/<span class='required'[^>]*>.*?<\/span>/g, '');
}

function isIpadNoReplacementSelected() {
    const checkbox = document.getElementById('ipad-no-spare-checkbox');
    return !!(checkbox && checkbox.checked);
}

function isIpadNoReplacementDataset(dataset) {
    return !!(dataset && dataset.returnIpadWithoutReplacement);
}

function getIpadReturnMessageText() {
    return translations[currentLanguage]['ipad-return-message'] ||
        'The iPad will be returned to the user after repair if the supervisor cannot provide a spare device.';
}

function openInventoryDbForAssets() {
    function ensureStores(db) {
        return INVENTORY_REQUIRED_STORES.every((storeName) => db.objectStoreNames.contains(storeName));
    }

    function createMissingStores(db) {
        if (!db.objectStoreNames.contains(INVENTORY_STORE)) {
            db.createObjectStore(INVENTORY_STORE, { keyPath: 'assetidKey' });
        }
        if (!db.objectStoreNames.contains(INVENTORY_DEFAULTS_STORE)) {
            db.createObjectStore(INVENTORY_DEFAULTS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(INVENTORY_MONTHLY_STORE)) {
            db.createObjectStore(INVENTORY_MONTHLY_STORE, { keyPath: 'id' });
        }
    }

    function repairInventoryDb(version) {
        return new Promise((resolve, reject) => {
            const repairRequest = indexedDB.open(INVENTORY_DB_NAME, version);
            repairRequest.onerror = () => reject(repairRequest.error);
            repairRequest.onblocked = () => reject(new Error('Inventory database upgrade blocked by another open tab.'));
            repairRequest.onupgradeneeded = () => {
                createMissingStores(repairRequest.result);
            };
            repairRequest.onsuccess = () => {
                repairRequest.result.close();
                resolve();
            };
        });
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(INVENTORY_DB_NAME, INVENTORY_DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Inventory database upgrade blocked by another open tab.'));
        request.onupgradeneeded = () => {
            createMissingStores(request.result);
        };
        request.onsuccess = async () => {
            const db = request.result;
            if (ensureStores(db)) {
                resolve(db);
                return;
            }

            const repairVersion = Math.max(Number(db.version || 0) + 1, INVENTORY_DB_VERSION + 1);
            db.close();

            try {
                await repairInventoryDb(repairVersion);
                const repairedDb = await openInventoryDbForAssets();
                resolve(repairedDb);
            } catch (error) {
                reject(error);
            }
        };
    });
}

function normalizeInventoryValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeTypeToken(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/^type[\s_-]*/g, '')
        .replace(/[_\-\s]+/g, '');
}

function canonicalDeviceTypeName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function loadManagedDeviceTypes() {
    try {
        const raw = localStorage.getItem(MANAGED_DEVICE_TYPES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const source = [
            ...(Array.isArray(parsed) ? parsed : []),
            ...loadManagedModels().map((entry) => entry?.type),
            ...inventoryAssets.map((asset) => asset?.type)
        ];
        const seen = new Set();
        const values = [];

        source.forEach((entry) => {
            const clean = canonicalDeviceTypeName(entry);
            if (!clean) {
                return;
            }
            const key = normalizeTypeToken(clean);
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            values.push(clean);
        });

        return values.sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
    } catch {
        return [];
    }
}

function normalizeModelToken(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([0-9])/g, '$1 $2')
        .replace(/([0-9])([a-z])/g, '$1 $2')
        .replace(/\s+/g, ' ');
}

function formatCanonicalModelLabel(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/(^|[\s(_-])iphone(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPhone`)
        .replace(/(^|[\s(_-])ipad(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPad`)
        .replace(/(^|[\s(_-])macbook(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}MacBook`);
}

function loadManagedModels() {
    try {
        const raw = localStorage.getItem(MANAGED_MODELS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const source = Array.isArray(parsed) ? [...parsed] : [];
        inventoryAssets.forEach((asset) => {
            if (asset?.type && asset?.version) {
                source.push({ type: asset.type, name: asset.version });
            }
        });

        const seen = new Set();
        const output = [];
        source.forEach((entry) => {
            const type = canonicalDeviceTypeName(entry?.type);
            const name = String(entry?.name || '').trim().replace(/\s+/g, ' ');
            if (!type || !name) {
                return;
            }
            const key = `${normalizeTypeToken(type)}::${normalizeModelToken(name)}`;
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            output.push({ type, name });
        });

        return output;
    } catch {
        return [];
    }
}

function syncManagedTypeOptions() {
    const managedTypes = loadManagedDeviceTypes();

    ['old-type', 'new-type'].forEach((selectId) => {
        const selectEl = document.getElementById(selectId);
        if (!selectEl) {
            return;
        }

        const currentValue = selectEl.value;

        Array.from(selectEl.querySelectorAll('option')).forEach((option) => {
            if (option.value !== '') {
                option.remove();
            }
        });
        const existingKeys = new Set(Array.from(selectEl.options).map((option) => normalizeTypeToken(option.value)));

        managedTypes.forEach((typeName) => {
            const key = normalizeTypeToken(typeName);
            if (existingKeys.has(key)) {
                return;
            }

            const option = document.createElement('option');
            option.value = typeName;
            option.textContent = typeName;
            option.setAttribute('data-managed-type', '1');
            selectEl.appendChild(option);
            existingKeys.add(key);
        });

        const preservedOption = Array.from(selectEl.options).find((option) => option.value === currentValue);
        selectEl.value = preservedOption ? currentValue : '';
    });
}

function buildAssetOptionLabel(asset) {
    return asset.assetid;
}

function findMatchingInventoryAsset(assetId, deviceType, deviceVersion) {
    return inventoryAssets.find((asset) => {
        return normalizeInventoryValue(asset.assetid) === normalizeInventoryValue(assetId)
            && normalizeTypeToken(asset.type) === normalizeTypeToken(deviceType)
            && normalizeModelToken(asset.version) === normalizeModelToken(deviceVersion);
    }) || null;
}

function syncNewSerialNumberFromInventory() {
    const typeSelect = document.getElementById('new-type');
    const versionSelect = document.getElementById('new-version');
    const assetSelect = document.getElementById('new-assetid');
    const serialInput = document.getElementById('new-serialnumber');

    if (!typeSelect || !versionSelect || !assetSelect || !serialInput) {
        return;
    }

    const matchingAsset = findMatchingInventoryAsset(
        assetSelect.value,
        typeSelect.value,
        versionSelect.value
    );

    serialInput.value = matchingAsset?.serialnumber || '';
}

function updateInventoryAssetOptions(targetPrefix, preferredValue = '') {
    const typeSelect = document.getElementById(`${targetPrefix}-type`);
    const versionSelect = document.getElementById(`${targetPrefix}-version`);
    const assetSelect = document.getElementById(`${targetPrefix}-assetid`);

    if (!typeSelect || !versionSelect || !assetSelect) {
        return;
    }

    const selectedType = typeSelect.value;
    const selectedVersion = versionSelect.value;
    const currentValue = preferredValue || assetSelect.value;
    const syncSerialNumber = syncNewSerialNumberFromInventory;

    assetSelect.innerHTML = '';

    const appendSingleOption = (labelKey) => {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = translations[currentLanguage][labelKey] || '';
        assetSelect.appendChild(option);
        assetSelect.value = '';
        syncSerialNumber();
    };

    if (!selectedType || !selectedVersion) {
        appendSingleOption('assetid-select-prereq');
        assetSelect.disabled = true;
        return;
    }

    const matchingAssets = inventoryAssets
        .filter((asset) => {
            return normalizeTypeToken(asset.type) === normalizeTypeToken(selectedType)
                && normalizeModelToken(asset.version) === normalizeModelToken(selectedVersion)
                && String(asset.assetid || '').trim() !== '';
        })
        .sort((left, right) => String(left.assetid).localeCompare(String(right.assetid)));

    if (matchingAssets.length === 0) {
        appendSingleOption('assetid-select-empty');
        assetSelect.disabled = true;
        return;
    }

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = translations[currentLanguage]['assetid-select-default'] || '';
    assetSelect.appendChild(defaultOption);

    matchingAssets.forEach((asset) => {
        const option = document.createElement('option');
        option.value = asset.assetid;
        option.textContent = buildAssetOptionLabel(asset);
        assetSelect.appendChild(option);
    });

    assetSelect.disabled = false;

    if (currentValue && matchingAssets.some((asset) => asset.assetid === currentValue)) {
        assetSelect.value = currentValue;
    } else {
        assetSelect.value = '';
    }

    syncSerialNumber();
}

function updateNewAssetIdOptions(preferredValue = '') {
    updateInventoryAssetOptions('new', preferredValue);
}

async function loadInventoryAssets() {
    try {
        const inventoryDb = await openInventoryDbForAssets();
        const assets = await new Promise((resolve, reject) => {
            const tx = inventoryDb.transaction(INVENTORY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_STORE);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
        inventoryDb.close();
        inventoryAssets = Array.isArray(assets)
            ? assets.map((asset) => ({
                ...asset,
                type: canonicalDeviceTypeName(asset?.type),
                version: formatCanonicalModelLabel(asset?.version)
            }))
            : [];
    } catch (error) {
        console.warn('Could not load inventory assets for new device selector.', error);
        inventoryAssets = [];
    }

    syncManagedTypeOptions();
    refreshAllVersionFilters();
    updateNewAssetIdOptions();
}

document.getElementById('lang-de').addEventListener('click', () => {
    setLanguage('de');
});
document.getElementById('lang-en').addEventListener('click', () => {
    setLanguage('en');
});

function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = translations[lang][key];
        if (typeof text === 'string') {
            el.innerHTML = text;
        }
    });
    // Handle i18n placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = translations[lang][key];
        if (typeof text === 'string') {
            el.placeholder = text;
        }
    });
    document.getElementById('lang-de').classList.toggle('active', lang === 'de');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    localStorage.setItem('language', lang);
    
    // Update the dropdown label text directly
    const selectorLabel = document.querySelector('label[for="datasetSelector"]');
    if (selectorLabel) {
        selectorLabel.textContent = translations[lang]['dataset-selector-label'] || 'Select Dataset:';
    }
    
    // Also update search label
    const searchLabel = document.querySelector('label[for="datasetSearch"]');
    if (searchLabel) {
        searchLabel.textContent = translations[lang]['search-label'] || 'Search:';
    }
    
    // refresh any dynamic labels not bound with data-i18n
    if (typeof refreshButtonLabels === 'function') refreshButtonLabels();
    if (typeof applyIpadNoReplacementFormState === 'function') applyIpadNoReplacementFormState();
    syncManagedTypeOptions();
    refreshAllVersionFilters();
    updateNewAssetIdOptions();
    // update document title from translations when available
    if (translations[lang] && translations[lang]['title']) {
        document.title = translations[lang]['title'];
    }

    renderTopbarBreadcrumb(lang);
}

function setSurfaceStyle(style) {
    const nextStyle = style === 'pagination' ? 'pagination' : 'classic';
    document.documentElement.setAttribute('data-surface-style', nextStyle);
    localStorage.setItem(SURFACE_STYLE_STORAGE_KEY, nextStyle);

    const toggle = document.getElementById('appearanceSurfaceToggle');
    if (toggle) {
        toggle.checked = nextStyle === 'pagination';
    }
}

function ensureAppearanceSettings() {
    const settingsMenu = document.getElementById('settings-menu');
    if (!settingsMenu) {
        return;
    }

    let host = settingsMenu.querySelector('.asset-settings-panel');
    if (!host) {
        settingsMenu.innerHTML = '';
        host = document.createElement('div');
        host.className = 'asset-settings-panel common-settings-panel';
        settingsMenu.appendChild(host);
    } else {
        settingsMenu.querySelector('[data-i18n="settings-placeholder"]')?.remove();
    }

    if (host.querySelector('#appearanceSettingsSection')) {
        return;
    }

    const section = document.createElement('section');
    section.id = 'appearanceSettingsSection';
    section.className = 'asset-settings-section appearance-settings-section';
    section.innerHTML = `
        <h3 data-i18n="appearance-settings-title">Darstellung</h3>
        <label class="appearance-toggle-row" for="appearanceSurfaceToggle">
            <input id="appearanceSurfaceToggle" class="appearance-toggle-input" type="checkbox">
            <span data-i18n="appearance-surface-toggle-label">Alternative Box-Optik</span>
        </label>
        <p class="appearance-settings-hint" data-i18n="appearance-surface-toggle-hint">Übernimmt die weichere Pagination-Optik für Karten und Boxen.</p>
    `;
    host.prepend(section);

    const toggle = section.querySelector('#appearanceSurfaceToggle');
    if (toggle) {
        toggle.addEventListener('change', () => {
            setSurfaceStyle(toggle.checked ? 'pagination' : 'classic');
        });
    }
}

// Lade gespeicherte Sprache
ensureAppearanceSettings();
const savedLanguage = localStorage.getItem('language');
setLanguage(savedLanguage || currentLanguage);

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
const initialSurfaceStyle = localStorage.getItem(SURFACE_STYLE_STORAGE_KEY) || 'classic';

document.documentElement.setAttribute('data-theme', currentTheme);
setSurfaceStyle(initialSurfaceStyle);
themeToggle.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
});

function closeNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    const backdrop = document.getElementById('menu-backdrop');
    if (drawer) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) {
        backdrop.classList.add('hidden');
    }
}

function toggleNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    const backdrop = document.getElementById('menu-backdrop');
    if (!drawer || !backdrop) {
        return;
    }

    const isOpen = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    backdrop.classList.toggle('hidden', !isOpen);
    if (isOpen) {
        document.getElementById('settings-menu')?.classList.add('hidden');
    }
}

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settings-menu');
    if (!settingsMenu) {
        return;
    }

    const shouldOpen = settingsMenu.classList.contains('hidden');
    settingsMenu.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) {
        closeNavDrawer();
    }
}

const menuToggle = document.getElementById('menu-toggle');
const menuBackdrop = document.getElementById('menu-backdrop');
const settingsToggle = document.getElementById('settings-toggle');

if (menuToggle) {
    menuToggle.addEventListener('click', toggleNavDrawer);
}
if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeNavDrawer);
}
if (settingsToggle) {
    settingsToggle.addEventListener('click', toggleSettingsMenu);
}

document.querySelectorAll('.drawer-nav a').forEach((link) => {
    link.addEventListener('click', closeNavDrawer);
});

document.addEventListener('click', (event) => {
    const settingsMenu = document.getElementById('settings-menu');
    if (!settingsMenu || settingsMenu.classList.contains('hidden')) {
        return;
    }

    if (!settingsMenu.contains(event.target) && event.target !== settingsToggle) {
        settingsMenu.classList.add('hidden');
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
        currentTheme = event.newValue;
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
    }
    if (event.key === 'language' && event.newValue) {
        setLanguage(event.newValue);
    }
    if (event.key === SURFACE_STYLE_STORAGE_KEY) {
        setSurfaceStyle(event.newValue || 'classic');
    }
});

// Animation für die Buttons
document.getElementById('saveDataset').addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
});

document.getElementById('saveDataset').addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
});

document.getElementById('saveDataset').addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

document.getElementById('viewData').addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
});

document.getElementById('viewData').addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
});

document.getElementById('viewData').addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Disable DB-dependent buttons until DB is ready
document.getElementById('saveDataset').disabled = true;
document.getElementById('loadLastDataset').disabled = true;
document.getElementById('viewData').disabled = true;

// IndexedDB Setup
let db;
const request = indexedDB.open('MDWMT_Database', 4);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const tx = event.target.transaction;

    if (!db.objectStoreNames.contains('datasets')) {
        const store = db.createObjectStore('datasets', { keyPath: 'id', autoIncrement: true });
        store.createIndex('ticketKey', 'ticketKey', { unique: true });
        return;
    }

    const store = tx.objectStore('datasets');
    const getAllReq = store.getAll();

    getAllReq.onsuccess = () => {
        const rows = getAllReq.result || [];
        const seen = new Set();

        // Keep the newest entry per normalized ticket and remove older duplicates.
        rows
            .sort((a, b) => {
                const da = a?.date ? new Date(a.date).getTime() : 0;
                const dbDate = b?.date ? new Date(b.date).getTime() : 0;
                return dbDate - da;
            })
            .forEach((row) => {
                const ticketRaw = row?.oldDevice?.ticket || row?.newDevice?.ticket || '';
                const ticketKey = String(ticketRaw).trim().toLowerCase();

                if (!ticketKey) {
                    return;
                }

                if (seen.has(ticketKey)) {
                    store.delete(row.id);
                    return;
                }

                seen.add(ticketKey);
                if (row.ticketKey !== ticketKey) {
                    row.ticketKey = ticketKey;
                    store.put(row);
                }
            });

        if (!store.indexNames.contains('ticketKey')) {
            store.createIndex('ticketKey', 'ticketKey', { unique: true });
        }
    };

    getAllReq.onerror = () => {
        console.error('Schema migration failed: could not read datasets for ticket index migration.');
        if (!store.indexNames.contains('ticketKey')) {
            store.createIndex('ticketKey', 'ticketKey', { unique: true });
        }
    };

};

request.onblocked = (event) => {
    console.warn('IndexedDB open request blocked:', event);
    alert('Datenbankaktualisierung blockiert. Bitte schließen Sie andere Tabs dieser Anwendung.');
};

request.onsuccess = (event) => {
    db = event.target.result;
    // enable DB actions now
    try {
        document.getElementById('saveDataset').disabled = false;
        document.getElementById('loadLastDataset').disabled = false;
        document.getElementById('viewData').disabled = false;
        const pb = document.getElementById('printData'); if (pb) pb.disabled = false;
        const eb = document.getElementById('exportData'); if (eb) eb.disabled = false;
        const epb = document.getElementById('exportPdf'); if (epb) epb.disabled = false;
        const pdnb = document.getElementById('printDeliveryNote'); if (pdnb) pdnb.disabled = false;
        const ednb = document.getElementById('exportDeliveryNotePdf'); if (ednb) ednb.disabled = false;
    } catch (e) {
        // ignore: elements may not exist yet
    }
};

request.onerror = (event) => {
    console.error('Database error:', event.target.error);
    alert(translations[currentLanguage]["error-message"]);
};

// Datensatz speichern
document.getElementById('saveDataset').addEventListener('click', () => {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Datenbank nicht bereit.");
        return;
    }
    // Daten aus Alt-Formular sammeln
    const oldDeviceData = {
        ticket: document.getElementById('old-ticket').value,
        type: document.getElementById('old-type').value,
        version: document.getElementById('old-version').value,
        assetid: document.getElementById('old-assetid').value,
        serialnumber: document.getElementById('old-serialnumber').value,
        user: document.getElementById('old-user').value,
        userid: document.getElementById('old-userid').value,
        userdata: document.getElementById('old-userdata').value,
        swapReason: document.getElementById('old-swapreason').value,
        // costcenter moved to new device
    };

    // Daten aus Neu-Formular sammeln (Ticketnummer und Kostenstelle aus Alt übernehmen)
    const newDeviceData = {
        ticket: document.getElementById('old-ticket').value,
        type: document.getElementById('new-type').value,
        version: document.getElementById('new-version').value,
        assetid: document.getElementById('new-assetid').value,
        serialnumber: document.getElementById('new-serialnumber').value,
        user: document.getElementById('new-user').value,
        userid: document.getElementById('new-userid').value,
        userdata: document.getElementById('new-userdata').value,
        costcenter: document.getElementById('new-costcenter').value
    };
    const ipadNoReplacement = isIpadNoReplacementSelected();

    // Validierung für Alt-Formular (nur Pflichtfelder)
    if (!oldDeviceData.ticket || !oldDeviceData.type || !oldDeviceData.version ||
        !oldDeviceData.assetid || !oldDeviceData.userid || !oldDeviceData.swapReason) {
        alert(translations[currentLanguage]["error-message"] + " Bitte alle Pflichtfelder im Alt-Gerät ausfüllen.");
        return;
    }

    // Validierung für Neu-Formular (nur Pflichtfelder)
    if (!ipadNoReplacement && (!newDeviceData.type || !newDeviceData.version || !newDeviceData.assetid || !newDeviceData.userid || !newDeviceData.costcenter)) {
        alert(translations[currentLanguage]["error-message"] + " Bitte alle Pflichtfelder im Neu-Gerät ausfüllen.");
        return;
    }

    // Datensatz zusammenstellen
    const dataset = {
        oldDevice: oldDeviceData,
        newDevice: newDeviceData,
        returnIpadWithoutReplacement: ipadNoReplacement,
        ticketKey: (oldDeviceData.ticket || '').trim().toLowerCase(),
        date: new Date().toISOString()
    };

    // Duplicate check by ticket number before saving
    const checkTransaction = db.transaction(['datasets'], 'readonly');
    const checkStore = checkTransaction.objectStore('datasets');
    const getAllReq = checkStore.getAll();

    getAllReq.onsuccess = () => {
        const existingDatasets = getAllReq.result || [];
        const normalizedTicket = (oldDeviceData.ticket || '').trim().toLowerCase();
        const alreadyExists = existingDatasets.some((existing) => {
            const existingTicket = (existing?.oldDevice?.ticket || existing?.newDevice?.ticket || '').trim().toLowerCase();
            return existingTicket === normalizedTicket;
        });

        if (alreadyExists) {
            alert(translations[currentLanguage]['duplicate-ticket-message']);
            return;
        }

        // In Datenbank speichern
        const transaction = db.transaction(['datasets'], 'readwrite');
        const store = transaction.objectStore('datasets');
        const addReq = store.add(dataset);
        addReq.onsuccess = () => {
            alert(translations[currentLanguage]["success-message"]);
        };
        addReq.onerror = (event) => {
            console.error('Add error:', event.target.error);
            if (event.target.error && event.target.error.name === 'ConstraintError') {
                alert(translations[currentLanguage]['duplicate-ticket-message']);
            } else {
                alert(translations[currentLanguage]["error-message"]);
            }
        };
        transaction.onerror = (event) => {
            console.error('Transaction error:', event.target.error);
        };
    };

    getAllReq.onerror = (event) => {
        console.error('Duplicate check error:', event.target.error);
        alert(translations[currentLanguage]["error-message"]);
    };
});

function populateFormsFromDataset(dataset) {
    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        alert(translations[currentLanguage]["error-message"]);
        return;
    }

    const oldDevice = dataset.oldDevice;
    const newDevice = dataset.newDevice;

    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = value || '';
            if (el.tagName === 'SELECT') {
                el.dispatchEvent(new Event('change'));
            }
        }
    };

    setValue('old-ticket', oldDevice.ticket);
    setValue('old-type', oldDevice.type);
    setValue('old-version', oldDevice.version);
    setValue('old-assetid', oldDevice.assetid);
    setValue('old-serialnumber', oldDevice.serialnumber);
    setValue('old-user', oldDevice.user);
    setValue('old-userid', oldDevice.userid);
    setValue('old-userdata', oldDevice.userdata);
    setValue('old-swapreason', oldDevice.swapReason);

    setValue('new-ticket', newDevice.ticket);
    setValue('new-type', newDevice.type);
    setValue('new-version', newDevice.version);
    updateNewAssetIdOptions(newDevice.assetid);
    setValue('new-assetid', newDevice.assetid);
    syncNewSerialNumberFromInventory();
    if (!document.getElementById('new-serialnumber').value) {
        setValue('new-serialnumber', newDevice.serialnumber);
    }
    setValue('new-user', newDevice.user);
    setValue('new-userid', newDevice.userid);
    setValue('new-userdata', newDevice.userdata);
    setValue('new-costcenter', newDevice.costcenter);

    const ipadNoSpareCheckbox = document.getElementById('ipad-no-spare-checkbox');
    if (ipadNoSpareCheckbox) {
        ipadNoSpareCheckbox.checked = isIpadNoReplacementDataset(dataset);
    }
    applyIpadNoReplacementFormState();
}

const loadLastDatasetBtn = document.getElementById('loadLastDataset');
if (loadLastDatasetBtn) {
    loadLastDatasetBtn.addEventListener('click', () => {
        getNewestDatasetFromDB((newestDataset) => {
            if (newestDataset) {
                populateFormsFromDataset(newestDataset);
            }
        });
    });
}

function clearMainFormFields() {
    const fieldIds = [
        'old-ticket',
        'old-type',
        'old-version',
        'old-assetid',
        'old-serialnumber',
        'old-user',
        'old-userid',
        'old-userdata',
        'old-swapreason',
        'new-ticket',
        'new-type',
        'new-version',
        'new-assetid',
        'new-serialnumber',
        'new-user',
        'new-userid',
        'new-userdata',
        'new-costcenter'
    ];

    fieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
        }
    });

    const oldType = document.getElementById('old-type');
    const newType = document.getElementById('new-type');
    if (oldType) oldType.dispatchEvent(new Event('change'));
    if (newType) newType.dispatchEvent(new Event('change'));

    const ticketInput = document.getElementById('old-ticket');
    if (ticketInput) ticketInput.focus();

    const ipadNoSpareCheckbox = document.getElementById('ipad-no-spare-checkbox');
    if (ipadNoSpareCheckbox) {
        ipadNoSpareCheckbox.checked = false;
    }
    applyIpadNoReplacementFormState();
}

function applyIpadNoReplacementFormState() {
    const newDeviceContainer = document.querySelector('.form-container.new-device');
    const ipadNoSpareCheckbox = document.getElementById('ipad-no-spare-checkbox');
    const ipadReturnMessage = document.getElementById('ipadReturnMessage');

    if (!newDeviceContainer || !ipadNoSpareCheckbox || !ipadReturnMessage) {
        return;
    }

    const hideNewDeviceFields = ipadNoSpareCheckbox.checked;
    newDeviceContainer.classList.toggle('ipad-no-replacement', hideNewDeviceFields);
    ipadReturnMessage.classList.toggle('hidden', !hideNewDeviceFields);
    ipadReturnMessage.textContent = getIpadReturnMessageText();

    if (hideNewDeviceFields) {
        ['new-type', 'new-version', 'new-assetid', 'new-serialnumber', 'new-user', 'new-userid', 'new-userdata', 'new-costcenter']
            .forEach((id) => {
                const el = document.getElementById(id);
                if (el) {
                    el.value = '';
                }
            });
    }

    const newRequiredFieldIds = ['new-type', 'new-version', 'new-assetid', 'new-userid', 'new-costcenter'];
    newRequiredFieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.required = !hideNewDeviceFields;
        }
    });

    updateNewAssetIdOptions();
}

const clearFormBtn = document.getElementById('clearFormFields');
if (clearFormBtn) {
    clearFormBtn.addEventListener('click', clearMainFormFields);
}

// View Data Modal
const viewDataBtn = document.getElementById('viewData');
const modal = document.getElementById('dataModal');
const closeBtn = document.querySelector('.close');

viewDataBtn.addEventListener('click', () => {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Datenbank nicht bereit.");
        return;
    }
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.getAll();
    const keysRequest = store.getAllKeys();

    let datasets = [];
    let datasetKeys = [];
    let completed = 0;

    request.onsuccess = (event) => {
        datasets = event.target.result;
        completed++;
        if (completed === 2) processDatasets();
    };

    keysRequest.onsuccess = (event) => {
        datasetKeys = event.target.result;
        completed++;
        if (completed === 2) processDatasets();
    };

    function processDatasets() {
        const savedDataDiv = document.getElementById('savedData');
        const selectedDatasetDiv = document.getElementById('selectedDatasetDisplay');
        const datasetSelector = document.getElementById('datasetSelector');
        const searchInput = document.getElementById('datasetSearch');
        
        savedDataDiv.innerHTML = '';
        selectedDatasetDiv.innerHTML = '';
        datasetSelector.innerHTML = '<option value="" data-i18n="select-ticket-label">' + translations[currentLanguage]['select-ticket-label'] + '</option>';

        if (!datasets || datasets.length === 0) {
            savedDataDiv.innerHTML = `<p>${translations[currentLanguage]["no-devices"]}</p>`;
            modal.style.display = 'block';
            return;
        }

        // Create pairs of {dataset, key} and sort by newest first
        const datasetPairs = datasets.map((dataset, index) => ({
            dataset: dataset,
            key: datasetKeys[index]
        })).reverse();

        // Function to render datasets based on search filter
        function renderDatasets(filteredPairs = datasetPairs, highlightMatches = null) {
            savedDataDiv.innerHTML = '';
            datasetSelector.innerHTML = '<option value="" data-i18n="select-ticket-label">' + translations[currentLanguage]['select-ticket-label'] + '</option>';

            if (filteredPairs.length === 0) {
                savedDataDiv.innerHTML = `<p>${translations[currentLanguage]["no-devices"]}</p>`;
                return;
            }

            filteredPairs.forEach((pair, displayIndex) => {
                const dataset = pair.dataset;
                const datasetKey = pair.key;
                const ticketNumber = dataset.oldDevice?.ticket || `Dataset`;
                const option = document.createElement('option');
                option.value = displayIndex;
                option.textContent = ticketNumber;
                datasetSelector.appendChild(option);

                const card = createDatasetCard(dataset, true, datasetKey); // true = make it collapsible
                
                // Highlight matching datasets
                if (highlightMatches && highlightMatches.has(ticketNumber)) {
                    card.style.borderLeft = '4px solid var(--secondary-color)';
                }
                
                savedDataDiv.appendChild(card);
            });
        }

        // Initial render
        renderDatasets(datasetPairs);

        // Function to perform search
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // No search term, show all in original order
                renderDatasets(datasetPairs, null);
            } else {
                // Filter and reorder: matching ones first, then non-matching
                const matchingPairs = [];
                const nonMatchingPairs = [];
                const matchedTickets = new Set();
                
                datasetPairs.forEach(pair => {
                    const ticketNumber = pair.dataset.oldDevice?.ticket || '';
                    if (ticketNumber.toLowerCase().includes(searchTerm)) {
                        matchingPairs.push(pair);
                        matchedTickets.add(ticketNumber);
                    } else {
                        nonMatchingPairs.push(pair);
                    }
                });
                
                const filteredPairs = [...matchingPairs, ...nonMatchingPairs];
                renderDatasets(filteredPairs, matchedTickets);
                
                // Scroll to top to show matched results
                setTimeout(() => {
                    savedDataDiv.scrollTop = 0;
                    // Also scroll the modal content to the top
                    const modalContent = document.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.scrollTop = 0;
                    }
                }, 0);
            }
            
            // Clear selection when searching
            datasetSelector.value = '';
            selectedDatasetDiv.innerHTML = '';
            selectedDatasetDiv.style.display = 'none';
        }
        
        // Set up search handler for input field (on each keystroke)
        searchInput.addEventListener('input', performSearch);
        
        // Allow Enter key to trigger search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        // Set up dropdown change handler
        datasetSelector.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            selectedDatasetDiv.innerHTML = '';
            
            if (selectedIndex === '') {
                selectedDatasetDiv.style.display = 'none';
                return;
            }
            
            // Get currently displayed pairs (considering search filter)
            const searchTerm = searchInput.value.toLowerCase().trim();
            let currentPairs = datasetPairs;
            
            if (searchTerm !== '') {
                const matchingPairs = [];
                const nonMatchingPairs = [];
                
                datasetPairs.forEach(pair => {
                    const ticketNumber = pair.dataset.oldDevice?.ticket || '';
                    if (ticketNumber.toLowerCase().includes(searchTerm)) {
                        matchingPairs.push(pair);
                    } else {
                        nonMatchingPairs.push(pair);
                    }
                });
                
                currentPairs = [...matchingPairs, ...nonMatchingPairs];
            }
            
            const selectedPair = currentPairs[selectedIndex];
            const expandedCard = createDatasetCard(selectedPair.dataset, false, selectedPair.key); // false = expanded view
            expandedCard.classList.add('selected-dataset-display');
            selectedDatasetDiv.appendChild(expandedCard);
            selectedDatasetDiv.style.display = 'block';
        });

        modal.style.display = 'block';
    }

    request.onerror = (event) => {
        console.error('Fehler beim Laden der Datensätze:', event.target.error);
        alert(translations[currentLanguage]["error-message"]);
    };
});

function createDatasetCard(dataset, isCollapsible = false, datasetKey = null) {
    // container holding two cards: old and new
    const pair = document.createElement('div');
    pair.className = 'dataset-pair';

    // Prüfen, ob dataset.oldDevice und dataset.newDevice existieren
    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        console.error("Ungültiger Datensatz:", dataset);
        const empty = document.createElement('div');
        empty.textContent = 'Invalid dataset';
        return empty;
    }

    const oldDevice = dataset.oldDevice;
    const newDevice = dataset.newDevice;
    const hideNewDeviceSection = isIpadNoReplacementDataset(dataset);

    function buildCard(titleText, device, showCostCenter, showSwapReason) {
        const card = document.createElement('div');
        card.className = 'dataset-card';

        const header = document.createElement('div');
        header.className = 'dataset-header';
        header.textContent = titleText;
        card.appendChild(header);

        const deviceSection = document.createElement('div');
        deviceSection.className = 'device-section';

        const formSection = document.createElement('div');
        formSection.className = 'form-section';

        function addRow(labelText, valueText) {
            const fg = document.createElement('div');
            fg.className = 'form-group';
            const lab = document.createElement('label');
            // cleanLabel returns a safe string without the required span
            lab.innerHTML = labelText;
            const val = document.createElement('div');
            val.className = 'value';
            val.textContent = valueText || 'N/A';
            fg.appendChild(lab);
            fg.appendChild(val);
            formSection.appendChild(fg);
        }
        
        // Show full details for all views
        addRow(cleanLabel('ticket-label'), device.ticket);
        addRow(cleanLabel('type-label'), device.type);
        addRow(cleanLabel('version-label'), device.version);
        addRow(cleanLabel('assetid-label'), device.assetid);
        addRow(cleanLabel('serialnumber-label'), device.serialnumber);
        addRow(cleanLabel('user-label'), `${device.user || 'N/A'} (ID: ${device.userid || 'N/A'})`);
        addRow(cleanLabel('userdata-label'), device.userdata);
        if (showSwapReason) addRow(cleanLabel('swap-reason-label'), device.swapReason);
        if (showCostCenter) addRow(cleanLabel('costcenter-label'), device.costcenter);

        deviceSection.appendChild(formSection);
        card.appendChild(deviceSection);
        return card;
    }

    function buildNoReplacementCard() {
        const card = document.createElement('div');
        card.className = 'dataset-card';

        const header = document.createElement('div');
        header.className = 'dataset-header';
        header.textContent = translations[currentLanguage]["new-device"];
        card.appendChild(header);

        const deviceSection = document.createElement('div');
        deviceSection.className = 'device-section';

        const formSection = document.createElement('div');
        formSection.className = 'form-section';

        const fg = document.createElement('div');
        fg.className = 'form-group';

        const lab = document.createElement('label');
        lab.textContent = cleanLabel('ipad-no-spare-label') + ' ' + getIpadReturnMessageText();

        fg.appendChild(lab);
        formSection.appendChild(fg);
        deviceSection.appendChild(formSection);
        card.appendChild(deviceSection);

        return card;
    }

    const oldCard = buildCard(translations[currentLanguage]["old-device"], oldDevice, false, true);
    const newCard = buildCard(translations[currentLanguage]["new-device"], newDevice, true, false);

    pair.appendChild(oldCard);
    if (hideNewDeviceSection) {
        pair.appendChild(buildNoReplacementCard());
    } else {
        pair.appendChild(newCard);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'dataset-wrapper';
    if (isCollapsible) {
        wrapper.classList.add('collapsed');
    }
    
    // For collapsible view, add a toggle header
    if (isCollapsible) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'dataset-toggle';
        toggleBtn.innerHTML = `Ticket: ${oldDevice.ticket}`;
        
        wrapper.appendChild(toggleBtn);
        
        const collapsibleContent = document.createElement('div');
        collapsibleContent.className = 'dataset-collapsible collapsed';
        collapsibleContent.appendChild(pair);
        
        // Create a flex container for saved-at and print button on the same line
        const footerDiv = document.createElement('div');
        footerDiv.className = 'dataset-footer';

        const savedAtEl = document.createElement('p');
        savedAtEl.className = 'saved-at';
        savedAtEl.textContent = `${translations[currentLanguage]["saved-at"]} ${dataset.date ? new Date(dataset.date).toLocaleString('de-DE') : 'Unbekannt'}`;
        footerDiv.appendChild(savedAtEl);

        const printBtn = document.createElement('button');
        printBtn.type = 'button';
        printBtn.className = 'print-icon-button';
        printBtn.title = translations[currentLanguage]['print-button'] || 'Print';
        printBtn.innerHTML = '🖨️'; // printer emoji
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            printDatasetElement(dataset);
        });
        footerDiv.appendChild(printBtn);

        const pdfBtn = document.createElement('button');
        pdfBtn.type = 'button';
        pdfBtn.className = 'pdf-export-icon-button';
        pdfBtn.title = translations[currentLanguage]['export-pdf-button'] || 'Export to PDF';
        pdfBtn.innerHTML = '📄'; // document emoji
        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportDatasetToPDF(dataset);
        });
        footerDiv.appendChild(pdfBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-icon-button';
        deleteBtn.title = translations[currentLanguage]['delete-button'] || 'Delete';
        deleteBtn.innerHTML = '🗑️'; // delete emoji
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (datasetKey !== null) {
                deleteDataset(datasetKey, oldDevice.ticket);
            }
        });
        footerDiv.appendChild(deleteBtn);

        collapsibleContent.appendChild(footerDiv);
        wrapper.appendChild(collapsibleContent);
        
        // Toggle functionality
        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle('expanded');
            collapsibleContent.classList.toggle('collapsed');
        });
    } else {
        // Full expanded view (for selected dataset)
        wrapper.appendChild(pair);
        
        const footerDiv = document.createElement('div');
        footerDiv.className = 'dataset-footer';

        const savedAtEl = document.createElement('p');
        savedAtEl.className = 'saved-at';
        savedAtEl.textContent = `${translations[currentLanguage]["saved-at"]} ${dataset.date ? new Date(dataset.date).toLocaleString('de-DE') : 'Unbekannt'}`;
        footerDiv.appendChild(savedAtEl);

        const printBtn = document.createElement('button');
        printBtn.type = 'button';
        printBtn.className = 'print-icon-button';
        printBtn.title = translations[currentLanguage]['print-button'] || 'Print';
        printBtn.innerHTML = '🖨️'; // printer emoji
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            printDatasetElement(dataset);
        });
        footerDiv.appendChild(printBtn);

        const pdfBtn = document.createElement('button');
        pdfBtn.type = 'button';
        pdfBtn.className = 'pdf-export-icon-button';
        pdfBtn.title = translations[currentLanguage]['export-pdf-button'] || 'Export to PDF';
        pdfBtn.innerHTML = '📄'; // document emoji
        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportDatasetToPDF(dataset);
        });
        footerDiv.appendChild(pdfBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-icon-button';
        deleteBtn.title = translations[currentLanguage]['delete-button'] || 'Delete';
        deleteBtn.innerHTML = '🗑️'; // delete emoji
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (datasetKey !== null) {
                deleteDataset(datasetKey, oldDevice.ticket);
            }
        });
        footerDiv.appendChild(deleteBtn);

        wrapper.appendChild(footerDiv);
    }

    return wrapper;
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Helper function to get the newest dataset from database
function getNewestDatasetFromDB(callback) {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Database not ready.");
        callback(null);
        return;
    }
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.getAll();
    
    request.onsuccess = (event) => {
        const datasets = event.target.result;
        if (!datasets || datasets.length === 0) {
            alert(translations[currentLanguage]["no-devices"]);
            callback(null);
            return;
        }
        // Last item is the newest (most recently added)
        const newestDataset = datasets[datasets.length - 1];
        callback(newestDataset);
    };
    
    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        alert(translations[currentLanguage]["error-message"]);
        callback(null);
    };
}

// Helper function to create a dataset card for printing (expanded, no toggle)
function createDatasetCardForPrint(dataset) {
    const pair = document.createElement('div');
    pair.className = 'dataset-pair';

    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        const empty = document.createElement('div');
        empty.textContent = 'Invalid dataset';
        return empty;
    }

    const oldDevice = dataset.oldDevice;
    const newDevice = dataset.newDevice;
    const hideNewDeviceSection = isIpadNoReplacementDataset(dataset);

    function buildCard(titleText, device, showCostCenter, showSwapReason) {
        const card = document.createElement('div');
        card.className = 'dataset-card';

        const header = document.createElement('div');
        header.className = 'dataset-header';
        header.textContent = titleText;
        card.appendChild(header);

        const deviceSection = document.createElement('div');
        deviceSection.className = 'device-section';

        const formSection = document.createElement('div');
        formSection.className = 'form-section';

        function addRow(labelText, valueText) {
            const fg = document.createElement('div');
            fg.className = 'form-group';
            const lab = document.createElement('label');
            lab.innerHTML = labelText;
            const val = document.createElement('div');
            val.className = 'value';
            val.textContent = valueText || 'N/A';
            fg.appendChild(lab);
            fg.appendChild(val);
            formSection.appendChild(fg);
        }
        
        // Show full details
        addRow(cleanLabel('ticket-label'), device.ticket);
        addRow(cleanLabel('type-label'), device.type);
        addRow(cleanLabel('version-label'), device.version);
        addRow(cleanLabel('assetid-label'), device.assetid);
        addRow(cleanLabel('serialnumber-label'), device.serialnumber);
        addRow(cleanLabel('user-label'), `${device.user || 'N/A'} (ID: ${device.userid || 'N/A'})`);
        addRow(cleanLabel('userdata-label'), device.userdata);
        if (showSwapReason) addRow(cleanLabel('swap-reason-label'), device.swapReason);
        if (showCostCenter) addRow(cleanLabel('costcenter-label'), device.costcenter);

        deviceSection.appendChild(formSection);
        card.appendChild(deviceSection);
        return card;
    }

    function buildNoReplacementCard() {
        const card = document.createElement('div');
        card.className = 'dataset-card';

        const header = document.createElement('div');
        header.className = 'dataset-header';
        header.textContent = translations[currentLanguage]["new-device"];
        card.appendChild(header);

        const deviceSection = document.createElement('div');
        deviceSection.className = 'device-section';

        const formSection = document.createElement('div');
        formSection.className = 'form-section';

        const fg = document.createElement('div');
        fg.className = 'form-group';

        const lab = document.createElement('label');
        lab.textContent = cleanLabel('ipad-no-spare-label') + ' ' + getIpadReturnMessageText();

        fg.appendChild(lab);
        formSection.appendChild(fg);
        deviceSection.appendChild(formSection);
        card.appendChild(deviceSection);

        return card;
    }

    const oldCard = buildCard(translations[currentLanguage]["old-device"], oldDevice, false, true);
    const newCard = buildCard(translations[currentLanguage]["new-device"], newDevice, true, false);

    pair.appendChild(oldCard);
    if (hideNewDeviceSection) {
        pair.appendChild(buildNoReplacementCard());
    } else {
        pair.appendChild(newCard);
    }

    return pair;
}

// Funktion zum Drucken eines spezifischen Datasets
function printDatasetElement(dataset) {
    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        alert(translations[currentLanguage]['no-devices']);
        return;
    }
    
    // Create expanded card for printing
    const expandedCard = createDatasetCardForPrint(dataset);
    let printContent = expandedCard.innerHTML;
    
    // Extract ticket number and user from dataset
    const ticketNumber = dataset.oldDevice.ticket || 'NoTicket';
    const userId = dataset.oldDevice.userid || 'NoUser';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${ticketNumber}_${userId}_${dateStr}`;
    
    const printWindow = window.open('', '_blank');
    const swapProtocolTitle = translations[currentLanguage]['swap-protocol-title'] || 'Tauschprotokoll';
    printWindow.document.write('<html><head><title>' + filename + '</title>');
    const styleHref = 'styles.css';
    printWindow.document.write('<link rel="stylesheet" href="' + styleHref + '">');
    printWindow.document.write('</head><body>');
    // wrap content in print-preview container for stretch/background rules
    printWindow.document.write('<div class="print-preview">');
    printWindow.document.write(`<h2 class="swap-protocol-title">${swapProtocolTitle}</h2>`);
    printWindow.document.write(printContent);
    printWindow.document.write('</div>');
    const printedAt = new Date().toLocaleString();
    const printedLabelRaw = translations[currentLanguage]['printed-at'] || 'Printed At';
    const printedLabel = printedLabelRaw.replace(/[:：]\s*$/u, '');
    const printedHTML = `<p class="print-generated-at">${printedLabel}: ${printedAt}</p>`;
    printWindow.document.write(printedHTML);
    const techLabel = translations[currentLanguage]['sig-technician'] || 'Technician';
    const custLabel = translations[currentLanguage]['sig-customer'] || 'Customer';
    const locLabel = translations[currentLanguage]['sig-location-date'] || 'Location / Date:';
    const signLabel = translations[currentLanguage]['sig-signature'] || 'Signature:';
    const note = isIpadNoReplacementDataset(dataset)
        ? ''
        : (translations[currentLanguage]['austausch-note'] || 'Exchange device received');
    const deviceResetLabel = translations[currentLanguage]['device-reset'] || 'Device reset';
    const simCardLabel = translations[currentLanguage]['sim-card-removed'] || 'SIM card removed';
    const checkboxesHtml = `
        <div class="print-checkboxes">
            <div class="checkbox-row"><input type="checkbox" id="chk-reset"> <label for="chk-reset">${deviceResetLabel}</label></div>
            <div class="checkbox-row"><input type="checkbox" id="chk-sim"> <label for="chk-sim">${simCardLabel}</label></div>
        </div>
    `;
    printWindow.document.write(checkboxesHtml);
    const signatureHtml = `
        <div class="print-signature-area">
            <div class="print-signatures-vertical">
                <div class="signature-block">
                    <div class="sig-title">${techLabel}</div>
                    <div class="sig-row"><div class="sig-label">${locLabel}</div><div class="sig-line"></div></div>
                    <div class="sig-row"><div class="sig-label">${signLabel}</div><div class="sig-line"></div></div>
                </div>
                <div class="signature-block">
                    <div class="sig-title">${custLabel}</div>
                    ${note ? `<div class="sig-note">${note}</div>` : ''}
                    <div class="sig-row"><div class="sig-label">${locLabel}</div><div class="sig-line"></div></div>
                    <div class="sig-row"><div class="sig-label">${signLabel}</div><div class="sig-line"></div></div>
                </div>
            </div>
        </div>
    `;
    printWindow.document.write(signatureHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Setup handlers to close the window after printing or when user cancels
    let printHandled = false;
    
    printWindow.onafterprint = function() {
        if (!printHandled) {
            printHandled = true;
            printWindow.close();
        }
    };
    
    printWindow.onbeforeunload = function() {
        if (!printHandled) {
            printHandled = true;
        }
    };
    
    printWindow.onload = function() { 
        printWindow.print();
        // Fallback: close the window after 2 seconds if onafterprint didn't work
        setTimeout(() => {
            if (!printHandled) {
                printHandled = true;
                printWindow.close();
            }
        }, 2000);
    };
}

// Funktion zum Öffnen des Druckdialogs - prints only the newest dataset
function openPrintDialog() {
    getNewestDatasetFromDB((newestDataset) => {
        if (newestDataset) {
            printDatasetElement(newestDataset);
        }
    });
}

// ─── Delivery Note helpers ────────────────────────────────────────────────────

// Build a single card showing only old-device data for the delivery note
function createOldDeviceCardForDelivery(dataset) {
    const card = document.createElement('div');
    card.className = 'dataset-card';

    const header = document.createElement('div');
    header.className = 'dataset-header';
    header.textContent = translations[currentLanguage]['old-device'] || 'Altes Gerät';
    card.appendChild(header);

    const deviceSection = document.createElement('div');
    deviceSection.className = 'device-section';

    const formSection = document.createElement('div');
    formSection.className = 'form-section';

    function addRow(labelText, valueText) {
        const fg = document.createElement('div');
        fg.className = 'form-group';
        const lab = document.createElement('label');
        lab.innerHTML = labelText;
        const val = document.createElement('div');
        val.className = 'value';
        val.textContent = valueText || 'N/A';
        fg.appendChild(lab);
        fg.appendChild(val);
        formSection.appendChild(fg);
    }

    const oldDevice = dataset.oldDevice;
    addRow(cleanLabel('ticket-label'), oldDevice.ticket);
    addRow(cleanLabel('type-label'), oldDevice.type);
    addRow(cleanLabel('version-label'), oldDevice.version);
    addRow(cleanLabel('assetid-label'), oldDevice.assetid);
    addRow(cleanLabel('serialnumber-label'), oldDevice.serialnumber);
    addRow(cleanLabel('user-label'), `${oldDevice.user || 'N/A'} (ID: ${oldDevice.userid || 'N/A'})`);
    addRow(cleanLabel('userdata-label'), oldDevice.userdata);
    addRow(cleanLabel('swap-reason-label'), oldDevice.swapReason);

    deviceSection.appendChild(formSection);
    card.appendChild(deviceSection);
    return card;
}

// Build the shared signature HTML for the delivery note
function buildDeliverySignatureHtml() {
    const deliveryPersonLabel = translations[currentLanguage]['delivery-person'] || 'Lieferant';
    const receiverLabel       = translations[currentLanguage]['receiver']        || 'Empfänger';
    const firstNameLabel      = translations[currentLanguage]['sig-firstname']   || 'Vorname:';
    const lastNameLabel       = translations[currentLanguage]['sig-name-only']   || 'Name:';
    const placeLabel          = translations[currentLanguage]['sig-place']       || 'Ort:';
    const dateLabel           = translations[currentLanguage]['sig-date-only']   || 'Datum:';
    const signLabel           = translations[currentLanguage]['sig-signature']   || 'Unterschrift:';

    function sigBlock(title) {
        return `
            <div class="signature-block">
                <div class="sig-title">${title}</div>
                <div class="sig-row"><div class="sig-label">${firstNameLabel}</div><div class="sig-line"></div></div>
                <div class="sig-row"><div class="sig-label">${lastNameLabel}</div><div class="sig-line"></div></div>
                <div class="sig-row"><div class="sig-label">${placeLabel}</div><div class="sig-line"></div></div>
                <div class="sig-row"><div class="sig-label">${dateLabel}</div><div class="sig-line"></div></div>
                <div class="sig-row"><div class="sig-label">${signLabel}</div><div class="sig-line"></div></div>
            </div>`;
    }

    return `
        <div class="print-signature-area">
            <div class="print-signatures-vertical">
                ${sigBlock(deliveryPersonLabel)}
                ${sigBlock(receiverLabel)}
            </div>
        </div>`;
}

// Print delivery note (old device data only)
function printDeliveryNoteElement(dataset, copyCount = 1) {
    if (!dataset || !dataset.oldDevice) {
        alert(translations[currentLanguage]['no-devices']);
        return;
    }

    const card = createOldDeviceCardForDelivery(dataset);

    const ticketNumber = dataset.oldDevice.ticket || 'NoTicket';
    const userId       = dataset.oldDevice.userid  || 'NoUser';
    const dateStr      = new Date().toISOString().split('T')[0];
    const filename     = `Lieferschein_${ticketNumber}_${userId}_${dateStr}`;

    const deliveryNoteTitle  = translations[currentLanguage]['delivery-note-title'] || 'Lieferschein';
    const factoryDefaultsLbl = translations[currentLanguage]['factory-defaults']    || 'Gerät auf Werkseinstellungen zurückgesetzt';

    const checkboxesHtml = `
        <div class="print-checkboxes">
            <div class="checkbox-row"><input type="checkbox"> <label>${factoryDefaultsLbl}</label></div>
        </div>`;

    const copies = copyCount === 2 ? 2 : 1;
    const cardHtml = card.outerHTML;
    const signatureHtml = buildDeliverySignatureHtml();

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>' + filename + '</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="print-preview">');
    for (let i = 0; i < copies; i++) {
        printWindow.document.write('<div class="delivery-note-copy">');
        printWindow.document.write(`<h2 class="delivery-note-title">${deliveryNoteTitle}</h2>`);
        printWindow.document.write(cardHtml);
        printWindow.document.write(checkboxesHtml);
        printWindow.document.write(signatureHtml);
        printWindow.document.write('</div>');
    }
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();

    let printHandled = false;
    printWindow.onafterprint = function() {
        if (!printHandled) { printHandled = true; printWindow.close(); }
    };
    printWindow.onbeforeunload = function() {
        if (!printHandled) { printHandled = true; }
    };
    printWindow.onload = function() {
        printWindow.print();
        setTimeout(() => {
            if (!printHandled) { printHandled = true; printWindow.close(); }
        }, 2000);
    };
}

// Export delivery note to PDF (old device data only)
function exportDeliveryNoteToPDF(dataset) {
    if (!dataset || !dataset.oldDevice) {
        alert(translations[currentLanguage]['no-devices']);
        return;
    }

    const hasHtml2Canvas = typeof html2canvas === 'function' || !!window.html2canvas;
    const hasJsPDF       = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || window.jspdf;
    const hasHtml2Pdf    = typeof html2pdf !== 'undefined';
    if (!hasHtml2Canvas && !hasHtml2Pdf) {
        alert('PDF export library not loaded.');
        return;
    }

    const card = createOldDeviceCardForDelivery(dataset);

    const cloneWrapper = document.createElement('div');
    cloneWrapper.className = 'pdf-export';

    const deliveryNoteTitle = translations[currentLanguage]['delivery-note-title'] || 'Lieferschein';
    const titleEl = document.createElement('h2');
    titleEl.className = 'delivery-note-title';
    titleEl.textContent = deliveryNoteTitle;
    cloneWrapper.appendChild(titleEl);
    cloneWrapper.appendChild(card);

    const factoryDefaultsLbl = translations[currentLanguage]['factory-defaults'] || 'Gerät auf Werkseinstellungen zurückgesetzt';
    cloneWrapper.insertAdjacentHTML('beforeend', `
        <div class="print-checkboxes">
            <div class="checkbox-row"><input type="checkbox"> <label>${factoryDefaultsLbl}</label></div>
        </div>`);

    cloneWrapper.insertAdjacentHTML('beforeend', buildDeliverySignatureHtml());

    const isoDate      = new Date().toISOString().split('T')[0];
    const ticketNumber = dataset.oldDevice.ticket || 'NoTicket';
    const userId       = dataset.oldDevice.userid  || 'NoUser';
    const filename     = `Lieferschein_${ticketNumber}_${userId}_${isoDate}.pdf`;

    const hidden = document.createElement('div');
    hidden.style.position = 'fixed';
    hidden.style.left = '-9999px';
    hidden.appendChild(cloneWrapper);
    document.body.appendChild(hidden);

    if (hasHtml2Canvas && hasJsPDF) {
        const html2canvasFn = (typeof html2canvas === 'function') ? html2canvas : window.html2canvas;
        html2canvasFn(cloneWrapper, { scale: 2, useCORS: true }).then(canvas => {
            const imgData   = canvas.toDataURL('image/jpeg', 0.98);
            const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF
                            : (window.jsPDF ? window.jsPDF : window.jspdf);
            if (!jsPDFCtor) {
                document.body.removeChild(hidden);
                alert('PDF library not available');
                return;
            }
            const pdf      = new jsPDFCtor({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight= pdf.internal.pageSize.getHeight();
            const ratio    = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
            const imgWidth = canvas.width  * ratio;
            const imgHeight= canvas.height * ratio;
            pdf.addImage(imgData, 'JPEG', (pdfWidth - imgWidth) / 2, (pdfHeight - imgHeight) / 2, imgWidth, imgHeight);
            pdf.save(filename);
            document.body.removeChild(hidden);
        }).catch(err => {
            document.body.removeChild(hidden);
            console.error('Delivery note PDF export failed', err);
            alert('PDF export failed.');
        });
    } else if (hasHtml2Pdf) {
        html2pdf().set({
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(cloneWrapper).save().then(() => {
            document.body.removeChild(hidden);
        }).catch(err => {
            document.body.removeChild(hidden);
            console.error('Delivery note PDF export failed', err);
            alert('PDF export failed.');
        });
    } else {
        document.body.removeChild(hidden);
        alert('No compatible PDF export libraries found.');
    }
}

function openDeliveryNotePrint() {
    getNewestDatasetFromDB((dataset) => {
        if (dataset) {
            const promptText = translations[currentLanguage]['print-delivery-note-two-copies-prompt'] || 'Print delivery note twice?';
            const printTwoCopies = confirm(promptText);
            printDeliveryNoteElement(dataset, printTwoCopies ? 2 : 1);
        }
    });
}

function openDeliveryNoteExport() {
    getNewestDatasetFromDB((dataset) => {
        if (dataset) exportDeliveryNoteToPDF(dataset);
    });
}

// ─────────────────────────────────────────────────────────────────────────────

// Function to export a single dataset to CSV
function exportSingleDatasetToCSV(dataset) {
    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        alert(translations[currentLanguage]["error-message"]);
        return;
    }

    function escapeCsvField(val) {
        if (val === undefined || val === null) return '""';
        const s = String(val);
        return '"' + s.replace(/"/g, '""') + '"';
    }

    const oldDevice = dataset.oldDevice || {};
    const newDevice = dataset.newDevice || {};
    const iPadNoReplacement = isIpadNoReplacementDataset(dataset);
    const iPadReturnMessage = iPadNoReplacement ? getIpadReturnMessageText() : '';

    let csvRows = [];
    const headers = [
        'Ticket Number (New)',
        'Old Device Type',
        'Old Device Model',
        'Old Asset ID',
        'Old Serial Number',
        'Old User',
        'Old User ID',
        'Old User Data',
        'Old Swap Reason / Defect',
        'Old Cost Center',
        'New Device Type',
        'New Device Model',
        'New Asset ID',
        'New Serial Number',
        'New User',
        'New User ID',
        'New User Data',
        'New Cost Center',
        'iPad No Spare Device',
        'iPad Return Message'
    ];
    csvRows.push(headers.join(','));

    const singleRow = [
        escapeCsvField(newDevice.ticket || 'N/A'),
        escapeCsvField(oldDevice.type || 'N/A'),
        escapeCsvField(oldDevice.version || 'N/A'),
        escapeCsvField(oldDevice.assetid || 'N/A'),
        escapeCsvField(oldDevice.serialnumber || 'N/A'),
        escapeCsvField(oldDevice.user || 'N/A'),
        escapeCsvField(oldDevice.userid || 'N/A'),
        escapeCsvField(oldDevice.userdata || 'N/A'),
        escapeCsvField(oldDevice.swapReason || 'N/A'),
        escapeCsvField(oldDevice.costcenter || 'N/A'),
        escapeCsvField(newDevice.type || 'N/A'),
        escapeCsvField(newDevice.version || 'N/A'),
        escapeCsvField(newDevice.assetid || 'N/A'),
        escapeCsvField(newDevice.serialnumber || 'N/A'),
        escapeCsvField(newDevice.user || 'N/A'),
        escapeCsvField(newDevice.userid || 'N/A'),
        escapeCsvField(newDevice.userdata || 'N/A'),
        escapeCsvField(newDevice.costcenter || 'N/A'),
        escapeCsvField(iPadNoReplacement ? 'Yes' : 'No'),
        escapeCsvField(iPadReturnMessage)
    ].join(',');

    csvRows.push(singleRow);

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const ticketNumber = dataset.oldDevice.ticket || 'dataset';
    const isoDate = new Date().toISOString().split('T')[0];
    const filename = `${ticketNumber}_${isoDate}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Function to delete a dataset from database
function deleteDataset(datasetId, datasetTicket) {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Database not ready.");
        return;
    }

    const confirmDelete = confirm(
        translations[currentLanguage]["delete-confirm-msg"] || "Are you sure you want to delete this dataset?"
    );

    if (!confirmDelete) {
        return;
    }

    // Ask if user wants to export before deleting
    const exportBeforeDelete = confirm(
        translations[currentLanguage]["export-before-delete"] || "Do you want to export this dataset as CSV before deleting?"
    );

    // Get the dataset first
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const getRequest = store.get(datasetId);

    getRequest.onsuccess = () => {
        const dataset = getRequest.result;

        // Export if user requested
        if (exportBeforeDelete && dataset) {
            exportSingleDatasetToCSV(dataset);
        }

        // Delete the dataset
        const deleteTransaction = db.transaction(['datasets'], 'readwrite');
        const deleteStore = deleteTransaction.objectStore('datasets');
        const deleteRequest = deleteStore.delete(datasetId);

        deleteRequest.onsuccess = () => {
            alert(translations[currentLanguage]["delete-success"] || "Dataset deleted successfully.");
            // Refresh the view
            viewDataBtn.click();
        };

        deleteRequest.onerror = () => {
            alert(translations[currentLanguage]["error-message"] + " Failed to delete dataset.");
        };
    };

    getRequest.onerror = () => {
        alert(translations[currentLanguage]["error-message"]);
    };
}

function getDatasetExportHeaders() {
    return [
        'Ticket Number (New)',
        'Old Device Type',
        'Old Device Model',
        'Old Asset ID',
        'Old Serial Number',
        'Old User',
        'Old User ID',
        'Old User Data',
        'Old Swap Reason / Defect',
        'Old Cost Center',
        'New Device Type',
        'New Device Model',
        'New Asset ID',
        'New Serial Number',
        'New User',
        'New User ID',
        'New User Data',
        'New Cost Center',
        'iPad No Spare Device',
        'iPad Return Message'
    ];
}

function buildDatasetExportRows(datasets) {
    return datasets.map((dataset) => {
        const oldDevice = dataset.oldDevice || {};
        const newDevice = dataset.newDevice || {};
        const iPadNoReplacement = isIpadNoReplacementDataset(dataset);
        const iPadReturnMessage = iPadNoReplacement ? getIpadReturnMessageText() : '';

        return [
            newDevice.ticket || 'N/A',
            oldDevice.type || 'N/A',
            oldDevice.version || 'N/A',
            oldDevice.assetid || 'N/A',
            oldDevice.serialnumber || 'N/A',
            oldDevice.user || 'N/A',
            oldDevice.userid || 'N/A',
            oldDevice.userdata || 'N/A',
            oldDevice.swapReason || 'N/A',
            oldDevice.costcenter || 'N/A',
            newDevice.type || 'N/A',
            newDevice.version || 'N/A',
            newDevice.assetid || 'N/A',
            newDevice.serialnumber || 'N/A',
            newDevice.user || 'N/A',
            newDevice.userid || 'N/A',
            newDevice.userdata || 'N/A',
            newDevice.costcenter || 'N/A',
            iPadNoReplacement ? 'Yes' : 'No',
            iPadReturnMessage
        ];
    });
}

function downloadCsv(headers, rows) {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Datenbank nicht bereit.");
        return;
    }

    function escapeCsvField(val) {
        if (val === undefined || val === null) return '""';
        const s = String(val);
        return '"' + s.replace(/"/g, '""') + '"';
    }

    const csvRows = [headers.map(escapeCsvField).join(',')];
    rows.forEach((row) => {
        csvRows.push(row.map(escapeCsvField).join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'datensaetze.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function downloadSpreadsheet(headers, rows, format) {
    if (!window.XLSX) {
        alert(translations[currentLanguage]['export-format-missing-lib'] || 'XLSX library missing.');
        return;
    }

    const table = [headers, ...rows];
    const sheet = XLSX.utils.aoa_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Datasets');
    XLSX.writeFile(workbook, `datensaetze.${format}`, { bookType: format });
}

// Funktion zum Exportieren aller Datensätze als CSV/XLSX/ODS
function exportToCSV() {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Datenbank nicht bereit.");
        return;
    }

    const exportFormatSelect = document.getElementById('exportDataFormat');
    const selectedFormat = (exportFormatSelect?.value || 'csv').toLowerCase();

    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.getAll();

    request.onsuccess = (event) => {
        const datasets = event.target.result;
        if (!datasets || datasets.length === 0) {
            alert(translations[currentLanguage]["no-devices"]);
            return;
        }

        const headers = getDatasetExportHeaders();
        const rows = buildDatasetExportRows(datasets);

        if (selectedFormat === 'xlsx' || selectedFormat === 'ods') {
            downloadSpreadsheet(headers, rows, selectedFormat);
            return;
        }

        downloadCsv(headers, rows);
    };
}

// Import datasets from CSV file
function importFromCSV(file) {
    if (!db) {
        alert(translations[currentLanguage]["error-message"] + " Database not ready.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const csv = event.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                alert('CSV file is empty or invalid.');
                return;
            }

            // First, get all existing datasets to check for duplicates
            const getTransaction = db.transaction(['datasets'], 'readonly');
            const getStore = getTransaction.objectStore('datasets');
            const getAllRequest = getStore.getAll();

            getAllRequest.onsuccess = () => {
                const existingDatasets = getAllRequest.result;
                const existingTickets = new Set();
                
                // Extract all existing ticket numbers (new device tickets)
                existingDatasets.forEach(dataset => {
                    const normalized = String(dataset.ticketKey || dataset?.newDevice?.ticket || dataset?.oldDevice?.ticket || '').trim().toLowerCase();
                    if (normalized) {
                        existingTickets.add(normalized);
                    }
                });

                // Skip header row (first line)
                const dataRows = lines.slice(1);
                let importedCount = 0;
                let skippedCount = 0;
                let errorCount = 0;
                let completedCount = 0;
                let totalToProcess = 0;

                // Process single rows (combined old + new device data)
                for (let i = 0; i < dataRows.length; i++) {
                    try {
                        const row = parseCSVLine(dataRows[i]);

                        if (row.length < 17) {
                            errorCount++;
                            completedCount++;
                            continue;
                        }

                        const hasSwapReasonColumn = row.length >= 18;
                        const oldCostCenterIndex = hasSwapReasonColumn ? 9 : 8;
                        const newBaseIndex = hasSwapReasonColumn ? 10 : 9;

                        const ticketNumber = row[0]; // new device ticket
                        const normalizedTicket = String(ticketNumber || '').trim().toLowerCase();

                        // Check if ticket already exists
                        if (existingTickets.has(normalizedTicket)) {
                            skippedCount++;
                            completedCount++;
                            continue;
                        }

                        const oldDevice = {
                            ticket: ticketNumber,
                            type: row[1],
                            version: row[2],
                            assetid: row[3],
                            serialnumber: row[4],
                            user: row[5],
                            userid: row[6],
                            userdata: row[7],
                            swapReason: hasSwapReasonColumn ? row[8] : '',
                            costcenter: row[oldCostCenterIndex]
                        };

                        const newDevice = {
                            ticket: ticketNumber,
                            type: row[newBaseIndex],
                            version: row[newBaseIndex + 1],
                            assetid: row[newBaseIndex + 2],
                            serialnumber: row[newBaseIndex + 3],
                            user: row[newBaseIndex + 4],
                            userid: row[newBaseIndex + 5],
                            userdata: row[newBaseIndex + 6],
                            costcenter: row[newBaseIndex + 7]
                        };

                        const dataset = {
                            oldDevice: oldDevice,
                            newDevice: newDevice,
                            ticketKey: String(ticketNumber || '').trim().toLowerCase(),
                            date: new Date().toISOString()
                        };

                        totalToProcess++;
                        const transaction = db.transaction(['datasets'], 'readwrite');
                        const store = transaction.objectStore('datasets');
                        store.add(dataset);

                        transaction.onsuccess = () => {
                            importedCount++;
                            completedCount++;
                            checkIfComplete();
                        };

                        transaction.onerror = () => {
                            errorCount++;
                            completedCount++;
                            checkIfComplete();
                        };
                    } catch (e) {
                        errorCount++;
                        completedCount++;
                        console.error('Error parsing row:', e);
                    }
                }

                // Function to check if import is complete
                function checkIfComplete() {
                    if (completedCount === totalToProcess + errorCount + skippedCount) {
                        showImportMessage();
                    }
                }

                // Function to show the import result message
                function showImportMessage() {
                    let message = `Import complete: ${importedCount} datasets imported successfully.`;
                    if (skippedCount > 0) {
                        message += ` ${skippedCount} datasets skipped (ticket number already exists).`;
                    }
                    if (errorCount > 0) {
                        message += ` ${errorCount} errors.`;
                    }
                    alert(message);
                    // Refresh the view
                    viewDataBtn.click();
                }

                // If nothing to process, show message immediately
                if (totalToProcess === 0) {
                    setTimeout(showImportMessage, 200);
                }
            };

            getAllRequest.onerror = () => {
                alert('Error reading existing datasets.');
            };
        } catch (e) {
            console.error('CSV import error:', e);
            alert('Error reading CSV file: ' + e.message);
        }
    };

    reader.readAsText(file);
}

// Helper function to parse CSV line, handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Export last saved dataset to PDF using html2pdf (client-side)
function exportToPDF() {
    getNewestDatasetFromDB((newestDataset) => {
        if (newestDataset) {
            exportDatasetToPDF(newestDataset);
        }
    });
}

// Export a specific dataset to PDF
function exportDatasetToPDF(dataset) {
    if (!dataset || !dataset.oldDevice || !dataset.newDevice) {
        alert(translations[currentLanguage]['no-devices']);
        return;
    }
    // Choose rendering strategy: prefer html2canvas + jsPDF, fall back to html2pdf bundle
    const hasHtml2Canvas = typeof html2canvas === 'function' || !!window.html2canvas;
    const hasJsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || window.jspdf;
    const hasHtml2Pdf = typeof html2pdf !== 'undefined';
    if (!hasHtml2Canvas && !hasHtml2Pdf) {
        alert('PDF export library not loaded.');
        return;
    }

    // Create expanded card for PDF export
    const expandedCard = createDatasetCardForPrint(dataset);
    const cloneWrapper = document.createElement('div');
    cloneWrapper.className = 'pdf-export';
    const swapProtocolTitle = translations[currentLanguage]['swap-protocol-title'] || 'Tauschprotokoll';
    const titleEl = document.createElement('h2');
    titleEl.className = 'swap-protocol-title';
    titleEl.textContent = swapProtocolTitle;
    cloneWrapper.appendChild(titleEl);
    cloneWrapper.appendChild(expandedCard);

    // append printed date and signature blocks similar to print dialog
    const printedAt = new Date().toLocaleString();
    const printedLabelRaw = translations[currentLanguage]['printed-at'] || 'Printed At';
    const printedLabel = printedLabelRaw.replace(/[:：]\s*$/u, '');
    const printedEl = document.createElement('p');
    printedEl.className = 'print-generated-at';
    printedEl.textContent = `${printedLabel}: ${printedAt}`;
    cloneWrapper.appendChild(printedEl);

    const techLabel = translations[currentLanguage]['sig-technician'] || 'Technician';
    const custLabel = translations[currentLanguage]['sig-customer'] || 'Customer';
    const locLabel = translations[currentLanguage]['sig-location-date'] || 'Location / Date:';
    const signLabel = translations[currentLanguage]['sig-signature'] || 'Signature:';
    const note = isIpadNoReplacementDataset(dataset)
        ? ''
        : (translations[currentLanguage]['austausch-note'] || 'Exchange device received');
    const deviceResetLabel = translations[currentLanguage]['device-reset'] || 'Device reset';
    const simCardLabel = translations[currentLanguage]['sim-card-removed'] || 'SIM card removed';

    const checkboxesHtml = `
        <div class="print-checkboxes">
            <div class="checkbox-row"><input type="checkbox"> <label>${deviceResetLabel}</label></div>
            <div class="checkbox-row"><input type="checkbox"> <label>${simCardLabel}</label></div>
        </div>
    `;
    cloneWrapper.insertAdjacentHTML('beforeend', checkboxesHtml);

    const signatureHtml = `
        <div class="print-signature-area">
            <div class="print-signatures-vertical">
                <div class="signature-block">
                    <div class="sig-title">${techLabel}</div>
                    <div class="sig-row"><div class="sig-label">${locLabel}</div><div class="sig-line"></div></div>
                    <div class="sig-row"><div class="sig-label">${signLabel}</div><div class="sig-line"></div></div>
                </div>
                <div class="signature-block">
                    <div class="sig-title">${custLabel}</div>
                    ${note ? `<div class="sig-note">${note}</div>` : ''}
                    <div class="sig-row"><div class="sig-label">${locLabel}</div><div class="sig-line"></div></div>
                    <div class="sig-row"><div class="sig-label">${signLabel}</div><div class="sig-line"></div></div>
                </div>
            </div>
        </div>
    `;
    cloneWrapper.insertAdjacentHTML('beforeend', signatureHtml);

    // Use html2pdf to generate a nicely scaled A4 PDF
    const isoDate = new Date().toISOString().split('T')[0];
    // Extract ticket number and user from dataset
    const ticketNumber = dataset.oldDevice.ticket || 'NoTicket';
    const userId = dataset.oldDevice.userid || 'NoUser';
    const filename = `${ticketNumber}_${userId}_${isoDate}.pdf`;

        const orientation = 'portrait';

        // temporarily show modal content in hidden container to ensure styles apply
        const hidden = document.createElement('div');
        hidden.style.position = 'fixed';
        hidden.style.left = '-9999px';
        hidden.appendChild(cloneWrapper);
        document.body.appendChild(hidden);

        // Render to canvas and create a single-page PDF that fits all content onto one side
        if (hasHtml2Canvas && hasJsPDF) {
            const html2canvasFn = (typeof html2canvas === 'function') ? html2canvas : window.html2canvas;
            const canvasPromise = html2canvasFn(cloneWrapper, { scale: 2, useCORS: true });

            canvasPromise.then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : (window.jspdf ? window.jspdf : null));
                if (!jsPDFCtor) {
                    document.body.removeChild(hidden);
                    alert('PDF library not available');
                    return;
                }

                const pdf = new jsPDFCtor({ orientation: orientation, unit: 'pt', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                const imgWidthPx = canvas.width;
                const imgHeightPx = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidthPx, pdfHeight / imgHeightPx);
                const imgWidth = imgWidthPx * ratio;
                const imgHeight = imgHeightPx * ratio;
                const x = (pdfWidth - imgWidth) / 2;
                const y = (pdfHeight - imgHeight) / 2;

                pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                pdf.save(filename);
                document.body.removeChild(hidden);
            }).catch(err => {
                document.body.removeChild(hidden);
                console.error('PDF export failed', err);
                alert('PDF export failed.');
            });
        } else if (hasHtml2Pdf) {
            // fallback: use html2pdf bundle
            const opt = {
                margin: [10, 10, 10, 10],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: orientation }
            };
            html2pdf().set(opt).from(cloneWrapper).save().then(() => {
                document.body.removeChild(hidden);
            }).catch((err) => {
                document.body.removeChild(hidden);
                console.error('PDF export failed', err);
                alert('PDF export failed.');
            });
        } else {
            document.body.removeChild(hidden);
            alert('No compatible PDF export libraries found.');
        }
}

// Button zum Exportieren hinzufügen
const exportBtn = document.createElement('button');
exportBtn.id = 'exportData';
exportBtn.className = 'button secondary';
exportBtn.classList.add('modal-action-button');
exportBtn.textContent = translations[currentLanguage]["export-button"] || 'Exportieren';
exportBtn.addEventListener('click', exportToCSV);

const exportFormatSelect = document.createElement('select');
exportFormatSelect.id = 'exportDataFormat';
exportFormatSelect.className = 'modal-export-format';
exportFormatSelect.innerHTML = `
    <option value="csv">${translations[currentLanguage]['export-format-csv'] || 'CSV'}</option>
    <option value="xlsx">${translations[currentLanguage]['export-format-xlsx'] || 'Excel (.xlsx)'}</option>
    <option value="ods">${translations[currentLanguage]['export-format-ods'] || 'LibreOffice (.ods)'}</option>
`;

// Place export button in the container next to dropdown
const exportButtonContainer = document.getElementById('exportButtonContainer');
if (exportButtonContainer) {
    exportButtonContainer.appendChild(exportFormatSelect);
    exportButtonContainer.appendChild(exportBtn);
}

// Button zum Importieren hinzufügen
const importBtn = document.createElement('button');
importBtn.id = 'importData';
importBtn.className = 'button secondary';
importBtn.classList.add('modal-action-button');
importBtn.textContent = translations[currentLanguage]["import-button"] || 'Importieren';
importBtn.addEventListener('click', () => {
    document.getElementById('csvFileInput').click();
});

// Place import button in the container next to export button
const importButtonContainer = document.getElementById('importButtonContainer');
if (importButtonContainer) {
    importButtonContainer.appendChild(importBtn);
}

// Button zum Aktualisieren hinzufügen
const refreshBtn = document.createElement('button');
refreshBtn.id = 'refreshData';
refreshBtn.className = 'button secondary';
refreshBtn.classList.add('modal-action-button', 'refresh-button');
refreshBtn.textContent = '🔄';
refreshBtn.addEventListener('click', () => {
    viewDataBtn.click();
});

// Place refresh button in the container next to import button
const refreshButtonContainer = document.getElementById('refreshButtonContainer');
if (refreshButtonContainer) {
    refreshButtonContainer.appendChild(refreshBtn);
}

// Handle file selection for import
const csvFileInput = document.getElementById('csvFileInput');
if (csvFileInput) {
    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importFromCSV(file);
            // Reset file input
            csvFileInput.value = '';
        }
    });
}

// Attach event listeners to buttons in HTML
const printDataBtn = document.getElementById('printData');
const exportPdfBtn = document.getElementById('exportPdf');

if (printDataBtn) {
    printDataBtn.addEventListener('click', openPrintDialog);
}
if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', exportToPDF);
}

const printDeliveryNoteBtn  = document.getElementById('printDeliveryNote');
const exportDeliveryNotePdfBtn = document.getElementById('exportDeliveryNotePdf');

if (printDeliveryNoteBtn) {
    printDeliveryNoteBtn.addEventListener('click', openDeliveryNotePrint);
}
if (exportDeliveryNotePdfBtn) {
    exportDeliveryNotePdfBtn.addEventListener('click', openDeliveryNoteExport);
}

// Update dynamic button labels when language changes
function refreshButtonLabels() {
    const pb = document.getElementById('printData');
    const eb = document.getElementById('exportData');
    const ib = document.getElementById('importData');
    const rb = document.getElementById('refreshData');
    const epb = document.getElementById('exportPdf');
    const selector = document.getElementById('datasetSelector');
    const exportFormat = document.getElementById('exportDataFormat');
    
    if (pb) pb.textContent = translations[currentLanguage]['print-button'] || pb.textContent;
    if (eb) eb.textContent = translations[currentLanguage]['export-button'] || eb.textContent;
    if (ib) ib.textContent = translations[currentLanguage]['import-button'] || ib.textContent;
    if (rb) rb.textContent = '🔄 ' + (translations[currentLanguage]['refresh-button'] || rb.textContent);
    if (epb) epb.textContent = translations[currentLanguage]['export-pdf-button'] || epb.textContent;

    if (exportFormat && exportFormat.options.length >= 3) {
        exportFormat.options[0].textContent = translations[currentLanguage]['export-format-csv'] || exportFormat.options[0].textContent;
        exportFormat.options[1].textContent = translations[currentLanguage]['export-format-xlsx'] || exportFormat.options[1].textContent;
        exportFormat.options[2].textContent = translations[currentLanguage]['export-format-ods'] || exportFormat.options[2].textContent;
    }

    const pdnb2 = document.getElementById('printDeliveryNote');
    const ednb2 = document.getElementById('exportDeliveryNotePdf');
    if (pdnb2) pdnb2.textContent = translations[currentLanguage]['print-delivery-note-button'] || pdnb2.textContent;
    if (ednb2) ednb2.textContent = translations[currentLanguage]['export-delivery-note-pdf-button'] || ednb2.textContent;
    
    // Update dataset selector placeholder option
    if (selector && selector.options[0]) {
        selector.options[0].textContent = translations[currentLanguage]['select-ticket-label'] || selector.options[0].textContent;
    }
}


/* Übersetzungen ergänzen
translations.de.print-button = "Drucken";
translations.de.export-button = "Exportieren";
translations.en.print-button = "Print";
translations.en.export-button = "Export";*/

/* Night-sky starfield animation for Dark mode
   - Canvas `#night-sky` is inserted behind the UI.
   - Animation runs only while dark-mode is active (detected via data-theme, body.dark, or localStorage.theme).
   - Uses a MutationObserver and storage event to react to theme changes.
*/
(function(){
    const canvas = document.getElementById('night-sky');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let rafId = null;
    let running = false;

    function isDarkMode() {
        const byAttr = document.documentElement.getAttribute('data-theme') === 'dark';
        const byBody = document.body && document.body.classList && document.body.classList.contains('dark');
        const byStorage = localStorage.getItem('theme') === 'dark';
        return byAttr || byBody || byStorage;
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initStars();
    }

    function initStars() {
        const w = Math.max(1, canvas.clientWidth || window.innerWidth);
        const h = Math.max(1, canvas.clientHeight || window.innerHeight);
        const area = w * h;
        // density factor: tuned for performance/visual balance
        const density = 0.00012; // stars per px
        const count = Math.min(900, Math.max(60, Math.floor(area * density)));
        stars = [];
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 1.3 + 0.2; // radius
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: r,
                baseAlpha: 0.3 + Math.random() * 0.7,
                phase: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.01
            });
        }
    }

    function draw() {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        // faint background gradient to give depth
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, 'rgba(6,10,25,0.9)');
        g.addColorStop(1, 'rgba(2,6,20,0.85)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.phase += s.speed;
            const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));

            // draw glow
            const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
            grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
            grad.addColorStop(0.4, `rgba(180,200,255,${alpha * 0.25})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        rafId = requestAnimationFrame(draw);
    }

    function start() {
        if (running) return;
        running = true;
        resize();
        rafId = requestAnimationFrame(draw);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        // clear canvas when stopped
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // react to theme changes
    function applyAccordingTheme() {
        if (isDarkMode()) {
            start();
        } else {
            stop();
        }
    }

    // Observe attribute changes on <html> (data-theme) and body class changes
    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === 'attributes') {
                applyAccordingTheme();
                break;
            }
        }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // storage event for other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') applyAccordingTheme();
    });

    // responsive
    window.addEventListener('resize', () => {
        if (running) resize();
    });

    // start/stop according to initial state
    document.addEventListener('DOMContentLoaded', applyAccordingTheme);
    // also attempt immediate run in case DOMContentLoaded already fired
    applyAccordingTheme();
})();

/* Light-mode moving clouds animation attached to #day-sky */
(function(){
    const canvas = document.getElementById('day-sky');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let clouds = [];
    let rafId = null;
    let running = false;

    function isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark' || (document.body && document.body.classList && document.body.classList.contains('dark')) || localStorage.getItem('theme') === 'dark';
    }
    function isLightMode() { return !isDarkMode(); }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initClouds();
    }

    function initClouds() {
        const w = Math.max(1, canvas.clientWidth || window.innerWidth);
        const h = Math.max(1, canvas.clientHeight || window.innerHeight);
        // target ~1 cloud per 160-240px width (clamped)
        const count = Math.min(18, Math.max(3, Math.floor(w / 160)));
        clouds = [];
        for (let i = 0; i < count; i++) {
            clouds.push({
                x: Math.random() * w,
                y: Math.random() * h * 0.6,
                scale: 0.6 + Math.random() * 1.4,
                speed: 0.5 + Math.random() * 2.2,
                alpha: 0.45 + Math.random() * 0.35
            });
        }
    }

    function drawCloud(c) {
        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.translate(c.x, c.y);
        ctx.scale(c.scale, c.scale);

        // draw a fluffy cloud composed of several radial gradients
        const parts = 6;
        for (let i = 0; i < parts; i++) {
            const cx = (i - 2.5) * 40 + Math.sin((c.x + i * 100) * 0.003) * 8;
            const cy = Math.sin(i * 0.5) * 6;
            const r = 36 + Math.abs(Math.cos(i)) * 18;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
            grad.addColorStop(0, 'rgba(255,255,255,0.95)');
            grad.addColorStop(0.6, 'rgba(255,255,255,0.9)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function draw() {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        // subtle sky gradient (slightly darker blue)
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#d0e8ff');
        g.addColorStop(1, '#eef8ff');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        // gentle parallax: slightly darker near top
        ctx.fillStyle = 'rgba(225,235,245,0.28)';
        ctx.fillRect(0, 0, w, h * 0.18);

        // update & draw clouds
        for (let i = 0; i < clouds.length; i++) {
            const c = clouds[i];
            c.x += c.speed * 1.5; // overall calm movement
            if (c.x - 400 > w) c.x = -400;
            drawCloud(c);
        }

        rafId = requestAnimationFrame(draw);
    }

    function start() {
        if (running) return;
        running = true;
        resize();
        rafId = requestAnimationFrame(draw);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // react to theme changes
    const mo = new MutationObserver(() => { if (isLightMode()) start(); else stop(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('storage', (e) => { if (e.key === 'theme') { if (isLightMode()) start(); else stop(); } });
    window.addEventListener('resize', () => { if (running) resize(); });

    document.addEventListener('DOMContentLoaded', () => { if (isLightMode()) start(); });
    // if DOM already loaded
    if (isLightMode()) start();
})();

function refreshAllVersionFilters() {
    versionFilterRefreshers.forEach((refreshFn) => {
        if (typeof refreshFn === 'function') {
            refreshFn();
        }
    });
}

function getInventoryModelsForType(typeName) {
    const selectedTypeKey = normalizeTypeToken(typeName);
    if (!selectedTypeKey) {
        return [];
    }

    return Array.from(new Set(
        inventoryAssets
            .filter((asset) => normalizeTypeToken(asset.type) === selectedTypeKey)
            .map((asset) => formatCanonicalModelLabel(asset.version))
            .filter((value) => !!value)
    )).sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
}

// Filter version options based on device type selection.
function filterVersionOptions(typeSelectId, versionSelectId) {
    const typeSelect = document.getElementById(typeSelectId);
    const versionSelect = document.getElementById(versionSelectId);
    
    if (!typeSelect || !versionSelect) return;

    const updateVersions = () => {
        const selectedType = typeSelect.value;
        const currentValue = versionSelect.value;

        Array.from(versionSelect.querySelectorAll('option[data-dynamic-version="1"]')).forEach((option) => option.remove());
        Array.from(versionSelect.querySelectorAll('option[data-managed-model-version="1"]')).forEach((option) => option.remove());
    
        Array.from(versionSelect.options).forEach(option => {
            if (option.value === '') {
                option.hidden = false;
            } else {
                const optionType = option.getAttribute('data-type');
                option.hidden = selectedType ? optionType !== selectedType : false;
            }
        });

        const valuesInSelect = new Set(Array.from(versionSelect.options).map((option) => normalizeModelToken(option.value)));
        const dynamicModels = selectedType ? getInventoryModelsForType(selectedType) : [];
        const managedModels = selectedType
            ? loadManagedModels()
                .filter((entry) => normalizeTypeToken(entry.type) === normalizeTypeToken(selectedType))
                .map((entry) => entry.name)
            : [];

        managedModels.forEach((model) => {
            if (valuesInSelect.has(normalizeModelToken(model))) {
                return;
            }

            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            option.setAttribute('data-type', selectedType);
            option.setAttribute('data-managed-model-version', '1');
            versionSelect.appendChild(option);
            valuesInSelect.add(normalizeModelToken(model));
        });

        dynamicModels.forEach((model) => {
            if (valuesInSelect.has(normalizeModelToken(model))) {
                return;
            }

            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            option.setAttribute('data-type', selectedType);
            option.setAttribute('data-dynamic-version', '1');
            versionSelect.appendChild(option);
            valuesInSelect.add(normalizeModelToken(model));
        });

        const exactMatch = Array.from(versionSelect.options).find((option) => option.value === currentValue && !option.hidden);
        const normalizedMatch = Array.from(versionSelect.options).find((option) => (
            !option.hidden && normalizeModelToken(option.value) === normalizeModelToken(currentValue)
        ));
        if (currentValue && exactMatch) {
            versionSelect.value = currentValue;
        } else if (currentValue && normalizedMatch) {
            versionSelect.value = normalizedMatch.value;
        } else {
            versionSelect.value = '';
        }

        if (typeSelectId === 'new-type' && typeof updateNewAssetIdOptions === 'function') {
            updateNewAssetIdOptions();
        }
    };
    
    typeSelect.addEventListener('change', updateVersions);
    versionFilterRefreshers.push(updateVersions);
    
    updateVersions();
}

// Initialize version filtering for both old and new device forms
document.addEventListener('DOMContentLoaded', () => {
    syncManagedTypeOptions();
    filterVersionOptions('old-type', 'old-version');
    filterVersionOptions('new-type', 'new-version');
    loadInventoryAssets();
    
    // Sync device type from old to new
    const oldTypeSelect = document.getElementById('old-type');
    const newTypeSelect = document.getElementById('new-type');
    
    if (oldTypeSelect && newTypeSelect) {
        oldTypeSelect.addEventListener('change', () => {
            newTypeSelect.value = oldTypeSelect.value;
            // Trigger change event on new-type to update version options
            newTypeSelect.dispatchEvent(new Event('change'));
            applyIpadNoReplacementFormState();
        });
    }

    const newTypeSelectForAssets = document.getElementById('new-type');
    const newVersionSelect = document.getElementById('new-version');
    const newAssetIdSelect = document.getElementById('new-assetid');
    if (newTypeSelectForAssets) {
        newTypeSelectForAssets.addEventListener('change', () => updateNewAssetIdOptions());
    }
    if (newVersionSelect) {
        newVersionSelect.addEventListener('change', () => updateNewAssetIdOptions());
    }
    if (newAssetIdSelect) {
        newAssetIdSelect.addEventListener('change', () => syncNewSerialNumberFromInventory());
    }

    const ipadNoSpareCheckbox = document.getElementById('ipad-no-spare-checkbox');
    if (ipadNoSpareCheckbox) {
        ipadNoSpareCheckbox.addEventListener('change', applyIpadNoReplacementFormState);
    }

    applyIpadNoReplacementFormState();
});

window.addEventListener('focus', () => {
    loadInventoryAssets();
});

window.addEventListener('storage', (event) => {
    if (event.key === MANAGED_DEVICE_TYPES_KEY || event.key === MANAGED_MODELS_KEY) {
        syncManagedTypeOptions();
        refreshAllVersionFilters();
        updateNewAssetIdOptions();
    }
});
