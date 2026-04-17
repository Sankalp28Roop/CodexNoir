const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../codexnoir.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initializeDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      useCase TEXT,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      badges TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT,
      content TEXT,
      intent TEXT DEFAULT 'note',
      pinned INTEGER DEFAULT 0,
      bookmarked INTEGER DEFAULT 0,
      color TEXT DEFAULT '#ffffff',
      tags TEXT DEFAULT '[]',
      reminder TEXT,
      notebookId TEXT,
      isTask INTEGER DEFAULT 0,
      isComplete INTEGER DEFAULT 0,
      publicLink TEXT,
      isPrivate INTEGER DEFAULT 0,
      sharedWith TEXT DEFAULT '[]',
      comments TEXT DEFAULT '[]',
      history TEXT DEFAULT '[]',
      metadata TEXT DEFAULT '{}',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notebooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#6366f1',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_userId ON notes(userId);
    CREATE INDEX IF NOT EXISTS idx_notebooks_userId ON notebooks(userId);
  `);
  
  console.log('SQLite Database Initialized Successfully');
}

const connectDB = async () => {
  try {
    initializeDB();
    console.log('SQLite Connected: ' + dbPath);
  } catch (error) {
    console.error('SQLite Connection Error:', error.message);
    process.exit(1);
  }
};

// Helper functions
const findUserByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

const findUserById = (id) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
};

const createUser = (name, email, password, useCase) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (name, email, password, useCase) VALUES (?, ?, ?, ?)');
  const result = stmt.run(name, email, hashedPassword, useCase || 'personal');
  return findUserById(result.lastInsertRowid);
};

const updateUser = (id, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  const stmt = db.prepare(`UPDATE users SET ${fields} WHERE id = ?`);
  return stmt.run(...values);
};

// Notes helpers
const getNotesByUser = (userId) => {
  const stmt = db.prepare('SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC');
  return stmt.all(userId);
};

const getNoteById = (id) => {
  const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
  return stmt.get(id);
};

const createNote = (userId, note) => {
  const stmt = db.prepare(`
    INSERT INTO notes (userId, title, content, intent, pinned, bookmarked, color, tags, reminder, notebookId, isTask, isComplete)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    userId,
    note.title || '',
    note.content || '',
    note.intent || 'note',
    note.pinned ? 1 : 0,
    note.bookmarked ? 1 : 0,
    note.color || '#ffffff',
    JSON.stringify(note.tags || []),
    note.reminder || null,
    note.notebookId || null,
    note.isTask ? 1 : 0,
    note.isComplete ? 1 : 0
  );
  return getNoteById(result.lastInsertRowid);
};

const updateNote = (id, updates) => {
  const note = getNoteById(id);
  if (!note) return null;
  
  const fields = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    fields.push(`${key} = ?`);
    if (key === 'tags' || key === 'sharedWith' || key === 'comments' || key === 'history' || key === 'metadata') {
      values.push(JSON.stringify(updates[key]));
    } else if (typeof updates[key] === 'boolean') {
      values.push(updates[key] ? 1 : 0);
    } else {
      values.push(updates[key]);
    }
  });
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  const stmt = db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return getNoteById(id);
};

const deleteNote = (id) => {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  return stmt.run(id);
};

const searchNotes = (userId, query) => {
  const stmt = db.prepare('SELECT * FROM notes WHERE userId = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updatedAt DESC');
  const searchTerm = `%${query}%`;
  return stmt.all(userId, searchTerm, searchTerm);
};

// Notebooks helpers
const getNotebooksByUser = (userId) => {
  const stmt = db.prepare('SELECT * FROM notebooks WHERE userId = ? ORDER BY createdAt DESC');
  return stmt.all(userId);
};

const getNotebookById = (id) => {
  const stmt = db.prepare('SELECT * FROM notebooks WHERE id = ?');
  return stmt.get(id);
};

const createNotebook = (userId, notebook) => {
  const stmt = db.prepare('INSERT INTO notebooks (userId, name, description, color) VALUES (?, ?, ?, ?)');
  const result = stmt.run(userId, notebook.name, notebook.description || '', notebook.color || '#6366f1');
  return getNotebookById(result.lastInsertRowid);
};

const updateNotebook = (id, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  const stmt = db.prepare(`UPDATE notebooks SET ${fields} WHERE id = ?`);
  return stmt.run(...values);
};

const deleteNotebook = (id) => {
  const stmt = db.prepare('DELETE FROM notebooks WHERE id = ?');
  return stmt.run(id);
};

// Get all users (for admin)
const getAllUsers = () => {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all();
};

// Get all notes (for admin)
const getAllNotes = () => {
  const stmt = db.prepare('SELECT * FROM notes');
  return stmt.all();
};

module.exports = {
  db,
  connectDB,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getNotesByUser,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotebooksByUser,
  getNotebookById,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  getAllUsers,
  getAllNotes
};