const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 2;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_DEFAULTS_STORE = 'inventory_defaults';
const DEFAULTS_RECORD_ID = 'globalDefaults';
const INVENTORY_CLEAR_ONCE_KEY = 'mdmtool_inventory_cleared_2026_04_19';

const ASSET_COLUMNS = [
    { key: 'type', labelDe: 'Geraetetyp', labelEn: 'Device Type' },
    { key: 'version', labelDe: 'Version', labelEn: 'Version' },
    { key: 'assetid', labelDe: 'Asset-ID', labelEn: 'Asset ID' },
    { key: 'serialnumber', labelDe: 'Seriennummer', labelEn: 'Serial Number' },
    { key: 'assigned', labelDe: 'Zugewiesen', labelEn: 'Assigned To' },
    { key: 'managedby', labelDe: 'Verwaltet von', labelEn: 'Managed By' },
    { key: 'costcenter', labelDe: 'Kostenstelle', labelEn: 'Cost Center' }
];

const ASSET_IMPORT_KEYS = ['type', 'version', 'assetid', 'serialnumber'];

const HEADER_ALIASES = {
    type: ['type', 'geraetetyp', 'geraetetyp', 'device type'],
    version: ['version'],
    assetid: ['assetid', 'asset-id', 'asset id'],
    serialnumber: ['serialnumber', 'seriennummer', 'serial number']
};

const REQUIRED_IMPORT_KEYS = ['assetid'];
const REQUIRED_DEFAULT_KEYS = ['assigned', 'managedby', 'costcenter'];
const ALLOWED_DEVICE_TYPES = ['iphone', 'ipad', 'macbook'];
const DEVICE_TYPE_ALIASES = {
    iphone: 'iPhone',
    'type-iphone': 'iPhone',
    ipad: 'iPad',
    'type-ipad': 'iPad',
    macbook: 'MacBook',
    'type-macbook': 'MacBook'
};

// Mirrors the selectable versions and data-type mapping from singleswap.html.
const VERSION_DEVICE_TYPE_MAP = {
    'iphone se': 'iPhone',
    'iphone 13': 'iPhone',
    'iphone 15': 'iPhone',
    'iphone 15 pro': 'iPhone',
    'iphone 16e': 'iPhone',
    'iphone 17': 'iPhone',
    'ipad pro': 'iPad',
    'ipad air': 'iPad',
    'ipad mini': 'iPad',
    'macbook air': 'MacBook',
    'macbook pro': 'MacBook'
};

let assetRows = [];
let selectedFile = null;
let lastValidationReport = [];
let inventoryDefaults = {
    assigned: '',
    managedby: '',
    costcenter: ''
};

const fileInput = document.getElementById('assetFileInput');
const pickFileButton = document.getElementById('assetPickFile');
const importButton = document.getElementById('assetImportButton');
const exportButton = document.getElementById('assetExportButton');
const exportFormat = document.getElementById('assetExportFormat');
const statusBox = document.getElementById('assetStatus');
const tableHead = document.querySelector('#assetTable thead');
const tableBody = document.querySelector('#assetTable tbody');
const validationReport = document.getElementById('assetValidationReport');
const validationTitle = document.getElementById('assetValidationTitle');
const validationTableHead = document.querySelector('#assetValidationTable thead');
const validationTableBody = document.querySelector('#assetValidationTable tbody');
const validationRefreshButton = document.getElementById('assetValidationRefresh');

const defaultAssignedInput = document.getElementById('defaultAssigned');
const defaultManagedByInput = document.getElementById('defaultManagedBy');
const defaultCostcenterInput = document.getElementById('defaultCostcenter');
const saveDefaultsButton = document.getElementById('saveDefaultsButton');
const clearInventoryButton = document.getElementById('clearInventoryButton');
const defaultsTableHead = document.querySelector('#assetDefaultsTable thead');
const defaultsTableBody = document.querySelector('#assetDefaultsTable tbody');

function getCurrentLanguage() {
    return localStorage.getItem('language') || 'de';
}

function t(deText, enText) {
    return getCurrentLanguage() === 'en' ? enText : deText;
}

function normalizeHeader(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[ä]/g, 'ae')
        .replace(/[ö]/g, 'oe')
        .replace(/[ü]/g, 'ue')
        .replace(/[^a-z0-9\-\s]/g, '');
}

function mapHeaderToKey(header) {
    const normalized = normalizeHeader(header);
    const keys = Object.keys(HEADER_ALIASES);
    for (const key of keys) {
        if (HEADER_ALIASES[key].includes(normalized)) {
            return key;
        }
    }
    return null;
}

