# MDMTool

Mobile Device Warranty Management Tool (MDWMT) for IT service single-swap workflows and asset inventory handling.

## Overview

MDMTool is a browser-based application to document and manage device swap cases for iPhone, iPad, and MacBook, plus an independent inventory list for newly delivered assets.

Main goals:
- Structured case capture for old and replacement device
- Local offline-first storage in IndexedDB
- Print and PDF export for swap protocol and delivery note
- CSV export/import for backup and transfer
- Dedicated inventory list for asset onboarding

## Entry Point and Navigation

Start with `index.html`.

The start page contains three vertically aligned navigation buttons:
- Neuen Fall anlegen -> `singleswap.html`
- Übersicht -> `overview.html`
- Assets verwalten -> `assetmanagement.html`

Language toggle (DE/EN) and dark mode toggle are available on all navigation pages and on the case form page.

Navigation targets:
- `singleswap.html`: Main swap workflow
- `overview.html`: Overview page
- `assetmanagement.html`: Inventory list (Lagerliste)

## Project Structure

```
MDMTool/
├── index.html
├── singleswap.html
├── overview.html
├── assetmanagement.html
├── assetmanagement.js
├── navigation.js
├── scripts.js
├── styles.css
├── service-worker.js
├── manifest.json
├── USER_MANUAL.md
├── DEVELOPMENT.md
└── README.md
```

## Core Features

- Case capture for old/new device with required field validation
- Optional no-spare-device mode (hides replacement device form and stores return note)
- IndexedDB persistence with duplicate ticket protection
- Saved dataset modal with search, load, delete, and single CSV export
- Full CSV export/import
- Print and PDF export for:
	- Tauschprotokoll (swap protocol)
	- Lieferschein (delivery note)
- DE/EN translations
- Light and dark theme with localStorage persistence

### Asset Inventory (Lagerliste)

The asset management page is independent from single-swap datasets.

- Dedicated IndexedDB database: `MDMTool_Inventory`
- Store `assets_inventory`: imported inventory records (unique by Asset-ID)
- Store `inventory_defaults`: standard values used during import

Import supports:
- CSV
- Excel (`.xlsx`, `.xls`)
- LibreOffice (`.ods`)

Import reads only asset source fields from the file:
- Device Type
- Version
- Asset-ID
- Serial Number

These fields are injected from settings defaults (not from the file):
- Zugewiesen (Assigned To)
- Verwaltet von (Managed By)
- Kostenstelle (Cost Center)

Validation includes:
- Required Asset-ID check
- Device type validation (`iPhone`, `iPad`, `MacBook`)
- Duplicate detection by Asset-ID only
- Row-level validation report (`Imported`, `Duplicate`, `Invalid`)

Settings menu on asset page includes:
- Save default values
- Table showing current default values
- Permanent action to delete all inventory records (with confirmation)

## Run Locally

Option 1:
- Open `index.html` directly in a modern browser

Option 2 (recommended for full PWA behavior):
```bash
python3 -m http.server
```
Then open the shown local URL in your browser.

## PWA / Offline

- `manifest.json` provides install metadata
- `service-worker.js` caches core assets for offline usage
- After first successful load, the app can run offline in the same browser profile

## Documentation

- User guide: `USER_MANUAL.md`
- Developer documentation: `DEVELOPMENT.md`
