# MDMTool – Entwicklungsdokumentation

**Projekt:** Mobile Device Warranty Management Tool (MDWMT)  
**Autor:** Lars Junker  
**Letzter Stand:** 2026  

---

## 1. Projektziel

Das MDWMT ist ein browserbasiertes Werkzeug zur Verwaltung von Garantieaustauschen mobiler Unternehmensgeräte (iPhone, iPad, MacBook). Es ersetzt manuelle Papierprozesse durch digitale Erfassung, lokale Speicherung, Drucken und Export – alles ohne Server-Backend.

---

## 2. Technologieentscheidungen

### 2.1 Vanilla JS + HTML + CSS (kein Framework)

Bewusster Verzicht auf Frameworks (React, Vue, etc.) zugunsten von:
- Maximaler Portabilität (läuft in jedem modernen Browser, offline, auf jedem Endgerät)
- Keine Abhängigkeiten von npm-Ökosystem oder Build-Prozessen
- Direktes Deployment: Dateien auf einen Webserver legen oder lokal öffnen genügt

### 2.2 Progressive Web App (PWA)

Die Anwendung ist als PWA ausgebaut:
- `manifest.json` definiert App-Name, Icons und Startparameter für die Installation auf dem Homescreen
- `service-worker.js` implementiert Cache-First-Strategie für Offline-Betrieb; die Core-Assets (`index.html`, `styles.css`, `scripts.js`, `manifest.json`) werden beim ersten Aufruf im Cache des Browsers (`mdwmt-v1`) gespeichert
- Der Service Worker registriert sich per `navigator.serviceWorker.register()` im `DOMContentLoaded`-Block in `singleswap.html`

### 2.3 IndexedDB für lokale Persistenz

- Datenbankname: `MDWMT_Database`, aktuelle Schemaversion: **4**
- Object Store: `datasets` mit Auto-Increment-Schlüssel `id` und Unique-Index `ticketKey` (normalisierter Lowercase-Ticketstring)
- Kein remote Backend – alle Daten verbleiben im Browser des Nutzers
- Schema-Migrationen in `onupgradeneeded`: dedupliciert beim Upgrade bestehende Einträge per Ticket und legt bei Bedarf den `ticketKey`-Index nach

### 2.4 html2pdf.js für PDF-Erzeugung

- Externes CDN-Script (`html2pdf.bundle.min.js` v0.9.3) wandelt DOM-Elemente in PDF um
- Alle Ausgabeelemente (Tauschprotokoll, Lieferschein) werden zunächst als verstecktes HTML-Fragment erzeugt und dann durch html2pdf gerendert
- Gleiche Render-Funktion (`createDatasetCardForPrint`) wird für Druckvorschau und PDF-Export genutzt, um konsistente Ausgabe zu gewährleisten

---

## 3. Architektur und Dateistruktur

```
MDMTool/
├── index.html          # Startseite / Navigation (vertikale Buttons)
├── singleswap.html     # Hauptanwendung mit Erfassungsformular und Modal
├── overview.html       # Platzhalterseite für Übersichtsfeatures
├── assetmanagement.html# Lagerlisten-UI (Import/Export/Validierung)
├── assetmanagement.js  # Logik für Lagerliste, Defaults und IndexedDB
├── navigation.js       # Gemeinsame Toggle- und i18n-Logik der Navigationsseiten
├── scripts.js          # Gesamte Anwendungslogik (~2500+ Zeilen)
├── styles.css          # Gemeinsame Styles inkl. Navigation, Dark-Mode, Print, Responsive
├── service-worker.js   # PWA Caching
├── manifest.json       # PWA-Manifest
└── README.md
```

**`index.html`** definiert:
- Zentralen Einstieg mit drei vertikal angeordneten Buttons
- Sprachumschalter (DE/EN) und Dark-Mode-Toggle
- Verlinkung zu `singleswap.html`, `overview.html`, `assetmanagement.html`

