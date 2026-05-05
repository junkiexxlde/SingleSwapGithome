const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 4;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_DEFAULTS_STORE = 'inventory_defaults';
const INVENTORY_MONTHLY_STORE = 'monthly_inventory_movements';
const INVENTORY_REQUIRED_STORES = [INVENTORY_STORE, INVENTORY_DEFAULTS_STORE, INVENTORY_MONTHLY_STORE];
const MANAGED_DEVICE_TYPES_KEY = 'mdmtool_managed_device_types_v1';
const MANAGED_MODELS_KEY = 'mdmtool_managed_models_v1';
const DEFAULT_DEVICE_TYPES = [];
const VERSION_DEVICE_TYPE_MAP = {};

const typeSelect = document.getElementById('monthlyInventoryTypeSelect');
const monthSelect = document.getElementById('monthlyInventoryMonthSelect');
const monthNativeWrap = document.getElementById('monthlyInventoryMonthNativeWrap');
const monthFallback = document.getElementById('monthlyInventoryMonthFallback');
const monthFallbackMonthSelect = document.getElementById('monthlyInventoryMonthFallbackMonth');
const monthFallbackYearSelect = document.getElementById('monthlyInventoryMonthFallbackYear');
const monthLabel = document.getElementById('monthlyInventoryMonthLabel');
const settingsTitle = document.getElementById('monthlyInventorySettingsTitle');
const modelTabs = document.getElementById('monthlyInventoryModelTabs');
const metricsBox = document.getElementById('monthlyInventoryMetrics');
const modelHeading = document.getElementById('monthlyInventoryModelHeading');
const modelHint = document.getElementById('monthlyInventoryModelHint');
const totalValue = document.getElementById('monthlyInventoryTotal');
const outgoingValue = document.getElementById('monthlyInventoryOutgoing');
const incomingValue = document.getElementById('monthlyInventoryIncoming');
const endingValue = document.getElementById('monthlyInventoryEnding');
const outgoingInput = document.getElementById('monthlyInventoryOutgoingInput');
const incomingInput = document.getElementById('monthlyInventoryIncomingInput');
const saveButton = document.getElementById('monthlyInventorySaveButton');
const resetButton = document.getElementById('monthlyInventoryResetButton');

let inventoryRows = [];
let selectedType = '';
let selectedModel = '';
let managedDeviceTypes = [];
let managedModels = [];
let useMonthFallback = false;

const translations = {
    de: {
        loading: 'Inventur wird geladen...',
        noData: 'Noch keine Assets in der Lagerliste vorhanden.',
        noTypes: 'Es sind keine Gerätetypen verfügbar.',
        noModels: 'Für den gewählten Gerätetyp sind keine Typen vorhanden.',
        loadedRows: '{count} Inventardatensätze geladen.',
        settingsTitle: 'Manuelle Werte für {month}',
        saved: 'Monatswerte gespeichert.',
        reset: 'Monatswerte zurückgesetzt.',
        saveError: 'Monatswerte konnten nicht gespeichert werden.',
        resetError: 'Monatswerte konnten nicht zurückgesetzt werden.',
        modelHint: 'Monatsstand {month} für {type} / {model}',
        monthLabel: 'Monat: {month}'
    },
    en: {
        loading: 'Loading inventory overview...',
        noData: 'No assets in the inventory list yet.',
        noTypes: 'No device types are available.',
        noModels: 'No models are available for the selected device type.',
        loadedRows: '{count} inventory records loaded.',
        settingsTitle: 'Manual values for {month}',
        saved: 'Monthly values saved.',
        reset: 'Monthly values reset.',
        saveError: 'Monthly values could not be saved.',
        resetError: 'Monthly values could not be reset.',
        modelHint: 'Monthly status for {month}: {type} / {model}',
        monthLabel: 'Month: {month}'
    }
};

function getCurrentLanguage() {
    return localStorage.getItem('language') || 'de';
}

function t(key, replacements = {}) {
    const lang = getCurrentLanguage();
    let text = translations[lang]?.[key] || translations.de[key] || key;
    Object.entries(replacements).forEach(([name, value]) => {
        text = text.replace(`{${name}}`, String(value));
    });
    return text;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizeValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeTypeValue(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/^type[\s_-]*/g, '')
        .replace(/[_\-\s]+/g, '');
}

