const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 3;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_DEFAULTS_STORE = 'inventory_defaults';
const INVENTORY_MONTHLY_STORE = 'monthly_inventory_movements';
const DEFAULTS_RECORD_ID = 'globalDefaults';
const INVENTORY_CLEAR_ONCE_KEY = 'mdmtool_inventory_cleared_2026_04_19';
const MANAGED_DEVICE_TYPES_KEY = 'mdmtool_managed_device_types_v1';
const DEFAULT_DEVICE_TYPES = ['iPhone', 'iPad', 'MacBook'];

const ASSET_COLUMNS = [
    { key: 'type', labelDe: 'Geraetetyp', labelEn: 'Device Type' },
    { key: 'version', labelDe: 'Typ', labelEn: 'Model' },
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
let currentPage = 1;
const PAGE_SIZE = 10;
let inventoryDefaults = {
    assigned: '',
    managedby: '',
    costcenter: ''
};
let managedDeviceTypes = [...DEFAULT_DEVICE_TYPES];
let editingTypeName = '';

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
        .replace(/\s+/g, '')
        .replace(/^type-/, '');
}

function canonicalDeviceType(value) {
    const key = normalizeTypeValue(value);
    const match = managedDeviceTypes.find((typeName) => normalizeTypeValue(typeName) === key);
    return match || '';
}

function sanitizeManagedTypeName(value) {
    return String(value || '').trim();
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
        managedDeviceTypes = uniqueSortedTypes([...DEFAULT_DEVICE_TYPES, ...(Array.isArray(parsed) ? parsed : [])]);
    } catch {
        managedDeviceTypes = uniqueSortedTypes(DEFAULT_DEVICE_TYPES);
    }
}

function persistManagedDeviceTypes() {
    localStorage.setItem(MANAGED_DEVICE_TYPES_KEY, JSON.stringify(managedDeviceTypes));
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
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalRows);

    return {
        totalPages,
        startIndex,
        endIndex
    };
}

function renderPagination(totalRows) {
    if (!assetPagination || !assetPaginationInfo || !assetPaginationPages) {
        return;
    }

    if (totalRows <= PAGE_SIZE) {
        assetPagination.classList.add('hidden');
        assetPaginationInfo.textContent = '';
        assetPaginationPages.innerHTML = '';
        return;
    }

    const { totalPages, startIndex, endIndex } = getPaginationState(totalRows);
    assetPagination.classList.remove('hidden');
    assetPaginationInfo.textContent = t(
        `Zeige ${startIndex + 1}–${endIndex} von ${totalRows} Einträgen`,
        `Showing ${startIndex + 1}-${endIndex} of ${totalRows} entries`
    );

    assetPaginationPages.innerHTML = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const activeClass = page === currentPage ? ' active' : '';
        return `<button type="button" class="button secondary asset-page-button${activeClass}" data-page="${page}">${page}</button>`;
    }).join('');
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
                .map((col) => `<td>${escapeHtml(row[col.key])}</td>`)
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
    if (assetAdminTypeLabel) {
        assetAdminTypeLabel.textContent = t('Neuen Geraetetyp anlegen oder bearbeiten', 'Add or edit device type');
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
}