**`singleswap.html`** definiert:
- Header mit Sprachumschalter (DE/EN) und Dark-Mode-Toggle
- Zwei-Spalten-Form: linke Spalte „Alt" (altes Gerät), rechte Spalte „Neu" (neues Gerät) oder Rückgabe-Hinweis
- Aktionsleiste mit allen Buttons
- Modal für gespeicherte Datensätze

**`navigation.js`** enthält:
- Eigenes Übersetzungsobjekt für die Navigationsseiten (`de`/`en`)
- Sprachumschaltung über `data-i18n` und `data-i18n-title`
- Dark-Mode-Persistenz via `localStorage` und `data-theme`

**`assetmanagement.js`** enthält:
- Eigenständige Lagerlisten-Logik (kein Bezug zu SingleSwap-Datensätzen)
- Import aus CSV/XLSX/XLS/ODS für Asset-Basisdaten
- Validierungsbericht pro Importzeile (importiert / duplikat / ungültig)
- Standardwerte-Verwaltung (Zugewiesen, Verwaltet von, Kostenstelle) im Einstellungsmenü
- Separate IndexedDB-Stores für Lagerliste und Standardwerte

**`scripts.js`** ist in folgende logische Sektionen gegliedert:
1. Übersetzungsobjekt (`translations`: `de`/`en`)
2. Hilfsfunktionen (`cleanLabel`, Checkbox-Helpers)
3. Sprachumschaltung (`setLanguage`)
4. Dark-Mode-Toggle
5. IndexedDB-Setup und Migration
6. Formular-Logik (Speichern, Laden, Leeren)
7. Modal-Logik (Datensatz-Liste, Suche, Löschen, Laden)
8. Dataset-Card-Rendering (`createDatasetCard`, `createDatasetCardForPrint`)
9. Print-Funktion (`printDatasetElement`)
10. PDF-Export (`exportDatasetToPDF`)
11. Tauschprotokoll Print + PDF (`printData`, `exportPdf`)
12. Lieferschein Print + PDF (`printDeliveryNote`, `exportDeliveryNotePdf`)
13. CSV-Export (einzeln + gesamt)
14. CSV-Import
15. Versionsfilterfunktion (Dropdowns nach Gerätetyp filtern)
16. `DOMContentLoaded`-Bootstrap

---

## 4. Feature-Entwicklung (chronologisch)

### 4.1 Grundfunktion: Formular + IndexedDB

**Ausgangspunkt:** Zweispaltiges Formular für Alt- und Neu-Gerät mit Pflichtfeldern (Ticket, Gerätetyp, Version, Asset-ID, Nutzer-ID) und einem „Datensatz speichern"-Button.

- Ticketnummer dient als logischer Schlüssel; beim Speichern wird auf Duplikate geprüft
- Kostenstelle wurde nachträglich vom Alt- in das Neu-Gerät-Formular verschoben, da sie das neue Gerät betrifft
- Speichern schreibt ein Dataset-Objekt mit `{ oldDevice, newDevice, date }` in IndexedDB
- Duplizierungsprüfung per `checkStore.getAll()` vor dem Schreiben

### 4.2 Gespeicherte Datensätze anzeigen (Modal)

- Klick auf „Gespeicherte Datensätze anzeigen" öffnet ein Modal
- Datensätze werden als „Dataset Cards" gerendert: je Eintrag werden Alt- und Neu-Gerät nebeneinander in einer Karte dargestellt
- Jede Karte hat Buttons: Laden (ins Formular), Löschen (mit optionalem CSV-Export vorher), Einzel-CSV-Export
- Text-Suche filtert nach Ticketnummer in Echtzeit

### 4.3 Versionsdropdown-Filterung

- Die Versions-`<select>`-Elemente zeigen dynamisch nur Optionen passend zum gewählten Gerätetyp an
- Implementiert über `data-type`-Attribute an den `<option>`-Elementen und `change`-Event-Listener auf den Typ-Dropdowns

