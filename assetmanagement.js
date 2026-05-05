const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 4;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_DEFAULTS_STORE = 'inventory_defaults';
const INVENTORY_MONTHLY_STORE = 'monthly_inventory_movements';
const DEFAULTS_RECORD_ID = 'globalDefaults';
const INVENTORY_CLEAR_ONCE_KEY = 'mdmtool_inventory_cleared_2026_04_19';
const MANAGED_DEVICE_TYPES_KEY = 'mdmtool_managed_device_types_v1';
const MANAGED_MODELS_KEY = 'mdmtool_managed_models_v1';
const DEFAULT_DEVICE_TYPES = [];
const CANONICAL_DEVICE_TYPE_MAP = {};

const ASSET_COLUMNS = [
    { key: 'type', labelDe: 'Gerätetyp', labelEn: 'Device Type' },
    { key: 'version', labelDe: 'Typ', labelEn: 'Model' },
    { key: 'assetid', labelDe: 'Asset-ID', labelEn: 'Asset ID' },
    { key: 'serialnumber', labelDe: 'Seriennummer', labelEn: 'Serial Number' },
    { key: 'assigned', labelDe: 'Zugewiesen', labelEn: 'Assigned To' },
    { key: 'managedby', labelDe: 'Verwaltet von', labelEn: 'Managed By' },
    { key: 'costcenter', labelDe: 'Kostenstelle', labelEn: 'Cost Center' }
];

const ASSET_DETAIL_FIELDS = [
    { key: 'serialnumber', labelDe: 'Seriennummer', labelEn: 'Serial Number', editable: true },
    { key: 'planneddecommissioning', labelDe: 'Geplante Aussonderung', labelEn: 'Planned decommissioning', editable: true },
    { key: 'warrantyexpiration', labelDe: 'Garantieablauf', labelEn: 'Warranty expiration', editable: true }
];

const ASSET_IMPORT_KEYS = ['type', 'version', 'assetid', 'serialnumber'];

const HEADER_ALIASES = {
    type: ['type', 'gerätetyp', 'geraetetyp', 'device type'],
    version: ['version', 'typ', 'modell', 'model'],
    assetid: ['assetid', 'asset-id', 'asset id'],
    serialnumber: ['serialnumber', 'seriennummer', 'serial number']
};

const REQUIRED_IMPORT_KEYS = ['assetid'];
const REQUIRED_DEFAULT_KEYS = ['assigned', 'managedby', 'costcenter'];
const DEFAULT_INVENTORY_DEFAULTS = {
    assigned: 'John Doe',
    managedby: 'Jane Doe',
    costcenter: '1234'
};
const INVENTORY_REQUIRED_STORES = [INVENTORY_STORE, INVENTORY_DEFAULTS_STORE, INVENTORY_MONTHLY_STORE];

const VERSION_DEVICE_TYPE_MAP = {};

let assetRows = [];
let selectedFile = null;
let lastValidationReport = [];
let currentPage = 1;
let pageSize = 10;
let inventoryDefaults = { ...DEFAULT_INVENTORY_DEFAULTS };
let managedDeviceTypes = [];
let managedModels = [];
let editingTypeName = '';
let editingModelKey = '';
let activeAssetDetailId = '';

const fileInput = document.getElementById('assetFileInput');
const pickFileButton = document.getElementById('assetPickFile');
const importButton = document.getElementById('assetImportButton');
const exportButton = document.getElementById('assetExportButton');
const exportFormat = document.getElementById('assetExportFormat');
const statusBox = document.getElementById('assetStatus');
const tableHead = document.querySelector('#assetTable thead');
const tableBody = document.querySelector('#assetTable tbody');
const assetDetailModal = document.getElementById('assetDetailModal');
const assetDetailTitle = document.getElementById('assetDetailTitle');
const assetDetailSubtitle = document.getElementById('assetDetailSubtitle');
const assetDetailBody = document.getElementById('assetDetailBody');
const assetDetailCloseButton = document.getElementById('assetDetailClose');
const validationReport = document.getElementById('assetValidationReport');
const validationTitle = document.getElementById('assetValidationTitle');
const validationTableHead = document.querySelector('#assetValidationTable thead');
const validationTableBody = document.querySelector('#assetValidationTable tbody');
const validationRefreshButton = document.getElementById('assetValidationRefresh');
const assetTypeFilter = document.getElementById('assetTypeFilter');
const assetModelFilter = document.getElementById('assetModelFilter');
const assetSearchInput = document.getElementById('assetSearchInput');
const assetFilterReset = document.getElementById('assetFilterReset');
const assetPagination = document.getElementById('assetPagination');
const assetPaginationInfo = document.getElementById('assetPaginationInfo');
const assetPaginationPages = document.getElementById('assetPaginationPages');

