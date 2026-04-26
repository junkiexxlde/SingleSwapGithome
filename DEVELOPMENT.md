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
- `service-worker.js` implementiert eine **Network-First-Strategie**: bei aktiver Verbindung werden stets frische Assets vom Server geholt und im Cache aktualisiert; erst bei Offline-Betrieb greift der Cache als Fallback
- Der Cache-Name ist an die App-Version gekoppelt (`mdwmt-v{VERSION}`); ein Versionsbump in `app-version.js` **und** `service-worker.js` löscht automatisch alle älteren Cache-Generationen beim nächsten Aktivierungszyklus
- `skipWaiting()` im Install-Event und `clients.claim()` im Activate-Event stellen sicher, dass ein neu installierter Service Worker sofort alle offenen Tabs übernimmt – ohne manuelle Seitenaktualisierung des Nutzers
- Der Service Worker sendet nach erfolgreicher Aktivierung eine `SW_UPDATED`-Nachricht an alle offenen Fenster; `navigation.js` wertet diese aus und zeigt einen nicht-blockierenden Reload-Banner
- Die Service-Worker-Registrierung ist aus `singleswap.html` in **`navigation.js`** verschoben worden, damit alle Seiten die Update-Logik erhalten

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
15. Typfilterfunktion (Dropdowns nach Gerätetyp filtern)
16. `DOMContentLoaded`-Bootstrap

---

## 4. Feature-Entwicklung (chronologisch)

### 4.1 Grundfunktion: Formular + IndexedDB

**Ausgangspunkt:** Zweispaltiges Formular für Alt- und Neu-Gerät mit Pflichtfeldern (Ticket, Gerätetyp, Typ, Asset-ID, Nutzer-ID) und einem „Datensatz speichern"-Button.

- Ticketnummer dient als logischer Schlüssel; beim Speichern wird auf Duplikate geprüft
- Kostenstelle wurde nachträglich vom Alt- in das Neu-Gerät-Formular verschoben, da sie das neue Gerät betrifft
- Speichern schreibt ein Dataset-Objekt mit `{ oldDevice, newDevice, date }` in IndexedDB
- Duplizierungsprüfung per `checkStore.getAll()` vor dem Schreiben

### 4.2 Gespeicherte Datensätze anzeigen (Modal)

- Klick auf „Gespeicherte Datensätze anzeigen" öffnet ein Modal
- Datensätze werden als „Dataset Cards" gerendert: je Eintrag werden Alt- und Neu-Gerät nebeneinander in einer Karte dargestellt
- Jede Karte hat Buttons: Laden (ins Formular), Löschen (mit optionalem CSV-Export vorher), Einzel-CSV-Export
- Text-Suche filtert nach Ticketnummer in Echtzeit

### 4.3 Typdropdown-Filterung

- Die Typ-`<select>`-Elemente zeigen dynamisch nur Optionen passend zum gewählten Gerätetyp an
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
       - Typ
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

### 4.13 Version 006 – Asset Administration + Option-Menü-Überarbeitung

**Grund für Versionssprung auf 006:** funktionale Erweiterung im Assetmanagement plus UI-Überarbeitung über mehrere Seiten.

1. **Asset Administration ergänzt:**
   - Neuer Bereich im Einstellungs-/Option-Menü von `assetmanagement.html`
   - Gerätetypen können als akzeptierte Typen hinzugefügt, bearbeitet und entfernt werden

2. **Gemeinsame Typquelle eingeführt:**
   - Akzeptierte Typen werden persistent gespeichert (LocalStorage)
   - SingleSwap-Dropdowns nutzen diese Typen zusätzlich zu den Standardtypen

3. **Importvalidierung erweitert:**
   - Asset-Import in `assetmanagement.js` validiert gegen die gepflegten akzeptierten Gerätetypen
   - Damit sind neue, freigegebene Typen im Import zulässig

4. **Option-Menüs vereinheitlicht:**
   - Einheitliche Farb- und Flächenlogik für das Options-Menü auf allen Seiten
   - Option-Sektionen sind farblich bewusst vom Hauptinhalt getrennt

