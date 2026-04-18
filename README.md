# CodexNoir - Your Second Brain

A modern, AI-powered notes app with notebooks, collaboration, gamification, and advanced productivity features.

![CodexNoir](https://img.shields.io/badge/CodexNoir-v3.0-brightgreen)
![Status](https://img.shields.io/badge/status-active-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![Android](https://img.shields.io/badge/Android-App-blue)

## 🚀 Live Demo

Deploy on Vercel: https://codexnoir.vercel.app

---

## Features

### 📚 Notebooks & Collections
- Create unlimited notebooks (e.g., "Semester 1", "JavaScript Notes")
- Color-coded notebooks
- View notes by notebook
- Notebook stats (note count)

### 🎯 Core Features
- 📝 Rich text editor with formatting (bold, italic, headings, lists, checkboxes)
- 📝 **Markdown Support** with live preview (click eye icon or Ctrl+Shift+P)
- 🔗 **Bidirectional Links** - Use `[[Note Title]]` to link notes
- 📚 4 personalized dashboards:
  - **Student** - Study notes, research
  - **Professional** - Work tasks, goals
  - **Creator** - Ideas, content
  - **Personal** - Journal, thoughts
- 🔍 Advanced search with filters:
  - Sort by date/title/created
  - Filter by tags/notebooks
- 📤 Export notes (Markdown, PDF, Text)
- 🔄 Auto-save with status indicator
- 🌙 Light/Dark theme toggle

### 🛠️ Editor Tools
- 🗑️ Delete note (Del key)
- 📌 Pin note (P key)
- 🔖 Bookmark note (B key)
- 🏷️ Add custom tags
- ⏰ Set reminders/schedules
- 📎 Attach files
- ✅ Task/checkbox mode (T key)
- ✨ AI tools panel (A key)
- 👁️ **Preview Mode** (Ctrl+Shift+P) - Toggle markdown preview

### 🧠 AI Features (Gemini API)
- Summarize notes
- Smart tags suggestions
- Rewrite/proofread in different styles
- Generate Blog/Tweet/LinkedIn posts
- Chat with your notes
- Writing Coach - grammar & readability analysis
- Flashcards generation
- Daily Brief - AI morning summary
- Weekly Summary - AI weekly recap
- Related Notes - AI-powered note suggestions
- **Copilot** - Real-time AI writing assistance

### 👥 Collaboration
- Share notes via public links
- Role-based access:
  - 👁️ View Only
  - 💬 Can Comment
  - ✏️ Can Edit
- Comments on notes

### 🎮 Gamification
- ⭐ XP points system
- 🔥 Daily streaks
- 🏆 Badges system
- 📊 Stats dashboard

### ⏱️ Productivity
- ⏱️ Pomodoro timer (25/5 min)
- 📅 Calendar view
- 🎯 Focus mode (F key)
- ⌨️ Command Palette (Cmd+K)
- 🖱️ Context menu (right-click)
- 📝 Quick Capture (Q key)
- 🎤 Voice input (V key)

### 📱 Mobile & PWA
- ✅ Fully installable PWA
- 📲 Add to Home Screen
- 📴 Offline support with IndexedDB
- 🔔 Push notifications ready
- 🎯 Quick shortcuts (New Note, Search, AI)

### 📱 Android App
- Native Android APK via Capacitor
- Haptic feedback
- Local notifications
- Deep linking support (codexnoir://)

### 🔐 Security
- JWT Authentication
- Rate limiting (20 req/15 min on auth)
- PIN lock option
- 👑 Admin dashboard

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+S` | Save |
| `Ctrl+Shift+P` | Preview Mode (Markdown) |
| `Cmd+K` | Command Palette |
| `F` | Focus Mode |
| `Q` | Quick Capture |
| `V` | Voice Input |
| `Del` | Delete note |
| `P` | Pin note |
| `B` | Bookmark |
| `A` | AI tools |
| `T` | Task mode |
| `?` | Show shortcuts |
| `Esc` | Close panel |

---

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API
- **PWA**: Service Worker, Web App Manifest
- **Mobile**: Capacitor.js (Android)
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Google Gemini API key

### Local Development

```bash
# Clone
git clone https://github.com/Sankalp28Roop/CodexNoir.git
cd CodexNoir

# Install backend dependencies
cd backend && npm install

# Run backend
node server.js

# Open in browser
# http://localhost:3000
```

### Vercel Deployment

1. Import GitHub repo on Vercel
2. Set Root Directory: `backend`
3. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   MONGODB_URL=your-mongodb-atlas-uri
   JWT_SECRET=your-secret
   GEMINI_API_KEY=your-gemini-key
   PORT=3000
   ```
4. Deploy!

### Android App Build

```bash
# Install dependencies
npm install

# Sync Capacitor
npm run cap:sync

# Open in Android Studio
npm run android:open

# Or build debug APK
npm run android:build
```

---

## Project Structure

```
CodexNoir/
├── README.md
├── package.json
├── capacitor.config.json
├── android/                    # Native Android app (Capacitor)
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── ai.js
│   ├── server.js
│   ├── vercel.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── sw.js                  # Service Worker
    ├── manifest.json          # PWA Manifest
    ├── capacitor.js           # Capacitor init
    └── icons/                 # App icons
```

---

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/tasks` - Get pending tasks
- `GET /api/notes/search?q=` - Search notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/complete` - Toggle task complete

### AI
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/smart-tag` - Auto-tag suggestions
- `POST /api/ai/rewrite` - Rewrite in different styles
- `POST /api/ai/chat` - Chat with your notes
- `POST /api/ai/generate` - Generate blog/tweet/linkedin
- `POST /api/ai/coach` - Writing coach feedback
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/daily-brief` - Daily AI summary
- `POST /api/ai/weekly-summary` - Weekly AI summary
- `POST /api/ai/related` - Find related notes
- `POST /api/ai/copilot` - Real-time AI assistance

---

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your-secret
GEMINI_API_KEY=your-key
```

---

## What's New in v3.0

- ✨ Markdown preview with live rendering
- 🔗 Bidirectional `[[wiki links]]`
- 🛡️ Rate limiting on auth endpoints
- 📱 Full PWA with offline support
- 🤖 Android app via Capacitor
- 🎯 Enhanced keyboard shortcuts
- 🎤 Voice input support
- ⏱️ Focus mode

---

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit and push
4. Open PR

---

## License

MIT License

---

Made with ❤️ by **Sankalp Developer**