const defaultAssignedInput = document.getElementById('defaultAssigned');
const defaultManagedByInput = document.getElementById('defaultManagedBy');
const defaultCostcenterInput = document.getElementById('defaultCostcenter');
const saveDefaultsButton = document.getElementById('saveDefaultsButton');
const clearInventoryButton = document.getElementById('clearInventoryButton');
const defaultsTableHead = document.querySelector('#assetDefaultsTable thead');
const defaultsTableBody = document.querySelector('#assetDefaultsTable tbody');
const settingsDefaultsTab = document.getElementById('assetSettingsDefaultsTab');
const settingsAdminTab = document.getElementById('assetSettingsAdminTab');
const settingsDefaultsPanel = document.getElementById('assetSettingsDefaultsPanel');
const settingsAdminPanel = document.getElementById('assetSettingsAdminPanel');
const assetAdminHeading = document.getElementById('assetAdminHeading');
const assetAdminTypeLabel = document.getElementById('assetAdminTypeLabel');
const assetAdminTypeInput = document.getElementById('assetAdminTypeInput');
const assetAdminAcceptTypeButton = document.getElementById('assetAdminAcceptTypeButton');
const assetAdminCancelEditButton = document.getElementById('assetAdminCancelEditButton');
const assetTypeAdminTableHead = document.querySelector('#assetTypeAdminTable thead');
const assetTypeAdminTableBody = document.querySelector('#assetTypeAdminTable tbody');
const assetModelAdminHeading = document.getElementById('assetModelAdminHeading');
const assetAdminTypeSubToggle = document.getElementById('assetAdminTypeSubToggle');
const assetAdminTypeSubPanel = document.getElementById('assetAdminTypeSubPanel');
const assetAdminModelSubToggle = document.getElementById('assetAdminModelSubToggle');
const assetAdminModelSubPanel = document.getElementById('assetAdminModelSubPanel');
const assetModelTypeLabel = document.getElementById('assetModelTypeLabel');
const assetModelTypeSelect = document.getElementById('assetModelTypeSelect');
const assetModelAdminLabel = document.getElementById('assetModelAdminLabel');
const assetModelAdminInput = document.getElementById('assetModelAdminInput');
const assetAdminAcceptModelButton = document.getElementById('assetAdminAcceptModelButton');
const assetAdminCancelModelEditButton = document.getElementById('assetAdminCancelModelEditButton');
const assetModelAdminTableHead = document.querySelector('#assetModelAdminTable thead');
const assetModelAdminTableBody = document.querySelector('#assetModelAdminTable tbody');

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
    const reservedKeys = new Set([...ASSET_COLUMNS.map((col) => col.key), 'assetidKey']);

    ASSET_COLUMNS.forEach((col) => {
        clean[col.key] = String(row[col.key] || '').trim();
    });

    clean.type = canonicalStoredDeviceType(clean.type);
    clean.version = canonicalModelName(clean.version, clean.type);

    Object.keys(row || {}).forEach((key) => {
        if (reservedKeys.has(key)) {
            return;
        }

        clean[key] = String(row[key] ?? '').trim();
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
    .replace(/^type[\s_-]*/g, '')
        .replace(/[_\-\s]+/g, '')
}

function canonicalStoredDeviceType(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function canonicalDeviceType(value) {
    const key = normalizeTypeValue(value);
    if (!key) {
        return '';
    }
    const match = managedDeviceTypes.find((typeName) => normalizeTypeValue(typeName) === key);
    return match || '';
}

function sanitizeManagedTypeName(value) {
    return canonicalStoredDeviceType(value);
}

function uniqueSortedTypes(typeNames) {
    const seen = new Set();
    const output = [];

    typeNames.forEach((typeName) => {
        const clean = sanitizeManagedTypeName(typeName);
        if (!clean) {
            return;
        }

        const key = normalizeTypeValue(clean);
        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        output.push(clean);
    });

    return output.sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
}

function loadManagedDeviceTypes() {
    try {
        const raw = localStorage.getItem(MANAGED_DEVICE_TYPES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        managedDeviceTypes = uniqueSortedTypes(Array.isArray(parsed) ? parsed : []);
    } catch {
        managedDeviceTypes = [];
    }
}

function persistManagedDeviceTypes() {
    localStorage.setItem(MANAGED_DEVICE_TYPES_KEY, JSON.stringify(managedDeviceTypes));
}

function formatCanonicalModelLabel(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/(^|[\s(_-])iphone(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPhone`)
        .replace(/(^|[\s(_-])ipad(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPad`)
        .replace(/(^|[\s(_-])macbook(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}MacBook`);
}

function normalizeModelValue(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([0-9])/g, '$1 $2')
        .replace(/([0-9])([a-z])/g, '$1 $2')
        .replace(/\s+/g, ' ');
}

function canonicalModelName(value, type = '') {
    void type;
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function sanitizeManagedModelName(value) {
    return canonicalModelName(value);
}

function getDefaultManagedModels() {
    return [];
}

function uniqueSortedModels(modelRows) {
    const seen = new Set();
    const output = [];

    modelRows.forEach((entry) => {
        const cleanName = canonicalModelName(entry?.name, entry?.type);
        const cleanType = sanitizeManagedTypeName(entry?.type);
        if (!cleanName || !cleanType) {
            return;
        }

        const key = `${normalizeTypeValue(cleanType)}::${normalizeModelValue(cleanName)}`;
        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        output.push({ name: cleanName, type: cleanType });
    });

    return output.sort((left, right) => {
        const typeSort = left.type.localeCompare(right.type, undefined, { sensitivity: 'base' });
        if (typeSort !== 0) {
            return typeSort;
        }
        return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
    });
}

function loadManagedModels() {
    try {
        const raw = localStorage.getItem(MANAGED_MODELS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const source = Array.isArray(parsed) ? parsed : [];
        managedModels = uniqueSortedModels(source);
    } catch {
        managedModels = [];
    }
}

function persistManagedModels() {
    localStorage.setItem(MANAGED_MODELS_KEY, JSON.stringify(managedModels));
}

function normalizeVersionValue(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

function expectedTypeForVersion(version) {
    const key = normalizeVersionValue(version);
    const managedMatch = managedModels.find((entry) => normalizeModelValue(entry.name) === key);
    if (managedMatch) {
        return managedMatch.type;
    }
    return '';
}

function collectManagedMetadataFromRows(rows) {
    const types = [];
    const models = [];

    (Array.isArray(rows) ? rows : []).forEach((row) => {
        const typeName = sanitizeManagedTypeName(row?.type);
        const modelName = sanitizeManagedModelName(row?.version);
        if (typeName) {
            types.push(typeName);
        }
        if (typeName && modelName) {
            models.push({ type: typeName, name: modelName });
        }
    });

    return {
        types: uniqueSortedTypes(types),
        models: uniqueSortedModels(models)
    };
}

function syncManagedMetadataFromRows(rows) {
    const collected = collectManagedMetadataFromRows(rows);
    const nextTypes = uniqueSortedTypes([...managedDeviceTypes, ...collected.types]);
    const nextModels = uniqueSortedModels([...managedModels, ...collected.models]);
    const typesChanged = JSON.stringify(nextTypes) !== JSON.stringify(managedDeviceTypes);
    const modelsChanged = JSON.stringify(nextModels) !== JSON.stringify(managedModels);

    managedDeviceTypes = nextTypes;
    managedModels = nextModels;

    if (typesChanged) {
        persistManagedDeviceTypes();
    }
    if (modelsChanged) {
        persistManagedModels();
    }

    return { typesChanged, modelsChanged };
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

function showDeleteFeedback(message, isError = false) {
    window.alert(message);
    showStatus(message, isError);
}

function clearImportFeedback() {
    renderValidationReport([]);
    showStatus('');
}

function getCurrentSelectedFile() {
    return fileInput?.files && fileInput.files[0] ? fileInput.files[0] : null;
}

function normalizeFilterValue(value) {
    return String(value || '').trim().toLowerCase();
}

function getCurrentFilterValues() {
    return {
        type: assetTypeFilter ? assetTypeFilter.value : '',
        model: assetModelFilter ? assetModelFilter.value : '',
        search: assetSearchInput ? assetSearchInput.value : ''
    };
}

function getFilteredRows() {
    const { type, model, search } = getCurrentFilterValues();
    const searchTerm = normalizeFilterValue(search);

    return assetRows.filter((row) => {
        const typeMatches = !type || normalizeFilterValue(row.type) === normalizeFilterValue(type);
        const modelMatches = !model || normalizeFilterValue(row.version) === normalizeFilterValue(model);
        const searchMatches = !searchTerm
            || normalizeFilterValue(row.assetid).includes(searchTerm)
            || normalizeFilterValue(row.serialnumber).includes(searchTerm);
        return typeMatches && modelMatches && searchMatches;
    });
}

function buildUniqueValues(values) {
    return Array.from(new Set(values.filter((value) => !!String(value || '').trim())))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function refreshTypeFilterOptions() {
    if (!assetTypeFilter) {
        return;
    }

    const previousValue = assetTypeFilter.value;
    const types = buildUniqueValues(assetRows.map((row) => row.type));
    const allLabel = t('Alle Gerätetypen', 'All Device Types');

    assetTypeFilter.innerHTML = [`<option value="">${escapeHtml(allLabel)}</option>`]
        .concat(types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`))
        .join('');

    if (types.some((type) => normalizeFilterValue(type) === normalizeFilterValue(previousValue))) {
        assetTypeFilter.value = previousValue;
    }
}

function refreshModelFilterOptions() {
    if (!assetModelFilter) {
        return;
    }

    const previousValue = assetModelFilter.value;
    const selectedType = assetTypeFilter ? assetTypeFilter.value : '';
    const candidateRows = selectedType
        ? assetRows.filter((row) => normalizeFilterValue(row.type) === normalizeFilterValue(selectedType))
        : assetRows;
    const models = buildUniqueValues(candidateRows.map((row) => row.version));
    const allLabel = t('Alle Typen', 'All Models');

    assetModelFilter.innerHTML = [`<option value="">${escapeHtml(allLabel)}</option>`]
        .concat(models.map((model) => `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`))
        .join('');

    if (models.some((model) => normalizeFilterValue(model) === normalizeFilterValue(previousValue))) {
        assetModelFilter.value = previousValue;
    }
}

function refreshFilterOptions() {
    refreshTypeFilterOptions();
    refreshModelFilterOptions();
}

function resetToFirstPage() {
    currentPage = 1;
}

function getPaginationState(totalRows) {
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);

    return {
        totalPages,
        startIndex,
        endIndex
    };
}

function getVisiblePaginationItems(totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    if (currentPage <= 3) {
        items.add(2);
        items.add(3);
        items.add(4);
    }
    if (currentPage >= totalPages - 2) {
        items.add(totalPages - 1);
        items.add(totalPages - 2);
        items.add(totalPages - 3);
    }

    return Array.from(items)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((left, right) => left - right)
        .reduce((acc, page, index, pages) => {
            if (index > 0 && page - pages[index - 1] > 1) {
                acc.push('ellipsis');
            }
            acc.push(page);
            return acc;
        }, []);
}

function renderPagination(totalRows) {
    if (!assetPagination || !assetPaginationInfo || !assetPaginationPages) {
        return;
    }

    if (totalRows <= pageSize) {
        assetPagination.classList.add('hidden');
        assetPaginationInfo.textContent = '';
        assetPaginationPages.innerHTML = '';
        return;
    }

    const { totalPages, startIndex, endIndex } = getPaginationState(totalRows);
    const visibleItems = getVisiblePaginationItems(totalPages);
    assetPagination.classList.remove('hidden');
    assetPaginationInfo.textContent = t(
        `Zeige ${startIndex + 1}–${endIndex} von ${totalRows} Einträgen`,
        `Showing ${startIndex + 1}-${endIndex} of ${totalRows} entries`
    );

    const previousLabel = t('Vorherige', 'Previous');
    const nextLabel = t('Nächste', 'Next');
    const perPageLabel = t('/ Seite', '/ page');

    const pageButtons = visibleItems.map((item) => {
        if (item === 'ellipsis') {
            return '<span class="asset-pagination-ellipsis" aria-hidden="true">…</span>';
        }

        const activeClass = item === currentPage ? ' active' : '';
        return `<button type="button" class="asset-page-button${activeClass}" data-page="${item}" aria-current="${item === currentPage ? 'page' : 'false'}">${item}</button>`;
    }).join('');

    assetPaginationPages.innerHTML = `
        <div class="asset-pagination-bar">
            <button type="button" class="asset-pagination-nav" data-page-nav="prev" ${currentPage === 1 ? 'disabled' : ''}>${escapeHtml(previousLabel)}</button>
            <div class="asset-pagination-numbers" aria-label="Pagination Pages">${pageButtons}</div>
            <button type="button" class="asset-pagination-nav" data-page-nav="next" ${currentPage === totalPages ? 'disabled' : ''}>${escapeHtml(nextLabel)}</button>
            <label class="asset-pagination-size-label" for="assetPageSizeSelect">
                <select id="assetPageSizeSelect" class="asset-page-size-select" aria-label="Page size">
                    ${[10, 20, 50].map((size) => `<option value="${size}" ${size === pageSize ? 'selected' : ''}>${size} ${escapeHtml(perPageLabel)}</option>`).join('')}
                </select>
            </label>
        </div>
    `;
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
        renderPagination(0);
        return;
    }

    const filteredRows = getFilteredRows();

    if (filteredRows.length === 0) {
        const noMatchText = t('Keine passenden Assets für den aktuellen Filter.', 'No matching assets for the current filter.');
        tableBody.innerHTML = `<tr><td colspan="${ASSET_COLUMNS.length}">${noMatchText}</td></tr>`;
        renderPagination(0);
        return;
    }

    const { startIndex, endIndex } = getPaginationState(filteredRows.length);
    const visibleRows = filteredRows.slice(startIndex, endIndex);

    const rowsHtml = visibleRows
        .map((row) => {
            const cells = ASSET_COLUMNS
                .map((col) => {
                    if (col.key === 'assetid') {
                        const assetId = String(row[col.key] || '');
                        const assetIdKey = assetIdKeyFromRow(row);
                        return `<td><a href="#" class="asset-id-link" data-asset-detail="${escapeHtml(assetIdKey)}">${escapeHtml(assetId)}</a></td>`;
                    }
                    return `<td>${escapeHtml(row[col.key])}</td>`;
                })
                .join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');

    tableBody.innerHTML = rowsHtml;
    renderPagination(filteredRows.length);
}

function getColumnLabel(columnKey) {
    const found = ASSET_COLUMNS.find((col) => col.key === columnKey);
    if (!found) {
        return columnKey;
    }
    return getCurrentLanguage() === 'en' ? found.labelEn : found.labelDe;
}

function getAssetDetailFieldDefinition(fieldKey) {
    return ASSET_COLUMNS.find((col) => col.key === fieldKey)
        || ASSET_DETAIL_FIELDS.find((field) => field.key === fieldKey)
        || null;
}

function humanizeAssetFieldKey(fieldKey) {
    return String(fieldKey || '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[\-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (letter) => letter.toUpperCase());
}

function getAssetDetailFieldLabel(fieldKey) {
    const definition = getAssetDetailFieldDefinition(fieldKey);
    if (definition) {
        return getCurrentLanguage() === 'en' ? definition.labelEn : definition.labelDe;
    }

    return humanizeAssetFieldKey(fieldKey);
}

function isAssetDetailFieldEditable(fieldKey) {
    return ASSET_DETAIL_FIELDS.some((field) => field.key === fieldKey && field.editable);
}

function getAssetRowById(assetIdKey) {
    return assetRows.find((row) => assetIdKeyFromRow(row) === assetIdKey) || null;
}

function getAssetDetailEntries(row) {
    const entries = [];
    const usedKeys = new Set();

    ASSET_COLUMNS.forEach((column) => {
        usedKeys.add(column.key);
        entries.push({
            key: column.key,
            label: getAssetDetailFieldLabel(column.key),
            value: String(row?.[column.key] || ''),
            editable: isAssetDetailFieldEditable(column.key)
        });
    });

    ASSET_DETAIL_FIELDS.forEach((field) => {
        if (usedKeys.has(field.key)) {
            return;
        }

        usedKeys.add(field.key);
        entries.push({
            key: field.key,
            label: getAssetDetailFieldLabel(field.key),
            value: String(row?.[field.key] || ''),
            editable: true
        });
    });

    Object.keys(row || {})
        .filter((key) => !usedKeys.has(key) && key !== 'assetidKey')
        .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }))
        .forEach((key) => {
            entries.push({
                key,
                label: getAssetDetailFieldLabel(key),
                value: String(row?.[key] || ''),
                editable: isAssetDetailFieldEditable(key)
            });
        });

    return entries;
}

function getAssetDetailLockLabel(isEditing) {
    return isEditing
        ? t('Feld speichern und sperren', 'Save field and lock')
        : t('Feld entsperren', 'Unlock field');
}

function getAssetDetailLockIcon(isEditing) {
    if (isEditing) {
        return `<svg class="asset-detail-lock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M17 9h-1V7a4 4 0 0 0-7.72-1.5.75.75 0 1 0 1.4.53A2.5 2.5 0 0 1 14.5 7v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm.5 10a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5Z" fill="currentColor"/>
        </svg>`;
    }

    return `<svg class="asset-detail-lock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7.5-2a2.5 2.5 0 0 1 5 0v2h-5Zm8 12.5H7a.5.5 0 0 1-.5-.5v-8A.5.5 0 0 1 7 10.5h10a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5Z" fill="currentColor"/>
    </svg>`;
}

function renderAssetDetailModal(row) {
    if (!assetDetailBody || !assetDetailTitle || !assetDetailSubtitle) {
        return;
    }

    const assetId = String(row?.assetid || '');
    assetDetailTitle.textContent = assetId
        ? t(`Asset-Übersicht: ${assetId}`, `Asset overview: ${assetId}`)
        : t('Asset-Übersicht', 'Asset overview');
    assetDetailSubtitle.textContent = t(
        'Alle in der Lagerdatenbank gespeicherten Felder werden hier angezeigt.',
        'All fields stored in the inventory database are shown here.'
    );

    const emptyValueLabel = t('Kein Wert gespeichert', 'No value stored');
    assetDetailBody.innerHTML = getAssetDetailEntries(row)
        .map((entry) => {
            if (entry.editable) {
                const lockLabel = getAssetDetailLockLabel(false);
                return `<div class="asset-detail-item asset-detail-item-editable" data-detail-field="${escapeHtml(entry.key)}">
                    <div class="asset-detail-item-header">
                        <span class="asset-detail-label">${escapeHtml(entry.label)}</span>
                        <button
                            type="button"
                            class="asset-detail-lock"
                            data-detail-lock="${escapeHtml(entry.key)}"
                            data-editing="false"
                            aria-label="${escapeHtml(lockLabel)}"
                            title="${escapeHtml(lockLabel)}"
                        >${getAssetDetailLockIcon(false)}</button>
                    </div>
                    <input
                        type="text"
                        class="asset-detail-input"
                        data-detail-input="${escapeHtml(entry.key)}"
                        value="${escapeHtml(entry.value)}"
                        readonly
                        disabled
                    >
                </div>`;
            }

            return `<div class="asset-detail-item">
                <span class="asset-detail-label">${escapeHtml(entry.label)}</span>
                <span class="asset-detail-value">${escapeHtml(entry.value || emptyValueLabel)}</span>
            </div>`;
        })
        .join('');
}

function openAssetDetailModal(assetIdKey) {
    if (!assetDetailModal) {
        return;
    }

    const row = getAssetRowById(assetIdKey);
    if (!row) {
        showStatus(t('Asset konnte nicht gefunden werden.', 'Asset could not be found.'), true);
        return;
    }

    activeAssetDetailId = assetIdKey;
    renderAssetDetailModal(row);
    assetDetailModal.style.display = 'flex';
    assetDetailModal.setAttribute('aria-hidden', 'false');
}

function closeAssetDetailModal() {
    if (!assetDetailModal) {
        return;
    }

    assetDetailModal.style.display = 'none';
    assetDetailModal.setAttribute('aria-hidden', 'true');
    activeAssetDetailId = '';
}

async function saveAssetDetailField(assetIdKey, fieldKey, nextValue) {
    const rowIndex = assetRows.findIndex((row) => assetIdKeyFromRow(row) === assetIdKey);
    if (rowIndex < 0) {
        throw new Error('Asset not found');
    }

    const updatedRow = sanitizeRow({
        ...assetRows[rowIndex],
        [fieldKey]: nextValue
    });

    const db = await openInventoryDb();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_STORE);
        store.put({ ...updatedRow, assetidKey: assetIdKey });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
    db.close();

    assetRows[rowIndex] = updatedRow;
}

async function toggleAssetDetailFieldLock(fieldKey) {
    if (!assetDetailBody || !activeAssetDetailId) {
        return;
    }

    const input = assetDetailBody.querySelector(`[data-detail-input="${fieldKey}"]`);
    const button = assetDetailBody.querySelector(`[data-detail-lock="${fieldKey}"]`);
    if (!input || !button) {
        return;
    }

    const isEditing = button.getAttribute('data-editing') === 'true';
    if (!isEditing) {
        const saveLabel = getAssetDetailLockLabel(true);
        button.setAttribute('data-editing', 'true');
        button.innerHTML = getAssetDetailLockIcon(true);
        button.setAttribute('aria-label', saveLabel);
        button.setAttribute('title', saveLabel);
        input.disabled = false;
        input.readOnly = false;
        input.focus();
        input.select();
        return;
    }

    try {
        await saveAssetDetailField(activeAssetDetailId, fieldKey, input.value);
        const refreshedRow = getAssetRowById(activeAssetDetailId);
        if (refreshedRow) {
            renderAssetDetailModal(refreshedRow);
        }
        showStatus(t('Asset-Feld gespeichert.', 'Asset field saved.'));
    } catch {
        showStatus(t('Asset-Feld konnte nicht gespeichert werden.', 'Could not save asset field.'), true);
    }
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

function renderAssetAdminTexts() {
    if (settingsDefaultsTab) {
        settingsDefaultsTab.textContent = t('Standardwerte', 'Default Values');
    }
    if (settingsAdminTab) {
        settingsAdminTab.textContent = t('Asset Administration', 'Asset Administration');
    }
    if (assetAdminHeading) {
        assetAdminHeading.textContent = t('Asset Administration', 'Asset Administration');
    }
    if (assetAdminTypeSubToggle) {
        assetAdminTypeSubToggle.textContent = t('Neuen Gerätetyp anlegen oder bearbeiten', 'Add or edit device type');
    }
    if (assetAdminModelSubToggle) {
        assetAdminModelSubToggle.textContent = t('Neuen Typ anlegen oder bearbeiten', 'Add or edit model');
    }
    if (assetAdminTypeLabel) {
        assetAdminTypeLabel.textContent = t('Gerätetyp', 'Device type');
    }
    if (assetAdminTypeInput) {
        assetAdminTypeInput.placeholder = t('z. B. Surface', 'e.g. Surface');
    }
    if (assetAdminAcceptTypeButton) {
        assetAdminAcceptTypeButton.textContent = editingTypeName
            ? t('Typ speichern', 'Save type')
            : t('Typ akzeptieren', 'Accept type');
    }
    if (assetAdminCancelEditButton) {
        assetAdminCancelEditButton.textContent = t('Bearbeitung abbrechen', 'Cancel edit');
    }
    if (assetModelAdminHeading) {
        assetModelAdminHeading.textContent = t('Typ Administration', 'Model Administration');
    }
    if (assetModelTypeLabel) {
        assetModelTypeLabel.textContent = t('Gerätetyp für Typ', 'Device type for model');
    }
    if (assetModelAdminLabel) {
        assetModelAdminLabel.textContent = t('Typ', 'Model');
    }
    if (assetModelAdminInput) {
        assetModelAdminInput.placeholder = t('z. B. Galaxy Tab S9', 'e.g. Galaxy Tab S9');
    }
    if (assetAdminAcceptModelButton) {
        assetAdminAcceptModelButton.textContent = editingModelKey
            ? t('Typ speichern', 'Save model')
            : t('Typ akzeptieren', 'Accept model');
    }
    if (assetAdminCancelModelEditButton) {
        assetAdminCancelModelEditButton.textContent = t('Bearbeitung abbrechen', 'Cancel edit');
    }
}

function renderAssetTypeAdminTable() {
    if (!assetTypeAdminTableHead || !assetTypeAdminTableBody) {
        return;
    }

    assetTypeAdminTableHead.innerHTML = `<tr>
        <th>${t('Gerätetyp', 'Device Type')}</th>
        <th>${t('Aktionen', 'Actions')}</th>
    </tr>`;

    assetTypeAdminTableBody.innerHTML = managedDeviceTypes
        .map((typeName) => {
            const editLabel = t('Bearbeiten', 'Edit');
            const deleteLabel = t('Entfernen', 'Remove');

            return `<tr>
                <td>${escapeHtml(typeName)}</td>
                <td>
                    <div class="asset-type-admin-actions">
                        <button type="button" class="button secondary" data-action="edit" data-type="${escapeHtml(typeName)}">${escapeHtml(editLabel)}</button>
                        <button type="button" class="button secondary" data-action="remove" data-type="${escapeHtml(typeName)}">${escapeHtml(deleteLabel)}</button>
                    </div>
                </td>
            </tr>`;
        })
        .join('');
}

function renderAssetModelTypeOptions(preferredType = '') {
    if (!assetModelTypeSelect) {
        return;
    }

    const selectedType = preferredType || assetModelTypeSelect.value || managedDeviceTypes[0] || '';
    assetModelTypeSelect.innerHTML = managedDeviceTypes
        .map((typeName) => `<option value="${escapeHtml(typeName)}">${escapeHtml(typeName)}</option>`)
        .join('');

    if (managedDeviceTypes.some((typeName) => normalizeTypeValue(typeName) === normalizeTypeValue(selectedType))) {
        assetModelTypeSelect.value = selectedType;
    } else if (managedDeviceTypes.length > 0) {
        assetModelTypeSelect.value = managedDeviceTypes[0];
    }
}

function renderAssetModelAdminTable() {
    if (!assetModelAdminTableHead || !assetModelAdminTableBody) {
        return;
    }

    assetModelAdminTableHead.innerHTML = `<tr>
        <th>${t('Gerätetyp', 'Device Type')}</th>
        <th>${t('Typ', 'Model')}</th>
        <th>${t('Aktionen', 'Actions')}</th>
    </tr>`;

    assetModelAdminTableBody.innerHTML = managedModels
        .map((entry) => {
            const rowKey = `${normalizeTypeValue(entry.type)}::${normalizeModelValue(entry.name)}`;
            const editLabel = t('Bearbeiten', 'Edit');
            const deleteLabel = t('Entfernen', 'Remove');

            return `<tr>
                <td>${escapeHtml(entry.type)}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td>
                    <div class="asset-type-admin-actions">
                        <button type="button" class="button secondary" data-model-action="edit" data-model-key="${escapeHtml(rowKey)}">${escapeHtml(editLabel)}</button>
                        <button type="button" class="button secondary" data-model-action="remove" data-model-key="${escapeHtml(rowKey)}">${escapeHtml(deleteLabel)}</button>
                    </div>
                </td>
            </tr>`;
        })
        .join('');
}

async function persistAssetRows(rows) {
    const db = await openInventoryDb();
    try {
        await persistCanonicalInventoryRows(db, rows);
    } finally {
        db.close();
    }

    assetRows = rows.map((row) => sanitizeRow(row));
    syncManagedMetadataFromRows(assetRows);
    refreshFilterOptions();
    resetToFirstPage();
    renderTable();
}

function refreshManagedMetadataViews(preferredType = '') {
    renderAssetTypeAdminTable();
    renderAssetModelTypeOptions(preferredType);
    renderAssetModelAdminTable();
}

function clearManagedMetadata() {
    managedDeviceTypes = [];
    managedModels = [];
    localStorage.removeItem(MANAGED_DEVICE_TYPES_KEY);
    localStorage.removeItem(MANAGED_MODELS_KEY);
    clearTypeEditMode();
    clearModelEditMode();
    refreshManagedMetadataViews();
}

function collectUnknownImportMetadata(importedRows) {
    const unknownTypes = new Map();
    const missingModels = new Map();

    importedRows.forEach((entry) => {
        const typeName = sanitizeManagedTypeName(entry?.row?.type);
        const modelName = sanitizeManagedModelName(entry?.row?.version);
        const knownType = canonicalDeviceType(typeName);
        const effectiveType = knownType || typeName;

        if (typeName && !knownType) {
            unknownTypes.set(normalizeTypeValue(typeName), typeName);
        }

        if (effectiveType && modelName) {
            const modelKey = `${normalizeTypeValue(effectiveType)}::${normalizeModelValue(modelName)}`;
            const exists = managedModels.some((entryModel) => (
                normalizeTypeValue(entryModel.type) === normalizeTypeValue(effectiveType)
                && normalizeModelValue(entryModel.name) === normalizeModelValue(modelName)
            ));
            if (!exists) {
                missingModels.set(modelKey, { type: effectiveType, name: modelName });
            }
        }
    });

    return {
        unknownTypes: Array.from(unknownTypes.values()),
        missingModels: Array.from(missingModels.values())
    };
}

function acceptUnknownImportMetadata(importedRows) {
    const { unknownTypes, missingModels } = collectUnknownImportMetadata(importedRows);
    const rejectedTypes = new Set();
    let acceptedTypeCount = 0;

    unknownTypes.forEach((typeName) => {
        const confirmed = window.confirm(
            t(
                `Unbekannter Gerätetyp „${typeName}“ gefunden. Möchten Sie ihn übernehmen?`,
                `Unknown device type "${typeName}" found. Do you want to accept it?`
            )
        );

        if (!confirmed) {
            rejectedTypes.add(normalizeTypeValue(typeName));
            return;
        }

        managedDeviceTypes = uniqueSortedTypes([...managedDeviceTypes, typeName]);
        acceptedTypeCount += 1;
    });

    const acceptedModels = missingModels.filter((entry) => !rejectedTypes.has(normalizeTypeValue(entry.type)));
    if (acceptedTypeCount > 0) {
        persistManagedDeviceTypes();
    }
    if (acceptedModels.length > 0) {
        managedModels = uniqueSortedModels([...managedModels, ...acceptedModels]);
        persistManagedModels();
    }
    if (acceptedTypeCount > 0 || acceptedModels.length > 0) {
        refreshManagedMetadataViews();
    }

    return {
        rejectedTypes,
        acceptedTypeCount,
        acceptedModelCount: acceptedModels.length
    };
}

function clearModelEditMode() {
    editingModelKey = '';
    if (assetModelAdminInput) {
        assetModelAdminInput.value = '';
    }
    if (assetAdminCancelModelEditButton) {
        assetAdminCancelModelEditButton.classList.add('hidden');
    }
    renderAssetAdminTexts();
}

function setModelEditMode(modelKey) {
    const [typeKey, modelKeyName] = String(modelKey || '').split('::');
    const match = managedModels.find((entry) => (
        normalizeTypeValue(entry.type) === typeKey
        && normalizeModelValue(entry.name) === modelKeyName
    ));
    if (!match) {
        return;
    }

    editingModelKey = `${normalizeTypeValue(match.type)}::${normalizeModelValue(match.name)}`;
    renderAssetModelTypeOptions(match.type);
    if (assetModelAdminInput) {
        assetModelAdminInput.value = match.name;
        assetModelAdminInput.focus();
    }
    if (assetAdminCancelModelEditButton) {
        assetAdminCancelModelEditButton.classList.remove('hidden');
    }
    renderAssetAdminTexts();
}

async function saveAcceptedModel() {
    const modelName = sanitizeManagedModelName(assetModelAdminInput?.value || '');
    const typeName = sanitizeManagedTypeName(assetModelTypeSelect?.value || '');

    if (!typeName) {
        showStatus(t('Bitte zuerst einen gültigen Gerätetyp wählen.', 'Please select a valid device type first.'), true);
        return;
    }

    if (!modelName) {
        showStatus(t('Bitte einen Typ eingeben.', 'Please enter a model.'), true);
        return;
    }

    const nextKey = `${normalizeTypeValue(typeName)}::${normalizeModelValue(modelName)}`;
    const modelExists = managedModels.some((entry) => (
        `${normalizeTypeValue(entry.type)}::${normalizeModelValue(entry.name)}` === nextKey
    ));

    if (modelExists && editingModelKey !== nextKey) {
        showStatus(t(`Typ bereits vorhanden: ${modelName}`, `Model already exists: ${modelName}`), true);
        return;
    }

    const nextModels = managedModels.filter((entry) => (
        `${normalizeTypeValue(entry.type)}::${normalizeModelValue(entry.name)}` !== editingModelKey
    ));
    managedModels = uniqueSortedModels([...nextModels, { name: modelName, type: typeName }]);
    persistManagedModels();

    if (editingModelKey && editingModelKey !== nextKey) {
        const updatedRows = assetRows.map((row) => {
            const rowKey = `${normalizeTypeValue(row.type)}::${normalizeModelValue(row.version)}`;
            if (rowKey !== editingModelKey) {
                return row;
            }

            return sanitizeRow({
                ...row,
                type: typeName,
                version: modelName
            });
        });
        await persistAssetRows(updatedRows);
    }

    clearModelEditMode();
    refreshManagedMetadataViews(typeName);
    showStatus(t('Typ erfolgreich aktualisiert.', 'Model updated successfully.'));
}

function getInventoryUsageForModel(modelKey) {
    const [typeKey, modelNameKey] = String(modelKey || '').split('::');
    if (!typeKey || !modelNameKey) {
        return [];
    }

    return assetRows.filter((row) => (
        normalizeTypeValue(row.type) === typeKey
        && normalizeModelValue(row.version) === modelNameKey
    ));
}

function getInventoryUsageForDeviceType(typeName) {
    const typeKey = normalizeTypeValue(typeName);
    if (!typeKey) {
        return [];
    }

    return assetRows.filter((row) => normalizeTypeValue(row.type) === typeKey);
}

function getManagedModelsForType(typeName) {
    const typeKey = normalizeTypeValue(typeName);
    if (!typeKey) {
        return [];
    }

    return managedModels.filter((entry) => normalizeTypeValue(entry.type) === typeKey);
}

function removeAcceptedModel(modelKey) {
    const [typeKey, modelNameKey] = String(modelKey || '').split('::');
    const matchedModel = managedModels.find((entry) => (
        normalizeTypeValue(entry.type) === typeKey
        && normalizeModelValue(entry.name) === modelNameKey
    ));

    if (!matchedModel) {
        showDeleteFeedback(
            t('Typ konnte nicht entfernt werden.', 'Model could not be removed.'),
            true
        );
        return;
    }

    const referencedAssets = getInventoryUsageForModel(modelKey);
    if (referencedAssets.length > 0) {
        const typeLabel = matchedModel?.type || typeKey;
        const modelLabel = matchedModel?.name || modelNameKey;
        const message = t(
            `Typ „${modelLabel}“ kann nicht entfernt werden. Es sind noch ${referencedAssets.length} Asset(s) für ${typeLabel} vorhanden.`,
            `Model "${modelLabel}" cannot be removed. ${referencedAssets.length} asset(s) for ${typeLabel} still exist.`
        );
        showDeleteFeedback(message, true);
        return;
    }

    managedModels = managedModels.filter((entry) => (
        `${normalizeTypeValue(entry.type)}::${normalizeModelValue(entry.name)}` !== modelKey
    ));
    managedModels = uniqueSortedModels(managedModels);
    persistManagedModels();
    if (editingModelKey === modelKey) {
        clearModelEditMode();
    }
    refreshManagedMetadataViews();
    showDeleteFeedback(
        t(`Typ „${matchedModel.name}“ wurde entfernt.`, `Model "${matchedModel.name}" was removed.`)
    );
}

function clearTypeEditMode() {
    editingTypeName = '';
    if (assetAdminTypeInput) {
        assetAdminTypeInput.value = '';
    }
    if (assetAdminCancelEditButton) {
        assetAdminCancelEditButton.classList.add('hidden');
    }
    renderAssetAdminTexts();
}

function setTypeEditMode(typeName) {
    editingTypeName = typeName;
    if (assetAdminTypeInput) {
        assetAdminTypeInput.value = typeName;
        assetAdminTypeInput.focus();
    }
    if (assetAdminCancelEditButton) {
        assetAdminCancelEditButton.classList.remove('hidden');
    }
    renderAssetAdminTexts();
}

async function saveAcceptedDeviceType() {
    const inputValue = sanitizeManagedTypeName(assetAdminTypeInput?.value || '');
    if (!inputValue) {
        showStatus(t('Bitte einen Gerätetyp eingeben.', 'Please enter a device type.'), true);
        return;
    }

    const inputKey = normalizeTypeValue(inputValue);
    const existingType = managedDeviceTypes.find((typeName) => normalizeTypeValue(typeName) === inputKey);

    if (existingType && normalizeTypeValue(existingType) !== normalizeTypeValue(editingTypeName)) {
        showStatus(t(`Gerätetyp bereits vorhanden: ${existingType}`, `Device type already exists: ${existingType}`), true);
        return;
    }

    let nextTypes = managedDeviceTypes.filter((typeName) => normalizeTypeValue(typeName) !== normalizeTypeValue(editingTypeName));
    nextTypes = uniqueSortedTypes([...nextTypes, inputValue]);
    managedDeviceTypes = nextTypes;
    persistManagedDeviceTypes();

    if (editingTypeName && normalizeTypeValue(editingTypeName) !== normalizeTypeValue(inputValue)) {
        managedModels = uniqueSortedModels(managedModels.map((entry) => {
            if (normalizeTypeValue(entry.type) !== normalizeTypeValue(editingTypeName)) {
                return entry;
            }

            return { ...entry, type: inputValue };
        }));

        const updatedRows = assetRows.map((row) => {
            if (normalizeTypeValue(row.type) !== normalizeTypeValue(editingTypeName)) {
                return row;
            }

            return sanitizeRow({
                ...row,
                type: inputValue
            });
        });
        await persistAssetRows(updatedRows);
    }

    managedModels = uniqueSortedModels(managedModels);
    persistManagedModels();
    clearTypeEditMode();
    refreshManagedMetadataViews(inputValue);
    showStatus(t('Gerätetyp erfolgreich aktualisiert.', 'Device type updated successfully.'));
}

function removeAcceptedDeviceType(typeName) {
    const normalizedType = normalizeTypeValue(typeName);
    const matchedType = managedDeviceTypes.find((entry) => normalizeTypeValue(entry) === normalizedType);
    if (!matchedType) {
        showDeleteFeedback(
            t('Gerätetyp konnte nicht entfernt werden.', 'Device type could not be removed.'),
            true
        );
        return;
    }

    const referencedAssets = getInventoryUsageForDeviceType(typeName);
    if (referencedAssets.length > 0) {
        const linkedModels = getManagedModelsForType(typeName)
            .filter((entry) => getInventoryUsageForModel(`${normalizeTypeValue(entry.type)}::${normalizeModelValue(entry.name)}`).length > 0)
            .map((entry) => entry.name);
        const linkedModelHint = linkedModels.length > 0
            ? t(
                ` Betroffene Typen: ${linkedModels.join(', ')}.`,
                ` Affected models: ${linkedModels.join(', ')}.`
            )
            : '';
        showDeleteFeedback(
            t(
                `Gerätetyp „${matchedType}“ kann nicht entfernt werden. Es sind noch ${referencedAssets.length} Asset(s) vorhanden.${linkedModelHint}`,
                `Device type "${matchedType}" cannot be removed. ${referencedAssets.length} asset(s) still exist.${linkedModelHint}`
            ),
            true
        );
        return;
    }

    managedDeviceTypes = managedDeviceTypes.filter((entry) => normalizeTypeValue(entry) !== normalizedType);
    managedDeviceTypes = uniqueSortedTypes(managedDeviceTypes);
    persistManagedDeviceTypes();
    managedModels = managedModels.filter((entry) => normalizeTypeValue(entry.type) !== normalizedType);
    managedModels = uniqueSortedModels(managedModels);
    persistManagedModels();
    if (editingTypeName && normalizeTypeValue(editingTypeName) === normalizedType) {
        clearTypeEditMode();
    }
    if (editingModelKey && editingModelKey.startsWith(`${normalizedType}::`)) {
        clearModelEditMode();
    }
    refreshManagedMetadataViews();
    showDeleteFeedback(
        t(`Gerätetyp „${matchedType}“ wurde entfernt.`, `Device type "${matchedType}" was removed.`)
    );
}

function setSettingsPanelExpanded(targetPanelId, expanded) {
    if (!settingsDefaultsPanel || !settingsAdminPanel || !settingsDefaultsTab || !settingsAdminTab) {
        return;
    }

    const isDefaultsPanel = targetPanelId === 'assetSettingsDefaultsPanel';
    const panel = isDefaultsPanel ? settingsDefaultsPanel : settingsAdminPanel;
    const button = isDefaultsPanel ? settingsDefaultsTab : settingsAdminTab;

    panel.classList.toggle('hidden', !expanded);
    panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    button.classList.toggle('active', expanded);
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function isSettingsPanelExpanded(targetPanelId) {
    if (targetPanelId === 'assetSettingsDefaultsPanel') {
        return settingsDefaultsPanel && !settingsDefaultsPanel.classList.contains('hidden');
    }
    return settingsAdminPanel && !settingsAdminPanel.classList.contains('hidden');
}

function toggleSettingsPanel(targetPanelId) {
    const nextExpanded = !isSettingsPanelExpanded(targetPanelId);
    setSettingsPanelExpanded(targetPanelId, nextExpanded);
}

function setAdminSubPanelExpanded(targetPanelId, expanded) {
    const isTypePanel = targetPanelId === 'assetAdminTypeSubPanel';
    const panel = isTypePanel ? assetAdminTypeSubPanel : assetAdminModelSubPanel;
    const button = isTypePanel ? assetAdminTypeSubToggle : assetAdminModelSubToggle;

    if (!panel || !button) {
        return;
    }

    panel.classList.toggle('hidden', !expanded);
    panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    button.classList.toggle('active', expanded);
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function isAdminSubPanelExpanded(targetPanelId) {
    if (targetPanelId === 'assetAdminTypeSubPanel') {
        return assetAdminTypeSubPanel && !assetAdminTypeSubPanel.classList.contains('hidden');
    }
    return assetAdminModelSubPanel && !assetAdminModelSubPanel.classList.contains('hidden');
}

function toggleAdminSubPanel(targetPanelId) {
    const nextExpanded = !isAdminSubPanelExpanded(targetPanelId);
    setAdminSubPanelExpanded(targetPanelId, nextExpanded);
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
                `Unbekannter Gerätetyp: ${row.type}`,
                `Unknown device type: ${row.type}`
            )
        );
    }

    if (normalizedType) {
        row.type = normalizedType;
    }

    const normalizedVersion = normalizeModelValue(row.version);
    const matchingModelEntries = managedModels.filter((entry) => normalizeModelValue(entry.name) === normalizedVersion);

    if (row.version && matchingModelEntries.length === 0) {
        errors.push(
            t(
                `Unbekannter Typ: ${row.version}`,
                `Unknown model: ${row.version}`
            )
        );
    }

    if (row.version && matchingModelEntries.length > 0 && !normalizedType) {
        errors.push(
            t(
                `Gerätetyp fehlt für Typ: ${row.version}`,
                `Device type is missing for model: ${row.version}`
            )
        );
    }

    if (row.version && matchingModelEntries.length > 0 && normalizedType) {
        const matchingByType = matchingModelEntries.find((entry) => normalizeTypeValue(entry.type) === normalizeTypeValue(normalizedType));
        if (!matchingByType) {
            errors.push(
                t(
                    `Gerätetyp und Typ passen nicht zusammen: ${row.type} / ${row.version}`,
                    `Device type and model do not match: ${row.type} / ${row.version}`
                )
            );
        } else {
            row.version = matchingByType.name;
        }
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
    return t('Ungültig', 'Invalid');
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
        showStatus(t('Import nicht verfügbar: XLSX-Bibliothek fehlt.', 'Import unavailable: XLSX library missing.'), true);
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
        showStatus(t('Keine erkennbaren Asset-Daten gefunden. Bitte Header prüfen.', 'No recognizable asset data found. Please check headers.'), true);
        renderValidationReport([]);
        return;
    }

    const { rejectedTypes, acceptedTypeCount, acceptedModelCount } = acceptUnknownImportMetadata(importedRows);

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

        if (rowWithDefaults.type && rejectedTypes.has(normalizeTypeValue(rowWithDefaults.type))) {
            invalid += 1;
            reportRows.push({
                rowNumber: entry.rowNumber,
                status: 'invalid',
                details: t(
                    `Gerätetyp nicht übernommen: ${rowWithDefaults.type}`,
                    `Device type not accepted: ${rowWithDefaults.type}`
                )
            });
            return;
        }

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
                details: t('Asset-ID fehlt oder ist ungültig.', 'Asset ID is missing or invalid.')
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
    syncManagedMetadataFromRows(assetRows);
    refreshFilterOptions();
    resetToFirstPage();
    renderTable();
    renderValidationReport(reportRows);
    refreshManagedMetadataViews();

    showStatus(
        t(
            `${added} Einträge importiert, ${duplicates} Duplikate, ${invalid} ungültig.${acceptedTypeCount || acceptedModelCount ? ` ${acceptedTypeCount} Gerätetyp(en) und ${acceptedModelCount} Typ(en) ergänzt.` : ''}`,
            `${added} rows imported, ${duplicates} duplicates, ${invalid} invalid.${acceptedTypeCount || acceptedModelCount ? ` Added ${acceptedTypeCount} device type(s) and ${acceptedModelCount} model(s).` : ''}`
        )
    );
}

async function persistCanonicalInventoryRows(db, rows) {
    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_STORE);
        rows.forEach((row) => {
            store.put({ ...row, assetidKey: assetIdKeyFromRow(row) });
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

function exportRows() {
    if (!window.XLSX) {
        showStatus(t('Export nicht verfügbar: XLSX-Bibliothek fehlt.', 'Export unavailable: XLSX library missing.'), true);
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
                const repairedDb = await openInventoryDb();
                resolve(repairedDb);
            } catch (error) {
                reject(error);
            }
        };
    });
}