5. **Interaktion im Options-Menü verbessert:**
   - Vertikale Menüstruktur
   - Auf-/Zuklappen pro Menüpunkt (Fold/Unfold)
   - Inhalte sind direkt am jeweiligen Menüpunkt verankert
   - Menübreite reduziert für kompaktere Darstellung

### 4.14 Version 007 – Typ (Model) Administration erweitert

**Grund für Versionssprung auf 007:** Erweiterung der Asset-Administration um eine zweite Stammdatenpflege für Asset-Typen (Modelle) mit seitenübergreifender Wirkung.

1. **Typ-Administration im Options-Menü ergänzt:**
   - Neuer Bereich „Typ Administration" in `assetmanagement.html`
   - Modelle können analog zu Gerätetypen erstellt, bearbeitet und entfernt werden
   - Jeder Modell-Eintrag ist einem Gerätetyp zugeordnet

2. **Persistente Modell-Stammdaten eingeführt:**
   - Neue lokale Speicherung über `mdmtool_managed_models_v1`
   - Standardmodelle und benutzerdefinierte Modelle werden zusammengeführt

3. **Importvalidierung angepasst:**
   - Importierte Zeilen werden gegen die gepflegten Modell-/Gerätetyp-Kombinationen validiert
   - Nicht akzeptierte Modelle oder unpassende Kombinationen werden als ungültig markiert

4. **SingleSwap-Modellauswahl erweitert:**
   - `scripts.js` ergänzt modellseitig verwaltete Optionen in den Typ-Dropdowns
   - Somit stehen neu gepflegte Modelle direkt in der Fallanlage zur Auswahl

### 4.15 Version 008 – Foldbare Unterpunkte in Asset Administration

**Grund für Versionssprung auf 008:** UX-Verbesserung im Options-Menü für klarere Struktur der Administrationsfunktionen.

1. **Unterpunkte als foldbare Sub-List eingeführt:**
   - „Neuen Gerätetyp anlegen oder bearbeiten" wurde als eigener Unterpunkt umgesetzt
   - „Neuen Typ anlegen oder bearbeiten" wurde als eigener Unterpunkt umgesetzt

2. **Jeder Unterpunkt mit eigenem Toggle:**
   - Klick auf den jeweiligen Unterpunkt klappt nur dessen Inhalt auf/zu
   - Die zugehörigen Eingaben/Buttons/Tabellen bleiben direkt am Unterpunkt verankert

3. **Bestehende Funktionen unverändert übernommen:**
   - CRUD-Logik für Gerätetyp und Typ (Model) bleibt technisch unverändert
   - Es wurde nur die Menüstruktur und Interaktionsführung angepasst

### 4.16 Version 009 – Asset-Detailkarte in der Lagerlistenverwaltung

**Grund für Versionssprung auf 009:** Die Lagerliste kann Asset-Datensätze jetzt nicht mehr nur tabellarisch anzeigen, sondern auch vollständig als Detailansicht lesen und um zusätzliche Felder erweitern.

1. **Asset-ID als Detail-Link umgesetzt:**
   - In der Lagerlisten-Tabelle ist die Asset-ID jetzt anklickbar
   - Ein Klick öffnet eine Übersichtskarte mit allen zu diesem Asset gespeicherten Datenbankfeldern

2. **Zusätzliche Asset-Felder dauerhaft erhalten:**
   - `assetmanagement.js` reduziert gespeicherte Datensätze nicht mehr nur auf die Standardspalten
   - Dadurch bleiben auch zukünftige Zusatzfelder im IndexedDB-Datensatz erhalten und werden in der Detailkarte angezeigt

3. **Editierbare Zusatzfelder mit Schloss-Mechanik ergänzt:**
   - Neu hinzugefügt wurden die Felder „Geplante Aussonderung" und „Garantieablauf"
   - Beide Felder lassen sich in der Detailkarte per geschlossenem/offenem Schloss entsperren, bearbeiten und wieder speichern

### 4.17 Version 010 – Seriennummer als editierbare Asset-Metadaten

**Grund für Versionssprung auf 010:** Die Lagerlistenverwaltung muss auch nach Reparaturen Änderungen an der Seriennummer direkt am Asset zulassen.