function canonicalStoredDeviceType(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function uniqueSortedValues(values) {
    return Array.from(new Set(values.filter((value) => !!String(value || '').trim())))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
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

function formatCanonicalModelLabel(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/(^|[\s(_-])iphone(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPhone`)
        .replace(/(^|[\s(_-])ipad(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}iPad`)
        .replace(/(^|[\s(_-])macbook(?=$|[\s)_-]|\d)/gi, (match, prefix) => `${prefix}MacBook`);
}

function canonicalModelName(value, type = '') {
    void type;
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function getDefaultManagedModels() {
    return [];
}

function uniqueSortedModels(modelRows) {
    const seen = new Set();
    const output = [];

    modelRows.forEach((entry) => {
        const cleanType = canonicalStoredDeviceType(entry?.type);
        const cleanName = canonicalModelName(entry?.name, cleanType);
        if (!cleanName || !cleanType) {
            return;
        }

        const key = `${normalizeValue(cleanType)}::${normalizeModelValue(cleanName)}`;
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

function loadManagedDeviceTypes() {
    try {
        const raw = localStorage.getItem(MANAGED_DEVICE_TYPES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        managedDeviceTypes = uniqueSortedValues(Array.isArray(parsed) ? parsed : []);
    } catch {
        managedDeviceTypes = [];
    }
}

function loadManagedModels() {
    try {
        const raw = localStorage.getItem(MANAGED_MODELS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        managedModels = uniqueSortedModels(Array.isArray(parsed) ? parsed : []);
    } catch {
        managedModels = [];
    }
}

function sanitizeRow(row) {
    return {
        type: canonicalStoredDeviceType(row?.type),
        version: canonicalModelName(row?.version, row?.type),
        assetid: String(row?.assetid || '').trim(),
        serialnumber: String(row?.serialnumber || '').trim()
    };
}

function sanitizeMovementValue(value) {
    const parsed = Number.parseInt(String(value || '0'), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function showStatus(message, isError = false) {
    void message;
    void isError;
}

function getCurrentMonthKey() {
    return new Date().toISOString().slice(0, 7);
}

function normalizeMonthKey(monthKey) {
    return /^\d{4}-\d{2}$/.test(String(monthKey || '')) ? String(monthKey) : getCurrentMonthKey();
}

function supportsMonthInput() {
    const input = document.createElement('input');
    input.setAttribute('type', 'month');
    return input.type === 'month';
}

function buildMonthOptionLabel(monthNumber) {
    const locale = getCurrentLanguage() === 'en' ? 'en-US' : 'de-DE';
    const date = new Date(`2000-${String(monthNumber).padStart(2, '0')}-01T00:00:00`);
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}

function ensureFallbackYearOptions(selectedYear) {
    if (!monthFallbackYearSelect) {
        return;
    }

    const numericSelectedYear = Number.parseInt(String(selectedYear || ''), 10);
    const currentYear = new Date().getFullYear();
    const anchorYear = Number.isFinite(numericSelectedYear) ? numericSelectedYear : currentYear;
    const startYear = Math.min(currentYear, anchorYear) - 5;
    const endYear = Math.max(currentYear, anchorYear) + 5;
    const years = [];

    for (let year = startYear; year <= endYear; year += 1) {
        years.push(year);
    }

    monthFallbackYearSelect.innerHTML = years
        .map((year) => `<option value="${year}">${year}</option>`)
        .join('');
}

function populateFallbackMonthOptions() {
    if (!monthFallbackMonthSelect) {
        return;
    }

    monthFallbackMonthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        const value = String(monthNumber).padStart(2, '0');
        return `<option value="${value}">${escapeHtml(buildMonthOptionLabel(monthNumber))}</option>`;
    }).join('');
}

function syncFallbackFromMonthKey(monthKey) {
    if (!monthFallbackMonthSelect || !monthFallbackYearSelect) {
        return;
    }

    const safeMonthKey = normalizeMonthKey(monthKey);
    const [year, month] = safeMonthKey.split('-');
    populateFallbackMonthOptions();
    ensureFallbackYearOptions(year);
    monthFallbackMonthSelect.value = month;
    monthFallbackYearSelect.value = year;
}

function getFallbackMonthKey() {
    const year = monthFallbackYearSelect?.value || getCurrentMonthKey().slice(0, 4);
    const month = monthFallbackMonthSelect?.value || getCurrentMonthKey().slice(5, 7);
    return normalizeMonthKey(`${year}-${month}`);
}

function setSelectedMonthKey(monthKey) {
    const safeMonthKey = normalizeMonthKey(monthKey);
    if (useMonthFallback) {
        syncFallbackFromMonthKey(safeMonthKey);
        return;
    }

    if (monthSelect) {
        monthSelect.value = safeMonthKey;
    }
}

function getSelectedMonthKey() {
    if (useMonthFallback) {
        return getFallbackMonthKey();
    }
    return normalizeMonthKey(monthSelect?.value || getCurrentMonthKey());
}

function formatMonthKey(monthKey) {
    const locale = getCurrentLanguage() === 'en' ? 'en-US' : 'de-DE';
    const safeMonthKey = normalizeMonthKey(monthKey);
    const date = new Date(`${safeMonthKey}-01T00:00:00`);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

function handleMonthSelectionChange() {
    renderMonthLabel();
    renderSettingsTitle();
    void renderMetrics();
}

function initMonthPicker() {
    if (!monthSelect) {
        return;
    }

    useMonthFallback = !supportsMonthInput();

    if (!useMonthFallback) {
        monthSelect.setAttribute('type', 'month');
        monthNativeWrap?.classList.remove('hidden');
        monthFallback?.classList.add('hidden');
        setSelectedMonthKey(getCurrentMonthKey());
        return;
    }

    monthNativeWrap?.classList.add('hidden');
    monthFallback?.classList.remove('hidden');
    syncFallbackFromMonthKey(getCurrentMonthKey());

    monthFallbackMonthSelect?.addEventListener('change', handleMonthSelectionChange);
    monthFallbackYearSelect?.addEventListener('change', handleMonthSelectionChange);
}

function renderMonthLabel() {
    monthLabel.textContent = t('monthLabel', { month: formatMonthKey(getSelectedMonthKey()) });
}

function renderSettingsTitle() {
    if (!settingsTitle) {
        return;
    }

    settingsTitle.textContent = t('settingsTitle', { month: formatMonthKey(getSelectedMonthKey()) });
}

function setMovementInputs(outgoing, incoming) {
    const safeOutgoing = sanitizeMovementValue(outgoing);
    const safeIncoming = sanitizeMovementValue(incoming);

    if (outgoingValue) {
        outgoingValue.textContent = String(safeOutgoing);
    }
    if (incomingValue) {
        incomingValue.textContent = String(safeIncoming);
    }
    if (outgoingInput) {
        outgoingInput.value = String(safeOutgoing);
    }
    if (incomingInput) {
        incomingInput.value = String(safeIncoming);
    }

    updateEndingValue();
}

function getDisplayedTotal() {
    return sanitizeMovementValue(totalValue?.textContent || '0');
}

function calculateEndingStock(total, outgoing, incoming) {
    return total - outgoing + incoming;
}

function updateEndingValue(total = getDisplayedTotal(), outgoing = sanitizeMovementValue(outgoingInput?.value), incoming = sanitizeMovementValue(incomingInput?.value)) {
    if (!endingValue) {
        return;
    }

    endingValue.textContent = String(calculateEndingStock(total, outgoing, incoming));
}

function setMetricsDisabled(disabled) {
    if (outgoingInput) {
        outgoingInput.disabled = disabled;
    }
    if (incomingInput) {
        incomingInput.disabled = disabled;
    }
    if (saveButton) {
        saveButton.disabled = disabled;
    }
    if (resetButton) {
        resetButton.disabled = disabled;
    }
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

function buildUniqueValues(values) {
    return uniqueSortedValues(values);
}

function getTypes() {
    const inventoryTypes = buildUniqueValues(inventoryRows.map((row) => row.type));
    if (inventoryTypes.length > 0) {
        return inventoryTypes;
    }

    return buildUniqueValues(managedDeviceTypes);
}

function getModelsForType(type) {
    const inventoryModels = inventoryRows
        .filter((row) => normalizeTypeValue(row.type) === normalizeTypeValue(type))
        .map((row) => row.version);
    const uniqueInventoryModels = buildUniqueValues(inventoryModels);

    if (uniqueInventoryModels.length > 0) {
        return uniqueInventoryModels;
    }

    const configuredModels = managedModels
        .filter((entry) => normalizeTypeValue(entry?.type) === normalizeTypeValue(type))
        .map((entry) => String(entry?.name || '').trim());

    return buildUniqueValues(configuredModels);
}

function getModelTotal(type, model) {
    return inventoryRows.filter((row) => (
        normalizeTypeValue(row.type) === normalizeTypeValue(type)
        && normalizeModelValue(row.version) === normalizeModelValue(model)
    )).length;
}

function getMovementRecordId(monthKey, type, model) {
    return `${monthKey}::${normalizeTypeValue(type)}::${normalizeModelValue(model)}`;
}

async function loadMovementSummaryBeforeMonth(monthKey, type, model) {
    const db = await openInventoryDb();

    try {
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_MONTHLY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_MONTHLY_STORE);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const records = (request.result || []).filter((record) => (
                    String(record?.month || '') < monthKey
                    && normalizeTypeValue(record?.type) === normalizeTypeValue(type)
                    && normalizeModelValue(record?.model) === normalizeModelValue(model)
                ));

                const summary = records.reduce((acc, record) => {
                    acc.outgoing += sanitizeMovementValue(record.outgoing);
                    acc.incoming += sanitizeMovementValue(record.incoming);
                    return acc;
                }, { outgoing: 0, incoming: 0 });

                resolve(summary);
            };
        });
    } finally {
        db.close();
    }
}

async function getStartingStockForMonth(monthKey, type, model) {
    const baseTotal = getModelTotal(type, model);
    const summary = await loadMovementSummaryBeforeMonth(monthKey, type, model);
    return baseTotal - summary.outgoing + summary.incoming;
}

async function loadMovementRecord(monthKey, type, model) {
    const db = await openInventoryDb();

    try {
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_MONTHLY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_MONTHLY_STORE);
            const request = store.get(getMovementRecordId(monthKey, type, model));
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const record = request.result || {};
                resolve({
                    outgoing: sanitizeMovementValue(record.outgoing),
                    incoming: sanitizeMovementValue(record.incoming)
                });
            };
        });
    } finally {
        db.close();
    }
}

async function saveMovementRecord(monthKey, type, model, outgoing, incoming) {
    const db = await openInventoryDb();

    try {
        await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_MONTHLY_STORE, 'readwrite');
            const store = tx.objectStore(INVENTORY_MONTHLY_STORE);
            store.put({
                id: getMovementRecordId(monthKey, type, model),
                month: monthKey,
                type,
                model,
                outgoing: sanitizeMovementValue(outgoing),
                incoming: sanitizeMovementValue(incoming)
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    } finally {
        db.close();
    }
}

async function deleteMovementRecord(monthKey, type, model) {
    const db = await openInventoryDb();

    try {
        await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_MONTHLY_STORE, 'readwrite');
            const store = tx.objectStore(INVENTORY_MONTHLY_STORE);
            store.delete(getMovementRecordId(monthKey, type, model));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    } finally {
        db.close();
    }
}

function renderTypeOptions() {
    const types = getTypes();
    const previousType = selectedType;

    typeSelect.innerHTML = types
        .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
        .join('');

    if (types.length === 0) {
        selectedType = '';
        return;
    }

    selectedType = types.some((type) => normalizeTypeValue(type) === normalizeTypeValue(previousType))
        ? previousType
        : types[0];

    typeSelect.value = selectedType;
}

function renderModelTabs() {
    const models = getModelsForType(selectedType);
    const previousModel = selectedModel;

    if (!selectedType) {
        modelTabs.innerHTML = '';
        modelTabs.classList.add('hidden');
        metricsBox.classList.add('hidden');
        setMetricsDisabled(true);
        showStatus(t('noTypes'), true);
        return;
    }

    if (models.length === 0) {
        selectedModel = '';
        modelTabs.innerHTML = '';
        modelTabs.classList.add('hidden');
        metricsBox.classList.add('hidden');
        setMetricsDisabled(true);
        showStatus(t('noModels'), true);
        return;
    }

    selectedModel = models.some((model) => normalizeModelValue(model) === normalizeModelValue(previousModel))
        ? previousModel
        : models[0];

    modelTabs.innerHTML = models.map((model) => {
        const isActive = normalizeModelValue(model) === normalizeModelValue(selectedModel);
        return `
            <button
                type="button"
                class="monthly-inventory-tab${isActive ? ' active' : ''}"
                data-model="${escapeHtml(model)}"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
            >${escapeHtml(model)}</button>
        `;
    }).join('');

    modelTabs.classList.remove('hidden');
    void renderMetrics();
}

async function renderMetrics() {
    if (!selectedType || !selectedModel) {
        metricsBox.classList.add('hidden');
        setMetricsDisabled(true);
        return;
    }

    const monthKey = getSelectedMonthKey();
    renderMonthLabel();
    renderSettingsTitle();

    modelHeading.textContent = selectedModel;
    modelHint.textContent = t('modelHint', {
        month: formatMonthKey(monthKey),
        type: selectedType,
        model: selectedModel
    });
    const total = await getStartingStockForMonth(monthKey, selectedType, selectedModel);
    totalValue.textContent = String(total);

    try {
        const movement = await loadMovementRecord(monthKey, selectedType, selectedModel);
        setMovementInputs(movement.outgoing, movement.incoming);
        updateEndingValue(total, movement.outgoing, movement.incoming);
        metricsBox.classList.remove('hidden');
        setMetricsDisabled(false);
        showStatus('');
    } catch (error) {
        console.error('Error loading movement record:', error);
        setMovementInputs(0, 0);
        updateEndingValue(total, 0, 0);
        metricsBox.classList.remove('hidden');
        setMetricsDisabled(false);
        showStatus(t('saveError'), true);
    }
}

async function loadInventoryRows() {
    try {
        showStatus(t('loading'));
        loadManagedDeviceTypes();
        loadManagedModels();

        setSelectedMonthKey(getCurrentMonthKey());

        const db = await openInventoryDb();
        const rows = await new Promise((resolve, reject) => {
            const tx = db.transaction(INVENTORY_STORE, 'readonly');
            const store = tx.objectStore(INVENTORY_STORE);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve((request.result || []).map((row) => sanitizeRow(row)));
        });
        db.close();

        inventoryRows = rows;
        renderMonthLabel();
        renderSettingsTitle();

        renderTypeOptions();

        if (getTypes().length === 0) {
            typeSelect.innerHTML = '';
            modelTabs.innerHTML = '';
            modelTabs.classList.add('hidden');
            metricsBox.classList.add('hidden');
            setMetricsDisabled(true);
            showStatus(t('noData'), true);
            return;
        }

        renderModelTabs();

        if (inventoryRows.length === 0) {
            showStatus(t('noData'), true);
        } else {
            showStatus(t('loadedRows', { count: inventoryRows.length }));
        }
    } catch (error) {
        console.error('Error loading monthly inventory:', error);
        inventoryRows = [];
        typeSelect.innerHTML = '';
        modelTabs.innerHTML = '';
        modelTabs.classList.add('hidden');
        metricsBox.classList.add('hidden');
        setMetricsDisabled(true);
        showStatus(t('noData'), true);
    }
}

if (typeSelect) {
    typeSelect.addEventListener('change', () => {
        selectedType = typeSelect.value;
        selectedModel = '';
        renderModelTabs();
    });
}

if (monthSelect) {
    monthSelect.addEventListener('change', handleMonthSelectionChange);
}

if (modelTabs) {
    modelTabs.addEventListener('click', (event) => {
        const button = event.target.closest('[data-model]');
        if (!button) {
            return;
        }
        selectedModel = button.getAttribute('data-model') || '';
        renderModelTabs();
    });
}

if (saveButton) {
    saveButton.addEventListener('click', async () => {
        if (!selectedType || !selectedModel) {
            return;
        }

        try {
            const outgoing = sanitizeMovementValue(outgoingInput?.value);
            const incoming = sanitizeMovementValue(incomingInput?.value);
            await saveMovementRecord(getSelectedMonthKey(), selectedType, selectedModel, outgoing, incoming);
            setMovementInputs(outgoing, incoming);
            updateEndingValue(getDisplayedTotal(), outgoing, incoming);
            showStatus(t('saved'));
        } catch (error) {
            console.error('Error saving movement record:', error);
            showStatus(t('saveError'), true);
        }
    });
}

if (resetButton) {
    resetButton.addEventListener('click', async () => {
        if (!selectedType || !selectedModel) {
            return;
        }

        try {
            await deleteMovementRecord(getSelectedMonthKey(), selectedType, selectedModel);
            setMovementInputs(0, 0);
            updateEndingValue(getDisplayedTotal(), 0, 0);
            showStatus(t('reset'));
        } catch (error) {
            console.error('Error resetting movement record:', error);
            showStatus(t('resetError'), true);
        }
    });
}

if (outgoingInput) {
    outgoingInput.addEventListener('input', () => {
        updateEndingValue();
    });
}

if (incomingInput) {
    incomingInput.addEventListener('input', () => {
        updateEndingValue();
    });
}

document.addEventListener('mdm-language-changed', () => {
    if (useMonthFallback) {
        syncFallbackFromMonthKey(getSelectedMonthKey());
    }
    renderMonthLabel();
    renderSettingsTitle();
    if (inventoryRows.length === 0) {
        showStatus(t('noData'), true);
        return;
    }
    renderTypeOptions();
    renderModelTabs();
});


window.addEventListener('focus', () => {
    loadInventoryRows();
});

window.addEventListener('storage', (event) => {
    if (
        event.key === MANAGED_DEVICE_TYPES_KEY
        || event.key === MANAGED_MODELS_KEY
        || event.key === 'language'
    ) {
        loadInventoryRows();
    }
});
initMonthPicker();
renderMonthLabel();
renderSettingsTitle();
setMovementInputs(0, 0);
setMetricsDisabled(true);
updateEndingValue(0, 0, 0);
loadInventoryRows();
