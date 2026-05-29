# FC Gränichen – Aufstellungs-App

Eine animierte Web-App für den FC Gränichen, um Fussball-Aufstellungen für 7-gegen-7-Spiele zu erstellen und zu präsentieren.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build-Tool)
- **CSS** (keine externen UI-Bibliotheken)
- **Google Fonts**: Bebas Neue + Barlow Condensed
- **localStorage** für Datenpersistenz

## Setup

```bash
npm install
npm run dev
```

Öffne http://localhost:5173 im Browser.

## Build

```bash
npm run build
npm run preview
```

## Verwendung

### 1. Spieler verwalten (Tab „Spieler")
- Spieler mit Nummer, Vor-/Nachname und optionalem Foto hinzufügen
- Spieler bearbeiten oder löschen
- Demo-Spieler sind beim ersten Start bereits geladen

### 2. Aufstellung konfigurieren (Tab „Aufstellung")
- Klick auf eine Position öffnet das Spieler-Auswahl-Modal
- Spieler per Klick der Position zuweisen
- Ersatzspieler (bis zu 6) und abwesende Spieler verwalten
- Trainer hinzufügen

### 3. Präsentation starten (Button „Präsentation starten")
- Vollbild-Animationspräsentation der Aufstellung
- Spieler erscheinen nacheinander mit Animationseffekten
- Steuerelemente: Neustart, Zurück, Vollbild

## Vereinslogo hinzufügen

Ersetze `public/logo-placeholder.svg` durch ein echtes Vereinslogo (SVG oder PNG).  
Passe den Pfad in `src/App.tsx` entsprechend an.

## Spielerfotos hinzufügen

1. Lege Fotos im Ordner `public/photos/` ab (z.B. `public/photos/mueller.jpg`)
2. Beim Spieler bearbeiten unter „Foto URL" den Pfad eingeben: `/photos/mueller.jpg`

## Formation

Die App verwendet eine 1-3-2-1 Formation für 7-gegen-7:

```
       [Stürmer]
  [L-Flügel] [R-Flügel]
[L-Abw] [M-Abw] [R-Abw]
         [Tor]
```

## Lizenz

Privates Projekt – FC Gränichen
# fc-graenichen-aufstellung-app
# fc-graenichen-aufstellung-app
