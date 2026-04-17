const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');

const JWT_SECRET = process.env.JWT_SECRET || 'notesappsecretkey';

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, isTask, isComplete, pinned } = req.query;
    
    let query = { userId: req.userId };
    
    if (pinned === 'true') query.pinned = true;
    if (isTask === 'true') query.isTask = true;
    if (isComplete === 'false') query.isTask = true;
    query.isComplete = isComplete === 'true' ? true : (isComplete === 'false' ? false : undefined);
    
    let notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
    
    if (search) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(n => 
        (n.title && n.title.toLowerCase().includes(searchLower)) ||
        (n.content && n.content.toLowerCase().includes(searchLower)) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(searchLower)))
      );
    }
    
    if (isComplete === 'false') {
      notes = notes.filter(n => n.isTask && !n.isComplete);
    }
    
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId, isTask: true, isComplete: false })
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const notes = await Note.find({
      userId: req.userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching notes' });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note.history || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, intent, pinned, color, reminder, isTask, tags, notebookId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      userId: req.userId,
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

    res.status(201).json(note);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note || note.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, intent, pinned, bookmarked, color, reminder, isTask, isComplete, tags, notebookId, publicLink, isPrivate, sharedWith, comments } = req.body;
    
    let history = note.history || [];
    if (content !== undefined && content !== note.content) {
      history.push({ content: note.content, savedAt: new Date() });
      if (history.length > 10) history = history.slice(-10);
    }
    
    const updates = { history };
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

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json(updatedNote);
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note || note.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isComplete = !note.isComplete;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note || note.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const note = await Note.findOne({ publicLink: req.params.slug });
    
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

router.post('/:id/public', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note || note.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (!note.publicLink) {
      note.publicLink = Math.random().toString(36).substring(2, 10);
      await note.save();
    }
    
    res.json({ slug: note.publicLink });
  } catch (error) {
    res.status(500).json({ message: 'Error creating public link' });
  }
});

module.exports = router;