function renderAssetTypeAdminTable() {
    if (!assetTypeAdminTableHead || !assetTypeAdminTableBody) {
        return;
    }

    assetTypeAdminTableHead.innerHTML = `<tr>
        <th>${t('Geraetetyp', 'Device Type')}</th>
        <th>${t('Status', 'Status')}</th>
        <th>${t('Aktionen', 'Actions')}</th>
    </tr>`;

    assetTypeAdminTableBody.innerHTML = managedDeviceTypes
        .map((typeName) => {
            const normalized = normalizeTypeValue(typeName);
            const isDefaultType = DEFAULT_DEVICE_TYPES.some((defaultType) => normalizeTypeValue(defaultType) === normalized);
            const statusLabel = isDefaultType ? t('Standard', 'Default') : t('Akzeptiert', 'Accepted');
            const editLabel = t('Bearbeiten', 'Edit');
            const deleteLabel = t('Entfernen', 'Remove');
            const removeDisabled = isDefaultType ? 'disabled' : '';

            return `<tr>
                <td>${escapeHtml(typeName)}</td>
                <td>${escapeHtml(statusLabel)}</td>
                <td>
                    <div class="asset-type-admin-actions">
                        <button type="button" class="button secondary" data-action="edit" data-type="${escapeHtml(typeName)}">${escapeHtml(editLabel)}</button>
                        <button type="button" class="button secondary" data-action="remove" data-type="${escapeHtml(typeName)}" ${removeDisabled}>${escapeHtml(deleteLabel)}</button>
                    </div>
                </td>
            </tr>`;
        })
        .join('');
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

function saveAcceptedDeviceType() {
    const inputValue = sanitizeManagedTypeName(assetAdminTypeInput?.value || '');
    if (!inputValue) {
        showStatus(t('Bitte einen Geraetetyp eingeben.', 'Please enter a device type.'), true);
        return;
    }

    const inputKey = normalizeTypeValue(inputValue);
    const existingType = managedDeviceTypes.find((typeName) => normalizeTypeValue(typeName) === inputKey);

    if (!editingTypeName && existingType) {
        showStatus(t(`Geraetetyp bereits vorhanden: ${existingType}`, `Device type already exists: ${existingType}`), true);
        return;
    }

    let nextTypes = managedDeviceTypes.filter((typeName) => normalizeTypeValue(typeName) !== normalizeTypeValue(editingTypeName));
    nextTypes = uniqueSortedTypes([...nextTypes, inputValue]);
    managedDeviceTypes = nextTypes;
    persistManagedDeviceTypes();
    clearTypeEditMode();
    renderAssetTypeAdminTable();
    showStatus(t('Geraetetyp erfolgreich aktualisiert.', 'Device type updated successfully.'));
}

function removeAcceptedDeviceType(typeName) {
    const isDefaultType = DEFAULT_DEVICE_TYPES.some((defaultType) => normalizeTypeValue(defaultType) === normalizeTypeValue(typeName));
    if (isDefaultType) {
        showStatus(t('Standardtypen koennen nicht entfernt werden.', 'Default types cannot be removed.'), true);
        return;
    }

    managedDeviceTypes = managedDeviceTypes.filter((entry) => normalizeTypeValue(entry) !== normalizeTypeValue(typeName));
    persistManagedDeviceTypes();
    if (editingTypeName && normalizeTypeValue(editingTypeName) === normalizeTypeValue(typeName)) {
        clearTypeEditMode();
    }
    renderAssetTypeAdminTable();
    showStatus(t('Geraetetyp entfernt.', 'Device type removed.'));
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

    if (versionExpectedType && !normalizedType) {
        errors.push(
            t(
                `Geraetetyp fehlt fuer Typ: ${row.version}`,
                `Device type is missing for model: ${row.version}`
            )
        );
    }

    if (versionExpectedType && normalizedType && versionExpectedType !== normalizedType) {
        errors.push(
            t(
                `Geraetetyp und Typ passen nicht zusammen: ${row.type} / ${row.version}`,
                `Device type and model do not match: ${row.type} / ${row.version}`
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
    refreshFilterOptions();
    resetToFirstPage();
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
            if (!db.objectStoreNames.contains(INVENTORY_MONTHLY_STORE)) {
                db.createObjectStore(INVENTORY_MONTHLY_STORE, { keyPath: 'id' });
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
    setSettingsPanelExpanded('assetSettingsDefaultsPanel', false);
    setSettingsPanelExpanded('assetSettingsAdminPanel', false);
    clearTypeEditMode();
    renderAssetTypeAdminTable();

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
        refreshFilterOptions();
        resetToFirstPage();
        renderTable();
        applyDefaultsToInputs(inventoryDefaults);
        renderDefaultsTable();
        renderAssetAdminTexts();

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
        showStatus(t('Alle Datensätze wurden gelöscht.', 'All records were deleted.'));
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
            if (!button) {
                return;
            }

            const page = Number(button.getAttribute('data-page'));
            if (!Number.isFinite(page) || page < 1) {
                return;
            }

            currentPage = page;
            renderTable();
        });
    }

    document.addEventListener('mdm-language-changed', () => {
        refreshFilterOptions();
        renderTable();
        renderValidationReport(lastValidationReport);
        renderDefaultsTable();
        renderAssetAdminTexts();
        renderAssetTypeAdminTable();
    });
}

bindEvents();
bootstrapRowsAndDefaults();
