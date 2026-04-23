const INVENTORY_DB_NAME = 'MDMTool_Inventory';
const INVENTORY_DB_VERSION = 3;
const INVENTORY_STORE = 'assets_inventory';
const INVENTORY_MONTHLY_STORE = 'monthly_inventory_movements';

const typeSelect = document.getElementById('monthlyInventoryTypeSelect');
const monthSelect = document.getElementById('monthlyInventoryMonthSelect');
const statusBox = document.getElementById('monthlyInventoryStatus');
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

const translations = {
    de: {
        loading: 'Inventur wird geladen...',
        noData: 'Noch keine Assets in der Lagerliste vorhanden.',
        noTypes: 'Es sind keine Gerätetypen verfügbar.',
        noModels: 'Für den gewählten Gerätetyp sind keine Typen vorhanden.',
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

function sanitizeRow(row) {
    return {
        type: String(row?.type || '').trim(),
        version: String(row?.version || '').trim(),
        assetid: String(row?.assetid || '').trim(),
        serialnumber: String(row?.serialnumber || '').trim()
    };
}

function sanitizeMovementValue(value) {
    const parsed = Number.parseInt(String(value || '0'), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function showStatus(message, isError = false) {
    if (!statusBox) {
        return;
    }

    statusBox.textContent = message;
    statusBox.style.background = isError ? 'rgba(180, 73, 73, 0.14)' : 'rgba(52, 73, 99, 0.08)';
}

function getCurrentMonthKey() {
    return new Date().toISOString().slice(0, 7);
}

function getSelectedMonthKey() {
    return monthSelect?.value || getCurrentMonthKey();
}

function formatMonthKey(monthKey) {
    const locale = getCurrentLanguage() === 'en' ? 'en-US' : 'de-DE';
    const safeMonthKey = /^\d{4}-\d{2}$/.test(String(monthKey || '')) ? String(monthKey) : getCurrentMonthKey();
    const date = new Date(`${safeMonthKey}-01T00:00:00`);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
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
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(INVENTORY_DB_NAME, INVENTORY_DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(INVENTORY_STORE)) {
                db.createObjectStore(INVENTORY_STORE, { keyPath: 'assetidKey' });
            }
            if (!db.objectStoreNames.contains(INVENTORY_MONTHLY_STORE)) {
                db.createObjectStore(INVENTORY_MONTHLY_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
    });
}

function buildUniqueValues(values) {
    return Array.from(new Set(values.filter((value) => !!String(value || '').trim())))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function getTypes() {
    return buildUniqueValues(inventoryRows.map((row) => row.type));
}

function getModelsForType(type) {
    return buildUniqueValues(
        inventoryRows
            .filter((row) => normalizeValue(row.type) === normalizeValue(type))
            .map((row) => row.version)
    );
}

function getModelTotal(type, model) {
    return inventoryRows.filter((row) => (
        normalizeValue(row.type) === normalizeValue(type)
        && normalizeValue(row.version) === normalizeValue(model)
    )).length;
}

function getMovementRecordId(monthKey, type, model) {
    return `${monthKey}::${normalizeValue(type)}::${normalizeValue(model)}`;
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
                    && normalizeValue(record?.type) === normalizeValue(type)
                    && normalizeValue(record?.model) === normalizeValue(model)
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

    selectedType = types.some((type) => normalizeValue(type) === normalizeValue(previousType))
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

    selectedModel = models.some((model) => normalizeValue(model) === normalizeValue(previousModel))
        ? previousModel
        : models[0];

    modelTabs.innerHTML = models.map((model) => {
        const isActive = normalizeValue(model) === normalizeValue(selectedModel);
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

        if (monthSelect && !monthSelect.value) {
            monthSelect.value = getCurrentMonthKey();
        }

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

        if (inventoryRows.length === 0) {
            typeSelect.innerHTML = '';
            modelTabs.innerHTML = '';
            modelTabs.classList.add('hidden');
            metricsBox.classList.add('hidden');
            setMetricsDisabled(true);
            showStatus(t('noData'), true);
            return;
        }

        renderTypeOptions();
        renderModelTabs();
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
    monthSelect.addEventListener('change', () => {
        renderMonthLabel();
        renderSettingsTitle();
        void renderMetrics();
    });
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
    renderMonthLabel();
    renderSettingsTitle();
    if (inventoryRows.length === 0) {
        showStatus(t('noData'), true);
        return;
    }
    renderTypeOptions();
    renderModelTabs();
});

if (monthSelect) {
    monthSelect.value = getCurrentMonthKey();
}

renderMonthLabel();
renderSettingsTitle();
setMovementInputs(0, 0);
setMetricsDisabled(true);
updateEndingValue(0, 0, 0);
loadInventoryRows();
