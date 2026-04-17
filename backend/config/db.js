const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let adapter = null;
let db = null;

const dbPath = process.env.VERCEL
  ? '/tmp/codexnoir.json'
  : path.join(__dirname, '../codexnoir.json');

async function connectDB() {
  const defaultData = {
    users: [],
    notes: [],
    notebooks: []
  };
  
  adapter = new JSONFile(dbPath);
  db = new Low(adapter, defaultData);
  
  await db.read();
  
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
  
  console.log('JSON Database Connected:', dbPath);
  return db;
}

const findUserByEmail = (email) => {
  db.read();
  return db.data.users.find(u => u.email === email);
};

const findUserById = (id) => {
  db.read();
  return db.data.users.find(u => u.id === id);
};

const createUser = (name, email, password, useCase) => {
  db.read();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    useCase: useCase || 'personal',
    xp: 0,
    streak: 0,
    badges: [],
    createdAt: new Date().toISOString()
  };
  db.data.users.push(newUser);
  db.write();
  return newUser;
};

const updateUser = (id, updates) => {
  db.read();
  const index = db.data.users.findIndex(u => u.id === id);
  if (index !== -1) {
    db.data.users[index] = { ...db.data.users[index], ...updates };
    db.write();
    return db.data.users[index];
  }
  return null;
};

const getNotesByUser = (userId) => {
  db.read();
  return db.data.notes
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

const getNoteById = (id) => {
  db.read();
  return db.data.notes.find(n => n.id === id);
};

const createNote = (userId, note) => {
  db.read();
  const newNote = {
    id: Date.now(),
    userId,
    title: note.title || '',
    content: note.content || '',
    intent: note.intent || 'note',
    pinned: note.pinned || false,
    bookmarked: note.bookmarked || false,
    color: note.color || '#ffffff',
    tags: note.tags || [],
    reminder: note.reminder || null,
    notebookId: note.notebookId || null,
    isTask: note.isTask || false,
    isComplete: note.isComplete || false,
    publicLink: null,
    isPrivate: false,
    sharedWith: [],
    comments: [],
    history: [],
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.data.notes.push(newNote);
  db.write();
  return newNote;
};

const updateNote = (id, updates) => {
  db.read();
  const index = db.data.notes.findIndex(n => n.id === id);
  if (index !== -1) {
    db.data.notes[index] = {
      ...db.data.notes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.write();
    return db.data.notes[index];
  }
  return null;
};

const deleteNote = (id) => {
  db.read();
  const index = db.data.notes.findIndex(n => n.id === id);
  if (index !== -1) {
    db.data.notes.splice(index, 1);
    db.write();
    return true;
  }
  return false;
};

const searchNotes = (userId, query) => {
  db.read();
  const q = query.toLowerCase();
  return db.data.notes.filter(n => 
    n.userId === userId && 
    (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
  ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

const getNotebooksByUser = (userId) => {
  db.read();
  return db.data.notebooks
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getNotebookById = (id) => {
  db.read();
  return db.data.notebooks.find(n => n.id === id);
};

const createNotebook = (userId, notebook) => {
  db.read();
  const newNotebook = {
    id: Date.now(),
    userId,
    name: notebook.name,
    description: notebook.description || '',
    color: notebook.color || '#6366f1',
    createdAt: new Date().toISOString()
  };
  db.data.notebooks.push(newNotebook);
  db.write();
  return newNotebook;
};

const updateNotebook = (id, updates) => {
  db.read();
  const index = db.data.notebooks.findIndex(n => n.id === id);
  if (index !== -1) {
    db.data.notebooks[index] = { ...db.data.notebooks[index], ...updates };
    db.write();
    return db.data.notebooks[index];
  }
  return null;
};

const deleteNotebook = (id) => {
  db.read();
  const index = db.data.notebooks.findIndex(n => n.id === id);
  if (index !== -1) {
    db.data.notebooks.splice(index, 1);
    db.write();
    return true;
  }
  return false;
};

const getAllUsers = () => {
  db.read();
  return db.data.users;
};

const getAllNotes = () => {
  db.read();
  return db.data.notes;
};

module.exports = {
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