### 4.4 Drucken und PDF-Export (Tauschprotokoll)

- `printData`-Button ruft `createDatasetCardForPrint` auf, das ein HTML-Fragment mit formatiertem Tauschprotokoll erzeugt
- Das Fragment enthält: Titel, Datum, Geräte-Info beider Seiten, Unterschriftenfelder (Techniker / Kunde), Hinweis-Checkboxen (Gerät zurückgesetzt, SIM entfernt), Rückgabe-Notiz
- `printDatasetElement` öffnet ein neues Fenster (`window.open`) mit dem Fragment und ruft `window.print()` auf
- `exportPdf` nutzt dasselbe Fragment, übergibt es aber html2pdf statt dem Browser-Druckdialog
- Print-spezifische CSS-Regeln isolieren das Ausgabeformat vom normalen UI-Style

### 4.5 Lieferschein

- Separater Ausgabekanal neben dem Tauschprotokoll
- `printDeliveryNote` / `exportDeliveryNotePdf` erzeugen einen formellen Lieferschein mit Lieferant, Empfänger, Ort, Datum und Unterschriftenfeldern
- Beim Drucken wird gefragt, ob der Lieferschein zweimal gedruckt werden soll (`print-delivery-note-two-copies-prompt`)

### 4.6 Mehrsprachigkeit (DE/EN)

- Gesamtes UI-Text-Management über das `translations`-Objekt
- Alle statischen Texte in `singleswap.html` nutzen `data-i18n`-Attribute
- `setLanguage(lang)` iteriert über alle `[data-i18n]`-Elemente, setzt `innerHTML` aus dem Übersetzungsobjekt
- Dynamisch erzeugte Labels (Buttons in Modals, Card-Inhalte) nutzen `translations[currentLanguage][key]` direkt im JS
- Sprachauswahl wird in `localStorage` persistiert

### 4.7 Dark Mode

- CSS Custom Properties (`--bg-color`, `--text-color`, `--border-color`, etc.) auf `:root` für Light Mode; überschrieben via `[data-theme="dark"]`-Selektor
- Toggle-Button wechselt `data-theme` auf `<html>`, persistiert in `localStorage`
- Initialer Wert wählt Systempräferenz aus (`prefers-color-scheme: dark`), wird aber durch gespeicherten Wert überschrieben

### 4.8 CSV-Export und -Import

- **Gesamt-Export:** Alle im IndexedDB gespeicherten Datensätze werden als eine CSV-Datei exportiert; Spalten für Alt- und Neu-Gerätedaten nebeneinander
- **Einzel-Export:** Jede Dataset Card hat einen eigenen Export-Button
- **Import:** CSV-Datei einlesen, zeilenweise parsen, fehlende Pflichtfelder überspringen, Datensätze in IndexedDB schreiben (Duplikatsprüfung per Ticket)
- CSV-Header-Texte sind im Übersetzungsobjekt hinterlegt (`csv-header-*`)
- BOM (`\uFEFF`) wird beim Export der CSV vorangestellt für korrekte Excel-Anzeige von Sonderzeichen

### 4.9 Schema-Migration (Version 4)

- IndexedDB-Version auf 4 erhöht, um `ticketKey`-Index (unique) nachzuführen
- `onupgradeneeded`: liest alle bestehenden Datensätze, normalisiert `ticketKey`, entfernt Duplikate (behält neuesten), legt Index an
- Blockierte DB-Öffnung führt zu Nutzer-Alert

### 4.10 „Kein Leihgerät verfügbar"-Checkbox (No-Spare-Device-Feature)

**Anforderung:** Bei fehlendem Leihgerät soll das Neu-Gerät-Formular entfallen und stattdessen ein Rückgabehinweis erscheinen – sowohl im Formular als auch in allen Ausgaben (Print, PDF, gespeicherte Ansicht, CSV).

**Implementierung:**