async function loadDefaultsFromDb(db) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_DEFAULTS_STORE, 'readonly');
        const store = tx.objectStore(INVENTORY_DEFAULTS_STORE);
        const request = store.get(DEFAULTS_RECORD_ID);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result ? sanitizeDefaults(request.result) : null);
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

async function seedDefaultsIfNeeded(db, rows, loadedDefaults) {
    if (loadedDefaults) {
        return loadedDefaults;
    }

    if (rows.length > 0) {
        return { ...DEFAULT_INVENTORY_DEFAULTS };
    }

    const seededDefaults = { ...DEFAULT_INVENTORY_DEFAULTS };
    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_DEFAULTS_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_DEFAULTS_STORE);
        store.put({ id: DEFAULTS_RECORD_ID, ...seededDefaults });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
    return seededDefaults;
}

async function applyDefaultsToExistingRows(defaults) {
    if (!Array.isArray(assetRows) || assetRows.length === 0) {
        return 0;
    }

    const updatedRows = assetRows.map((row) =>
        sanitizeRow({
            ...row,
            assigned: defaults.assigned,
            managedby: defaults.managedby,
            costcenter: defaults.costcenter
        })
    );

    const db = await openInventoryDb();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(INVENTORY_STORE, 'readwrite');
        const store = tx.objectStore(INVENTORY_STORE);

        const clearRequest = store.clear();
        clearRequest.onerror = () => reject(clearRequest.error);
        clearRequest.onsuccess = () => {
            updatedRows.forEach((row) => {
                store.put({ ...row, assetidKey: assetIdKeyFromRow(row) });
            });
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
    db.close();

    assetRows = updatedRows;
    refreshFilterOptions();
    resetToFirstPage();
    renderTable();
    return updatedRows.length;
}

async function bootstrapRowsAndDefaults() {
    loadManagedDeviceTypes();
    loadManagedModels();
    setSettingsPanelExpanded('assetSettingsDefaultsPanel', false);
    setSettingsPanelExpanded('assetSettingsAdminPanel', false);
    setAdminSubPanelExpanded('assetAdminTypeSubPanel', false);
    setAdminSubPanelExpanded('assetAdminModelSubPanel', false);
    clearTypeEditMode();
    clearModelEditMode();
    renderAssetTypeAdminTable();
    renderAssetModelTypeOptions();
    renderAssetModelAdminTable();

    try {
        const db = await openInventoryDb();
        const clearedNow = await clearImportedInventoryOnceIfNeeded(db);

        const records = await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_STORE);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });

        const rows = records.map((record) => sanitizeRow(record));
        const requiresCanonicalSync = records.some((record, index) => (
            String(record?.type || '').trim() !== rows[index].type
            || String(record?.version || '').trim() !== rows[index].version
        ));
        if (requiresCanonicalSync) {
            await persistCanonicalInventoryRows(db, rows);
        }

        const loadedDefaults = await loadDefaultsFromDb(db);
        inventoryDefaults = await seedDefaultsIfNeeded(db, rows, loadedDefaults);
        db.close();

        assetRows = rows;
        syncManagedMetadataFromRows(assetRows);
        refreshFilterOptions();
        resetToFirstPage();
        renderTable();
        applyDefaultsToInputs(inventoryDefaults);
        renderDefaultsTable();
        renderAssetAdminTexts();
        refreshManagedMetadataViews();

        showStatus(
            clearedNow
                ? t('Alle importierten Datensätze wurden gelöscht.', 'All imported records were deleted.')
                : (rows.length > 0
                    ? t('Lagerliste geladen.', 'Inventory list loaded.')
                    : t('Noch keine Assets in der Lagerliste vorhanden.', 'No assets in inventory list yet.'))
        );
    } catch (error) {
        console.error('Asset inventory bootstrap failed:', error);
        assetRows = [];
        inventoryDefaults = { ...DEFAULT_INVENTORY_DEFAULTS };
        refreshFilterOptions();
        resetToFirstPage();
        renderTable();
        applyDefaultsToInputs(inventoryDefaults);
        renderDefaultsTable();
        renderAssetAdminTexts();
        showStatus(t('Konnte die Lagerliste nicht laden.', 'Could not load inventory list.'), true);
    }
}

