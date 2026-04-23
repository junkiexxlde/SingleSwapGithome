# MDMTool – Benutzerhandbuch

**Mobile Device Warranty Management Tool (MDWMT)**  
Kurzanleitung für den täglichen Gebrauch

---

## 1. Anwendung starten

Öffnen Sie `index.html` im Browser. Sie landen auf der Startseite mit drei **vertikal angeordneten** Buttons:

- **Neuen Fall anlegen** → öffnet `singleswap.html`
- **Übersicht** → öffnet `overview.html`
- **Assets verwalten** → öffnet `assetmanagement.html`

Sie können die Anwendung auch als PWA auf dem Startbildschirm Ihres Geräts installieren (Browser-Menü → „Zum Startbildschirm hinzufügen").

Die Anwendung funktioniert vollständig offline, sobald sie einmal im Browser geladen wurde.

---

## 2. Sprache und Darstellung

- **Sprache:** Oben rechts auf `DE` oder `EN` klicken, um zwischen Deutsch und Englisch zu wechseln
- **Dark Mode:** Klick auf 🌙 / ☀️ (oben rechts neben den Sprachbuttons) schaltet zwischen hellem und dunklem Design um

Diese beiden Toggles sind auf allen drei Navigationsseiten verfügbar (`index.html`, `overview.html`, `assetmanagement.html`) sowie im Erfassungsformular (`singleswap.html`).

Beide Einstellungen werden automatisch gespeichert und beim nächsten Öffnen wiederhergestellt.

### 2.1 Startseite (Navigation)

Die Startseite dient als zentraler Einstiegspunkt:

1. **Neuen Fall anlegen:** Öffnet das Erfassungsformular für Alt-/Neu-Gerät
2. **Übersicht:** Platzhalterseite für zukünftige Übersichtsfunktionen
3. **Assets verwalten:** Platzhalterseite für zukünftige Asset-Verwaltungsfunktionen

Über den Link **„Zurück zur Startseite"** gelangen Sie von den Unterseiten jederzeit zurück.

### 2.2 Assets verwalten (Lagerliste)

Die Seite `assetmanagement.html` ist eine **eigene Lagerlisten-Funktion** und unabhängig von SingleSwap-Fällen.

- Importierte Assets werden in einer separaten Lagerliste gespeichert
- Duplikatprüfung erfolgt ausschließlich über **Asset-ID**
- Ein Asset kann nur eine Asset-ID besitzen

#### Import-Logik

Unterstützte Dateiformate:

- CSV
- Excel (`.xlsx`, `.xls`)
- LibreOffice (`.ods`)

Aus der Datei werden nur Asset-Daten gelesen:

- Gerätetyp
- Version
- Asset-ID
- Seriennummer

Die Felder

- Zugewiesen
- Verwaltet von
- Kostenstelle

werden **nicht** aus der Datei übernommen, sondern aus den im Einstellungsmenü gespeicherten Standardwerten.

#### Standardwerte im Einstellungsmenü

Über das Zahnrad oben rechts öffnen Sie das Einstellungsmenü auf der Asset-Seite.

Dort können Standardwerte für folgende Felder gepflegt und gespeichert werden:

- Zugewiesen
- Verwaltet von
- Kostenstelle

Zusätzlich wird eine kleine Tabelle mit den aktuell gespeicherten Standardwerten angezeigt.

#### Validierung und Bericht

Nach dem Import erscheint ein Validierungsbericht mit Status pro Zeile:

- Importiert
- Duplikat
- Ungültig

Mit **„Seite aktualisieren"** im Bericht wird die Seite neu geladen; der Bericht ist danach nicht mehr sichtbar.

#### Datensätze löschen

Im Einstellungsmenü gibt es den Button **„Alle Datensätze löschen"**.

- Löscht alle Lagerlisten-Einträge
- Beibehaltung der gespeicherten Standardwerte
- Sicherheitsabfrage vor dem Löschen

---

## 3. Datensatz erfassen

### 3.1 Altes Gerät (linke Spalte)

Füllen Sie alle Pflichtfelder aus (mit `*` markiert):

| Feld | Beschreibung |
|---|---|
| Ticketnummer `*` | Eindeutige Ticket-ID aus dem Helpdesk-System |
| Gerätetyp `*` | iPhone / iPad / MacBook |
| Version `*` | Modell des Geräts (Auswahl passt sich dem Gerätetyp an) |
| Asset-ID `*` | Interne Inventarnummer |
| Seriennummer | Optional; Seriennummer des Geräts |
| Nutzer | Name des Anwenders |
| Nutzer-ID `*` | Login-Name / Kennung des Anwenders |
| Nutzerdaten | Freitext für weitere Infos zum Nutzer |
| Grund für Austausch/Defekt `*` | Beschreibung des Problems |

### 3.2 Neues Gerät (rechte Spalte)

Standardfall: Ein Ersatzgerät wird ausgegeben. Füllen Sie die Pflichtfelder aus:

| Feld | Beschreibung |
|---|---|
| Gerätetyp `*` | Typ des Austauschgeräts |
| Version `*` | Modell des Austauschgeräts |
| Asset-ID `*` | Inventarnummer des Austauschgeräts |
| Seriennummer | Optional |
| Nutzer | Name des Anwenders (kann aus Alt übernommen werden) |
| Nutzer-ID `*` | Nutzerkennung |
| Nutzerdaten | Freitext |
| Kostenstelle `*` | Kostenstelle, der das neue Gerät zugeordnet wird |

> **Ticketnummer:** Das neue Gerät übernimmt automatisch die Ticketnummer des alten Geräts; das Feld ist im Neu-Formular ausgeblendet.

### 3.3 Kein Leihgerät verfügbar

Wenn kein Ersatzgerät bereitgestellt werden kann:

1. Haken Sie **„Kein Leihgerät verfügbar"** (Checkbox oben in der rechten Spalte) an
2. Die Neu-Gerät-Felder werden ausgeblendet
3. An ihrer Stelle erscheint ein Hinweistext: *„Das Gerät wird nach der Reparatur an den Nutzer zurückgegeben, falls die Aufsicht kein Leihgerät bereitstellen kann."*

In diesem Modus ist keine Eingabe für das neue Gerät erforderlich. Der Hinweis erscheint in allen Ausgaben (Tauschprotokoll, Lieferschein, gespeicherte Ansicht).

---

## 4. Datensatz speichern

Klicken Sie auf **„Datensatz speichern"**.

- Alle Pflichtfelder müssen ausgefüllt sein (bei aktiviertem „Kein Leihgerät"-Haken entfallen die Neu-Gerät-Pflichtfelder)
- Jede Ticketnummer kann nur einmal gespeichert werden; bei Duplikat erscheint eine Fehlermeldung

---

## 5. Letzten Datensatz laden

**„Letzten Datensatz laden"** füllt das Formular mit dem zuletzt gespeicherten Datensatz – nützlich zum schnellen Weiterarbeiten nach einem Seitenneuladen.

---

## 6. Formular leeren

**„Formular leeren"** setzt alle Felder und die Checkbox auf den Ausgangszustand zurück.

---

## 7. Gespeicherte Datensätze anzeigen

Klicken Sie auf **„Gespeicherte Datensätze anzeigen"**, um das Datensatz-Modal zu öffnen.

### 7.1 Suchen

Tippen Sie in das Suchfeld, um nach Ticketnummer zu filtern.

### 7.2 Datensatz laden

Klicken Sie auf **„Laden"** innerhalb einer Karte, um den Datensatz ins Formular zu übernehmen. Das Modal schließt sich automatisch.

### 7.3 Datensatz löschen

Klicken Sie auf **„Löschen"**. Sie werden gefragt, ob Sie den Datensatz vorher als CSV exportieren möchten. Anschließend wird er unwiderruflich aus dem Browser-Speicher entfernt.

### 7.4 Einzel-CSV-Export

Jede Karte bietet einen **„CSV exportieren"**-Button, der nur diesen Datensatz als CSV-Datei herunterlädt.

---

## 8. Tauschprotokoll drucken / als PDF exportieren

- **„Drucken":** Öffnet den Browser-Druckdialog mit dem formatierten Tauschprotokoll
- **„Als PDF exportieren":** Speichert das Tauschprotokoll direkt als PDF-Datei

Das Protokoll enthält:
- Titel, Datum, Uhrzeit
- Altes und neues Gerät (oder den Rückgabe-Hinweis, wenn kein Leihgerät verfügbar)
- Unterschriftenfelder für Techniker und Nutzer
- Bestätigungscheckboxen (Gerät zurückgesetzt, SIM-Karte entfernt)

---

## 9. Lieferschein drucken / als PDF exportieren

- **„Lieferschein drucken":** Erzeugt einen formellen Lieferschein und fragt, ob dieser zweimal gedruckt werden soll (je eine Kopie für Lieferant und Empfänger)
- **„Lieferschein als PDF exportieren":** Speichert den Lieferschein als PDF

Der Lieferschein enthält Felder für Lieferant, Empfänger, Ort, Datum und Unterschriften.

---

## 10. CSV-Export (alle Datensätze)

Über den **„Exportieren"**-Button im Modal (oder in der Aktionsleiste) werden alle gespeicherten Datensätze als eine CSV-Datei heruntergeladen.

Die CSV enthält Spalten für alle Felder beider Geräte sowie:
- `iPad No Spare Device` – Yes / No
- `iPad Return Message` – Rückgabe-Hinweistext (wenn kein Leihgerät)

Die Datei wird mit UTF-8-BOM gespeichert, damit Sonderzeichen in Excel korrekt dargestellt werden.

---

## 11. CSV-Import

Klicken Sie auf **„Importieren"** und wählen Sie eine CSV-Datei im richtigen Format. Die Anwendung liest die Zeilen ein und speichert sie als Datensätze. Bereits vorhandene Ticketnummern werden übersprungen.

---

## 12. Datenspeicherung und Datenschutz

Alle Daten werden **ausschließlich lokal im Browser** gespeichert (IndexedDB). Es findet keine Übertragung an externe Server statt. Beim Löschen des Browser-Caches gehen die Daten verloren – nutzen Sie den CSV-Export als Backup.

---

## 13. Fehlermeldungen

| Meldung | Ursache | Lösung |
|---|---|---|
| „Bitte alle Pflichtfelder ausfüllen" | Pflichtfeld leer | Fehlende Felder ergänzen |
| „Ticketnummer existiert bereits" | Doppelter Datensatz | Alten Datensatz zuerst löschen, dann neu speichern |
| „Datenbankaktualisierung blockiert" | Andere Tabs mit der App offen | Andere Tabs schließen und Seite neu laden |
| „Fehler beim Speichern" | Unbekannter DB-Fehler | Browser-Konsole für Details prüfen |

---

*Ende des Benutzerhandbuchs*
