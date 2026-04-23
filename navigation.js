const navTranslations = {
    de: {
        "start-page-title": "MDM Tool - Start",
        "overview-page-title": "MDM Tool - Übersicht",
        "asset-page-title": "MDM Tool - Assets verwalten",
        "app-shell-title": "Mobile Device Warranty Management Tool",
        "start-heading": "Mobile Device Management",
        "new-case-button": "Neuen Fall anlegen",
        "overview-button": "Übersicht",
        "assets-button": "Assets verwalten",
        "overview-heading": "Übersicht",
        "overview-description": "Diese Seite ist als neuer Bereich vorbereitet und kann nun mit Inhalten ergänzt werden.",
        "asset-heading": "Assets verwalten",
        "asset-description": "Import und Export der Lagerliste für neu gelieferte Assets.",
        "asset-tools-heading": "Lagerlistenverwaltung",
        "asset-import-heading": "Import",
        "asset-import-hint": "Unterstützt CSV, XLSX, XLS und ODS. Duplikatprüfung erfolgt nur über Asset-ID.",
        "asset-pick-file": "Datei auswählen",
        "asset-import-button": "Import starten",
        "asset-export-heading": "Export",
        "asset-export-hint": "Exportiert die aktuelle Lagerliste.",
        "asset-export-format-label": "Format",
        "asset-export-button": "Exportieren",
        "asset-validation-refresh": "Seite aktualisieren",
        "asset-settings-title": "Standardwerte",
        "asset-default-assigned-label": "Zugewiesen",
        "asset-default-assigned-placeholder": "z. B. Team Support",
        "asset-default-managedby-label": "Verwaltet von",
        "asset-default-managedby-placeholder": "z. B. IT Service",
        "asset-default-costcenter-label": "Kostenstelle",
        "asset-default-costcenter-placeholder": "z. B. 1100",
        "asset-default-save-button": "Standardwerte speichern",
        "asset-clear-inventory-button": "Alle Datensätze löschen",
        "back-home": "Zurück zur Startseite",
        "nav-home": "Startseite",
        "nav-new-case": "Neuen Fall anlegen",
        "nav-overview": "Übersicht",
        "nav-assets": "Assets verwalten",
        "settings-placeholder": "Einstellungsmenü folgt."
    },
    en: {
        "start-page-title": "MDM Tool - Home",
        "overview-page-title": "MDM Tool - Overview",
        "asset-page-title": "MDM Tool - Manage Assets",
        "app-shell-title": "Mobile Device Warranty Management Tool",
        "start-heading": "Mobile Device Management",
        "new-case-button": "Create New Case",
        "overview-button": "Overview",
        "assets-button": "Manage Assets",
        "overview-heading": "Overview",
        "overview-description": "This page is prepared as a new section and can now be filled with content.",
        "asset-heading": "Manage Assets",
        "asset-description": "Import and export the inventory list for newly delivered assets.",
        "asset-tools-heading": "Inventory List Management",
        "asset-import-heading": "Import",
        "asset-import-hint": "Supports CSV, XLSX, XLS and ODS. Duplicate checks use Asset ID only.",
        "asset-pick-file": "Choose File",
        "asset-import-button": "Start Import",
        "asset-export-heading": "Export",
        "asset-export-hint": "Exports the current inventory list.",
        "asset-export-format-label": "Format",
        "asset-export-button": "Export",
        "asset-validation-refresh": "Refresh Page",
        "asset-settings-title": "Default Values",
        "asset-default-assigned-label": "Assigned To",
        "asset-default-assigned-placeholder": "e.g. Support Team",
        "asset-default-managedby-label": "Managed By",
        "asset-default-managedby-placeholder": "e.g. IT Service",
        "asset-default-costcenter-label": "Cost Center",
        "asset-default-costcenter-placeholder": "e.g. 1100",
        "asset-default-save-button": "Save Default Values",
        "asset-clear-inventory-button": "Delete All Records",
        "back-home": "Back to Home",
        "nav-home": "Home",
        "nav-new-case": "Create New Case",
        "nav-overview": "Overview",
        "nav-assets": "Manage Assets",
        "settings-placeholder": "Settings menu coming soon."
    }
};

function setNavLanguage(lang) {
    const dict = navTranslations[lang] || navTranslations.de;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    document.querySelectorAll('[data-i18n-titleattr]').forEach((el) => {
        const key = el.getAttribute('data-i18n-titleattr');
        if (dict[key]) {
            el.setAttribute('title', dict[key]);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    const titleTag = document.querySelector('title[data-i18n-title]');
    if (titleTag) {
        const titleKey = titleTag.getAttribute('data-i18n-title');
        if (dict[titleKey]) {
            titleTag.textContent = dict[titleKey];
            document.title = dict[titleKey];
        }
    }

    const deButton = document.getElementById('lang-de');
    const enButton = document.getElementById('lang-en');
    if (deButton && enButton) {
        deButton.classList.toggle('active', lang === 'de');
        enButton.classList.toggle('active', lang === 'en');
    }

    localStorage.setItem('language', lang);
    document.dispatchEvent(new CustomEvent('mdm-language-changed', { detail: { lang } }));
}

function setNavTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    localStorage.setItem('theme', theme);
}

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

(function initNavigationShell() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const initialTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    const initialLanguage = localStorage.getItem('language') || 'de';

    setNavTheme(initialTheme);
    setNavLanguage(initialLanguage);

    const deButton = document.getElementById('lang-de');
    const enButton = document.getElementById('lang-en');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const settingsToggle = document.getElementById('settings-toggle');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

    if (deButton) {
        deButton.addEventListener('click', () => setNavLanguage('de'));
    }
    if (enButton) {
        enButton.addEventListener('click', () => setNavLanguage('en'));
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setNavTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleNavDrawer);
    }
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeNavDrawer);
    }
    if (settingsToggle) {
        settingsToggle.addEventListener('click', toggleSettingsMenu);
    }
    drawerLinks.forEach((link) => {
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
})();