function sanitizeRow(row) {
    const clean = {};
    ASSET_COLUMNS.forEach((col) => {
        clean[col.key] = String(row[col.key] || '').trim();
    });
    return clean;
}

function sanitizeDefaults(raw) {
    return {
        assigned: String(raw?.assigned || '').trim(),
        managedby: String(raw?.managedby || '').trim(),
        costcenter: String(raw?.costcenter || '').trim()
    };
}

function normalizeAssetId(assetId) {
    return String(assetId || '').trim().toLowerCase();
}

function assetIdKeyFromRow(row) {
    return normalizeAssetId(row.assetid);
}

function normalizeTypeValue(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '');
}

function canonicalDeviceType(value) {
    const key = normalizeTypeValue(value);
    return DEVICE_TYPE_ALIASES[key] || '';
}

function normalizeVersionValue(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

function expectedTypeForVersion(version) {
    const key = normalizeVersionValue(version);
    return VERSION_DEVICE_TYPE_MAP[key] || '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showStatus(message, isError = false) {
    statusBox.textContent = message;
    statusBox.style.background = isError ? 'rgba(180, 73, 73, 0.14)' : 'rgba(52, 73, 99, 0.08)';
}

function renderTable() {
    const lang = getCurrentLanguage();

    const headerCells = ASSET_COLUMNS
        .map((col) => `<th>${lang === 'en' ? col.labelEn : col.labelDe}</th>`)
        .join('');
    tableHead.innerHTML = `<tr>${headerCells}</tr>`;

    if (assetRows.length === 0) {
        const emptyText = t('Noch keine Daten vorhanden.', 'No data available yet.');
        tableBody.innerHTML = `<tr><td colspan="${ASSET_COLUMNS.length}">${emptyText}</td></tr>`;
        return;
    }

    const rowsHtml = assetRows
        .map((row) => {
            const cells = ASSET_COLUMNS
                .map((col) => `<td>${escapeHtml(row[col.key])}</td>`)
                .join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');

    tableBody.innerHTML = rowsHtml;
}

function getColumnLabel(columnKey) {
    const found = ASSET_COLUMNS.find((col) => col.key === columnKey);
    if (!found) {
        return columnKey;
    }
    return getCurrentLanguage() === 'en' ? found.labelEn : found.labelDe;
}

function readDefaultsFromInputs() {
    return sanitizeDefaults({
        assigned: defaultAssignedInput?.value || '',
        managedby: defaultManagedByInput?.value || '',
        costcenter: defaultCostcenterInput?.value || ''
    });
}

function applyDefaultsToInputs(defaults) {
    if (defaultAssignedInput) {
        defaultAssignedInput.value = defaults.assigned;
    }
    if (defaultManagedByInput) {
        defaultManagedByInput.value = defaults.managedby;
    }
    if (defaultCostcenterInput) {
        defaultCostcenterInput.value = defaults.costcenter;
    }
}

function renderDefaultsTable() {
    if (!defaultsTableHead || !defaultsTableBody) {
        return;
    }

    defaultsTableHead.innerHTML = `<tr>
        <th>${t('Feld', 'Field')}</th>
        <th>${t('Standardwert', 'Default Value')}</th>
    </tr>`;

    const rows = [
        { label: t('Zugewiesen', 'Assigned To'), value: inventoryDefaults.assigned },
        { label: t('Verwaltet von', 'Managed By'), value: inventoryDefaults.managedby },
        { label: t('Kostenstelle', 'Cost Center'), value: inventoryDefaults.costcenter }
    ];

    defaultsTableBody.innerHTML = rows
        .map((row) => `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.value || '-')}</td></tr>`)
        .join('');
}

function validateDefaultValues(defaults) {
    const missing = REQUIRED_DEFAULT_KEYS.filter((key) => !defaults[key]);
    return missing;
}

function validateRowData(row) {
    const errors = [];

    REQUIRED_IMPORT_KEYS.forEach((key) => {
        if (!row[key]) {
            errors.push(
                t(
                    `Pflichtfeld fehlt: ${getColumnLabel(key)}`,
                    `Missing required field: ${getColumnLabel(key)}`
                )
            );
        }
    });

    const normalizedType = canonicalDeviceType(row.type);

    if (row.type && !normalizedType) {
        errors.push(
            t(
                `Unbekannter Geraetetyp: ${row.type}`,
                `Unknown device type: ${row.type}`
            )
        );
    }

    if (normalizedType) {
        row.type = normalizedType;
    }

    const versionExpectedType = expectedTypeForVersion(row.version);

    if (row.version && !versionExpectedType) {
        errors.push(
            t(
                `Unbekannte Version: ${row.version}`,
                `Unknown version: ${row.version}`
            )
        );
    }

    if (versionExpectedType && !normalizedType) {
        errors.push(
            t(
                `Geraetetyp fehlt fuer Version: ${row.version}`,
                `Device type is missing for version: ${row.version}`
            )
        );
    }

    if (versionExpectedType && normalizedType && versionExpectedType !== normalizedType) {
        errors.push(
            t(
                `Geraetetyp und Version passen nicht zusammen: ${row.type} / ${row.version}`,
                `Device type and version do not match: ${row.type} / ${row.version}`
            )
        );
    }

    return errors;
}

function getReportStatusLabel(status) {
    if (status === 'imported') {
        return t('Importiert', 'Imported');
    }
    if (status === 'duplicate') {
        return t('Duplikat', 'Duplicate');
    }
    return t('Ungueltig', 'Invalid');
}

function getReportStatusClass(status) {
    if (status === 'imported') {
        return 'imported';
    }
    if (status === 'duplicate') {
        return 'duplicate';
    }
    return 'invalid';
}

function renderValidationReport(reportRows) {
    if (!validationReport || !validationTableHead || !validationTableBody || !validationTitle) {
        return;
    }

    if (!Array.isArray(reportRows) || reportRows.length === 0) {
        lastValidationReport = [];
        validationReport.classList.add('hidden');
        validationTableHead.innerHTML = '';
        validationTableBody.innerHTML = '';
        return;
    }

    lastValidationReport = reportRows;

    validationReport.classList.remove('hidden');
    validationTitle.textContent = t('Validierungsbericht', 'Validation Report');

    validationTableHead.innerHTML = `<tr>
        <th>${t('Zeile', 'Row')}</th>
        <th>${t('Status', 'Status')}</th>
        <th>${t('Details', 'Details')}</th>
    </tr>`;

    validationTableBody.innerHTML = reportRows
        .map((entry) => {
            const statusLabel = getReportStatusLabel(entry.status);
            const statusClass = getReportStatusClass(entry.status);
            const details = escapeHtml(entry.details || '');
            return `<tr>
                <td>${entry.rowNumber}</td>
                <td><span class="asset-report-pill ${statusClass}">${escapeHtml(statusLabel)}</span></td>
                <td>${details}</td>
            </tr>`;
        })
        .join('');
}

function toSheetRows(rows) {
    const lang = getCurrentLanguage();
    const header = ASSET_COLUMNS.map((col) => (lang === 'en' ? col.labelEn : col.labelDe));
    const dataRows = rows.map((row) => ASSET_COLUMNS.map((col) => row[col.key] || ''));
    return [header, ...dataRows];
}

function parseImportedWorkbook(workbook) {
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
        return [];
    }

    const firstSheet = workbook.Sheets[firstSheetName];
    const table = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
    if (!Array.isArray(table) || table.length === 0) {
        return [];
    }

    const headerRow = table[0];
    const keyMap = headerRow.map((header) => mapHeaderToKey(header));
    const recognizedColumns = keyMap.filter(Boolean).length;
    if (recognizedColumns === 0) {
        return [];
    }

    const rows = [];
    for (let i = 1; i < table.length; i += 1) {
        const sourceRow = table[i] || [];
        const mapped = {};

        keyMap.forEach((key, idx) => {
            if (key) {
                mapped[key] = sourceRow[idx];
            }
        });

        const clean = sanitizeRow(mapped);
        const hasData = ASSET_IMPORT_KEYS.some((key) => clean[key] !== '');
        if (hasData) {
            rows.push({
                rowNumber: i + 1,
                row: clean
            });
        }
    }

    return rows;
}

function applyDefaultsToRow(row, defaults) {
    return sanitizeRow({
        ...row,
        assigned: defaults.assigned,
        managedby: defaults.managedby,
        costcenter: defaults.costcenter
    });
}

async function importFile(file) {
    if (!window.XLSX) {
        showStatus(t('Import nicht verfuegbar: XLSX-Bibliothek fehlt.', 'Import unavailable: XLSX library missing.'), true);
        return;
    }

    const missingDefaults = validateDefaultValues(inventoryDefaults);
    if (missingDefaults.length > 0) {
        const labels = missingDefaults.map((key) => getColumnLabel(key)).join(', ');
        showStatus(
            t(
                `Bitte zuerst Standardwerte in den Einstellungen setzen: ${labels}`,
                `Please set default values in settings first: ${labels}`
            ),
            true
        );
        return;
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const importedRows = parseImportedWorkbook(workbook);

    if (importedRows.length === 0) {
        showStatus(t('Keine erkennbaren Asset-Daten gefunden. Bitte Header pruefen.', 'No recognizable asset data found. Please check headers.'), true);
        renderValidationReport([]);
        return;
    }

    const merged = [...assetRows];
    const knownAssetIds = new Set(merged.map(assetIdKeyFromRow));
    const importSeenAssetIds = new Set();
    const reportRows = [];
    let added = 0;
    let invalid = 0;
    let duplicates = 0;

    const rowsToInsert = [];

    importedRows.forEach((entry) => {
        const rowWithDefaults = applyDefaultsToRow(entry.row, inventoryDefaults);
        const rowErrors = validateRowData(rowWithDefaults);

        if (rowErrors.length > 0) {
            invalid += 1;
            reportRows.push({
                rowNumber: entry.rowNumber,
                status: 'invalid',
                details: rowErrors.join(' | ')
            });
            return;
        }

        const assetIdKey = assetIdKeyFromRow(rowWithDefaults);
        if (!assetIdKey) {
            invalid += 1;
            reportRows.push({
                rowNumber: entry.rowNumber,
                status: 'invalid',
                details: t('Asset-ID fehlt oder ist ungueltig.', 'Asset ID is missing or invalid.')
            });
            return;
        }

        if (knownAssetIds.has(assetIdKey) || importSeenAssetIds.has(assetIdKey)) {
            duplicates += 1;
            reportRows.push({
                rowNumber: entry.rowNumber,
                status: 'duplicate',
                details: t('Asset-ID bereits vorhanden und uebersprungen.', 'Asset ID already exists and was skipped.')
            });
            return;
        }

        knownAssetIds.add(assetIdKey);
        importSeenAssetIds.add(assetIdKey);
        merged.push(rowWithDefaults);
        rowsToInsert.push({ ...rowWithDefaults, assetidKey: assetIdKey });
        added += 1;
        reportRows.push({
            rowNumber: entry.rowNumber,
            status: 'imported',
            details: t('Zeile erfolgreich importiert.', 'Row imported successfully.')
        });
    });

    if (rowsToInsert.length > 0) {
        const db = await openInventoryDb();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_STORE, 'readwrite');
            const store = tx.objectStore(INVENTORY_STORE);
            rowsToInsert.forEach((row) => {
                store.add(row);
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
        db.close();
    }

    assetRows = merged;
    renderTable();
    renderValidationReport(reportRows);

    showStatus(
        t(
            `${added} Eintraege importiert, ${duplicates} Duplikate, ${invalid} ungueltig.`,
            `${added} rows imported, ${duplicates} duplicates, ${invalid} invalid.`
        )
    );
}

function exportRows() {
    if (!window.XLSX) {
        showStatus(t('Export nicht verfuegbar: XLSX-Bibliothek fehlt.', 'Export unavailable: XLSX library missing.'), true);
        return;
    }

    if (assetRows.length === 0) {
        showStatus(t('Keine Daten zum Exportieren vorhanden.', 'No data available to export.'), true);
        return;
    }

    const format = exportFormat.value || 'csv';
    const rows = toSheetRows(assetRows);
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Assets');

    const datePart = new Date().toISOString().slice(0, 10);
    const filename = `inventory-datasheet-${datePart}.${format}`;

    XLSX.writeFile(wb, filename, { bookType: format });
    showStatus(t('Export erfolgreich erstellt.', 'Export created successfully.'));
}

function openInventoryDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(INVENTORY_DB_NAME, INVENTORY_DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(INVENTORY_STORE)) {
                db.createObjectStore(INVENTORY_STORE, { keyPath: 'assetidKey' });
            }
            if (!db.objectStoreNames.contains(INVENTORY_DEFAULTS_STORE)) {
                db.createObjectStore(INVENTORY_DEFAULTS_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
    });
}

async function loadDefaultsFromDb(db) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_DEFAULTS_STORE, 'readonly');
        const store = tx.objectStore(INVENTORY_DEFAULTS_STORE);
        const request = store.get(DEFAULTS_RECORD_ID);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(sanitizeDefaults(request.result || {}));
    });
}

