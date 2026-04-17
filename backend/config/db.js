const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let db = null;
const dbPath = path.join(__dirname, '../codexnoir.db');

async function initializeDB() {
  const SQL = await initSqlJs();
  
  let fileBuffer = null;
  if (fs.existsSync(dbPath)) {
    fileBuffer = fs.readFileSync(dbPath);
  }
  
  db = new SQL.Database(fileBuffer);
  
  db.run(`
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
    )
  `);
  
  db.run(`
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
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#6366f1',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  saveDB();
  console.log('SQLite Database Initialized Successfully');
}

function saveDB() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

const connectDB = async () => {
  try {
    await initializeDB();
    console.log('SQLite Connected: ' + dbPath);
  } catch (error) {
    console.error('SQLite Connection Error:', error.message);
    process.exit(1);
  }
};

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDB();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
}

const findUserByEmail = (email) => queryOne('SELECT * FROM users WHERE email = ?', [email]);
const findUserById = (id) => queryOne('SELECT * FROM users WHERE id = ?', [id]);

const createUser = (name, email, password, useCase) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  run('INSERT INTO users (name, email, password, useCase) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, useCase || 'personal']);
  return findUserByEmail(email);
};

const updateUser = (id, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  run(`UPDATE users SET ${fields} WHERE id = ?`, values);
};

const getNotesByUser = (userId) => queryAll('SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC', [userId]);
const getNoteById = (id) => queryOne('SELECT * FROM notes WHERE id = ?', [id]);

const createNote = (userId, note) => {
  run(`INSERT INTO notes (userId, title, content, intent, pinned, bookmarked, color, tags, reminder, notebookId, isTask, isComplete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, note.title || '', note.content || '', note.intent || 'note', note.pinned ? 1 : 0, note.bookmarked ? 1 : 0, note.color || '#ffffff', JSON.stringify(note.tags || []), note.reminder || null, note.notebookId || null, note.isTask ? 1 : 0, note.isComplete ? 1 : 0]
  );
  const newNote = queryOne('SELECT * FROM notes WHERE id = (SELECT MAX(id) FROM notes WHERE userId = ?)', [userId]);
  return newNote;
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
  
  values.push(id);
  run(`UPDATE notes SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, values);
  return getNoteById(id);
};

const deleteNote = (id) => run('DELETE FROM notes WHERE id = ?', [id]);

const searchNotes = (userId, query) => {
  const searchTerm = `%${query}%`;
  return queryAll('SELECT * FROM notes WHERE userId = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updatedAt DESC', [userId, searchTerm, searchTerm]);
};

const getNotebooksByUser = (userId) => queryAll('SELECT * FROM notebooks WHERE userId = ? ORDER BY createdAt DESC', [userId]);
const getNotebookById = (id) => queryOne('SELECT * FROM notebooks WHERE id = ?', [id]);

const createNotebook = (userId, notebook) => {
  run('INSERT INTO notebooks (userId, name, description, color) VALUES (?, ?, ?, ?)', [userId, notebook.name, notebook.description || '', notebook.color || '#6366f1']);
  return queryOne('SELECT * FROM notebooks WHERE id = (SELECT MAX(id) FROM notebooks WHERE userId = ?)', [userId]);
};

const updateNotebook = (id, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  run(`UPDATE notebooks SET ${fields} WHERE id = ?`, values);
};

const deleteNotebook = (id) => run('DELETE FROM notebooks WHERE id = ?', [id]);

const getAllUsers = () => queryAll('SELECT * FROM users');
const getAllNotes = () => queryAll('SELECT * FROM notes');

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