1. **Seriennummer in der Detailkarte entsperrbar gemacht:**
   - Das Feld „Seriennummer" nutzt jetzt dieselbe Schloss-Mechanik wie die übrigen editierbaren Asset-Metadaten
   - Dadurch kann die Seriennummer gezielt für ein einzelnes Asset angepasst und wieder gespeichert werden

2. **Tabellenansicht aktualisiert sich über denselben Datensatz:**
   - Die geänderte Seriennummer wird direkt im gespeicherten Asset-Datensatz in IndexedDB aktualisiert
   - Da die Haupttabelle auf denselben Datensätzen basiert, ist die neue Seriennummer anschließend auch dort sichtbar

### 4.18 Version 011 – Kanonische iPhone/iPad-Schreibweise beim Lagerlisten-Import

**Grund für Versionssprung auf 011:** Gerätetypen aus der Lagerliste sollen verschiedene Schreibweisen akzeptieren, aber in App und Datenbestand immer in einer einheitlichen Form gespeichert werden.

1. **Import-Normalisierung für Gerätetypen erweitert:**
   - Schreibweisen wie `iphone`, `I Phone`, `i-phone`, `ipad` oder `i pad` werden beim Import akzeptiert
   - Bekannte Gerätetypen werden vor dem Speichern konsequent auf `iPhone`, `iPad` und `MacBook` normalisiert

2. **Bestehende Lagerdaten beim Laden kanonisiert:**
   - Bereits gespeicherte Asset-Datensätze werden beim Laden geprüft
   - Falls ältere Schreibweisen vorhanden sind, werden sie direkt in IndexedDB auf die kanonische Form zurückgeschrieben

3. **App-seitige Typoptionen mit derselben Kanonisierung versehen:**
   - `scripts.js` nutzt dieselbe Typnormalisierung für verwaltete Gerätetypen und Modell-Zuordnungen
   - Dadurch erscheinen bekannte Gerätetypen appweit nur noch in der gewünschten Schreibweise

### 4.19 Version 012 – Löschsperre für verwendete Typen in der Typ-Administration

**Grund für Versionssprung auf 012:** Ein Typ darf in der Typ-Administration nicht entfernt werden, solange noch Assets dieses Typs in der Lagerliste vorhanden sind.

1. **Lagerlisten-Prüfung vor dem Entfernen ergänzt:**
   - `assetmanagement.js` prüft beim Entfernen eines Typs jetzt die aktuelle Lagerliste auf vorhandene Referenzen
   - Nur wenn kein Asset mehr mit dieser Gerätetyp-/Typ-Kombination existiert, wird der Typ tatsächlich gelöscht

2. **Blockierende Rückmeldung für Nutzer ergänzt:**
   - Bei einer verhinderten Löschung erscheint eine Popup-Meldung mit dem Grund
   - Dieselbe Begründung wird zusätzlich im `asset-status` angezeigt, analog zu den übrigen Statusmeldungen

### 4.20 Version 013 – Breadcrumb-Fix für SingleSwap und zentrierte Topbar

**Grund für Versionssprung auf 013:** Die gemeinsame Breadcrumb-Navigation funktionierte in `singleswap.html` nicht, und der Topbar-Titel sollte trotz Breadcrumb links visuell mittig bleiben.

1. **Breadcrumb in der SingleSwap-Shell ergänzt:**
   - `scripts.js` rendert die Breadcrumb-Navigation jetzt direkt in der eigenen Topbar-Logik von `singleswap.html`
   - Damit nutzt SingleSwap denselben Breadcrumb-Pfad wie die übrigen Seiten, ohne zusätzlich `navigation.js` laden zu müssen

2. **Topbar-Spalten symmetrisch ausgerichtet:**
   - `styles.css` verwendet jetzt links und rechts gleichgewichtete Grid-Spalten um den mittleren Titel
   - Der Titel „Mobile Device Warranty Management Tool“ bleibt dadurch auch mit Breadcrumb links mittig ausgerichtet

3. **Mobile Zentrierung nachgezogen:**
   - Auf kleineren Breakpoints bleibt der Topbar-Titel ebenfalls zentriert
   - Die Breadcrumb kann links eingeblendet werden, ohne den Titel auf links zu ziehen

### 4.21 Version 014 – Kompaktere SingleSwap-Topbar auf kleinen Breiten