async function clearImportedInventoryOnceIfNeeded(db) {
    if (localStorage.getItem(INVENTORY_CLEAR_ONCE_KEY) === '1') {
        return false;
    }

    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_STORE);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        tx.onabort = () => reject(tx.error);
    });

    localStorage.setItem(INVENTORY_CLEAR_ONCE_KEY, '1');
    return true;
}

async function saveDefaultsToDb(defaults) {
    const db = await openInventoryDb();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_DEFAULTS_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_DEFAULTS_STORE);
        store.put({ id: DEFAULTS_RECORD_ID, ...defaults });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
    db.close();
}

async function bootstrapRowsAndDefaults() {
    try {
        const db = await openInventoryDb();
        const clearedNow = await clearImportedInventoryOnceIfNeeded(db);

        const rows = await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_STORE);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const records = request.result || [];
                resolve(records.map((record) => sanitizeRow(record)));
            };
        });

        inventoryDefaults = await loadDefaultsFromDb(db);
        db.close();

        assetRows = rows;
        renderTable();
        applyDefaultsToInputs(inventoryDefaults);
        renderDefaultsTable();

        showStatus(
            clearedNow
                ? t('Alle importierten Datensaetze wurden geloescht.', 'All imported records were deleted.')
                : (rows.length > 0
                    ? t('Lagerliste geladen.', 'Inventory list loaded.')
                    : t('Noch keine Assets in der Lagerliste vorhanden.', 'No assets in inventory list yet.'))
        );
    } catch {
        assetRows = [];
        inventoryDefaults = { assigned: '', managedby: '', costcenter: '' };
        renderTable();
        applyDefaultsToInputs(inventoryDefaults);
        renderDefaultsTable();
        showStatus(t('Konnte die Lagerliste nicht laden.', 'Could not load inventory list.'), true);
    }
}

