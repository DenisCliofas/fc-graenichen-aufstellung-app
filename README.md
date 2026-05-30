# FC Gränichen – Aufstellungs-App

Eine animierte Web-App für den FC Gränichen, um Fussball-Aufstellungen für 7-gegen-7-Spiele zu erstellen und zu präsentieren.

🔗 **Live:** https://deniscliofas.github.io/fc-graenichen-aufstellung-app/

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build-Tool)
- **React Router v7** (client-side routing)
- **Firebase Firestore** (Echtzeit-Datenbank für Cloud-Sync)
- **CSS** (keine externen UI-Bibliotheken)
- **Google Fonts**: Bebas Neue + Barlow Condensed

## URLs

| URL | Beschreibung |
|-----|-------------|
| `/presentation` | Öffentliche Präsentation – für alle Eltern und Spieler |
| `/editor` | Trainer-Editor – nur für Trainer (URL nicht teilen) |

## Setup

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

## Verwendung

### 1. Trainer verwalten (Editor → Tab „Trainer")
- Trainer mit Vor-/Nachname, Rolle (z.B. „Haupttrainer") und optionalem Foto erfassen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser
- Trainer bearbeiten oder löschen

### 2. Spieler verwalten (Editor → Tab „Spieler")
- Spieler mit Trikotnummer, Vor-/Nachname und optionalem Foto hinzufügen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser
- Spieler bearbeiten oder löschen

### 3. Aufstellung konfigurieren (Editor → Tab „Aufstellung")
- Klick auf eine Position öffnet das Spieler-Auswahl-Modal
- **Direktes Umbesetzen**: Klick auf einen bereits besetzten Slot öffnet ebenfalls das Modal (kein Leeren nötig)
- Ersatzspieler (bis zu 6) und abwesende Spieler verwalten
- Trainer per Klick als „Dabei" / „Nicht dabei" markieren
- **Captain** wählen – wird in der Präsentation visuell hervorgehoben
- **Spieldaten**: Gegner und Datum eingeben – erscheinen auf dem Intro-Screen
- Button „Präsentation starten"

### 4. Präsentation (`/presentation`)
- **Intro**: FC Gränichen Logo + Name + Gegner + Datum
- **Spieler-Spotlight**: Jeder Startspieler wird kurz gross gezeigt (mit Captain-Badge falls zutreffend), fliegt dann auf seine Position im Feld
- **Ersatzspieler**: Alle Ersatzspieler mit Foto und Nummer
- **Abschluss**: „Hopp FC Gränichen!" mit Logo
- Steuerelemente: Neustart · Vollbild · **Teilen** (Web Share API, Fallback: Link kopieren)

## Cloud-Sync (Firebase Firestore)

Alle Daten (Spieler, Trainer, Aufstellung) werden in Firebase Firestore gespeichert und sind damit auf allen Geräten verfügbar.

- Trainer erfassen die Aufstellung auf dem Laptop → Daten automatisch in der Cloud
- Präsentation auf dem Beamer oder Handy öffnen → Daten werden live aus der Cloud geladen
- Mehrere Trainer können gleichzeitig vom Editor aus Änderungen vornehmen

## Formation (1-3-3, 7-gegen-7)

```
   [MF links] [Mittelfeld] [MF rechts]
  [V-links]   [Libero]   [V-rechts]
               [Tor]
```

## Vereinslogo

SVG unter `public/logo.svg`, PNG unter `public/logo.png` (für WhatsApp-Vorschau).  
Das Logo verlinkt auf https://www.fcgraenichen.ch.

## Spielerfotos / Trainerfotos

Fotos direkt in der App hochladen und zuschneiden (Knopf „📷 Foto hochladen").  
Die Bilder werden als JPEG (400×400px) in localStorage **und** Firebase gespeichert.

## Lizenz

Privates Projekt – FC Gränichen