**Grund für Versionssprung auf 014:** In `singleswap.html` sollte der mittige Titel auch bei enger Breite stabil bleiben, obwohl rechts mehrere Topbar-Bedienelemente liegen.

1. **SingleSwap-rechtsseitig verdichtet:**
   - Für SingleSwap wurden die Abstände der rechten Topbar-Gruppe auf kleineren Breakpoints reduziert
   - Die Sprachumschaltung nutzt dort kompaktere Button-Abstände und kleinere Innenabstände

2. **Icon-Buttons auf Mobile verkleinert:**
   - Theme- und Einstellungsbutton werden auf kleineren Breiten in SingleSwap gezielt etwas kleiner gerendert
   - Dadurch bleibt mehr Platz für den zentrierten Titel in der mittleren Topbar-Spalte

3. **Änderung bewusst seitenlokal gehalten:**
   - Die Verdichtung gilt nur für `singleswap.html`
   - Andere Seiten behalten ihre bisherige Topbar-Dichte und Bediengröße

### 4.22 Version 015 – SingleSwap ohne Breadcrumb auf sehr kleinen Breiten

**Grund für Versionssprung auf 015:** Auf sehr kleinen Displays konkurrierte der Breadcrumb in `singleswap.html` weiterhin mit dem mittig zentrierten Titel.

1. **Breadcrumb unter 480 Pixel ausgeblendet:**
   - In `singleswap.html` wird der Breadcrumb auf sehr kleinen Breiten nicht mehr angezeigt
   - Dadurch steht die gesamte linke Topbar-Fläche dem zentrierten Titel zur Verfügung

2. **Änderung nur für SingleSwap:**
   - Die Ausblendung gilt ausschließlich für `singleswap.html`
   - Andere Seiten behalten ihren Breadcrumb auch auf kleinen Breiten unverändert

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

## 8. Änderungsrichtlinie (Major Changes)

Für jede **größere Änderung** (neue Kernfunktion, relevante UI/UX-Änderung, Datenmodell-/Validierungsänderung, seitenübergreifende Logikänderung) gilt künftig:

1. `app-version.js` wird erhöht (z. B. `006` -> `007`).
2. In dieser Datei (`DEVELOPMENT.md`) wird ein kurzer, klarer Änderungsblock mit den Gründen ergänzt.
3. Der Eintrag beschreibt mindestens:
   - was funktional neu ist,
   - welche Seiten/Module betroffen sind,
   - warum der Versionssprung notwendig war.

---

## 9. Release-Checkliste (Deployment)

Bei jedem Deployment folgende Schritte ausführen, um sicherzustellen, dass Nutzer keine veralteten Assets aus dem Service-Worker-Cache erhalten:

1. **Versionsnummer erhöhen** in beiden Dateien (müssen übereinstimmen):
   - `app-version.js` → `APP_VERSION = 'NNN'`
   - `service-worker.js` → `SW_VERSION = 'NNN'`
2. **Alle geänderten Dateien deployen** (der neue `CACHE_NAME` sorgt dafür, dass der alte Cache bei der Aktivierung des neuen SW automatisch gelöscht wird).
3. **Verifizierung auf der Live-Seite:**
   - Seite im Browser öffnen → Reload-Banner prüfen (erscheint kurz nach SW-Aktivierung).
   - In DevTools → Application → Service Workers: neuen SW mit aktuellem `CACHE_NAME` (`mdwmt-vNNN`) sehen.
   - In DevTools → Application → Cache Storage: nur eine Cache-Generation vorhanden.
   - Versionsbadge in der Ecke der Seite zeigt neue Nummer.

### Troubleshooting: Hosted-Verhalten weicht von lokal ab

Falls ein Feature lokal funktioniert, aber auf dem Webserver nicht:

1. DevTools → Application → Service Workers → **Unregister**
2. DevTools → Application → Storage → **Clear site data**
3. Seite hart neu laden (`Ctrl+Shift+R`)

Wenn das Problem danach behoben ist, war die Ursache ein veralteter Service-Worker-Cache. Die neue Network-First-Strategie und der Versionsbump verhindern diese Situation bei zukünftigen Deploys.

---

*Ende der Entwicklungsdokumentation*