async function handleSaveDefaults() {
    const defaults = readDefaultsFromInputs();
    inventoryDefaults = defaults;

    try {
        await saveDefaultsToDb(defaults);
        renderDefaultsTable();
        showStatus(t('Standardwerte gespeichert.', 'Default values saved.'));
    } catch {
        showStatus(t('Standardwerte konnten nicht gespeichert werden.', 'Could not save default values.'), true);
    }
}

async function handleClearInventory() {
    const confirmed = window.confirm(
        t(
            'Möchten Sie wirklich alle importierten Datensätze löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.',
            'Do you really want to delete all imported records? This cannot be undone.'
        )
    );

    if (!confirmed) {
        return;
    }

    try {
        const db = await openInventoryDb();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_STORE, 'readwrite');
            const store = tx.objectStore(INVENTORY_STORE);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            tx.onabort = () => reject(tx.error);
        });
        db.close();

        assetRows = [];
        selectedFile = null;
        if (fileInput) {
            fileInput.value = '';
        }
        renderTable();
        renderValidationReport([]);
        showStatus(t('Alle Datensätze wurden gelöscht.', 'All records were deleted.'));
    } catch {
        showStatus(t('Datensätze konnten nicht gelöscht werden.', 'Could not delete records.'), true);
    }
}

