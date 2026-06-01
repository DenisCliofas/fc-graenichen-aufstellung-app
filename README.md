# Aufstellungs-App

Eine animierte Web-App um Fussball-Aufstellungen (7-gegen-7) zu erstellen und zu prasentieren. Jedes Team bekommt eine eigene, isolierte URL — keine Installation, kein Login.

Unterstuetzte Sprachen: Deutsch, English, Francais, Italiano.

Live: https://deniscliofas.github.io/fc-graenichen-aufstellung-app/

## So funktioniert es

1. Offne die App-URL und wahle deine Sprache
2. Gib ein **Team-Kurzel** ein (z.B. `fc-aarau-2025`) — das ist dein persoenlicher Schlussel
3. Beim ersten Besuch landest du im Editor in den Einstellungen (Teamname, Farben, Logo)
4. Beim nachsten Besuch (Kurzel bereits bekannt) landest du direkt auf der Aufstellung

> **Wichtig:** Merke dir dein Kurzel. Es gibt kein Passwort und keine Wiederherstellung. Wer die Editor-URL kennt, kann die Daten bearbeiten — teile nur die Aufstellungs-URL mit Fans.

### Deine URLs

| URL | Beschreibung |
|-----|-------------|
| `/` | Startseite — Kurzel eingeben |
| `/{kurzel}/presentation` | Offentliche Prasentation — fur alle Eltern und Spieler |
| `/{kurzel}/editor` | Trainer-Editor — nur fur Trainer (URL nicht teilen!) |

**Beispiel:** `.../fc-aarau-2025/editor` und `.../fc-aarau-2025/presentation`

## Verwendung

### 1. Team einrichten (Editor -> Einstellungen)
- Teamname, Kurzname, Primar- und Sekundarfarbe, Logo und Sprache festlegen
- Anderungen werden sofort in der Prasentation sichtbar
- Die Sprache lasst sich auch auf der Startseite wahlen

### 2. Trainer verwalten (Editor -> Trainer)
- Trainer mit Vor-/Nachname, Rolle (z.B. "Haupttrainer") und optionalem Foto erfassen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser

### 3. Spieler verwalten (Editor -> Spieler)
- Spieler mit Trikotnummer, Vor-/Nachname und optionalem Foto hinzufugen
- Foto per Upload & Zuschneiden (1:1-Crop) direkt im Browser

### 4. Aufstellung konfigurieren (Editor -> Aufstellung)
- Klick auf eine Position offnet das Spieler-Auswahl-Modal
- Ersatzspieler (bis zu 6) und abwesende Spieler verwalten
- Trainer per Klick als "Dabei" / "Nicht dabei" markieren
- **Captain** wahlen — wird in der Prasentation visuell hervorgehoben
- **Spieldaten**: Gegner und Datum eingeben — erscheinen auf dem Intro-Screen
- Button "Prasentation starten"

### 5. Prasentation (`/{kurzel}/presentation`)
- **Intro**: Team-Logo + Name + Gegner + Datum
- **Spieler-Spotlight**: Jeder Startspieler wird kurz gross gezeigt, fliegt dann auf seine Position im Feld
- **Ersatzspieler**: Alle Ersatzspieler mit Foto und Nummer
- **Abschluss**: "Hopp [Teamname]!" mit Logo
- Steuerelemente: Neustart · Vollbild · Musik · Teilen

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build-Tool)
- **React Router v7** (client-side routing)
- **Firebase Firestore** (Echtzeit-Datenbank, isoliert pro Team-Kurzel)
- **react-i18next** (Mehrsprachigkeit: DE / EN / FR / IT)
- **CSS** (keine externen UI-Bibliotheken)
- **Google Fonts**: Bebas Neue + Barlow Condensed

## Cloud-Sync (Firebase Firestore)

Alle Daten werden pro Team-Kurzel isoliert in Firebase Firestore gespeichert.

- Trainer erfassen die Aufstellung auf dem Laptop -> Daten automatisch in der Cloud
- Prasentation auf dem Beamer oder Handy offnen -> Daten werden live aus der Cloud geladen
- Mehrere Trainer konnen gleichzeitig Anderungen vornehmen
- Zwei Teams mit unterschiedlichen Kurzeln teilen **keine** Daten

## Formation (1-3-3, 7-gegen-7)

```
   [MF links] [Mittelfeld] [MF rechts]
  [V-links]   [Libero]   [V-rechts]
               [Tor]
```

## Setup (lokal entwickeln)

```bash
npm install
npm run dev
```

Offne http://localhost:5173 im Browser.
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

Open source — nutzbar fur beliebige Amateurteams.