async function handleSaveDefaults() {
    const defaults = readDefaultsFromInputs();
    inventoryDefaults = defaults;

    try {
        await saveDefaultsToDb(defaults);
        const updatedCount = await applyDefaultsToExistingRows(defaults);
        renderDefaultsTable();
        showStatus(
            updatedCount > 0
                ? t(`Standardwerte gespeichert und auf ${updatedCount} Datensätze angewendet.`, `Default values saved and applied to ${updatedCount} records.`)
                : t('Standardwerte gespeichert.', 'Default values saved.')
        );
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
        clearManagedMetadata();
        selectedFile = null;
        if (fileInput) {
            fileInput.value = '';
        }
        if (assetTypeFilter) {
            assetTypeFilter.value = '';
        }
        if (assetModelFilter) {
            assetModelFilter.value = '';
        }
        if (assetSearchInput) {
            assetSearchInput.value = '';
        }
        refreshFilterOptions();
        resetToFirstPage();
        renderTable();
        renderValidationReport([]);
        showStatus(t('Alle Datensätze sowie Gerätetypen und Typen wurden gelöscht.', 'All records, device types, and models were deleted.'));
    } catch {
        showStatus(t('Datensätze konnten nicht gelöscht werden.', 'Could not delete records.'), true);
    }
}