function bindEvents() {
    pickFileButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        if (selectedFile) {
            showStatus(t(`Datei ausgewaehlt: ${selectedFile.name}`, `Selected file: ${selectedFile.name}`));
        }
    });

    importButton.addEventListener('click', async () => {
        if (!selectedFile) {
            showStatus(t('Bitte zuerst eine Datei auswaehlen.', 'Please choose a file first.'), true);
            return;
        }

        try {
            await importFile(selectedFile);
        } catch {
            showStatus(t('Import fehlgeschlagen. Datei pruefen.', 'Import failed. Please check the file.'), true);
        }
    });

    exportButton.addEventListener('click', () => {
        try {
            exportRows();
        } catch {
            showStatus(t('Export fehlgeschlagen.', 'Export failed.'), true);
        }
    });

    if (saveDefaultsButton) {
        saveDefaultsButton.addEventListener('click', () => {
            handleSaveDefaults();
        });
    }

    if (clearInventoryButton) {
        clearInventoryButton.addEventListener('click', () => {
            handleClearInventory();
        });
    }

    if (validationRefreshButton) {
        validationRefreshButton.addEventListener('click', () => {
            window.location.reload();
        });
    }

    document.addEventListener('mdm-language-changed', () => {
        renderTable();
        renderValidationReport(lastValidationReport);
        renderDefaultsTable();
    });
}

bindEvents();
bootstrapRowsAndDefaults();
