# CodexNoir - Your Second Brain

A modern, AI-powered notes app with intent-based note taking, gamification, and productivity features.

![CodexNoir](https://img.shields.io/badge/CodexNoir-v1.0-brightgreen)
![Status](https://img.shields.io/badge/status-active-blue)

## Features

### 🎯 Core Features
- 📝 Rich text editor with formatting (bold, italic, headings, lists, checkboxes)
- 📚 4 personalized dashboards:
  - **Student** - Study notes, research, flashcards
  - **Professional** - Work tasks, goals, agenda
  - **Creator** - Ideas, content, media planning
  - **Personal** - Journal, thoughts, memories
- 🔍 Real-time search across all notes
- 📤 Export notes (Markdown, PDF, Text)
- 🔄 Auto-save with status indicator
- 🌙 Light/Dark theme toggle

### 🛠️ Editor Tools
- 🗑️ Delete note
- 📌 Pin important notes
- 🔖 Bookmark notes
- 🏷️ Add custom tags
- ⏰ Set reminders/schedules
- 📎 Attach files and images
- ✅ Task/checkbox mode

### 🧠 AI Features
- Summarize long notes
- Auto-generate smart tags
- Rewrite/proofread content
- Generate Blog posts
- Generate Tweets
- Generate LinkedIn posts
- Chat with your notes (Ask anything)

### 🎮 Gamification
- ⭐ XP points system (earn for actions)
- 🔥 Daily writing streaks
- 🏆 8 unlockable badges:
  - 📝 First Note
  - ✍️ 10 Notes
  - 📚 100 Notes
  - 💯 100 Words
  - 📖 1000 Words
  - 🎯 Task Master
  - 🔥 7 Day Streak
  - ⭐ XP Collector
- 📊 Stats dashboard (notes count, words, streak, XP)

### ⏱️ Productivity
- ⏱️ Pomodoro timer (25/5 min sessions)
- Writing goals tracking

### 🔐 Security
- 🔐 Lock app with PIN code

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI**: Google Gemini API

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   cd Notes
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Add your MongoDB URI
   - Add your Gemini API key

4. **Start the servers**

   Option A - Run both (frontend + backend):
   ```bash
   cd backend
   node server.js
   ```
   App runs on http://localhost:3000

   Option B - Run separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js

   # Terminal 2 - Frontend
   cd frontend
   python3 -m http.server 8080
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
Notes/
├── README.md
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Note.js       # Note schema
│   │   └── User.js       # User schema
│   ├── routes/
│   │   ├── auth.js      # Authentication
│   │   ├── notes.js     # CRUD operations
│   │   └── ai.js        # AI endpoints
│   ├── server.js        # Main server
│   ├── package.json
│   └── .env            # Environment variables
└── frontend/
    ├── index.html       # Main HTML
    ├── style.css       # All styles
    └── script.js      # All JavaScript
```

## Usage

### Onboarding
1. Select your use case (Student/Professional/Creator/Personal)
2. Click "Get Started"
3. Your dashboard will be personalized

### Creating Notes
1. Click + button (top nav or floating)
2. Choose note type:
   - **Text Note** - Basic note
   - **Idea** - Problem/Solution format
   - **Task** - Checklist format
   - **Study** - Key concepts template
   - **Thought** - Journal format
   - **Goal** - Goal planning

### Using AI
1. Open any note
2. Click ✨ AI button in toolbar
3. Choose tool:
   - Summarize - Get summary
   - Smart Tag - Auto-tag
   - Rewrite - Improve writing
   - Generate - Create content

### Productivity Features
1. **Pomodoro**: Profile > Focus Timer
2. **Stats**: Profile > Your Stats
3. **Lock App**: Profile > Lock App

## Keyboard Shortcuts

- `Ctrl+B` - Bold text
- `Ctrl+I` - Italic text

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### AI
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/smart-tag` - Generate tags
- `POST /api/ai/rewrite` - Rewrite text
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/generate` - Generate content

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/codexnoir
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use!

---

Made with ❤️ by **Sankalp Devloper**

---