1. **Checkbox in `singleswap.html`:** Im Neu-Gerät-Container, direkt nach `<h2>Neu</h2>`, vor der `form-section`:
   ```html
   <div class="form-group no-spare-checkbox-group" id="noSpareDeviceGroup">
       <label class="checkbox-inline" for="ipad-no-spare-checkbox">
           <input type="checkbox" id="ipad-no-spare-checkbox" name="ipadNoSpare">
           <span data-i18n="ipad-no-spare-label">Kein Leihgerät verfügbar</span>
       </label>
   </div>
   ```

2. **`applyIpadNoReplacementFormState()`** in `scripts.js`:
   - Toggled `.ipad-no-replacement` auf `.form-container.new-device`
   - CSS-Regel `.new-device.ipad-no-replacement .form-section { display: none }` blendet die Felder aus
   - Zeigt/versteckt `#ipadReturnMessage` (`.hidden`-Toggle)
   - Leert alle Neu-Gerät-Felder und entfernt `required`-Attribute, damit das Formular trotzdem abgespeichert werden kann
   - Wird bei: Checkbox-Change, Formular-Laden, Formular-Leeren und Sprachumschaltung aufgerufen

3. **Persistenz:** `returnIpadWithoutReplacement: boolean` wird im Dataset-Objekt in IndexedDB gespeichert

4. **Ausgaben:**
   - `createDatasetCard` und `createDatasetCardForPrint` prüfen `isIpadNoReplacementDataset(dataset)` und ersetzen die Neu-Gerät-Karte durch einen Rückgabe-Hinweis-Block
   - `printData` und `exportPdf`: `note`-Variable erhält `getIpadReturnMessageText()` statt `austausch-note`
   - CSV-Export: zwei zusätzliche Spalten `'iPad No Spare Device'` (Yes/No) und `'iPad Return Message'`

5. **Ausrichtungskorrektur (`styles.css`):**
   - `.form-container.old-device .form-section { margin-top: 39px }` gleicht die Höhe der Checkbox-Gruppe im neuen Gerät aus, so dass Alt- und Neu-Felder vertikal bündig beginnen
   - `.ipad-return-message { flex: 1 }` dehnt die Rückgabe-Meldungsbox in der Dataset-Card-Ansicht auf die volle Höhe der Nachbarkarte aus

### 4.11 Startnavigation + gemeinsame Toggles auf allen Seiten

**Anforderung:** Eine zentrale Startseite mit vertikalen Buttons und einheitlichen Sprach-/Darkmode-Toggles auf allen neuen HTML-Seiten.

**Implementierung:**

1. **Neue Seitenstruktur:**
   - `index.html` als zentrale Navigation
   - `overview.html` und `assetmanagement.html` als neue Zielseiten

2. **Vertikale Navigation:**
   - Die drei Einstiegsbuttons auf `index.html` wurden in `styles.css` bewusst vertikal (`flex-direction: column`) ausgerichtet

3. **Kein Inline-CSS:**
   - Inline-Styles in den neuen Seiten wurden entfernt
   - Styling vollständig in `styles.css` zentralisiert

4. **Gemeinsame Toggle-/i18n-Logik (`navigation.js`):**
   - DE/EN-Umschaltung für Titel, Überschriften, Beschreibungen und Buttons auf den Navigationsseiten
   - Darkmode-Umschaltung via `data-theme` + Persistenz in `localStorage`
   - Identisches Bedienmuster (`DE`/`EN`, 🌙/☀️) auf `index.html`, `overview.html`, `assetmanagement.html`

### 4.12 Lagerlisten-Funktion (Assetmanagement)

**Anforderung:** Die Asset-Seite soll als unabhängige Lagerliste arbeiten und nicht auf SingleSwap-Daten basieren.

**Implementierung:**

1. **Unabhängige Datenspeicherung:**
   - Eigene IndexedDB: `MDMTool_Inventory`
   - Store `assets_inventory` für Lagerlisteneinträge (Primary Key: normalisierte Asset-ID)
   - Store `inventory_defaults` für globale Standardwerte