function bindEvents() {
    if (settingsDefaultsTab) {
        settingsDefaultsTab.addEventListener('click', () => toggleSettingsPanel('assetSettingsDefaultsPanel'));
    }

    if (settingsAdminTab) {
        settingsAdminTab.addEventListener('click', () => toggleSettingsPanel('assetSettingsAdminPanel'));
    }

    if (assetAdminTypeSubToggle) {
        assetAdminTypeSubToggle.addEventListener('click', () => toggleAdminSubPanel('assetAdminTypeSubPanel'));
    }

    if (assetAdminModelSubToggle) {
        assetAdminModelSubToggle.addEventListener('click', () => toggleAdminSubPanel('assetAdminModelSubPanel'));
    }

    if (assetAdminAcceptTypeButton) {
        assetAdminAcceptTypeButton.addEventListener('click', () => saveAcceptedDeviceType());
    }

    if (assetAdminTypeInput) {
        assetAdminTypeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveAcceptedDeviceType();
            }
        });
    }

    if (assetAdminCancelEditButton) {
        assetAdminCancelEditButton.addEventListener('click', () => clearTypeEditMode());
    }

    if (assetAdminAcceptModelButton) {
        assetAdminAcceptModelButton.addEventListener('click', () => saveAcceptedModel());
    }

    if (assetModelAdminInput) {
        assetModelAdminInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveAcceptedModel();
            }
        });
    }

    if (assetAdminCancelModelEditButton) {
        assetAdminCancelModelEditButton.addEventListener('click', () => clearModelEditMode());
    }

    if (assetTypeAdminTableBody) {
        assetTypeAdminTableBody.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action][data-type]');
            if (!button) {
                return;
            }

            const action = button.getAttribute('data-action');
            const typeName = button.getAttribute('data-type') || '';

            if (action === 'edit') {
                setTypeEditMode(typeName);
                return;
            }

            if (action === 'remove') {
                removeAcceptedDeviceType(typeName);
            }
        });
    }

    if (assetModelAdminTableBody) {
        assetModelAdminTableBody.addEventListener('click', (event) => {
            const button = event.target.closest('[data-model-action][data-model-key]');
            if (!button) {
                return;
            }

            const action = button.getAttribute('data-model-action');
            const modelKey = button.getAttribute('data-model-key') || '';

            if (action === 'edit') {
                setModelEditMode(modelKey);
                return;
            }

            if (action === 'remove') {
                removeAcceptedModel(modelKey);
            }
        });
    }

    pickFileButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        selectedFile = getCurrentSelectedFile();
        if (selectedFile) {
            showStatus(t(`Datei ausgewaehlt: ${selectedFile.name}`, `Selected file: ${selectedFile.name}`));
        }
    });

    importButton.addEventListener('click', async () => {
        const file = getCurrentSelectedFile();
        selectedFile = file;

        if (!file) {
            showStatus(t('Bitte zuerst eine Datei auswaehlen.', 'Please choose a file first.'), true);
            return;
        }

        try {
            await importFile(file);
        } catch (error) {
            console.error('Asset import failed:', error);
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
            clearImportFeedback();
        });
    }

    if (assetTypeFilter) {
        assetTypeFilter.addEventListener('change', () => {
            refreshModelFilterOptions();
            resetToFirstPage();
            renderTable();
        });
    }

    if (assetModelFilter) {
        assetModelFilter.addEventListener('change', () => {
            resetToFirstPage();
            renderTable();
        });
    }

    if (assetSearchInput) {
        assetSearchInput.addEventListener('input', () => {
            resetToFirstPage();
            renderTable();
        });
    }

    if (assetFilterReset) {
        assetFilterReset.addEventListener('click', () => {
            if (assetTypeFilter) {
                assetTypeFilter.value = '';
            }
            if (assetModelFilter) {
                assetModelFilter.value = '';
            }
            if (assetSearchInput) {
                assetSearchInput.value = '';
            }
            refreshModelFilterOptions();
            resetToFirstPage();
            renderTable();
        });
    }

    if (assetPaginationPages) {
        assetPaginationPages.addEventListener('click', (event) => {
            const button = event.target.closest('[data-page]');
            if (button) {
                const page = Number(button.getAttribute('data-page'));
                if (!Number.isFinite(page) || page < 1) {
                    return;
                }

                currentPage = page;
                renderTable();
                return;
            }

            const navButton = event.target.closest('[data-page-nav]');
            if (!navButton) {
                return;
            }

            const direction = navButton.getAttribute('data-page-nav');
            if (direction === 'prev' && currentPage > 1) {
                currentPage -= 1;
            }
            if (direction === 'next') {
                currentPage += 1;
            }
            renderTable();
        });

        assetPaginationPages.addEventListener('change', (event) => {
            const select = event.target.closest('#assetPageSizeSelect');
            if (!select) {
                return;
            }

            const nextPageSize = Number(select.value);
            if (!Number.isFinite(nextPageSize) || nextPageSize < 1) {
                return;
            }

            pageSize = nextPageSize;
            currentPage = 1;
            renderTable();
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const link = event.target.closest('[data-asset-detail]');
            if (!link) {
                return;
            }

            event.preventDefault();
            const assetIdKey = link.getAttribute('data-asset-detail') || '';
            if (assetIdKey) {
                openAssetDetailModal(assetIdKey);
            }
        });
    }

    if (assetDetailCloseButton) {
        assetDetailCloseButton.addEventListener('click', () => closeAssetDetailModal());
    }

    if (assetDetailModal) {
        assetDetailModal.addEventListener('click', (event) => {
            if (event.target === assetDetailModal) {
                closeAssetDetailModal();
            }
        });
    }

    if (assetDetailBody) {
        assetDetailBody.addEventListener('click', (event) => {
            const button = event.target.closest('[data-detail-lock]');
            if (!button) {
                return;
            }

            const fieldKey = button.getAttribute('data-detail-lock') || '';
            if (fieldKey) {
                toggleAssetDetailFieldLock(fieldKey);
            }
        });

        assetDetailBody.addEventListener('keydown', (event) => {
            const input = event.target.closest('[data-detail-input]');
            if (!input || event.key !== 'Enter') {
                return;
            }

            event.preventDefault();
            const fieldKey = input.getAttribute('data-detail-input') || '';
            if (fieldKey) {
                toggleAssetDetailFieldLock(fieldKey);
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && assetDetailModal && assetDetailModal.getAttribute('aria-hidden') === 'false') {
            closeAssetDetailModal();
        }
    });

    document.addEventListener('mdm-language-changed', () => {
        refreshFilterOptions();
        renderTable();
        renderValidationReport(lastValidationReport);
        renderDefaultsTable();
        renderAssetAdminTexts();
        renderAssetTypeAdminTable();
        renderAssetModelTypeOptions();
        renderAssetModelAdminTable();
        if (activeAssetDetailId) {
            const row = getAssetRowById(activeAssetDetailId);
            if (row) {
                renderAssetDetailModal(row);
            }
        }
    });
}

bindEvents();
bootstrapRowsAndDefaults();
