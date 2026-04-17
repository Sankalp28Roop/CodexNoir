const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'notesappsecretkey';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/', (req, res) => {
  try {
    const { search, isTask, isComplete, pinned } = req.query;
    
    let notes = db.getNotesByUser(req.userId);
    
    if (pinned === 'true') {
      notes = notes.filter(n => n.pinned);
    }
    
    if (isTask === 'true') {
      notes = notes.filter(n => n.isTask);
    }
    
    if (isComplete === 'false') {
      notes = notes.filter(n => n.isTask && !n.isComplete);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(n => 
        (n.title && n.title.toLowerCase().includes(searchLower)) ||
        (n.content && n.content.toLowerCase().includes(searchLower)) ||
        (n.tags && n.tags.toLowerCase().includes(searchLower))
      );
    }
    
    notes = notes.map(n => ({
      ...n,
      tags: JSON.parse(n.tags || '[]'),
      sharedWith: JSON.parse(n.sharedWith || '[]'),
      comments: JSON.parse(n.comments || '[]'),
      history: JSON.parse(n.history || '[]'),
      metadata: JSON.parse(n.metadata || '{}')
    }));
    
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.get('/tasks', (req, res) => {
  try {
    const notes = db.getNotesByUser(req.userId)
      .filter(n => n.isTask && !n.isComplete)
      .map(n => ({
        ...n,
        tags: JSON.parse(n.tags || '[]'),
        sharedWith: JSON.parse(n.sharedWith || '[]'),
        comments: JSON.parse(n.comments || '[]'),
        history: JSON.parse(n.history || '[]'),
        metadata: JSON.parse(n.metadata || '{}')
      }));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const notes = db.searchNotes(req.userId, q).map(n => ({
      ...n,
      tags: JSON.parse(n.tags || '[]')
    }));
    res.json(notes.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Error searching notes' });
  }
});

router.get('/:id/history', (req, res) => {
  try {
    const note = db.getNoteById(req.params.id);
    if (!note || note.userId !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const history = JSON.parse(note.history || '[]');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, content, intent, pinned, color, reminder, isTask, tags, notebookId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = db.createNote(req.userId, {
      title,
      content: content || '',
      intent: intent || 'note',
      pinned: pinned || false,
      color: color || '#ffffff',
      reminder: reminder || null,
      isTask: isTask || false,
      tags: tags || [],
      notebookId: notebookId || null
    });

    res.status(201).json({
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      sharedWith: JSON.parse(note.sharedWith || '[]'),
      comments: JSON.parse(note.comments || '[]'),
      history: JSON.parse(note.history || '[]'),
      metadata: JSON.parse(note.metadata || '{}')
    });
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const note = db.getNoteById(req.params.id);
    
    if (!note || note.userId !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, intent, pinned, bookmarked, color, reminder, isTask, isComplete, tags, notebookId, publicLink, isPrivate, sharedWith, comments } = req.body;
    
    let history = JSON.parse(note.history || '[]');
    if (content !== undefined && content !== note.content) {
      history.push({ content: note.content, savedAt: new Date() });
      if (history.length > 10) history = history.slice(-10);
    }
    
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (intent !== undefined) updates.intent = intent;
    if (pinned !== undefined) updates.pinned = pinned;
    if (bookmarked !== undefined) updates.bookmarked = bookmarked;
    if (color !== undefined) updates.color = color;
    if (reminder !== undefined) updates.reminder = reminder;
    if (isTask !== undefined) updates.isTask = isTask;
    if (isComplete !== undefined) updates.isComplete = isComplete;
    if (tags !== undefined) updates.tags = tags;
    if (notebookId !== undefined) updates.notebookId = notebookId;
    if (publicLink !== undefined) updates.publicLink = publicLink;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;
    if (sharedWith !== undefined) updates.sharedWith = sharedWith;
    if (comments !== undefined) updates.comments = comments;
    updates.history = history;

    const updatedNote = db.updateNote(req.params.id, updates);

    res.json({
      ...updatedNote,
      tags: JSON.parse(updatedNote.tags || '[]'),
      sharedWith: JSON.parse(updatedNote.sharedWith || '[]'),
      comments: JSON.parse(updatedNote.comments || '[]'),
      history: JSON.parse(updatedNote.history || '[]'),
      metadata: JSON.parse(updatedNote.metadata || '{}')
    });
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.patch('/:id/complete', (req, res) => {
  try {
    const note = db.getNoteById(req.params.id);
    
    if (!note || note.userId !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = db.updateNote(req.params.id, { isComplete: !note.isComplete });

    res.json({
      ...updatedNote,
      tags: JSON.parse(updatedNote.tags || '[]'),
      sharedWith: JSON.parse(updatedNote.sharedWith || '[]'),
      comments: JSON.parse(updatedNote.comments || '[]'),
      history: JSON.parse(updatedNote.history || '[]'),
      metadata: JSON.parse(updatedNote.metadata || '{}')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const note = db.getNoteById(req.params.id);
    
    if (!note || note.userId !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    db.deleteNote(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

router.get('/public/:slug', (req, res) => {
  try {
    const notes = db.getAllNotes();
    const note = notes.find(n => n.publicLink === req.params.slug);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

router.post('/:id/public', (req, res) => {
  try {
    const note = db.getNoteById(req.params.id);
    
    if (!note || note.userId !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (!note.publicLink) {
      const publicLink = Math.random().toString(36).substring(2, 10);
      db.updateNote(req.params.id, { publicLink });
    }
    
    res.json({ slug: note.publicLink });
  } catch (error) {
    res.status(500).json({ message: 'Error creating public link' });
  }
});

module.exports = router;