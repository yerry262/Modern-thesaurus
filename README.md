# Modern Thesaurus

A full-stack crowd-sourced modern thesaurus web app where users can define, vote on, and discuss contemporary words and slang.

**Live Demo:** [https://yerry262.github.io/Modern-thesaurus](https://yerry262.github.io/Modern-thesaurus)

---

## Features

- 📖 Browse trending words (Today / This Week)
- ➕ Add new words with definitions, examples, and attribution
- 👍👎 Upvote / downvote entries
- 💬 Comment on entries
- 🔍 Search words in real-time
- 📱 Responsive design for iOS and desktop

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React.js (Create React App)        |
| Backend  | Express.js                         |
| Database | Google Firestore (firebase-admin)  |
| Hosting  | GitHub Pages (frontend), Railway (backend) |

---

## Project Structure

```
Modern-thesaurus/
├── frontend/          # React app
│   ├── src/
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.css
│   │   └── components/
│   │       ├── EntryCard.js
│   │       ├── EntryForm.js
│   │       ├── CommentSection.js
│   │       └── SearchBar.js
│   └── .env.example
├── backend/           # Express API
│   ├── src/
│   │   ├── index.js
│   │   ├── firebase.js
│   │   └── routes/
│   │       └── entries.js
│   ├── Procfile
│   └── .env.example
└── README.md
```

---

## Setup

### Prerequisites

- Node.js ≥ 16
- A Google Firebase project with Firestore enabled (or use mock mode without credentials)

### 1. Clone the repo

```bash
git clone https://github.com/yerry262/Modern-thesaurus.git
cd Modern-thesaurus
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in your Firebase credentials in .env
npm install
npm start        # Runs on http://localhost:3001
```

#### Backend environment variables (`.env`)

| Variable               | Description                          |
|------------------------|--------------------------------------|
| `FIREBASE_PROJECT_ID`  | Firebase project ID                  |
| `FIREBASE_PRIVATE_KEY` | Service account private key          |
| `FIREBASE_CLIENT_EMAIL`| Service account email                |
| `PORT`                 | Port to listen on (default: 3001)    |

> **Note:** If Firebase credentials are not provided, the backend runs in **mock mode** using in-memory storage (data resets on restart). Perfect for local development.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL (default: http://localhost:3001)
npm install
npm start        # Runs on http://localhost:3000
```

#### Frontend environment variables (`.env`)

| Variable             | Description                  |
|----------------------|------------------------------|
| `REACT_APP_API_URL`  | Backend API URL              |

---

## API Endpoints

| Method | Path                          | Description               |
|--------|-------------------------------|---------------------------|
| GET    | `/api/entries?period=day\|week` | Get trending entries     |
| POST   | `/api/entries`                | Create a new entry        |
| POST   | `/api/entries/:id/vote`       | Upvote or downvote        |
| GET    | `/api/entries/:id/comments`   | Get comments              |
| POST   | `/api/entries/:id/comments`   | Add a comment             |
| GET    | `/api/entries/search?q=term`  | Search entries            |

---

## Deployment

### Backend → Railway

1. Create a new Railway project and connect this repo (point root to `backend/`)
2. Set the environment variables in Railway dashboard
3. Railway auto-detects the `Procfile`: `web: node src/index.js`

### Frontend → GitHub Pages

```bash
cd frontend
# Set REACT_APP_API_URL in .env to your Railway URL
npm run deploy
```

This runs `npm run build` then `gh-pages -d build`.

---

## License

MIT
