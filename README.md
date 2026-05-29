# FC Gränichen – Aufstellungs-App

Eine animierte Web-App für den FC Gränichen, um Fussball-Aufstellungen für 7-gegen-7-Spiele zu erstellen und zu präsentieren.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build-Tool)
- **CSS** (keine externen UI-Bibliotheken)
- **Google Fonts**: Bebas Neue + Barlow Condensed
- **localStorage** für Datenpersistenz (kein Backend erforderlich)

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

# GitHub Pages Deploy (nach einmaliger Einrichtung)
npm run deploy
```

## Verwendung

### 1. Trainer verwalten (Tab „Trainer")
- Trainer mit Vor-/Nachname, Rolle (z.B. „Haupttrainer") und optionalem Foto erfassen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser
- Alle erfassten Trainer sind standardmässig als „Dabei" markiert
- Trainer bearbeiten oder löschen

### 2. Spieler verwalten (Tab „Spieler")
- Spieler mit Trikotnummer, Vor-/Nachname und optionalem Foto hinzufügen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser – wird als Base64 in localStorage gespeichert
- Spieler bearbeiten oder löschen
- Demo-Spieler sind beim ersten Start bereits geladen

### 3. Aufstellung konfigurieren (Tab „Aufstellung")
- Klick auf eine Position öffnet das Spieler-Auswahl-Modal
- Ersatzspieler (bis zu 6) und abwesende Spieler verwalten
- Trainer per Klick als „Dabei" / „Nicht dabei" markieren
- **Spieldaten**: Gegner und Datum eingeben – erscheinen auf dem Intro-Screen
- Button „Präsentation starten"

### 4. Präsentation (automatisch)
- **Intro**: FC Gränichen Logo + Name + Gegner + Datum
- **Spieler-Spotlight**: Jeder Startspieler wird kurz gross gezeigt, fliegt dann auf seine Position im Feld
- **Ersatzspieler**: Alle Ersatzspieler mit Foto und Nummer
- **Abschluss**: „Hopp FC Gränichen!" mit Logo
- Steuerelemente: Neustart · Zurück · Vollbild · **Teilen** (Web Share API, Fallback: Link kopieren)

## Formation (1-3-3, 7-gegen-7)

```
   [MF links] [Mittelfeld] [MF rechts]
  [V-links]   [Libero]   [V-rechts]
               [Tor]
```

## Vereinslogo

SVG-Logo unter `public/logo.svg` ablegen. Das Logo verlinkt auf https://www.fcgraenichen.ch.

## Spielerfotos / Trainerfotos

Fotos direkt in der App hochladen und zuschneiden (Knopf „📷 Foto hochladen").  
Die Bilder werden als JPEG (400×400px) in localStorage gespeichert (~5 MB Limit beachten).

## GitHub Pages Deploy einrichten

1. `vite.config.ts` anpassen:
   ```ts
   base: '/fc-graenichen-roster/',
   ```
2. Deploy-Paket installieren:
   ```bash
   npm install --save-dev gh-pages
   ```
3. In `package.json` ergänzen:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Deployen:
   ```bash
   npm run deploy
   ```

## Lizenz

Privates Projekt – FC Gränichen