2. **Importmodell:**
   - Datei-Import unterstützt CSV, XLSX, XLS, ODS
   - Aus Datei werden nur Asset-Basisfelder gelesen:
     - Gerätetyp
     - Version
     - Asset-ID
     - Seriennummer

3. **Standardwerte statt Importfelder:**
   - Felder `Zugewiesen`, `Verwaltet von`, `Kostenstelle` werden aus gespeicherten Standardwerten gesetzt
   - Standardwerte werden im Einstellungsmenü gepflegt und versioniert gespeichert

4. **Validierung und Duplikate:**
   - Pflichtfeldprüfung (Asset-ID)
   - Geräte-Typ-Prüfung (`iPhone`, `iPad`, `MacBook`)
   - Duplikatprüfung ausschließlich per Asset-ID
   - Importbericht je Zeile (Status + Details)

5. **Datenpflege:**
   - Permanenter Lösch-Button „Alle Datensätze löschen" im Einstellungsmenü
   - Löscht Lagerlisteneinträge, behält Standardwerte bei

---

## 5. CSS-Architektur

`styles.css` ist in folgende Bereiche gegliedert:

| Bereich | Beschreibung |
|---|---|
| CSS Custom Properties | Light-/Dark-Mode-Variablen auf `:root` und `[data-theme="dark"]` |
| Base & Layout | `body`, `.container`, Header, `.forms-row` (Flexbox-Zweispalte) |
| Form-Komponenten | `.form-container`, `.form-section`, `.form-group`, Labels, Inputs, Selects, Textareas |
| Checkbox-Gruppe | `.checkbox-inline`, `.no-spare-checkbox-group` |
| Buttons | `.button`, Button-IDs mit Farben, Hover/Active-States |
| Modal | `.modal`, `.modal-content`, Dataset-Cards im Modal |
| Dataset-Card | `.dataset-card`, `.card-column`, `.ipad-return-message` |
| Print-Styles | `@media print` – verbirgt UI-Elemente, zeigt nur Ausgabe-Fragment |
| PDF/Print-Fragment | Styles für das generierte HTML-Fragment (Tauschprotokoll-Format) |
| Responsive | `@media (max-width: ...)` für mobile Anpassungen |
| No-Spare-Feature | `.new-device.ipad-no-replacement .form-section`, `.ipad-return-message` |

---

## 6. Bekannte Einschränkungen und Design-Entscheidungen

- **Keine Authentifizierung:** Die App ist für den Einsatz auf vertrauenswürdigen Endgeräten gedacht; Daten liegen nur im Browser des Nutzers
- **Kein Sync:** Daten sind an den Browser bzw. das Gerät gebunden; CSV-Export/-Import dient als manuelle Synchronisation zwischen Geräten
- **html2pdf via CDN:** Externe Abhängigkeit; bei reinem Offline-Betrieb muss die Bibliothek gecacht sein (Service Worker übernimmt dies)
- **Ticketnummer als Unique Key:** Verhindert Duplikate, aber die Normalisierung (lowercase, trim) bedeutet, dass Ticket-Groß-/Kleinschreibung ignoriert wird
- **Kostenstelle im Neu-Gerät:** Abweichung von der optisch naheliegenden Platzierung im Alt-Gerät, da die Kostenstelle die Zuordnung des neuen Geräts betrifft

---

## 7. Deployment

Die Anwendung benötigt keinen Build-Schritt. Deployment:

1. Alle Dateien auf einen Webserver kopieren (HTTPS empfohlen für Service-Worker-Registrierung)
2. Oder lokal über einen einfachen HTTP-Server öffnen (z.B. `python3 -m http.server`)
3. Für PWA-Installation: Browser-eigenes „Zum Startbildschirm hinzufügen" nutzen

---

*Ende der Entwicklungsdokumentation*
