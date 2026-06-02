# Aufstellungs-App

> 🇬🇧 [English version (README.en.md)](README.en.md) · 🍴 [Fork-Anleitung (FORK_GUIDE.md)](FORK_GUIDE.md)

Eine animierte Web-App um Fussball-Aufstellungen zu erstellen und zu präsentieren. Unterstützt 7-gegen-7, 9-gegen-9 und 11-gegen-11. Jedes Team bekommt eine eigene, isolierte URL — keine Installation, kein Login.

Unterstützte Sprachen: Deutsch, English, Français, Italiano.

Live: https://deniscliofa.github.io/fc-graenichen-aufstellung-app/

## So funktioniert es

1. Öffne die App-URL und wähle deine Sprache
2. Gib ein **Team-Kürzel** ein (z.B. `fc-aarau-2025`) — das ist dein persönlicher Schlüssel
3. Beim ersten Besuch landest du im Editor in den Einstellungen (Teamname, Farben, Logo)
4. Beim nächsten Besuch (Kürzel bereits bekannt) landest du direkt auf der Aufstellung

> **Wichtig:** Merke dir dein Kürzel. Es gibt kein Passwort und keine Wiederherstellung. Wer die Editor-URL kennt, kann die Daten bearbeiten — teile nur die Aufstellungs-URL mit Fans.

### Deine URLs

| URL | Beschreibung |
|-----|-------------|
| `/` | Startseite — Kürzel eingeben |
| `/{kürzel}/presentation` | Öffentliche Präsentation — für alle Eltern und Spieler |
| `/{kürzel}/editor` | Trainer-Editor — nur für Trainer (URL nicht teilen!) |

**Beispiel:** `.../fc-aarau-2025/editor` und `.../fc-aarau-2025/presentation`

## Verwendung

### 1. Team einrichten (Editor → Einstellungen)
- Teamname, Kurzname, Primär- und Sekundärfarbe, Logo und Sprache festlegen
- **Spielformat** wählen: 7v7, 9v9 oder 11v11 (Standard: 11v11)
- Änderungen werden sofort in der Präsentation sichtbar
- Die Sprache lässt sich auch auf der Startseite wählen

### 2. Trainer verwalten (Editor → Trainer)
- Trainer mit Vor-/Nachname, Rolle (z.B. "Haupttrainer") und optionalem Foto erfassen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser

### 3. Spieler verwalten (Editor → Spieler)
- Spieler mit Trikotnummer, Vor-/Nachname und optionalem Foto hinzufügen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser

### 4. Aufstellung konfigurieren (Editor → Aufstellung)
- Formation wählen (passend zum gewählten Spielformat)
- Spielerpositionen werden als absolute Koordinaten auf dem Feld dargestellt
- Klick auf eine Position öffnet das Spieler-Auswahl-Modal
- Ersatzspieler (bis zu 6) und abwesende Spieler verwalten
- Trainer per Klick als "Dabei" / "Nicht dabei" markieren
- **Captain** wählen — wird in der Präsentation visuell hervorgehoben
- **Spieldaten**: Gegner und Datum eingeben — erscheinen auf dem Intro-Screen
- Button "Präsentation starten"

### 5. Präsentation (`/{kürzel}/presentation`)
- **Intro**: Team-Logo + Name + Gegner + Datum
- **Spieler-Spotlight**: Jeder Startspieler wird kurz gross gezeigt — **in Reihenfolge Torhüter → Abwehr → Mittelfeld → Sturm** — und fliegt dann auf seine Position im Feld
- **Ersatzspieler**: Alle Ersatzspieler mit Foto und Nummer
- **Abschluss**: "Hopp [Teamname]!" mit Logo
- Steuerelemente: Neustart · Vollbild · Musik · Teilen

## Formationen

Die Formationsbezeichnungen zählen den Torhüter **nicht** mit (Konvention wie im echten Fussball).

| Format | Formationen |
|--------|-------------|
| 7v7    | 3-3 · 2-3-1 |
| 9v9    | 3-3-2 · 3-2-3 · 2-3-2-1 |
| 11v11  | 4-4-2 · 4-3-3 · 3-5-2 · 4-2-3-1 |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build-Tool)
- **React Router v7** (client-side routing)
- **Firebase Firestore** (Echtzeit-Datenbank, isoliert pro Team-Kürzel)
- **react-i18next** (Mehrsprachigkeit: DE / EN / FR / IT)
- **CSS** (keine externen UI-Bibliotheken)
- **Google Fonts**: Bebas Neue + Barlow Condensed

## Cloud-Sync (Firebase Firestore)

Alle Daten werden pro Team-Kürzel isoliert in Firebase Firestore gespeichert.

- Trainer erfassen die Aufstellung auf dem Laptop → Daten automatisch in der Cloud
- Präsentation auf dem Beamer oder Handy öffnen → Daten werden live aus der Cloud geladen
- Mehrere Trainer können gleichzeitig Änderungen vornehmen
- Zwei Teams mit unterschiedlichen Kürzeln teilen **keine** Daten

## Setup (lokal entwickeln)

```bash
npm install
npm run dev
```

Öffne http://localhost:5173 im Browser.
Oder einfach `start.bat` doppelklicken.

## Build & Deploy

```bash
# Lokaler Build
npm run build
npm run preview

# GitHub Pages Deploy
npm run deploy
```

## Lizenz

Open source — nutzbar für beliebige Amateurteams.