# CodexNoir - Your Second Brain

A modern, AI-powered notes app with notebooks, collaboration, gamification, and advanced productivity features.

![CodexNoir](https://img.shields.io/badge/CodexNoir-v2.0-brightgreen)
![Status](https://img.shields.io/badge/status-active-blue)

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

### 🧠 AI Features (Gemini API)
- Summarize notes
- Smart tags suggestions
- Rewrite/proofread
- Generate Blog/Tweet/LinkedIn posts
- Chat with your notes

### 👥 Collaboration
- Share notes via email
- Role-based access:
  - 👁️ View Only
  - 💬 Can Comment
  - ✏️ Can Edit
- Comments on notes

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

### 🔐 Security & Admin
- 🔐 Lock app with PIN
- 👑 Admin dashboard
- View all notes/users
- Activity logs

### 🔔 Notifications
- Share notifications
- Comment notifications
- Activity alerts

### ♿ Accessibility
- Keyboard shortcuts
- Focus indicators
- ARIA labels
- Tab navigation

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+S` | Save |
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
- **Database**: MongoDB (Atlas)
- **AI**: Google Gemini API
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

# Install
cd backend && npm install

# Run
node server.js
```

### Vercel Deployment

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

## Project Structure

```
CodexNoir/
├── README.md
├── .gitignore
├── backend/
│   ├── config/db.js
│   ├── middleware/authMiddleware.js
│   ├── models/Note.js, User.js
│   ├── routes/auth.js, notes.js, ai.js
│   ├── server.js
│   ├── vercel.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Notes
- `GET/POST /api/notes`
- `PUT/DELETE /api/notes/:id`

### AI
- `POST /api/ai/summarize`
- `POST /api/ai/smart-tag`
- `POST /api/ai/rewrite`
- `POST /api/ai/chat`
- `POST /api/ai/generate`

---

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
GEMINI_API_KEY=your-key
```

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

Made with ❤️ by **Sankalp Devloper**