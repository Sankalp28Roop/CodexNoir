const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { category, pinned, search, isTask, isComplete } = req.query;
    
    let query = { userId: req.userId };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (pinned === 'true') {
      query.pinned = true;
    }

    if (isTask === 'true') {
      query.isTask = true;
    }

    if (isComplete === 'false') {
      query.isTask = true;
      query.isComplete = false;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Note.distinct('category', { userId: req.userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Note.find({ 
      userId: req.userId, 
      isTask: true,
      isComplete: false 
    }).sort({ reminder: 1, updatedAt: -1 });
    res.json(tasks);
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
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).limit(10).select('title content tags');
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching notes' });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note.history || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, category, pinned, color, reminder, isTask, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      userId: req.userId,
      title,
      content: content || '',
      category: category || 'General',
      pinned: pinned || false,
      color: color || '#ffffff',
      reminder: reminder || null,
      isTask: isTask || false,
      tags: tags || []
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, pinned, color, reminder, isTask, isComplete, tags, linkedNotes } = req.body;
    
    let note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (content !== undefined && content !== note.content) {
      if (!note.history) note.history = [];
      note.history.push({
        content: note.content,
        savedAt: new Date()
      });
      if (note.history.length > 10) {
        note.history = note.history.slice(-10);
      }
      note.version += 1;
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (pinned !== undefined) note.pinned = pinned;
    if (color !== undefined) note.color = color;
    if (reminder !== undefined) note.reminder = reminder;
    if (isTask !== undefined) note.isTask = isTask;
    if (isComplete !== undefined) note.isComplete = isComplete;
    if (tags !== undefined) note.tags = tags;
    if (linkedNotes !== undefined) note.linkedNotes = linkedNotes;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!note) {
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
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;