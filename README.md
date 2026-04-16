# CodexNoir - Your Second Brain

A modern, AI-powered notes app with notebooks, collaboration, gamification, PWA support, and advanced productivity features.

![CodexNoir](https://img.shields.io/badge/CodexNoir-v3.0-brightgreen)
![Status](https://img.shields.io/badge/status-active-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![Offline](https://img.shields.io/badge/Offline-Support-blue)

## 🚀 Live Demo

Deploy on Vercel: https://codexnoir.vercel.app

---

## ✨ What's New in v3.0

- 🤖 **AI Copilot Sidebar** - Persistent AI assistant while you write
- 📱 **PWA Ready** - Installable app with offline support
- 🎤 **Audio/Screen Recording** - Record voice and screen directly in notes
- 🔗 **Rich Embeds** - YouTube, Tweets, Gists, Figma
- 👆 **Biometric Login** - FaceID/Fingerprint support
- 🔐 **2FA** - Two-factor authentication
- 🔗 **Integrations Panel** - Calendar, GitHub, Slack (UI ready)
- 📁 **Drag & Drop** - Move notes between notebooks
- 🔒 **Private Mode** - Hide sensitive notes

---

## Features

### 📚 Notebooks & Collections
- Create unlimited notebooks (e.g., "Semester 1", "JavaScript Notes")
- Color-coded notebooks
- View notes by notebook
- Notebook stats (note count)
- **Drag & Drop** notes between notebooks

### 🎯 Core Features
- 📝 Rich text editor with formatting (bold, italic, headings, lists, checkboxes)
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

### 📱 PWA & Offline
- ✅ Installable web app (manifest.json)
- ✅ Full offline support (IndexedDB + Service Worker)
- ✅ Background sync when back online
- ✅ Offline mode indicator
- ✅ Push notification support

### 🛠️ Editor Tools
- 🗑️ Delete note (Del key)
- 📌 Pin note (P key)
- 🔖 Bookmark note (B key)
- 🏷️ Add custom tags
- ⏰ Set reminders/schedules
- 📎 Attach files / images
- ✅ Task/checkbox mode (T key)
- ✨ AI tools panel (A key)
- 🎤 Voice Note recording (V key)
- 🎬 Screen recording
- 🎧 Audio recording
- ▶️ Video embedding (YouTube)
- 📎 Rich embeds (tweets, gists, figma)

### 🧠 AI Features (Gemini API)
- 📋 Summarize notes
- 🏷️ Smart tags suggestions
- ✏️ Rewrite/proofread (simplify, expand, formal, casual)
- 💬 Chat with your notes
- 📝 Generate Blog/Tweet/LinkedIn posts
- ✍️ Writing Coach (grammar, readability, suggestions)
- 🎴 Generate Flashcards
- 🌅 Daily Brief
- 🔗 Related Notes (AI-powered)
- 📅 Weekly Summary
- 🤖 **Copilot** - Real-time writing assistance (continue, complete, suggest)

### 👥 Collaboration
- Share notes via email
- Role-based access:
  - 👁️ View Only
  - 💬 Can Comment
  - ✏️ Can Edit
- Comments on notes
- 🔗 **Quick Share** - Create public shareable links
- Public note access via slug

### 🎮 Gamification
- ⭐ XP points system
- 🔥 Daily streaks
- 🏆 9 Badges:
  - 📝 First Note
  - ✍️ 10 Notes
  - 📚 100 Notes
  - 💯 100 Words
  - 📖 1000 Words
  - 🎯 Task Master
  - 🔥 7 Day Streak
  - ⭐ XP Collector
  - 👑 Admin
- 📊 Stats dashboard

### ⏱️ Productivity
- ⏱️ Pomodoro timer (25/5 min)
- Writing goals
- Notes templates
- 📅 Calendar View
- ⏰ Time Travel (version history)
- 📚 Study Mode (flashcards)
- 🕸️ Knowledge Graph

### 🔐 Security & Admin
- 🔐 Lock app with PIN
- 👆 Biometric Login (FaceID/Fingerprint)
- 🔒 Two-Factor Authentication (2FA)
- 🔏 Private Mode - hide sensitive notes
- 👑 Admin dashboard
- View all notes/users
- Activity logs

### 🔔 Notifications
- Share notifications
- Comment notifications
- Activity alerts
- Push notifications (PWA)

### ♿ Accessibility
- Keyboard shortcuts
- Focus indicators
- ARIA labels
- Tab navigation

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Command Palette |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+S` | Save |
| `Del` | Delete note |
| `P` | Pin note |
| `B` | Bookmark |
| `A` | AI tools |
| `T` | Task mode |
| `F` | Focus Mode |
| `V` | Voice Note |
| `Q` | Quick Capture |
| `C` | AI Copilot |
| `?` | Show shortcuts |
| `Esc` | Close panel |

---

## 🚀 Quick Start

### Run Locally

```bash
# Clone
git clone https://github.com/Sankalp28Roop/CodexNoir.git
cd CodexNoir

# Install backend
cd backend && npm install

# Run
node server.js
```

Open http://localhost:3000

---

## 🌐 Deploy on Vercel

1. Import GitHub repo on Vercel
2. Set Root Directory: `backend`
3. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret
   GEMINI_API_KEY=your-gemini-key
   PORT=3000
   ```
4. Deploy!

---

## 🏗️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **AI**: Google Gemini API (gemini-2.0-flash)
- **PWA**: Service Worker, IndexedDB, Manifest
- **Deployment**: Vercel

---

## 📁 Project Structure

```
CodexNoir/
├── README.md
├── backend/
│   ├── config/db.js
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
    ├── manifest.json
    └── sw.js
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Notes
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search` - Search
- `GET /api/notes/public/:slug` - Public note
- `POST /api/notes/:id/public` - Create public link

### AI (Gemini)
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/smart-tag` - Generate tags
- `POST /api/ai/rewrite` - Rewrite in different styles
- `POST /api/ai/chat` - Chat with notes
- `POST /api/ai/generate` - Generate blog/tweet/linkedin
- `POST /api/ai/coach` - Writing feedback
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/daily-brief` - Daily summary
- `POST /api/ai/related` - Find related notes
- `POST /api/ai/weekly-summary` - Weekly summary
- `POST /api/ai/copilot` - Real-time writing help

---

## 🔧 Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
GEMINI_API_KEY=your-gemini-key
```

---

## 🎯 Phase Roadmap

### Completed ✅
- Phase 1: AI Copilot, Smart Auto-Summaries, Voice Notes
- Phase 2: Quick Share, Public Links
- Phase 3: PWA, Offline Support, Background Sync
- Phase 4: Audio/Screen Recording, Video Embeds
- Phase 5: Drag & Drop, Context Menu, Focus Mode
- Phase 6: Private Mode, Biometric, 2FA
- Phase 7: Integrations (UI ready)

### Coming Soon 🔜
- Real-time Co-editing (WebSocket)
- End-to-End Encryption
- Full OAuth (Slack, GitHub, Google Calendar)

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit and push
4. Open PR

---

## 📄 License

MIT License

---

Made with ❤️ by **Sankalp Developer**