# CodexNoir - Your Second Brain

![CodexNoir](https://img.shields.io/badge/CodexNoir-v4.0-brightgreen) ![Status](https://img.shields.io/badge/status-active-blue) ![PWA](https://img.shields.io/badge/PWA-Ready-green) ![Android](https://img.shields.io/badge/Android-App-blue) ![Encryption](https://img.shields.io/badge/Encryption-E2EE-critical)

A modern, AI-powered notes app with notebooks, collaboration, gamification, real-time sync, and end-to-end encrypted storage.

## 🚀 Live Demo

Deploy on Vercel: https://codexnoir.vercel.app

---

## ✨ New in v4.0

- 🤝 **Real-time Sync** - Socket.IO powered multi-device synchronization
- 🎤 **Voice Transcription** - AI-powered voice-to-text with Gemini summarization
- 🔒 **End-to-End Encryption** - Client-side AES-GCM encryption (server never sees plaintext)
- 🧮 **LaTeX Math Support** - KaTeX integration for mathematical notation
- 🚀 **Quick Capture** - Floating button for instant note creation
- 📱 **Android App** - Native APK via Capacitor

## 📚 Features

### 🎯 Core Features
- 📝 Rich text editor with formatting (bold, italic, headings, lists, checkboxes)
- 📝 **Markdown Support** with live preview (click eye icon or Ctrl+Shift+P)
- 🔗 **Bidirectional Links** - Use `[[Note Title]]` to link notes
- 🧮 **LaTeX Math** - Render mathematical notation with `$$E = mc^2$$`

#### 4 Personalized Dashboards
- **Student** - Study notes, research
- **Professional** - Work tasks, goals
- **Creator** - Ideas, content
- **Personal** - Journal, thoughts

#### Advanced Search & Filters
- Sort by date/title/created
- Filter by tags/notebooks
- Full-text search across content

#### Export Options
- Markdown
- PDF
- Plain Text

#### Editor Tools
- ✅ Auto-save with status indicator
- 🌙 Light/Dark theme toggle
- 🗑️ Delete note (Del key)
- 📌 Pin note (P key)
- 🔖 Bookmark note (B key)
- 🏷️ Add custom tags
- ⏰ Set reminders/schedules
- ✅ Task/checkbox mode (T key)
- ✨ AI tools panel (A key)
- 👁️ Preview Mode (Ctrl+Shift+P)

### 🧠 AI Features (Gemini API)

#### Transcription & Analysis
- 🎤 **Voice to Text** - Record and transcribe with automatic AI summarization
- 📄 Summarize notes
- 💡 Smart tags suggestions
- 🔄 Rewrite & proofread in different styles

#### Content Generation
- 📝 Generate Blog/Tweet/LinkedIn posts
- 💬 Chat with your notes (ask questions about your content)
- ✍️ Writing Coach - grammar & readability feedback
- 📚 Flashcards generation

#### Smart Organization
- 📅 Daily Brief - AI morning summary of your notes
- 🗓️ Weekly Summary - AI weekly recap
- 🔗 Related Notes - AI-powered note suggestions
- 🤖 **Copilot** - Real-time AI writing assistance sidebar

### 💬 Collaboration & Sharing
- 🔗 Share notes via public links
- 👥 Role-based access (View/Comment/Edit)
- 💬 Comment threads on notes
- 📤 Real-time sync across devices

### 🎮 Gamification
- ⭐ XP points system
- 🔥 Daily streaks
- 🏆 9 Badge types
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

### ⏱️ Productivity Tools
- ⏱️ Pomodoro timer (25/5 min)
- 📅 Calendar view with note indicators
- 🎯 Focus mode (F key) - distraction-free writing
- ⌨️ Command Palette (Cmd+K) - quick actions
- 🖱️ Context menu (right-click on notes)
- 📝 Quick Capture (Q key or ⚡ button)
- 🎤 Voice input (V key)
- ⌨️ 15+ keyboard shortcuts

### 📱 Mobile & PWA
- ✅ Fully installable Progressive Web App
- 📲 Add to Home Screen on mobile
- 📴 Offline support with IndexedDB
- 🔔 Push notifications ready
- ⚡ Quick shortcuts (New Note, Search, AI)

### 📱 Android App
- 🚀 Native Android APK via Capacitor.js
- 🖱️ Haptic feedback
- 📢 Local notifications
- 🔗 Deep linking support (`codexnoir://`)
- 🔄 Background sync capability

### 🔐 Security
- 🔑 JWT Authentication
- 🛡️ Rate limiting (20 req/15 min on auth endpoints)
- 🔒 PIN lock option
- 👑 Admin dashboard
- 🔐 **End-to-End Encryption** (AES-GCM, client-side)
- 📡 Encrypted data transmission

### 🌐 Real-time Sync
- 🔗 Socket.IO powered synchronization
- 💾 Instant note updates across devices
- 🔄 Conflict resolution (last-write-wins)
- 🟢 Online/offline indicators
- 🔄 Background reconnection

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

## 🖥️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO (WebSocket)
- **AI**: Google Gemini API
- **Encryption**: Web Crypto API (AES-GCM)
- **Math**: KaTeX
- **PWA**: Service Worker, Web App Manifest
- **Mobile**: Capacitor.js (Android)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- (Optional) Android Studio for APK build

### Local Development

```bash
# Clone repository
git clone https://github.com/Sankalp28Roop/CodexNoir.git
cd CodexNoir

# Install backend dependencies
cd backend && npm install
cd ..

# Install frontend dependencies
npm install

# Run backend server
cd backend && node server.js
```

Open http://localhost:3000 in your browser.

### Vercel Deployment

1. Import GitHub repo on Vercel
2. Set Root Directory: `backend`
3. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   MONGODB_URL=your-mongodb-atlas-uri
   JWT_SECRET=your-secret-key
   GEMINI_API_KEY=your-gemini-key
   PORT=3000
   ```
4. Deploy!

### Android App Build

```bash
# In project root
npm install

# Sync Capacitor configuration
npm run cap:sync

# Open in Android Studio
npm run android:open

# Build debug APK
npm run android:build
```

### Testing Voice Transcription

1. Click the microphone button (🎤) or press `V`
2. Allow microphone access
3. Speak your note content
4. Stop recording - AI will summarize automatically

### Testing Encryption

Notes are automatically encrypted client-side before storage:
- Check localStorage for `codexnoir_encryption_key` (key identifier)
- Note data stored as `iv:ciphertext` format
- Server never receives plaintext content

### Testing Real-time Sync

1. Open CodexNoir in two browser windows
2. Create/edit a note in one window
3. Watch it update instantly in the other
4. Toggle network connection to test offline mode

---

## 📁 Project Structure

```
CodexNoir/
├── README.md
├── package.json                  # Root dependencies & scripts
├── capacitor.config.json         # Android app config
├── android/                      # Native Android app (Capacitor)
│   ├── app/
│   ├── gradle/
│   └── ...
├── backend/                      # Express.js backend
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── Note.js               # Note schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── notes.js              # Note CRUD routes
│   │   └── ai.js                 # AI integration routes
│   ├── server.js                 # Express + Socket.IO server
│   ├── vercel.json               # Vercel configuration
│   └── .env.example              # Environment template
└── frontend/                     # PWA frontend
    ├── index.html                # Main HTML
    ├── style.css                 # All styles
    ├── script.js                 # Main application logic
    ├── sw.js                     # Service Worker
    ├── manifest.json             # PWA manifest
    ├── capacitor.js              # Capacitor initialization
    └── icons/                    # App icons
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/tasks` - Get pending tasks
- `GET /api/notes/search?q=` - Search notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/complete` - Toggle task completion
- `POST /api/notes/:id/public` - Generate public link
- `GET /api/notes/public/:slug` - Access public note

### AI Integration
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/smart-tag` - Auto-tag suggestions
- `POST /api/ai/rewrite` - Rewrite in different style
- `POST /api/ai/chat` - Chat with notes
- `POST /api/ai/generate` - Generate blog/tweet/linkedin
- `POST /api/ai/coach` - Writing coach feedback
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/daily-brief` - Daily AI summary
- `POST /api/ai/weekly-summary` - Weekly recap
- `POST /api/ai/related` - Find related notes
- `POST /api/ai/copilot` - Real-time AI assistance

### Real-time Events (Socket.IO)
- `connect` - Client connection
- `note-updated` - Broadcast note changes
- `note-deleted` - Broadcast note deletion
- `disconnect` - Client disconnection

---

## 🌐 Environment Variables

```env
# Server
PORT=3000

# Database (MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codexnoir
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/codexnoir

# Authentication
JWT_SECRET=your-secret-key-here

# AI Services
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🔍 Architecture Overview

### Data Flow
1. **Client** → **Express API** → **MongoDB** (encrypted data)
2. **Client** ↔ **Socket.IO** ↔ **Other Clients** (real-time sync)
3. **Client** → **Gemini API** ← **AI Features**
4. **Client** ↔ **LocalStorage** (cached encrypted notes)

### Encryption Flow
```
Plaintext → AES-GCM Encrypt → Store (iv:ciphertext)
                                   ↓
                              MongoDB
                                   ↓
                          Retrieve (iv:ciphertext)
                                   ↓
                           AES-GCM Decrypt → Plaintext
```

### Real-time Sync Flow
```
Client A (Edit)
    ↓
Express API (Save to DB)
    ↓
Socket.IO (Broadcast)
    ↓
Client B/C/D (Update)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Areas for contribution:**
- 🐛 Bug fixes
- 🚀 New features (real-time sync, collaborative editing)
- 🎨 UI/UX improvements
- 📝 Documentation updates
- ✅ Test coverage

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## ⭐ Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Socket.IO](https://socket.io/) - Real-time communication
- [Capacitor](https://capacitorjs.com/) - Cross-platform development
- [KaTeX](https://katex.org/) - Math rendering
- All contributors and testers

---

## 📞 Support

- 🐛 [Report Bug](https://github.com/Sankalp28Roop/CodexNoir/issues)
- 💡 [Request Feature](https://github.com/Sankalp28Roop/CodexNoir/issues)
- 📖 [Documentation](https://github.com/Sankalp28Roop/CodexNoir/wiki)

---

**Made with ❤️ by Sankalp Devloper**

[![Website](https://img.shields.io/badge/Website-codexnoir.vercel.app-blue)](https://codexnoir.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/Sankalp28Roop/CodexNoir)
