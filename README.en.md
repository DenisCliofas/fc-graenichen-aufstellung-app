# Lineup App

An animated web app to create and present football lineups. Supports 7v7, 9v9 and 11v11. Each team gets its own isolated URL — no installation, no login required.

Supported languages: Deutsch, English, Français, Italiano.

Live: https://deniscliofa.github.io/fc-graenichen-aufstellung-app/

> 🇩🇪 [Deutsche Version (README.md)](README.md) · 🍴 [Fork Guide (FORK_GUIDE.md)](FORK_GUIDE.md)

## How it works

1. Open the app URL and select your language
2. Enter a **team slug** (e.g. `fc-aarau-2025`) — this is your personal key
3. On your first visit you land in the editor's settings tab (team name, colours, logo)
4. On subsequent visits (slug already known) you land directly on the lineup

> **Important:** Remember your slug. There is no password and no recovery option. Anyone who knows the editor URL can edit the data — only share the presentation URL with fans.

### Your URLs

| URL | Description |
|-----|-------------|
| `/` | Start page — enter team slug |
| `/{slug}/presentation` | Public presentation — for parents and players |
| `/{slug}/editor` | Coach editor — for coaches only (don't share!) |

**Example:** `.../fc-aarau-2025/editor` and `.../fc-aarau-2025/presentation`

## Usage

### 1. Set up your team (Editor → Settings)
- Set team name, short name, primary & secondary colour, logo and language
- Choose **game format**: 7v7, 9v9 or 11v11 (default: 11v11)
- Changes are immediately reflected in the presentation
- Language can also be changed on the start page

### 2. Manage coaches (Editor → Coaches)
- Add coaches with first/last name, role (e.g. "Head Coach") and optional photo
- Photo upload with 1:1 crop directly in the browser

### 3. Manage players (Editor → Players)
- Add players with shirt number, first/last name and optional photo
- Photo upload with 1:1 crop directly in the browser

### 4. Configure the lineup (Editor → Lineup)
- Choose a formation matching your game format
- Player positions are displayed as absolute coordinates on the field
- Click a position to open the player selection modal
- Manage substitutes (up to 6) and absent players
- Mark coaches as "attending" / "not attending" with a click
- Choose a **captain** — highlighted visually in the presentation
- Enter **match details**: opponent and date — shown on the intro screen
- Press "Start presentation"

### 5. Presentation (`/{slug}/presentation`)
- **Intro**: Team logo + name + opponent + date
- **Player spotlight**: Each starting player is briefly shown large — **in order: goalkeeper → defenders → midfielders → strikers** — then flies onto their position on the field
- **Substitutes**: All substitutes with photo and number
- **Closing slide**: "Hopp [Team name]!" with logo
- Controls: Restart · Fullscreen · Music · Share

## Formations

Formation names follow football convention and **exclude the goalkeeper** from the count.

| Format | Formations |
|--------|------------|
| 7v7    | 3-3 · 2-3-1 |
| 9v9    | 3-3-2 · 3-2-3 · 2-3-2-1 |
| 11v11  | 4-4-2 · 4-3-3 · 3-5-2 · 4-2-3-1 |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router v7** (client-side routing)
- **Firebase Firestore** (real-time database, isolated per team slug)
- **react-i18next** (multilingual: DE / EN / FR / IT)
- **CSS** (no external UI libraries)
- **Google Fonts**: Bebas Neue + Barlow Condensed

## Cloud Sync (Firebase Firestore)

All data is stored in Firebase Firestore, isolated per team slug.

- Coaches enter the lineup on their laptop → data saved to the cloud automatically
- Open the presentation on a projector or phone → data loaded live from the cloud
- Multiple coaches can make changes simultaneously
- Two teams with different slugs share **no** data

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.
Or just double-click `start.bat`.

## Build & Deploy

```bash
# Local build
npm run build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## License

Open source — free to use for any amateur football club.
