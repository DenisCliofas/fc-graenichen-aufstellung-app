# Fork Guide — Deploy Your Own Aufstellungs-App

> 🇩🇪 [Deutsche Version weiter unten](#fork-anleitung--eigene-aufstellungs-app-deployen)

---

## Fork Guide — Deploy Your Own Aufstellungs-App

This guide explains how to fork this project and run your own lineup app for a different football club — with your own Firebase backend and GitHub Pages URL.

### 1. Fork the Repository

1. Go to https://github.com/DenisCliofas/fc-graenichen-aufstellung-app
2. Click **Fork** → choose your GitHub account and give it a new name (e.g. `fc-aarau-aufstellung-app`)
3. Clone your fork and install dependencies:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
npm install
```

---

### 2. Create a Firebase Project

1. Go to https://console.firebase.google.com → **Add project**
2. Enter a project name (e.g. `fc-aarau-aufstellung`) → continue through the wizard (disable Google Analytics — not needed)
3. In the left sidebar: **Build → Firestore Database** → **Create database**
   - Choose **Production mode**
   - Pick a region close to your users (e.g. `europe-west6` for Switzerland)
4. Go to **Project settings** (gear icon top-left) → **Your apps** → **Add app** → Web (`</>`)
   - Register the app (any nickname)
   - Copy the `firebaseConfig` object — you'll need it in the next step

---

### 3. Set Firestore Security Rules

In **Firestore → Rules**, replace the default content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamSlug}/{collection}/{doc} {
      allow read: true;
      allow write: true;
    }
  }
}
```

Click **Publish**.

> ⚠️ This allows anyone who knows a team slug to read and write its data. The security model relies on keeping the editor URL private — the same approach as the original app.

---

### 4. Update the Code

**`src/firebase.ts`** — replace the config with your own:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**`vite.config.ts`** — update the base path to match your GitHub repository name:

```ts
base: '/YOUR-REPO-NAME/',
```

**`package.json`** — optionally update the `name` field:

```json
"name": "fc-aarau-roster"
```

---

### 5. Optional Customizations

| What | File | Field |
|------|------|-------|
| Default team name & colors | `src/types.ts` | `DEFAULT_SETTINGS` |
| Default formation | `src/formations.ts` | `DEFAULT_FORMATION_ID` |
| App title & favicon | `index.html` | `<title>` and `<link rel="icon">` |
| Anthem music | `public/anthem.mp3` | Replace with your own MP3 |

---

### 6. Deploy to GitHub Pages

1. Commit and push all your changes to `main`:

```bash
git add .
git commit -m "Configure for MY-CLUB"
git push origin main
```

2. Run the deploy script:

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch automatically.

3. In GitHub: **Settings → Pages** → Source: **Deploy from branch** → `gh-pages` / `/ (root)` → **Save**

Your app will be live at:
**`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`**

---

### 7. Using the App

| URL | Description |
|-----|-------------|
| `/` | Start page — enter team slug |
| `/{slug}/editor` | Trainer editor — keep this URL private |
| `/{slug}/presentation` | Public presentation — share with parents & players |

Each team slug is an isolated workspace in Firestore. You can have multiple clubs in one deployment — just use different slugs.

---
---

# Fork-Anleitung — Eigene Aufstellungs-App deployen

Diese Anleitung erklärt, wie du dieses Projekt forkst und eine eigene Aufstellungs-App für einen anderen Fussballverein betreibst — mit eigenem Firebase-Backend und GitHub-Pages-URL.

### 1. Repository forken

1. Gehe zu https://github.com/DenisCliofas/fc-graenichen-aufstellung-app
2. Klicke auf **Fork** → wähle dein GitHub-Konto und vergib einen neuen Namen (z.B. `fc-aarau-aufstellung-app`)
3. Klone dein Fork und installiere die Abhängigkeiten:

```bash
git clone https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
cd DEIN-REPO-NAME
npm install
```

---

### 2. Firebase-Projekt erstellen

1. Gehe zu https://console.firebase.google.com → **Projekt hinzufügen**
2. Projektnamen eingeben (z.B. `fc-aarau-aufstellung`) → durch den Assistenten gehen (Google Analytics deaktivieren — nicht benötigt)
3. Im linken Menü: **Build → Firestore-Datenbank** → **Datenbank erstellen**
   - **Produktionsmodus** wählen
   - Region wählen (z.B. `europe-west6` für die Schweiz)
4. **Projekteinstellungen** (Zahnrad oben links) → **Deine Apps** → **App hinzufügen** → Web (`</>`)
   - App registrieren (beliebiger Name)
   - Das `firebaseConfig`-Objekt kopieren — wird im nächsten Schritt benötigt

---

### 3. Firestore-Sicherheitsregeln setzen

Unter **Firestore → Regeln** den Standardinhalt ersetzen mit:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamSlug}/{collection}/{doc} {
      allow read: true;
      allow write: true;
    }
  }
}
```

**Veröffentlichen** klicken.

> ⚠️ Diese Regeln erlauben jedem, der einen Team-Slug kennt, die Daten zu lesen und zu schreiben. Das Sicherheitsmodell basiert darauf, die Editor-URL privat zu halten — genau wie in der Original-App.

---

### 4. Code anpassen

**`src/firebase.ts`** — Konfiguration durch deine eigene ersetzen:

```ts
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT.firebasestorage.app",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};
```

**`vite.config.ts`** — Basispfad auf deinen GitHub-Repository-Namen anpassen:

```ts
base: '/DEIN-REPO-NAME/',
```

**`package.json`** — optional den `name` anpassen:

```json
"name": "fc-aarau-roster"
```

---

### 5. Optionale Anpassungen

| Was | Datei | Feld |
|-----|-------|------|
| Standard-Teamname & -farben | `src/types.ts` | `DEFAULT_SETTINGS` |
| Standard-Formation | `src/formations.ts` | `DEFAULT_FORMATION_ID` |
| App-Titel & Favicon | `index.html` | `<title>` und `<link rel="icon">` |
| Hymne / Musik | `public/anthem.mp3` | Durch eigene MP3 ersetzen |

---

### 6. Auf GitHub Pages deployen

1. Alle Änderungen committen und pushen:

```bash
git add .
git commit -m "Konfiguriert für MEIN-VEREIN"
git push origin main
```

2. Deploy-Skript ausführen:

```bash
npm run deploy
```

Damit wird die App gebaut und der `dist/`-Ordner automatisch in den `gh-pages`-Branch gepusht.

3. In GitHub: **Settings → Pages** → Quelle: **Deploy from branch** → `gh-pages` / `/ (root)` → **Save**

Deine App ist dann erreichbar unter:
**`https://DEIN-USERNAME.github.io/DEIN-REPO-NAME/`**

---

### 7. App verwenden

| URL | Beschreibung |
|-----|-------------|
| `/` | Startseite — Kürzel eingeben |
| `/{kürzel}/editor` | Trainer-Editor — URL **nicht** teilen |
| `/{kürzel}/presentation` | Öffentliche Präsentation — für Eltern & Spieler |

Jedes Team-Kürzel ist ein isolierter Bereich in Firestore. In einer einzigen Deployment-Instanz können mehrere Vereine gleichzeitig die App nutzen — einfach verschiedene Kürzel verwenden.
